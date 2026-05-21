import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(loginDto: LoginDto): Promise<{ user: User; tokens: TokensDto }> {
    // ✅ Handle demo account locally (no DB check)
    if (loginDto.username === 'admin' && loginDto.password === 'admin 123') {
      const demoUser: Partial<User> = {
        id: 'demo-admin-1',
        username: 'admin',
        full_name: 'Admin User',
        role: 'admin' as any,
        email: 'admin@demo.local',
        is_active: true,
      };

      const demoToken = 'demo_' + Date.now();
      return {
        user: demoUser as User,
        tokens: {
          accessToken: demoToken,
          refreshToken: demoToken,
          expiresIn: 2592000, // 30 days
        },
      };
    }

    const user = await this.usersService.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User account is inactive');
    }

    let isValid = false;

    if (loginDto.password) {
      isValid = await this.usersService.validatePassword(user, loginDto.password);
    } else if (loginDto.pin) {
      isValid = await this.usersService.validatePin(user, loginDto.pin);
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  async refresh(user: User): Promise<TokensDto> {
    return this.generateTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('jwt').refreshSecret,
    });

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    await this.cacheManager.set(`blacklist_${refreshToken}`, true, expiresIn * 1000);
  }

  private async generateTokens(user: User): Promise<TokensDto> {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt').accessSecret,
      expiresIn: this.configService.get('jwt').accessExpiration,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt').refreshSecret,
      expiresIn: this.configService.get('jwt').refreshExpiration,
    });

    const decoded = this.jwtService.decode(accessToken) as any;

    return {
      accessToken,
      refreshToken,
      expiresIn: decoded.exp - decoded.iat,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    const isBlacklisted = await this.cacheManager.get(`blacklist_${token}`);
    return !isBlacklisted;
  }
}
