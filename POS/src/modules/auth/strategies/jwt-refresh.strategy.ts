import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (req) => req.body?.refreshToken || req.headers.authorization?.replace('Bearer ', ''),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt').refreshSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.id);
    return user;
  }
}
