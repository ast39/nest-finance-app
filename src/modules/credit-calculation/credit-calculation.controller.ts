import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreditCalculationService } from './credit-calculation.service';
import { JoiValidationPipe } from '../../common/pipes/joy.validation.pipe';
import { CreditCalculationCreateDto } from './dto/credit-calculation.create.dto';
import { CreditCalculationDto } from './dto/credit-calculation.dto';
import { JwtUser } from '../../common/decorators/user.decorator';
import { CreditCalculationCreateSchema } from './schemas/credit-calculation.crate.schema';

@ApiTags('Расчет кредита')
@Controller('credit-calculation')
export class CreditCalculationController {
  constructor(private creditCalculationService: CreditCalculationService) {}

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
  @UsePipes(new JoiValidationPipe(CreditCalculationCreateSchema))
  @Post()
  public async create(
    @JwtUser('id') userId: number,
    @Body() body: CreditCalculationCreateDto,
  ): Promise<CreditCalculationDto> {
    return await this.creditCalculationService.createCalculation(userId, body);
  }
}
