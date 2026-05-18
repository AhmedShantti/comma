import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.full_name = createUserDto.full_name;
    user.role = createUserDto.role || UserRole.CASHIER;
    user.password = await bcrypt.hash(createUserDto.password, 12);

    if (createUserDto.pin) {
      user.pin = await bcrypt.hash(createUserDto.pin, 12);
    }

    return this.usersRepository.save(user);
  }

  async findAll(pagination: PaginationDto, filters?: { role?: UserRole; is_active?: boolean }) {
    const query = this.usersRepository.createQueryBuilder('user');

    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters?.is_active !== undefined) {
      query.andWhere('user.is_active = :is_active', { is_active: filters.is_active });
    }

    query
      .orderBy(`user.${pagination.sort}`, pagination.order.toUpperCase() as 'ASC' | 'DESC')
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

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existing = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existing) {
        throw new BadRequestException('Username already exists');
      }
      user.username = updateUserDto.username;
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new BadRequestException('Email already exists');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    if (updateUserDto.pin !== undefined) {
      user.pin = updateUserDto.pin ? await bcrypt.hash(updateUserDto.pin, 12) : null;
    }

    if (updateUserDto.full_name) {
      user.full_name = updateUserDto.full_name;
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    if (updateUserDto.is_active !== undefined) {
      user.is_active = updateUserDto.is_active;
    }

    return this.usersRepository.save(user);
  }

  async softDelete(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async validatePin(user: User, pin: string): Promise<boolean> {
    if (!user.pin) return false;
    return bcrypt.compare(pin, user.pin);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, { last_login_at: new Date() });
  }
}
