import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const auth = req.headers.authorization;
        if (!auth) return null;
        const token = auth.split(' ')[1];
        // ✅ Handle demo tokens - bypass JWT validation
        if (token?.startsWith('demo_')) {
          return token;
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt').accessSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const auth = req.headers.authorization;
    const token = auth?.split(' ')[1];

    // ✅ Demo token - return mock admin user
    if (token?.startsWith('demo_')) {
      return {
        id: 'demo-admin-1',
        username: 'admin',
        full_name: 'Admin User',
        role: 'admin',
        email: 'admin@demo.local',
        is_active: true,
      };
    }

    const user = await this.usersService.findById(payload.id);
    return user;
  }
}
