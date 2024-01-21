import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreditCheckingService } from './credit-checking.service';
import { JoiValidationPipe } from '../../common/pipes/joy.validation.pipe';
import { CreditCheckingCreateDto } from './dto/credit-checking.create.dto';
import { CreditCheckingDto } from './dto/credit-checking.dto';
import { JwtUser } from '../../common/decorators/user.decorator';
import { CreditCheckingCreateSchema } from './schemas/credit-checking.create.schema';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';

@ApiTags('Проверка кредита')
@Controller('credit-checking')
export class CreditCheckingController {
  constructor(private creditCheckingService: CreditCheckingService) {}

  @ApiOperation({
    summary: 'Проверка по ID',
    description: 'Получить информацию о проверке',
  })
  @ApiOkResponse({
    description: 'Информация о расчете',
    type: CreditCheckingDto,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':checking_id')
  public async show(
    @Param('checking_id', ParseIntPipe) checkingId: number,
  ): Promise<CreditCheckingDto> {
    return this.creditCheckingService.getChecking(checkingId);
  }

  @ApiOperation({
    summary: 'Новая проверка',
    description: 'Создать новую проверку кредита',
  })
  @ApiResponse({
    description: 'Итоги проверки',
    type: CreditCheckingDto,
    status: 201,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @JwtUser('id') userId: number,
    @Body(new JoiValidationPipe(CreditCheckingCreateSchema))
    body: CreditCheckingCreateDto,
  ): Promise<CreditCheckingDto> {
    return this.creditCheckingService.createChecking(userId, body);
  }

  @ApiOperation({
    summary: 'Удалить расчет',
    description: 'Удалить проверку кредита',
  })
  @ApiOkResponse({
    description: 'Удаленная проверка',
    type: CreditCheckingDto,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':checking_id')
  public async delete(
    @JwtUser('id') userId: number,
    @Param('checking_id', ParseIntPipe) checkingId: number,
  ): Promise<CreditCheckingDto> {
    return this.creditCheckingService.deleteChecking(userId, checkingId);
  }
}
