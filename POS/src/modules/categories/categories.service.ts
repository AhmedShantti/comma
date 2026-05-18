import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoryDto } from './dto/create-category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(pagination: PaginationDto, isActive?: boolean) {
    const query = this.categoriesRepository.createQueryBuilder('category');

    if (isActive !== undefined) {
      query.andWhere('category.is_active = :isActive', { isActive });
    }

    query
      .orderBy('category.sort_order', 'ASC')
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

  async findById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async softDelete(id: string): Promise<void> {
    const category = await this.findById(id);
    // Check if category has active menu items - this is a simplification
    await this.categoriesRepository.softDelete(id);
  }

  async reorder(reorderDtos: ReorderCategoryDto[]): Promise<void> {
    for (const dto of reorderDtos) {
      await this.categoriesRepository.update(dto.id, { sort_order: dto.sort_order });
    }
  }
}
