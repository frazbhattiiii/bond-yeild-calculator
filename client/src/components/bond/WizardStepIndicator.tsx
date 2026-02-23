import clsx from 'clsx';

type WizardStepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
};

export function WizardStepIndicator({
  currentStep,
  totalSteps,
  stepLabels,
}: WizardStepIndicatorProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-center gap-0">
      {Array.from({ length: totalSteps }, (_, stepIndex) => {
        const stepNumber = stepIndex + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            {stepIndex > 0 && (
              <div
                className={clsx(
                  'h-0.5 w-10',
                  isCompleted || isActive ? 'bg-emerald-400' : 'bg-gray-200',
                )}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  isActive && 'bg-emerald-600 text-white',
                  isCompleted && 'bg-emerald-100 text-emerald-700',
                  !isActive && !isCompleted && 'bg-gray-200 text-gray-500',
                )}
              >
                {stepNumber}
              </div>
              <span
                className={clsx(
                  'text-xs font-medium',
                  isActive ? 'text-emerald-700' : 'text-gray-500',
                )}
              >
                {stepLabels[stepIndex]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
