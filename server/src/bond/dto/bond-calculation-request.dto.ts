import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsPositive, Max, Min } from 'class-validator';

import { CouponFrequency } from '@/enums/coupon-frequency.enum';

const MIN_COUPON_RATE = 0;
const MAX_COUPON_RATE = 100;

export class BondCalculationRequestDto {
  @ApiProperty({
    description: 'The nominal value of the bond, repaid at maturity',
    example: 1000,
  })
  @IsNumber()
  @IsPositive({ message: 'Face value must be a positive number' })
  faceValue!: number;

  @ApiProperty({
    description: 'Annual interest rate as a percentage of face value (0-100)',
    example: 5,
    minimum: MIN_COUPON_RATE,
    maximum: MAX_COUPON_RATE,
  })
  @IsNumber()
  @Min(MIN_COUPON_RATE, {
    message: 'Coupon rate must be between 0 and 100',
  })
  @Max(MAX_COUPON_RATE, {
    message: 'Coupon rate must be between 0 and 100',
  })
  couponRate!: number;

  @ApiProperty({
    description: 'Current trading price of the bond',
    example: 950,
  })
  @IsNumber()
  @IsPositive({ message: 'Market price must be a positive number' })
  marketPrice!: number;

  @ApiProperty({
    description: 'Number of years until the bond matures',
    example: 10,
  })
  @IsInt({ message: 'Years to maturity must be a positive integer' })
  @IsPositive({ message: 'Years to maturity must be a positive integer' })
  yearsToMaturity!: number;

  @ApiProperty({
    description:
      'How often interest is paid per year: 1 (annual), 2 (semi-annual), or 4 (quarterly)',
    enum: CouponFrequency,
    example: CouponFrequency.SemiAnnual,
  })
  @IsEnum(CouponFrequency, {
    message:
      'Coupon frequency must be 1 (annual), 2 (semi-annual), or 4 (quarterly)',
  })
  couponFrequency!: CouponFrequency;
}
