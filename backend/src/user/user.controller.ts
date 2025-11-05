// backend/src/user/user.controller.ts
import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import
import { RefreshTokenGuard } from '../auth/refresh-token.guard'; // Import
import { Request } from 'express';

// Định nghĩa kiểu cho user trong request
interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    refreshToken?: string;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  // Endpoint này giờ đây bị khoá
  @UseGuards(JwtAuthGuard) // Bảo vệ route này
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Endpoint MỚI: Lấy thông tin user hiện tại
  @UseGuards(JwtAuthGuard) // Bảo vệ route này
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    // 'user' được đính kèm vào request bởi JwtStrategy
    return this.userService.getUserFromToken(req.user.userId);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }

  // Endpoint MỚI: Refresh token
  @UseGuards(RefreshTokenGuard) // Bảo vệ bằng RefreshTokenGuard
  @Post('refresh')
  refreshTokens(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    const email = req.user.email;
    return this.userService.refreshTokens(userId, email);
  }
}