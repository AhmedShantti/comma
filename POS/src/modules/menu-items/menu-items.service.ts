import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem, Variant } from './entities/menu-item.entity';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/create-menu-item.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
    @InjectRepository(Variant)
    private variantsRepository: Repository<Variant>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const menuItem = this.menuItemsRepository.create({
      category_id: createMenuItemDto.category_id,
      name_ar: createMenuItemDto.name_ar,
      name_en: createMenuItemDto.name_en,
      description_ar: createMenuItemDto.description_ar,
      description_en: createMenuItemDto.description_en,
      base_price: createMenuItemDto.base_price,
      image_url: createMenuItemDto.image_url,
      tax_group: createMenuItemDto.tax_group || 'standard',
      is_active: createMenuItemDto.is_active ?? true,
      sort_order: createMenuItemDto.sort_order || 0,
    });

    const saved = await this.menuItemsRepository.save(menuItem);

    if (createMenuItemDto.variants && createMenuItemDto.variants.length > 0) {
      for (const variantDto of createMenuItemDto.variants) {
        await this.variantsRepository.save({
          menu_item_id: saved.id,
          ...variantDto,
        });
      }
    }

    return this.findById(saved.id);
  }

  async findAll(pagination: PaginationDto, categoryId?: string, isActive?: boolean) {
    const query = this.menuItemsRepository.createQueryBuilder('item')
      .leftJoinAndSelect('item.variants', 'variants')
      .leftJoinAndSelect('item.addons', 'addons');

    if (categoryId) {
      query.andWhere('item.category_id = :categoryId', { categoryId });
    }

    if (isActive !== undefined) {
      query.andWhere('item.is_active = :isActive', { isActive });
    }

    query
      .orderBy('item.sort_order', 'ASC')
      .addOrderBy('item.created_at', 'DESC')
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

  async findById(id: string): Promise<MenuItem> {
    const item = await this.menuItemsRepository.findOne({
      where: { id },
      relations: ['variants', 'addons'],
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return item;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    const item = await this.findById(id);
    Object.assign(item, updateMenuItemDto);
    await this.menuItemsRepository.save(item);
    return this.findById(id);
  }

  async toggleAvailability(id: string): Promise<MenuItem> {
    const item = await this.findById(id);
    item.is_active = !item.is_active;
    await this.menuItemsRepository.save(item);
    return item;
  }

  async softDelete(id: string): Promise<void> {
    await this.menuItemsRepository.softDelete(id);
  }

  async getAvailability(): Promise<Array<{ id: string; available: boolean }>> {
    const items = await this.menuItemsRepository.find({
      select: ['id', 'is_active'],
    });
    return items.map(item => ({
      id: item.id,
      available: item.is_active,
    }));
  }

  async setAddons(id: string, addonIds: string[]): Promise<MenuItem> {
    const item = await this.menuItemsRepository.findOne({
      where: { id },
      relations: ['addons'],
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    // Clear existing addons and set new ones
    item.addons = [];
    await this.menuItemsRepository.save(item);

    if (addonIds && addonIds.length > 0) {
      // Reload with new addons via query builder
      await this.menuItemsRepository
        .createQueryBuilder('item')
        .relation(MenuItem, 'addons')
        .of(id)
        .add(addonIds);
    }

    return this.findById(id);
  }

  async addAddon(id: string, addonId: string): Promise<MenuItem> {
    const item = await this.menuItemsRepository.findOne({
      where: { id },
      relations: ['addons'],
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    await this.menuItemsRepository
      .createQueryBuilder('item')
      .relation(MenuItem, 'addons')
      .of(id)
      .add(addonId);

    return this.findById(id);
  }

  async removeAddon(id: string, addonId: string): Promise<MenuItem> {
    const item = await this.findById(id);

    await this.menuItemsRepository
      .createQueryBuilder('item')
      .relation(MenuItem, 'addons')
      .of(id)
      .remove(addonId);

    return this.findById(id);
  }

  async getItemAddons(id: string): Promise<any[]> {
    const item = await this.findById(id);
    return item.addons || [];
  }
}
