import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../user/schema/user.schema';
import { JwtAuthUser, JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('ACCESS_TOKEN_SECRET');
    if (!secret) {
      throw new InternalServerErrorException(
        'ACCESS_TOKEN_SECRET is not defined in configuration',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload): JwtAuthUser {
    return {
      _id: new Types.ObjectId(payload.sub),
      role: payload.role ?? UserRole.USER,
    };
  }
}
