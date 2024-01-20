import {
  Body,
  Controller,
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
import { CreditCalculationService } from './credit-calculation.service';
import { JoiValidationPipe } from '../../common/pipes/joy.validation.pipe';
import { CreditCalculationCreateDto } from './dto/credit-calculation.create.dto';
import { CreditCalculationDto } from './dto/credit-calculation.dto';
import { JwtUser } from '../../common/decorators/user.decorator';
import { CreditCalculationCreateSchema } from './schemas/credit-calculation.crate.schema';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';

@ApiTags('Расчет кредита')
@Controller('credit-calculation')
export class CreditCalculationController {
  constructor(private creditCalculationService: CreditCalculationService) {}

  @ApiOperation({
    summary: 'Расчет по ID',
    description: 'Получить информацию о расчете',
  })
  @ApiOkResponse({
    description: 'Информация о расчете',
    type: CreditCalculationDto,
    isArray: false,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':calculation_id')
  public async show(
    @Param('calculation_id', ParseIntPipe) calculationId: number,
  ): Promise<CreditCalculationDto> {
    return this.creditCalculationService.getCalculation(calculationId);
  }

  @ApiOperation({
    summary: 'Новый расчет',
    description: 'Создать новый расчет кредита',
  })
  @ApiResponse({
    description: 'Итоги расчета',
    type: CreditCalculationDto,
    isArray: false,
    status: 201,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @JwtUser('id') userId: number,
    @Body(new JoiValidationPipe(CreditCalculationCreateSchema))
    body: CreditCalculationCreateDto,
  ): Promise<CreditCalculationDto> {
    return await this.creditCalculationService.createCalculation(userId, body);
  }
}
