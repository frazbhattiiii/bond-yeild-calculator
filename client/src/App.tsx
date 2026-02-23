import { BondCalculatorForm } from '@/components/bond/BondCalculatorForm';
import { BondYieldResults } from '@/components/bond/BondYieldResults';
import { CashFlowScheduleTable } from '@/components/bond/CashFlowScheduleTable';
import { WizardStepIndicator } from '@/components/bond/WizardStepIndicator';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useBondCalculator } from '@/hooks/useBondCalculator';

const WIZARD_STEP_LABELS = ['Bond Parameters', 'Results'];
const TOTAL_WIZARD_STEPS = 2;

function App(): React.JSX.Element {
  const { state, resetCalculator } = useBondCalculator();

  const { calculationResponse } = state;
  const currentWizardStep = calculationResponse !== null ? 2 : 1;

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-700">
            Bond Yield Calculator
          </h1>
          <p className="mt-2 text-gray-600">
            Calculate current yield, yield to maturity, and view the cash flow
            schedule for a bond.
          </p>
        </header>

        <div className="mb-8">
          <WizardStepIndicator
            currentStep={currentWizardStep}
            totalSteps={TOTAL_WIZARD_STEPS}
            stepLabels={WIZARD_STEP_LABELS}
          />
        </div>

        {calculationResponse === null && (
          <section className="mb-10">
            <Card className="mx-auto max-w-lg p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Bond Parameters
              </h2>
              <BondCalculatorForm />
            </Card>
          </section>
        )}

        {calculationResponse !== null && (
          <div className="animate-fade-in space-y-8 transition-opacity duration-300">
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Results
              </h2>
              <BondYieldResults
                calculationResponse={calculationResponse}
              />
            </section>

            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Cash Flow Schedule
              </h2>
              <CashFlowScheduleTable
                cashFlowSchedule={calculationResponse.cashFlowSchedule}
              />
            </section>

            <div className="flex justify-center">
              <Button
                buttonLabel="Start Over"
                variant="secondary"
                onClick={resetCalculator}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
