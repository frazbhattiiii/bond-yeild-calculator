import { Badge } from '@/components/ui/Badge';
import type { BondStatus } from '@/types/bond.types';
import { formatBondStatusLabel } from '@/utils/format.util';

type BadgeVariant = 'amber' | 'blue' | 'emerald' | 'gray';

const BOND_STATUS_BADGE_VARIANTS: Record<BondStatus, BadgeVariant> = {
  premium: 'amber',
  discount: 'blue',
  par: 'emerald',
};

type BondStatusBadgeProps = {
  bondStatus: BondStatus;
};

export function BondStatusBadge({
  bondStatus,
}: BondStatusBadgeProps): React.JSX.Element {
  return (
    <Badge
      badgeLabel={formatBondStatusLabel(bondStatus)}
      variant={BOND_STATUS_BADGE_VARIANTS[bondStatus]}
    />
  );
}
