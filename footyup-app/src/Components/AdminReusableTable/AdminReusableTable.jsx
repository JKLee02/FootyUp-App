import { useState, useMemo } from 'react';
import './AdminReusableTable.css';

function AdminReusableTable({ columns, data, actions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [columnFilters, setColumnFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Filter data based on search and column filters
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch = columns.some((col) =>
        row[col.accessor]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesColumnFilters = Object.entries(columnFilters).every(([accessor, filterValue]) => {
        if (!filterValue) return true;
        return row[accessor]?.toString().toLowerCase().includes(filterValue.toLowerCase());
      });

      return matchesSearch && matchesColumnFilters;
    });
  }, [data, columns, searchTerm, columnFilters]);

  // Paginate the filtered data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleColumnFilter = (accessor, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [accessor]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="admin-table-container">
      {/* Search bar */}
      <div className="admin-search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
          placeholder="Search..."
          className="admin-search-input"
        />
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.accessor}>
                  <div className="column-header">
                    <span>{column.Header}</span>
                    <input
                      type="text"
                      placeholder={`Filter ${column.Header}`}
                      value={columnFilters[column.accessor] || ''}
                      onChange={(e) => handleColumnFilter(column.accessor, e.target.value)}
                      className="column-filter"
                    />
                  </div>
                </th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column.accessor}>{row[column.accessor]}</td>
                  ))}
                  {actions && (
                    <td className="admin-action-buttons">
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => action.onClick(row)} // Pass the row data to the action
                          className={`admin-action-button ${action.className || ''}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="no-results">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="admin-pagination-button"
          >
            Previous
          </button>
          <span className="admin-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="admin-pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminReusableTable;
