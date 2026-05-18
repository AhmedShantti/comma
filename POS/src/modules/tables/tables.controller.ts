import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTableDto, UpdateTableDto } from './dto/create-table.dto';
import { TableStatus } from './entities/table.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('tables')
@ApiBearerAuth()
@Controller('tables')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto, @Query('status') status?: TableStatus) {
    return this.tablesService.findAll(pagination, status);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findById(id);
  }

  @Get('number/:number')
  findByNumber(@Param('number') number: string) {
    return this.tablesService.findByNumber(Number(number));
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  updateStatus(@Param('id') id: string, @Body('status') status: TableStatus) {
    return this.tablesService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.tablesService.softDelete(id);
  }

  @Get(':id/orders')
  getOrdersHistory(@Param('id') id: string, @Query() pagination: PaginationDto) {
    return this.tablesService.getOrdersHistory(id, pagination);
  }
}
