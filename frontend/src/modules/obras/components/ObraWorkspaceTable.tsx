import type { ReactNode } from 'react';

export function ObraWorkspaceTable({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 text-left font-semibold text-text-muted">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-surface-soft/70">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-text-body">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
