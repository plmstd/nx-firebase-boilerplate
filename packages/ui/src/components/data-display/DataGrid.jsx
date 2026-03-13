import { cn } from '@myapp/utils';

export function DataGrid({ rows = [], columns = [], className }) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border', className)}>
      <table className="w-full border-collapse text-left text-sm text-text">
        <thead className="bg-surface">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-3 py-2 font-medium">{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border">
              {columns.map((column) => {
                const value = row[column.key];
                return (
                  <td key={String(column.key)} className="px-3 py-2">
                    {column.render ? column.render(value, row) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
