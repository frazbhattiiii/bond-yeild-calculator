import { buildCashFlowSchedule } from '@/utils/cash-flow.util';
import { CouponFrequency } from '@/enums/coupon-frequency.enum';

describe('cash-flow.util', () => {
  describe('buildCashFlowSchedule', () => {
    const bondFaceValue = 1000;
    const periodicCoupon = 25;

    it('should generate correct number of periods for semi-annual payments', () => {
      const totalPeriods = 20;
      const schedule = buildCashFlowSchedule(
        bondFaceValue,
        periodicCoupon,
        totalPeriods,
        CouponFrequency.SemiAnnual,
      );

      expect(schedule).toHaveLength(totalPeriods);
    });

    it('should label payment dates using month offsets', () => {
      const schedule = buildCashFlowSchedule(
        bondFaceValue,
        periodicCoupon,
        4,
        CouponFrequency.SemiAnnual,
      );

      expect(schedule[0].paymentDate).toBe('Month 6');
      expect(schedule[1].paymentDate).toBe('Month 12');
      expect(schedule[2].paymentDate).toBe('Month 18');
      expect(schedule[3].paymentDate).toBe('Month 24');
    });

    it('should compute cumulative interest correctly', () => {
      const schedule = buildCashFlowSchedule(
        bondFaceValue,
        periodicCoupon,
        4,
        CouponFrequency.SemiAnnual,
      );

      expect(schedule[0].cumulativeInterest).toBe(25);
      expect(schedule[1].cumulativeInterest).toBe(50);
      expect(schedule[2].cumulativeInterest).toBe(75);
      expect(schedule[3].cumulativeInterest).toBe(100);
    });

    it('should show full principal until the final period', () => {
      const schedule = buildCashFlowSchedule(
        bondFaceValue,
        periodicCoupon,
        4,
        CouponFrequency.SemiAnnual,
      );

      expect(schedule[0].remainingPrincipal).toBe(bondFaceValue);
      expect(schedule[1].remainingPrincipal).toBe(bondFaceValue);
      expect(schedule[2].remainingPrincipal).toBe(bondFaceValue);
      expect(schedule[3].remainingPrincipal).toBe(0);
    });

    it('should set each period coupon payment to the periodic amount', () => {
      const schedule = buildCashFlowSchedule(
        bondFaceValue,
        periodicCoupon,
        4,
        CouponFrequency.SemiAnnual,
      );

      for (const entry of schedule) {
        expect(entry.couponPayment).toBe(periodicCoupon);
      }
    });

    it('should use 3-month intervals for quarterly frequency', () => {
      const schedule = buildCashFlowSchedule(
        bondFaceValue,
        12.5,
        8,
        CouponFrequency.Quarterly,
      );

      expect(schedule[0].paymentDate).toBe('Month 3');
      expect(schedule[3].paymentDate).toBe('Month 12');
      expect(schedule[7].paymentDate).toBe('Month 24');
    });

    it('should use 12-month intervals for annual frequency', () => {
      const schedule = buildCashFlowSchedule(
        bondFaceValue,
        50,
        3,
        CouponFrequency.Annual,
      );

      expect(schedule[0].paymentDate).toBe('Month 12');
      expect(schedule[1].paymentDate).toBe('Month 24');
      expect(schedule[2].paymentDate).toBe('Month 36');
    });

    it('should return an empty schedule when total periods is zero', () => {
      const schedule = buildCashFlowSchedule(
        bondFaceValue,
        0,
        0,
        CouponFrequency.Annual,
      );

      expect(schedule).toHaveLength(0);
    });
  });
});
