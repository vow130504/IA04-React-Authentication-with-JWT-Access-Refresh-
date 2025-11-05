// backend/src/user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RefreshTokenStrategy } from '../auth/refresh-token.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({}), // Đăng ký module JWT
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, RefreshTokenStrategy], // Thêm Strategy
})
export class UserModule {}