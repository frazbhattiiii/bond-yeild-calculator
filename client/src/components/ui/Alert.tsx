import clsx from 'clsx';

type AlertVariant = 'error' | 'warning';

type AlertProps = {
  alertMessage: string;
  variant?: AlertVariant;
};

const ALERT_VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
};

export function Alert({
  alertMessage,
  variant = 'error',
}: AlertProps): React.JSX.Element {
  return (
    <div
      className={clsx(
        'rounded-lg border px-4 py-3 text-sm',
        ALERT_VARIANT_CLASSES[variant],
      )}
    >
      {alertMessage}
    </div>
  );
}
