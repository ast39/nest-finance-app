import { Body, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  TokenExpireException,
  WrongAuthDataException,
} from './exeptions/auth.exeptions';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../user/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { UserCreateDto } from '../user/dto/user.create.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Регистрация
  async signUp(@Body() userCreate: UserCreateDto) {
    const user = await this.userService.createUser(userCreate);

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.userId, tokens.refresh_token);

    return tokens;
  }

  // Вход
  async signIn(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new WrongAuthDataException();
    }

    const passwordEquals = await bcrypt.compare(password, user.password);
    if (!passwordEquals) {
      throw new WrongAuthDataException();
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.userId, tokens.refresh_token);

    return tokens;
  }

  // Информация об авторизованном пользователе
  async me(userId: number): Promise<UserDto> {
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new TokenExpireException();
    }

    return user;
  }

  // Выход
  async logout(user_id: number): Promise<UserDto> {
    return this.userService.updateUser(user_id, { refreshToken: null });
  }

  // Пролонгирование токена
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.getUser(userId);
    if (!user || !user.refreshToken) {
      throw new TokenExpireException();
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new TokenExpireException();
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.userId, tokens.refresh_token);

    return tokens;
  }

  // Обновление рефреш токена в БД
  private async updateRefreshToken(
    user_id: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.updateUser(user_id, {
      refreshToken: hashedRefreshToken,
    });
  }

  // Генерация токена доступа и рефреш токена
  private async generateTokens(user: UserDto) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.userId,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRED'),
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.userId,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
