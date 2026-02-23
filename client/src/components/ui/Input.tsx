import clsx from 'clsx';

type InputProps = {
  inputId: string;
  inputName: string;
  inputValue: string;
  onInputChange: (newValue: string) => void;
  inputType?: string;
  placeholder?: string;
  hasError?: boolean;
  isDisabled?: boolean;
};

export function Input({
  inputId,
  inputName,
  inputValue,
  onInputChange,
  inputType = 'text',
  placeholder,
  hasError = false,
  isDisabled = false,
}: InputProps): React.JSX.Element {
  return (
    <input
      id={inputId}
      name={inputName}
      type={inputType}
      value={inputValue}
      onChange={(event) => onInputChange(event.target.value)}
      placeholder={placeholder}
      disabled={isDisabled}
      className={clsx(
        'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
        hasError
          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
          : 'border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
    />
  );
}
