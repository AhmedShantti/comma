import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedingService implements OnModuleInit {
  private readonly logger = new Logger(SeedingService.name);

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Wait for DataSource to be initialized
      if (!this.dataSource.isInitialized) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      await this.seed();
    } catch (error) {
      this.logger.error('Seeding failed:', error);
    }
  }

  async seed() {
    this.logger.log('🌱 Starting database seeding...');

    const userRepository = this.dataSource.getRepository(User);

    // Admin User
    const adminExists = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!adminExists) {
      const admin = new User();
      admin.username = 'admin';
      admin.email = 'admin@restaurant.com';
      admin.password = await bcrypt.hash('admin123', 12);
      admin.full_name = 'Administrator';
      admin.role = UserRole.ADMIN;
      admin.is_active = true;

      await userRepository.save(admin);
      this.logger.log('✅ Admin user created (admin/admin123)');
    } else {
      this.logger.log('✅ Admin user already exists');
    }

    // Manager User
    const managerExists = await userRepository.findOne({
      where: { username: 'manager1' },
    });

    if (!managerExists) {
      const manager = new User();
      manager.username = 'manager1';
      manager.email = 'manager@restaurant.com';
      manager.password = await bcrypt.hash('manager123', 12);
      manager.full_name = 'Manager User';
      manager.role = UserRole.MANAGER;
      manager.is_active = true;

      await userRepository.save(manager);
      this.logger.log('✅ Manager user created (manager1/manager123)');
    } else {
      this.logger.log('✅ Manager user already exists');
    }

    // Cashier Users
    for (let i = 1; i <= 2; i++) {
      const cashierExists = await userRepository.findOne({
        where: { username: `cashier${i}` },
      });

      if (!cashierExists) {
        const cashier = new User();
        cashier.username = `cashier${i}`;
        cashier.email = `cashier${i}@restaurant.com`;
        cashier.password = await bcrypt.hash('cashier123', 12);
        cashier.pin = await bcrypt.hash('1234', 12);
        cashier.full_name = `Cashier ${i}`;
        cashier.role = UserRole.CASHIER;
        cashier.is_active = true;

        await userRepository.save(cashier);
        this.logger.log(`✅ Cashier ${i} created (cashier${i}/cashier123)`);
      }
    }

    this.logger.log('✅ Database seeding completed');
  }
}
