# Cash Flow Schedule

## Table Columns

| Column | Description | Format |
|--------|------------|--------|
| Period | Sequential period number (1 to n) | Integer |
| Payment Date | Relative date label from today based on coupon frequency | "Year X" or "Month X" |
| Coupon Payment | Periodic coupon amount received | Currency ($X,XXX.XX) |
| Cumulative Interest | Running total of all coupon payments up to this period | Currency ($X,XXX.XX) |
| Remaining Principal | Face value still owed (face value until final period) | Currency ($X,XXX.XX) |

## Calculation Logic

**Total periods:**
```
totalPeriods = yearsToMaturity * couponFrequency
```

**Per-period coupon payment:**
```
periodicCouponPayment = (faceValue * couponRate / 100) / couponFrequency
```

**Cumulative interest at period `t`:**
```
cumulativeInterest = periodicCouponPayment * t
```

**Remaining principal:**
- Periods 1 to (n-1): `faceValue` (full principal still owed)
- Period n (final): `0` (face value repaid at maturity)

**Final period cash flow:**
The last period includes both the coupon payment and the face value repayment:
```
finalPeriodCashFlow = periodicCouponPayment + faceValue
```

## Display Requirements

- All currency values formatted with dollar sign, comma separators, and 2 decimal places
- Final period row should be visually distinguished (e.g., bold or labeled) to indicate principal repayment
- Table should be scrollable if the number of periods is large (e.g., 30-year semi-annual = 60 rows)
- Column headers should be clear and self-explanatory
