import { BondService } from '@/bond/bond.service';
import { BondStatus } from '@/enums/bond-status.enum';
import { CouponFrequency } from '@/enums/coupon-frequency.enum';

describe('BondService', () => {
  let bondService: BondService;

  beforeEach(() => {
    bondService = new BondService();
  });

  describe('calculateBondMetrics', () => {
    it('should compute correct metrics for a discount bond', () => {
      const bondMetrics = bondService.calculateBondMetrics({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.SemiAnnual,
      });

      expect(bondMetrics.currentYield).toBeCloseTo(5.2632, 2);
      expect(bondMetrics.yieldToMaturity).toBeGreaterThan(5);
      expect(bondMetrics.totalInterest).toBe(500);
      expect(bondMetrics.bondStatus).toBe(BondStatus.Discount);
      expect(bondMetrics.cashFlowSchedule).toHaveLength(20);
    });

    it('should compute correct metrics for a premium bond', () => {
      const bondMetrics = bondService.calculateBondMetrics({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1050,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.SemiAnnual,
      });

      expect(bondMetrics.currentYield).toBeCloseTo(4.7619, 2);
      expect(bondMetrics.yieldToMaturity).toBeLessThan(5);
      expect(bondMetrics.totalInterest).toBe(500);
      expect(bondMetrics.bondStatus).toBe(BondStatus.Premium);
    });

    it('should compute correct metrics for a par bond', () => {
      const bondMetrics = bondService.calculateBondMetrics({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.SemiAnnual,
      });

      expect(bondMetrics.currentYield).toBeCloseTo(5, 2);
      expect(bondMetrics.yieldToMaturity).toBeCloseTo(5, 1);
      expect(bondMetrics.bondStatus).toBe(BondStatus.Par);
    });

    it('should handle zero-coupon bonds', () => {
      const bondMetrics = bondService.calculateBondMetrics({
        faceValue: 1000,
        couponRate: 0,
        marketPrice: 800,
        yearsToMaturity: 5,
        couponFrequency: CouponFrequency.Annual,
      });

      expect(bondMetrics.currentYield).toBe(0);
      expect(bondMetrics.yieldToMaturity).toBeGreaterThan(0);
      expect(bondMetrics.totalInterest).toBe(0);
      expect(bondMetrics.bondStatus).toBe(BondStatus.Discount);
    });

    it('should handle annual coupon frequency', () => {
      const bondMetrics = bondService.calculateBondMetrics({
        faceValue: 1000,
        couponRate: 8,
        marketPrice: 1100,
        yearsToMaturity: 5,
        couponFrequency: CouponFrequency.Annual,
      });

      expect(bondMetrics.cashFlowSchedule).toHaveLength(5);
      expect(bondMetrics.bondStatus).toBe(BondStatus.Premium);
      expect(bondMetrics.totalInterest).toBe(400);
    });

    it('should handle quarterly coupon frequency', () => {
      const bondMetrics = bondService.calculateBondMetrics({
        faceValue: 1000,
        couponRate: 6,
        marketPrice: 980,
        yearsToMaturity: 3,
        couponFrequency: CouponFrequency.Quarterly,
      });

      expect(bondMetrics.cashFlowSchedule).toHaveLength(12);
      expect(bondMetrics.totalInterest).toBe(180);
    });

    it('should return yields as percentages', () => {
      const bondMetrics = bondService.calculateBondMetrics({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.Annual,
      });

      expect(bondMetrics.currentYield).toBeCloseTo(5, 1);
      expect(bondMetrics.yieldToMaturity).toBeCloseTo(5, 1);
    });
  });
});
