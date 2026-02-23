import clsx from 'clsx';

type BadgeVariant = 'amber' | 'blue' | 'emerald' | 'gray';

type BadgeProps = {
  badgeLabel: string;
  variant: BadgeVariant;
};

const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  amber: 'bg-amber-100 text-amber-800',
  blue: 'bg-blue-100 text-blue-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  gray: 'bg-gray-100 text-gray-800',
};

export function Badge({
  badgeLabel,
  variant,
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={clsx(
        'inline-block rounded-full px-3 py-1 text-sm font-medium',
        BADGE_VARIANT_CLASSES[variant],
      )}
    >
      {badgeLabel}
    </span>
  );
}
