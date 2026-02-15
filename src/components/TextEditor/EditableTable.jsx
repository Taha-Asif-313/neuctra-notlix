import React, { useState, useEffect } from "react";
import { Plus, Trash2, Columns, Check } from "lucide-react";

const EditableTable = ({ initialRows = 2, initialCols = 2, initialData = null, onDone }) => {
  const [tableData, setTableData] = useState(() => {
    if (initialData) return initialData; // use passed table data if editing
    const headers = Array(initialCols).fill("").map((_, i) => `Header ${i + 1}`);
    const rows = Array(initialRows).fill(null).map(() => Array(initialCols).fill(""));
    return { headers, rows };
  });

  useEffect(() => {
    if (initialData) setTableData(initialData);
  }, [initialData]);

  const updateCell = (rowIndex, colIndex, value) => {
    setTableData((prev) => {
      const newRows = [...prev.rows];
      newRows[rowIndex][colIndex] = value;
      return { ...prev, rows: newRows };
    });
  };

  const updateHeader = (colIndex, value) => {
    setTableData((prev) => {
      const newHeaders = [...prev.headers];
      newHeaders[colIndex] = value;
      return { ...prev, headers: newHeaders };
    });
  };

  const addRow = () => {
    setTableData((prev) => {
      const newRow = Array(prev.headers.length).fill("");
      return { ...prev, rows: [...prev.rows, newRow] };
    });
  };

  const deleteRow = (rowIndex) => {
    setTableData((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== rowIndex),
    }));
  };

  const addColumn = () => {
    setTableData((prev) => {
      const newHeaders = [...prev.headers, `Header ${prev.headers.length + 1}`];
      const newRows = prev.rows.map((r) => [...r, ""]);
      return { headers: newHeaders, rows: newRows };
    });
  };

  const deleteColumn = (colIndex) => {
    setTableData((prev) => {
      const newHeaders = prev.headers.filter((_, i) => i !== colIndex);
      const newRows = prev.rows.map((r) => r.filter((_, i) => i !== colIndex));
      return { headers: newHeaders, rows: newRows };
    });
  };

  return (
    <div className="min-w-full overflow-auto border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900">
      {/* Table Controls */}
      <div className="flex gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-10">
        <button
          onClick={addRow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <Plus size={16} /> Add Row
        </button>
        <button
          onClick={addColumn}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <Columns size={16} /> Add Column
        </button>
        {onDone && (
          <button
            onClick={() => onDone(tableData)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-md hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            <Check size={16} /> Done
          </button>
        )}
      </div>

      {/* Table Body */}
      <div className="p-0">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {tableData.headers.map((header, colIndex) => (
                <th
                  key={colIndex}
                  className="border border-zinc-200 dark:border-zinc-700 p-2 bg-zinc-50 dark:bg-zinc-800 relative group"
                >
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => updateHeader(colIndex, e.target.value)}
                      className="w-full px-2 py-1 bg-transparent border border-transparent focus:border-sky-500 rounded-md text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder={`Header ${colIndex + 1}`}
                    />
                    {tableData.headers.length > 1 && (
                      <button
                        onClick={() => deleteColumn(colIndex)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        title="Delete column"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {tableData.headers.length > 0 && <th className="w-10 p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"></th>}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-zinc-200 dark:border-zinc-700 p-2"
                  >
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="w-full px-2 py-1 bg-transparent border border-transparent focus:border-sky-500 rounded-md text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder="Enter value..."
                    />
                  </td>
                ))}
                <td className="border border-zinc-200 dark:border-zinc-700 p-2 bg-zinc-50 dark:bg-zinc-800">
                  <button
                    onClick={() => deleteRow(rowIndex)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                    title="Delete row"
                    disabled={tableData.rows.length <= 1}
                  >
                    <Trash2 size={14} className={tableData.rows.length <= 1 ? "opacity-30" : ""} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tableData.rows.length === 0 && (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-lg mt-4">
            No rows available. Click "Add Row" to create one.
          </div>
        )}
      </div>

      {/* Table Info */}
      <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400">
        {tableData.rows.length} row{tableData.rows.length !== 1 ? 's' : ''} • {tableData.headers.length} column{tableData.headers.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default EditableTable;
