import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/create-menu-item.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('menu-items')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get('availability')
  async getAvailability() {
    return this.menuItemsService.getAvailability();
  }

  @Get()
  findAll(@Query() pagination: PaginationDto, @Query() filters?: { category_id?: string; is_active?: string }) {
    const isActiveBoolean = filters?.is_active !== undefined ? filters.is_active === 'true' : undefined;
    return this.menuItemsService.findAll(pagination, filters?.category_id, isActiveBoolean);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findById(id);
  }

  @Get(':id/addons')
  getAddons(@Param('id') id: string) {
    return this.menuItemsService.getItemAddons(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(id, updateMenuItemDto);
  }

  @Patch(':id/availability')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  toggleAvailability(@Param('id') id: string) {
    return this.menuItemsService.toggleAvailability(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.menuItemsService.softDelete(id);
  }

  @Patch(':id/addons')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  setAddons(
    @Param('id') id: string,
    @Body() body: { addon_ids: string[] },
  ) {
    return this.menuItemsService.setAddons(id, body.addon_ids);
  }

  @Post(':id/addons/:addon_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  addAddon(@Param('id') id: string, @Param('addon_id') addonId: string) {
    return this.menuItemsService.addAddon(id, addonId);
  }

  @Delete(':id/addons/:addon_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  removeAddon(@Param('id') id: string, @Param('addon_id') addonId: string) {
    return this.menuItemsService.removeAddon(id, addonId);
  }
}
