import { Table } from '@/components/ui/Table';
import type { TableColumn } from '@/components/ui/Table';
import type { CashFlowEntry } from '@/types/bond.types';
import { formatAsCurrency } from '@/utils/format.util';

type CashFlowScheduleTableProps = {
  cashFlowSchedule: CashFlowEntry[];
};

const CASH_FLOW_TABLE_COLUMNS: TableColumn<CashFlowEntry>[] = [
  {
    columnKey: 'period',
    columnHeader: 'Period',
    renderCell: (entry) => entry.period,
  },
  {
    columnKey: 'paymentDate',
    columnHeader: 'Payment Date',
    renderCell: (entry) => entry.paymentDate,
  },
  {
    columnKey: 'couponPayment',
    columnHeader: 'Coupon Payment',
    renderCell: (entry) => formatAsCurrency(entry.couponPayment),
  },
  {
    columnKey: 'cumulativeInterest',
    columnHeader: 'Cumulative Interest',
    renderCell: (entry) => formatAsCurrency(entry.cumulativeInterest),
  },
  {
    columnKey: 'remainingPrincipal',
    columnHeader: 'Remaining Principal',
    renderCell: (entry) => formatAsCurrency(entry.remainingPrincipal),
    isHighlighted: (entry) => entry.remainingPrincipal === 0,
  },
];

export function CashFlowScheduleTable({
  cashFlowSchedule,
}: CashFlowScheduleTableProps): React.JSX.Element {
  return (
    <Table
      columns={CASH_FLOW_TABLE_COLUMNS}
      rows={cashFlowSchedule}
      getRowKey={(entry) => entry.period}
    />
  );
}
