// backend/src/user/user.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { jwtConstants } from '../auth/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService, // Injec
  ) {}

  // --- HÀM MỚI: Tạo tokens ---
  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: jwtConstants.accessSecret,
          expiresIn: '15m', // Access token hết hạn sau 15 phút
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: jwtConstants.refreshSecret,
          expiresIn: '7d', // Refresh token hết hạn sau 7 ngày
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // --- HÀM MỚI: Refresh tokens ---
  async refreshTokens(userId: string, email: string) {
    return this.getTokens(userId, email);
  }

  // --- HÀM CŨ: Register (Giữ nguyên) ---
  async register(dto: CreateUserDto) {
    // ... (Giữ nguyên code register)
    const existing = await this.userModel.findOne({ email: dto.email }).lean();
    if (existing) {
      throw new ConflictException('Email đã tồn tại');
    }

    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const hashed = await bcrypt.hash(dto.password, saltRounds);

    try {
      const created = await this.userModel.create({
        email: dto.email,
        password: hashed,
      });
      return {
        message: 'Đăng ký thành công',
        user: {
          id: created._id.toString(),
          email: created.email,
          createdAt: created.createdAt,
        },
      };
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Email đã tồn tại');
      }
      throw new InternalServerErrorException('Không thể tạo người dùng');
    }
  }

  // --- HÀM CŨ: Login (Cập nhật) ---
  async login(dto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: dto.email }).lean();
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo và trả về tokens
    const tokens = await this.getTokens(user._id.toString(), user.email);

    return {
      message: 'Đăng nhập thành công',
      ...tokens, // Trả về accessToken và refreshToken
      user: {
        id: user._id.toString(),
        email: user.email,
      },
    };
  }

  // --- HÀM CŨ: FindAll (Giữ nguyên) ---
  async findAll() {
    // ... (Giữ nguyên code findAll)
    const users = await this.userModel
      .find({}, { email: 1, createdAt: 1, password: 1 }) // include password
      .lean();
    return users.map((u: any) => ({
      id: u._id.toString(),
      email: u.email,
      password: u.password, // hashed password
      createdAt: u.createdAt,
    }));
  }

  // --- HÀM MỚI: Lấy thông tin user từ token ---
  async getUserFromToken(userId: string) {
    const user = await this.userModel.findById(userId, { email: 1, _id: 1 }).lean();
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }
    return { id: user._id.toString(), email: user.email };
  }
}