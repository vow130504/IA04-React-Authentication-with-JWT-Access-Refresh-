"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("./user.schema");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(dto) {
        const existing = await this.userModel.findOne({ email: dto.email }).lean();
        if (existing) {
            throw new common_1.ConflictException('Email đã tồn tại');
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
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
                throw new common_1.ConflictException('Email đã tồn tại');
            }
            throw new common_1.InternalServerErrorException('Không thể tạo người dùng');
        }
    }
    async login(dto) {
        const user = await this.userModel.findOne({ email: dto.email }).lean();
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        return {
            message: 'Đăng nhập thành công',
            user: { id: user._id.toString(), email: user.email, createdAt: user.createdAt },
        };
    }
    async findAll() {
        const users = await this.userModel
            .find({}, { email: 1, createdAt: 1, password: 1 })
            .lean();
        return users.map((u) => ({
            id: u._id.toString(),
            email: u.email,
            password: u.password,
            createdAt: u.createdAt,
        }));
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map