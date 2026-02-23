import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BondService } from '@/bond/bond.service';
import {
  BondCalculationRequestDto,
  BondCalculationResponseDto,
} from '@/bond/dto';

@ApiTags('Bond')
@Controller('bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  @ApiOperation({
    summary: 'Calculate bond yield metrics and cash flow schedule',
    description:
      'Accepts bond parameters (face value, coupon rate, market price, years to maturity, coupon frequency) and returns current yield, yield to maturity, total interest, bond pricing status, and a period-by-period cash flow schedule.',
  })
  @ApiResponse({
    status: 201,
    description: 'Bond calculation completed successfully',
    type: BondCalculationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — invalid or missing bond parameters',
  })
  calculateBondMetrics(
    @Body() bondCalculationRequest: BondCalculationRequestDto,
  ): BondCalculationResponseDto {
    const bondCalculationResult = this.bondService.calculateBondMetrics(
      bondCalculationRequest,
    );

    return BondCalculationResponseDto.fromCalculationResult(
      bondCalculationResult.currentYield,
      bondCalculationResult.yieldToMaturity,
      bondCalculationResult.totalInterest,
      bondCalculationResult.bondStatus,
      bondCalculationResult.cashFlowSchedule,
    );
  }
}
