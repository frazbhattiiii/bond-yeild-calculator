import clsx from 'clsx';

type ButtonProps = {
  buttonLabel: string;
  buttonType?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onClick?: () => void;
};

const VARIANT_CLASSES: Record<string, string> = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50',
  secondary:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
};

export function Button({
  buttonLabel,
  buttonType = 'button',
  variant = 'primary',
  isDisabled = false,
  isFullWidth = false,
  onClick,
}: ButtonProps): React.JSX.Element {
  return (
    <button
      type={buttonType}
      disabled={isDisabled}
      onClick={onClick}
      className={clsx(
        'cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
        VARIANT_CLASSES[variant],
        isFullWidth && 'w-full',
      )}
    >
      {buttonLabel}
    </button>
  );
}
