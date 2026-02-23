import { Test, TestingModule } from '@nestjs/testing';

import { BondController } from '@/bond/bond.controller';
import { BondService } from '@/bond/bond.service';
import { BondCalculationRequestDto } from '@/bond/dto';
import { BondStatus } from '@/enums/bond-status.enum';
import { CouponFrequency } from '@/enums/coupon-frequency.enum';

describe('BondController', () => {
  let bondController: BondController;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      controllers: [BondController],
      providers: [BondService],
    }).compile();

    bondController = testModule.get<BondController>(BondController);
  });

  describe('calculateBondMetrics', () => {
    it('should return a complete bond calculation response', () => {
      const bondRequest: BondCalculationRequestDto = {
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.SemiAnnual,
      };

      const bondResponse = bondController.calculateBondMetrics(bondRequest);

      expect(bondResponse.currentYield).toBeDefined();
      expect(bondResponse.yieldToMaturity).toBeDefined();
      expect(bondResponse.totalInterest).toBe(500);
      expect(bondResponse.bondStatus).toBe(BondStatus.Discount);
      expect(bondResponse.cashFlowSchedule).toHaveLength(20);
    });

    it('should delegate calculation to BondService', () => {
      const bondRequest: BondCalculationRequestDto = {
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 5,
        couponFrequency: CouponFrequency.Annual,
      };

      const bondResponse = bondController.calculateBondMetrics(bondRequest);

      expect(bondResponse.bondStatus).toBe(BondStatus.Par);
      expect(bondResponse.cashFlowSchedule).toHaveLength(5);
    });
  });
});
