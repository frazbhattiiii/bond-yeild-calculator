import { ApiProperty } from '@nestjs/swagger';

import type { CashFlowEntry } from '@/types/bond.types';
import { BondStatus } from '@/enums/bond-status.enum';

export class CashFlowEntryDto {
  @ApiProperty({ description: 'Sequential period number', example: 1 })
  period!: number;

  @ApiProperty({
    description: 'Relative date label from bond start',
    example: 'Month 6',
  })
  paymentDate!: string;

  @ApiProperty({
    description: 'Periodic coupon amount received',
    example: 25,
  })
  couponPayment!: number;

  @ApiProperty({
    description: 'Running total of all coupon payments up to this period',
    example: 25,
  })
  cumulativeInterest!: number;

  @ApiProperty({
    description:
      'Face value still owed (full amount until final period, then 0)',
    example: 1000,
  })
  remainingPrincipal!: number;
}

export class BondCalculationResponseDto {
  @ApiProperty({
    description: 'Annual return based on current market price, as a percentage',
    example: 5.26,
  })
  currentYield!: number;

  @ApiProperty({
    description: 'Annualized total return if held to maturity, as a percentage',
    example: 5.66,
  })
  yieldToMaturity!: number;

  @ApiProperty({
    description: 'Sum of all coupon payments over the bond lifetime',
    example: 500,
  })
  totalInterest!: number;

  @ApiProperty({
    description: 'Whether the bond trades at a premium, discount, or par value',
    enum: BondStatus,
    example: BondStatus.Discount,
  })
  bondStatus!: BondStatus;

  @ApiProperty({
    description: 'Period-by-period breakdown of coupon payments and principal',
    type: [CashFlowEntryDto],
  })
  cashFlowSchedule!: CashFlowEntryDto[];

  static fromCalculationResult(
    currentYield: number,
    yieldToMaturity: number,
    totalInterest: number,
    bondStatus: BondStatus,
    cashFlowSchedule: CashFlowEntry[],
  ): BondCalculationResponseDto {
    const responseDto = new BondCalculationResponseDto();
    responseDto.currentYield = currentYield;
    responseDto.yieldToMaturity = yieldToMaturity;
    responseDto.totalInterest = totalInterest;
    responseDto.bondStatus = bondStatus;
    responseDto.cashFlowSchedule = cashFlowSchedule;
    return responseDto;
  }
}
