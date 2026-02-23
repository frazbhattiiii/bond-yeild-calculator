import type { BondStatus } from '@/types/bond.types';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatAsCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatAsPercentage(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

const BOND_STATUS_LABELS: Record<BondStatus, string> = {
  premium: 'Premium',
  discount: 'Discount',
  par: 'Par',
};

export function formatBondStatusLabel(bondStatus: BondStatus): string {
  return BOND_STATUS_LABELS[bondStatus];
}
