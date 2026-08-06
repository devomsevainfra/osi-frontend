/**
 * Generic data table.
 * @param {Object} props
 * @param {string[]} props.headers - column header labels
 * @param {React.ReactNode[][]} props.rows - 2D array of cells (can be JSX)
 * @param {boolean} [props.loading]
 * @param {string} [props.emptyMessage]
 */
export function AdminTable({ headers, rows, loading, emptyMessage = 'No records found.' }) {
  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="admin-table__th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="admin-table__empty">
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="admin-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((cells, ri) => (
              <tr key={ri} className="admin-table__row">
                {cells.map((cell, ci) => (
                  <td key={ci} className="admin-table__td">{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
