import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table, TableStatus } from './entities/table.entity';
import { CreateTableDto, UpdateTableDto } from './dto/create-table.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto): Promise<Table> {
    const existing = await this.tablesRepository.findOne({
      where: { table_number: createTableDto.table_number },
    });

    if (existing) {
      throw new ConflictException(`Table ${createTableDto.table_number} already exists`);
    }

    const table = this.tablesRepository.create({
      table_number: createTableDto.table_number,
      capacity: createTableDto.capacity || 4,
      status: createTableDto.status || TableStatus.AVAILABLE,
      location: createTableDto.location,
      notes: createTableDto.notes,
    });

    return this.tablesRepository.save(table);
  }

  async findAll(pagination: PaginationDto, status?: TableStatus) {
    const query = this.tablesRepository.createQueryBuilder('table');

    if (status) {
      query.andWhere('table.status = :status', { status });
    }

    query
      .orderBy('table.table_number', 'ASC')
      .skip(pagination.skip)
      .take(pagination.limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async findById(id: string): Promise<Table> {
    const table = await this.tablesRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }

  async findByNumber(tableNumber: number): Promise<Table> {
    const table = await this.tablesRepository.findOne({
      where: { table_number: tableNumber },
      relations: ['orders'],
    });

    if (!table) {
      throw new NotFoundException(`Table ${tableNumber} not found`);
    }

    return table;
  }

  async update(id: string, updateTableDto: UpdateTableDto): Promise<Table> {
    const table = await this.findById(id);

    if (updateTableDto.table_number && updateTableDto.table_number !== table.table_number) {
      const existing = await this.tablesRepository.findOne({
        where: { table_number: updateTableDto.table_number },
      });
      if (existing) {
        throw new ConflictException(`Table ${updateTableDto.table_number} already exists`);
      }
    }

    Object.assign(table, updateTableDto);
    return this.tablesRepository.save(table);
  }

  async softDelete(id: string): Promise<void> {
    await this.findById(id);
    await this.tablesRepository.softDelete(id);
  }

  async updateStatus(id: string, status: TableStatus): Promise<Table> {
    const table = await this.findById(id);
    table.status = status;
    return this.tablesRepository.save(table);
  }

  async setActiveOrder(tableId: string, orderId: string): Promise<Table> {
    const table = await this.findById(tableId);
    table.active_order_id = orderId;
    return this.tablesRepository.save(table);
  }

  async clearActiveOrder(tableId: string): Promise<Table> {
    const table = await this.findById(tableId);
    table.active_order_id = null;
    table.status = TableStatus.AVAILABLE;
    return this.tablesRepository.save(table);
  }

  async getTablesWithActiveOrders(): Promise<Table[]> {
    return this.tablesRepository.find({
      where: { status: TableStatus.OCCUPIED },
      order: { table_number: 'ASC' },
    });
  }

  async getOrdersHistory(id: string, pagination: PaginationDto) {
    const table = await this.findById(id);

    const query = this.tablesRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.orders', 'orders')
      .where('table.id = :id', { id })
      .orderBy('orders.created_at', 'DESC');

    const orders = await query.getOne();

    const paginatedOrders = orders?.orders.slice(
      pagination.skip,
      pagination.skip + pagination.limit,
    ) || [];

    return {
      data: paginatedOrders,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: orders?.orders.length || 0,
        totalPages: Math.ceil((orders?.orders.length || 0) / pagination.limit),
      },
    };
  }
}
