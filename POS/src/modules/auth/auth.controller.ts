import { Controller, Post, Patch, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/tokens.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    // ✅ Handle demo token refresh
    if (refreshTokenDto.refreshToken?.startsWith('demo_')) {
      return {
        accessToken: refreshTokenDto.refreshToken,
        refreshToken: refreshTokenDto.refreshToken,
        expiresIn: 2592000,
      };
    }

    // Verify refresh token first
    const user = this.authService['jwtService'].verify(refreshTokenDto.refreshToken, {
      secret: this.authService['configService'].get('jwt').refreshSecret,
    });
    const userData = await this.usersService.findById(user.id);
    return this.authService.refresh(userData);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    // ✅ Skip logout processing for demo tokens
    if (!refreshTokenDto.refreshToken?.startsWith('demo_')) {
      await this.authService.logout(refreshTokenDto.refreshToken);
    }
    return { message: 'Logout successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
