# Bond Calculator

## Inputs

| Field | Type | Constraints |
|-------|------|------------|
| Face Value | number | Required, positive |
| Coupon Rate | number | Required, 0–100 (percentage) |
| Market Price | number | Required, positive |
| Years to Maturity | number | Required, positive integer |
| Coupon Frequency | enum | Required: annual (1), semi-annual (2), quarterly (4) |

## Outputs

| Output | Description |
|--------|------------|
| Current Yield | Annual return based on current market price |
| Yield to Maturity (YTM) | Annualized total return if held to maturity |
| Total Interest | Sum of all coupon payments over the bond's life |
| Bond Status | Premium (price > face), Discount (price < face), or Par (price = face) |
| Cash Flow Schedule | Period-by-period table of payments (see `cash-flow-schedule.md`) |

## Formulas

**Annual Coupon Payment:**
```
annualCouponPayment = faceValue * (couponRate / 100)
```

**Periodic Coupon Payment:**
```
periodicCouponPayment = annualCouponPayment / couponFrequency
```

**Current Yield:**
```
currentYield = annualCouponPayment / marketPrice
```

**Total Interest:**
```
totalInterest = annualCouponPayment * yearsToMaturity
```

**Yield to Maturity (Newton-Raphson approximation):**

YTM is the rate `r` that satisfies:

```
marketPrice = Σ (periodicCoupon / (1 + r)^t) + (faceValue / (1 + r)^n)
```

Where:
- `t` = period number (1 to n)
- `n` = total periods (`yearsToMaturity * couponFrequency`)
- `r` = periodic yield (YTM / couponFrequency)

Solve iteratively using Newton-Raphson:
```
r_next = r_current - f(r_current) / f'(r_current)
```

Where:
- `f(r) = marketPrice - Σ(periodicCoupon / (1+r)^t) - faceValue / (1+r)^n`
- `f'(r) = Σ(t * periodicCoupon / (1+r)^(t+1)) + n * faceValue / (1+r)^(n+1)`

Annualize: `YTM = periodicYield * couponFrequency`

## Edge Cases

| Case | Behavior |
|------|----------|
| Zero coupon rate | Current yield = 0, YTM based solely on price vs. face value |
| Bond at par (price = face value) | Current yield = coupon rate, YTM ≈ coupon rate |
| Very short maturity (1 year) | Fewer periods, YTM converges quickly |
| Very long maturity (30+ years) | More periods, ensure Newton-Raphson iteration limit is sufficient |
| Price equals zero | Reject — validation error |
| Coupon rate of 0% | Valid — treat as zero-coupon bond |

## Validation Rules

- All fields are required
- Face value: must be a positive number
- Coupon rate: must be between 0 and 100 (inclusive)
- Market price: must be a positive number
- Years to maturity: must be a positive integer
- Coupon frequency: must be one of 1, 2, or 4
