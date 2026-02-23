import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { COUPON_FREQUENCY_OPTIONS } from '@/constants/bond.constants';
import { useBondCalculator } from '@/hooks/useBondCalculator';

type BondFormFieldProps = {
  fieldLabel: string;
  fieldName: string;
  fieldValue: string;
  onFieldChange: (newValue: string) => void;
  errorMessage?: string;
  inputType?: string;
  placeholder?: string;
};

function BondFormField({
  fieldLabel,
  fieldName,
  fieldValue,
  onFieldChange,
  errorMessage,
  inputType = 'text',
  placeholder,
}: BondFormFieldProps): React.JSX.Element {
  const hasError = Boolean(errorMessage);

  return (
    <div>
      <label
        htmlFor={fieldName}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {fieldLabel}
      </label>
      <Input
        inputId={fieldName}
        inputName={fieldName}
        inputValue={fieldValue}
        onInputChange={onFieldChange}
        inputType={inputType}
        placeholder={placeholder}
        hasError={hasError}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

export function BondCalculatorForm(): React.JSX.Element {
  const { state, updateField, submitCalculation, resetCalculator } =
    useBondCalculator();

  function handleFormSubmit(event: React.FormEvent): void {
    event.preventDefault();
    void submitCalculation();
  }

  const frequencySelectOptions = COUPON_FREQUENCY_OPTIONS.map(
    (frequencyOption) => ({
      label: frequencyOption.label,
      optionValue: frequencyOption.value,
    }),
  );

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <BondFormField
        fieldLabel="Face Value ($)"
        fieldName="faceValue"
        fieldValue={state.faceValue}
        onFieldChange={(newValue) => updateField('faceValue', newValue)}
        errorMessage={state.bondFormErrors.faceValue}
        inputType="number"
        placeholder="1000"
      />

      <BondFormField
        fieldLabel="Coupon Rate (%)"
        fieldName="couponRate"
        fieldValue={state.couponRate}
        onFieldChange={(newValue) => updateField('couponRate', newValue)}
        errorMessage={state.bondFormErrors.couponRate}
        inputType="number"
        placeholder="5"
      />

      <BondFormField
        fieldLabel="Market Price ($)"
        fieldName="marketPrice"
        fieldValue={state.marketPrice}
        onFieldChange={(newValue) => updateField('marketPrice', newValue)}
        errorMessage={state.bondFormErrors.marketPrice}
        inputType="number"
        placeholder="950"
      />

      <BondFormField
        fieldLabel="Years to Maturity"
        fieldName="yearsToMaturity"
        fieldValue={state.yearsToMaturity}
        onFieldChange={(newValue) => updateField('yearsToMaturity', newValue)}
        errorMessage={state.bondFormErrors.yearsToMaturity}
        inputType="number"
        placeholder="10"
      />

      <div>
        <label
          htmlFor="couponFrequency"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Coupon Frequency
        </label>
        <Select
          selectId="couponFrequency"
          selectName="couponFrequency"
          selectedValue={state.couponFrequency}
          options={frequencySelectOptions}
          onSelectionChange={(newValue) =>
            updateField('couponFrequency', newValue)
          }
        />
      </div>

      {state.calculationError && (
        <Alert alertMessage={state.calculationError} />
      )}

      <div className="flex gap-3 pt-2">
        <Button
          buttonLabel={state.isCalculating ? 'Calculating...' : 'Calculate'}
          buttonType="submit"
          variant="primary"
          isDisabled={state.isCalculating}
          isFullWidth
        />
        <Button
          buttonLabel="Reset"
          variant="secondary"
          onClick={resetCalculator}
        />
      </div>
    </form>
  );
}
