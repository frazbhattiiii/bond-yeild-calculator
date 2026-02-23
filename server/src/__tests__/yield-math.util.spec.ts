import {
  computeAnnualCouponPayment,
  computeBondPriceAtYield,
  computeBondPriceDerivative,
  calculateCurrentYield,
  calculateTotalInterest,
  calculateYieldToMaturity,
  hasConverged,
} from '@/utils/yield-math.util';
import { CONVERGENCE_THRESHOLD } from '@/constants/bond.constants';

describe('yield-math.util', () => {
  describe('computeAnnualCouponPayment', () => {
    it('should compute the annual coupon for a standard bond', () => {
      const annualCoupon = computeAnnualCouponPayment(1000, 5);
      expect(annualCoupon).toBe(50);
    });

    it('should return zero for a zero-coupon bond', () => {
      const annualCoupon = computeAnnualCouponPayment(1000, 0);
      expect(annualCoupon).toBe(0);
    });
  });

  describe('calculateCurrentYield', () => {
    it('should compute current yield as annual coupon divided by market price', () => {
      const currentYield = calculateCurrentYield(50, 950);
      expect(currentYield).toBeCloseTo(0.052632, 5);
    });

    it('should equal the coupon rate when bond is at par', () => {
      const currentYield = calculateCurrentYield(50, 1000);
      expect(currentYield).toBeCloseTo(0.05, 5);
    });
  });

  describe('calculateTotalInterest', () => {
    it('should multiply annual coupon by years to maturity', () => {
      const totalInterest = calculateTotalInterest(50, 10);
      expect(totalInterest).toBe(500);
    });

    it('should return zero for a zero-coupon bond', () => {
      const totalInterest = calculateTotalInterest(0, 10);
      expect(totalInterest).toBe(0);
    });
  });

  describe('computeBondPriceAtYield', () => {
    it('should return face value when yield equals coupon rate', () => {
      const periodicCoupon = 25;
      const faceValue = 1000;
      const totalPeriods = 20;
      const periodicYield = 0.025;

      const estimatedPrice = computeBondPriceAtYield(
        periodicCoupon,
        faceValue,
        totalPeriods,
        periodicYield,
      );

      expect(estimatedPrice).toBeCloseTo(1000, 2);
    });

    it('should return a price below face value when yield exceeds coupon rate', () => {
      const periodicCoupon = 25;
      const faceValue = 1000;
      const totalPeriods = 20;
      const periodicYield = 0.03;

      const estimatedPrice = computeBondPriceAtYield(
        periodicCoupon,
        faceValue,
        totalPeriods,
        periodicYield,
      );

      expect(estimatedPrice).toBeLessThan(1000);
    });
  });

  describe('computeBondPriceDerivative', () => {
    it('should return a positive value for positive yield', () => {
      const derivative = computeBondPriceDerivative(25, 1000, 20, 0.025);
      expect(derivative).toBeGreaterThan(0);
    });
  });

  describe('hasConverged', () => {
    it('should return true when difference is below threshold', () => {
      const belowThreshold = CONVERGENCE_THRESHOLD / 10;
      expect(hasConverged(0.05, 0.05 + belowThreshold)).toBe(true);
    });

    it('should return false when difference exceeds threshold', () => {
      const aboveThreshold = CONVERGENCE_THRESHOLD * 10;
      expect(hasConverged(0.05, 0.05 + aboveThreshold)).toBe(false);
    });
  });

  describe('calculateYieldToMaturity', () => {
    it('should converge to the coupon rate when bond is at par', () => {
      const yieldToMaturity = calculateYieldToMaturity(1000, 1000, 25, 20, 2);

      expect(yieldToMaturity).toBeCloseTo(0.05, 3);
    });

    it('should return a higher yield for a discount bond', () => {
      const yieldToMaturity = calculateYieldToMaturity(1000, 950, 25, 20, 2);

      expect(yieldToMaturity).toBeGreaterThan(0.05);
    });

    it('should return a lower yield for a premium bond', () => {
      const yieldToMaturity = calculateYieldToMaturity(1000, 1050, 25, 20, 2);

      expect(yieldToMaturity).toBeLessThan(0.05);
    });

    it('should work for annual coupon frequency', () => {
      const yieldToMaturity = calculateYieldToMaturity(1000, 950, 50, 10, 1);

      expect(yieldToMaturity).toBeGreaterThan(0.05);
      expect(yieldToMaturity).toBeLessThan(0.1);
    });

    it('should work for quarterly coupon frequency', () => {
      const yieldToMaturity = calculateYieldToMaturity(1000, 950, 12.5, 20, 4);

      expect(yieldToMaturity).toBeGreaterThan(0.05);
    });

    it('should handle zero-coupon bonds', () => {
      const yieldToMaturity = calculateYieldToMaturity(1000, 800, 0, 10, 1);

      expect(yieldToMaturity).toBeGreaterThan(0);
    });
  });
});
