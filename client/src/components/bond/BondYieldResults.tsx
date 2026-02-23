import { Card } from '@/components/ui/Card';
import type { BondCalculationResponse } from '@/types/bond.types';
import { formatAsCurrency, formatAsPercentage } from '@/utils/format.util';

import { BondStatusBadge } from './BondStatusBadge';

type BondYieldResultsProps = {
  calculationResponse: BondCalculationResponse;
};

function ResultCard({
  resultTitle,
  displayValue,
}: {
  resultTitle: string;
  displayValue: string;
}): React.JSX.Element {
  return (
    <Card className="p-4">
      <p className="text-sm font-medium text-gray-500">{resultTitle}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">
        {displayValue}
      </p>
    </Card>
  );
}

export function BondYieldResults({
  calculationResponse,
}: BondYieldResultsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ResultCard
        resultTitle="Current Yield"
        displayValue={formatAsPercentage(calculationResponse.currentYield)}
      />
      <ResultCard
        resultTitle="Yield to Maturity"
        displayValue={formatAsPercentage(calculationResponse.yieldToMaturity)}
      />
      <ResultCard
        resultTitle="Total Interest"
        displayValue={formatAsCurrency(calculationResponse.totalInterest)}
      />
      <Card className="p-4">
        <p className="text-sm font-medium text-gray-500">Bond Status</p>
        <div className="mt-2">
          <BondStatusBadge bondStatus={calculationResponse.bondStatus} />
        </div>
      </Card>
    </div>
  );
}
