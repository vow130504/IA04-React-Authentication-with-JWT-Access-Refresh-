import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;
  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt' })
  password!: string;
}
