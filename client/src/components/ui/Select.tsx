import clsx from 'clsx';

type SelectOption<TValue extends string | number> = {
  label: string;
  optionValue: TValue;
};

type SelectProps<TValue extends string | number> = {
  selectId: string;
  selectName: string;
  selectedValue: TValue;
  options: SelectOption<TValue>[];
  onSelectionChange: (newValue: string) => void;
  isDisabled?: boolean;
};

export function Select<TValue extends string | number>({
  selectId,
  selectName,
  selectedValue,
  options,
  onSelectionChange,
  isDisabled = false,
}: SelectProps<TValue>): React.JSX.Element {
  return (
    <select
      id={selectId}
      name={selectName}
      value={selectedValue}
      onChange={(event) => onSelectionChange(event.target.value)}
      disabled={isDisabled}
      className={clsx(
        'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors',
        'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {options.map((frequencyOption) => (
        <option key={frequencyOption.optionValue} value={frequencyOption.optionValue}>
          {frequencyOption.label}
        </option>
      ))}
    </select>
  );
}
