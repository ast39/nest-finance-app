import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserCreateSchema } from './schemas/user.crate.schema';
import { UserUpdateSchema } from './schemas/user.update.schema';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { JoiValidationPipe } from '../../common/pipes/joy.validation.pipe';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: 'Список пользователей',
    description: 'Получить список пользователей по фильтрам',
  })
  @ApiOkResponse({
    description: 'Список пользователей',
    type: UserDto,
    isArray: true,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  public async index(): Promise<UserDto[]> {
    return this.userService.userList({
      page: 1,
      limit: 10,
    });
  }

  @ApiOperation({
    summary: 'Пользователь по ID',
    description: 'Получить информацию о пользователе',
  })
  @ApiOkResponse({
    description: 'Информация о пользователе',
    type: UserDto,
    isArray: false,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':user_id')
  public async show(
    @Param('user_id', ParseIntPipe) userId: number,
  ): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @ApiOperation({
    summary: 'Добавление пользователя',
    description: 'Добавление пользователя в БД',
  })
  @ApiResponse({
    description: 'Добавленный пользователь',
    type: UserDto,
    isArray: false,
    status: 201,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @UsePipes(new JoiValidationPipe(UserCreateSchema))
  @Post()
  public async create(@Body() body: UserCreateDto): Promise<UserDto> {
    return await this.userService.createUser(body);
  }

  @ApiOperation({
    summary: 'Редактирование пользователя',
    description: 'Редактирование пользователя в БД',
  })
  @ApiOkResponse({
    description: 'Обновленный пользователь',
    type: UserDto,
    isArray: false,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @UsePipes(new JoiValidationPipe(UserUpdateSchema))
  @Put(':user_id')
  public async update(
    @Param('user_id', ParseIntPipe) userId: number,
    @Body() body: UserUpdateDto,
  ): Promise<UserDto> {
    return await this.userService.updateUser(userId, body);
  }

  @ApiOperation({
    summary: 'Удаление пользователя',
    description: 'Удалить пользователя из БД',
  })
  @ApiOkResponse({
    description: 'Удаленный пользователь',
    type: UserDto,
    isArray: false,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':user_id')
  public async delete(
    @Param('user_id', ParseIntPipe) userId: number,
  ): Promise<UserDto> {
    return await this.userService.deleteUser(userId);
  }
}
