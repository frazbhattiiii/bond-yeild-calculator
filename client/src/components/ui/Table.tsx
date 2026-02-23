import clsx from 'clsx';

export type TableColumn<TRow,> = {
  columnKey: string;
  columnHeader: string;
  renderCell: (row: TRow) => React.ReactNode;
  isHighlighted?: (row: TRow) => boolean;
};

type TableProps<TRow,> = {
  columns: TableColumn<TRow>[];
  rows: TRow[];
  getRowKey: (row: TRow) => string | number;
};

export function Table<TRow,>({
  columns,
  rows,
  getRowKey,
}: TableProps<TRow>): React.JSX.Element {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.columnKey}
                  className="px-4 py-3 text-left font-medium text-gray-700"
                >
                  {column.columnHeader}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => {
              const hasHighlight = columns.some(
                (column) => column.isHighlighted?.(row),
              );

              return (
                <tr
                  key={getRowKey(row)}
                  className={clsx(
                    hasHighlight && 'bg-emerald-50 font-medium',
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.columnKey}
                      className="px-4 py-2.5 text-gray-700"
                    >
                      {column.renderCell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
