import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const TableEditorBlock = ({
  initialRows = 2,
  initialCols = 2,
  initialData = null,
  onDone,
}) => {
  const [tableData, setTableData] = useState(() => {
    const headers = Array(initialCols)
      .fill("")
      .map((_, i) => `Header ${i + 1}`);
    const rows = Array(initialRows)
      .fill(null)
      .map(() => Array(initialCols).fill(""));
    const headerAlign = Array(initialCols).fill("center");
    const cellAlign = Array(initialCols).fill("left");

    // Merge initialData safely
    if (initialData) {
      return {
        headers: initialData.headers || headers,
        rows: initialData.rows || rows,
        headerAlign: initialData.headerAlign || headerAlign,
        cellAlign: initialData.cellAlign || cellAlign,
      };
    }

    return { headers, rows, headerAlign, cellAlign };
  });

  useEffect(() => {
    setTableData((prev) => {
      const colCount = prev.headers.length;
      return {
        ...prev,
        headerAlign: prev.headerAlign
          ?.slice(0, colCount)
          .concat(
            Array(colCount - (prev.headerAlign?.length || 0)).fill("center"),
          ),
        cellAlign: prev.cellAlign
          ?.slice(0, colCount)
          .concat(Array(colCount - (prev.cellAlign?.length || 0)).fill("left")),
      };
    });
  }, [tableData.headers.length]);

  // Update cell value
  const updateCell = (rowIndex, colIndex, value) => {
    setTableData((prev) => {
      const newRows = [...prev.rows];
      if (!newRows[rowIndex])
        newRows[rowIndex] = Array(prev.headers.length).fill("");
      newRows[rowIndex][colIndex] = value;
      return { ...prev, rows: newRows };
    });
  };

  // Update header value
  const updateHeader = (colIndex, value) => {
    setTableData((prev) => {
      const newHeaders = [...prev.headers];
      newHeaders[colIndex] = value;
      return { ...prev, headers: newHeaders };
    });
  };

  // Change header alignment
  const setHeaderAlign = (colIndex, align) => {
    setTableData((prev) => {
      const newAlign = [...(prev.headerAlign || [])];
      newAlign[colIndex] = align;
      return { ...prev, headerAlign: newAlign };
    });
  };

  // Change body cell alignment
  const setCellAlign = (colIndex, align) => {
    setTableData((prev) => {
      const newAlign = [...(prev.cellAlign || [])];
      newAlign[colIndex] = align;
      return { ...prev, cellAlign: newAlign };
    });
  };

  // Column & row operations (keep as before)
  const addRow = () => {
    setTableData((prev) => ({
      ...prev,
      rows: [...prev.rows, Array(prev.headers.length).fill("")],
    }));
  };

  const addRowAt = (rowIndex) => {
    setTableData((prev) => {
      const newRows = [...prev.rows];
      newRows.splice(rowIndex + 1, 0, Array(prev.headers.length).fill(""));
      return { ...prev, rows: newRows };
    });
  };

  const deleteRow = (rowIndex) => {
    setTableData((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== rowIndex),
    }));
  };

  const addColumn = () => {
    setTableData((prev) => ({
      headers: [...prev.headers, `Header ${prev.headers.length + 1}`],
      rows: prev.rows.map((r) => [...r, ""]),
      headerAlign: [...(prev.headerAlign || []), "center"],
      cellAlign: [...(prev.cellAlign || []), "left"],
    }));
  };

  const deleteColumn = (colIndex) => {
    setTableData((prev) => ({
      headers: prev.headers.filter((_, i) => i !== colIndex),
      rows: prev.rows.map((r) => r.filter((_, i) => i !== colIndex)),
      headerAlign: (prev.headerAlign || []).filter((_, i) => i !== colIndex),
      cellAlign: (prev.cellAlign || []).filter((_, i) => i !== colIndex),
    }));
  };

  return (
    <div className="w-full overflow-auto border border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-900">
      <table className="w-full border-collapse text-sm table-auto">
        <thead>
          <tr>
            {tableData.headers.map((header, colIndex) => (
              <th
                key={colIndex}
                className="relative border border-zinc-200 dark:border-zinc-700 p-2 bg-zinc-50 dark:bg-zinc-800 group"
                style={{ textAlign: tableData.headerAlign[colIndex] }}
              >
                <div className="flex flex-col gap-1">
                  <input
                    value={header}
                    onChange={(e) => updateHeader(colIndex, e.target.value)}
                    className="w-full bg-transparent outline-none font-medium"
                    style={{ textAlign: tableData.headerAlign[colIndex] }} // <- added
                  />

                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => setHeaderAlign(colIndex, "left")}
                      className={`p-1 ${tableData.headerAlign[colIndex] === "left" ? "bg-zinc-200 dark:bg-zinc-700 rounded" : ""}`}
                    >
                      <AlignLeft size={14} />
                    </button>
                    <button
                      onClick={() => setHeaderAlign(colIndex, "center")}
                      className={`p-1 ${tableData.headerAlign[colIndex] === "center" ? "bg-zinc-200 dark:bg-zinc-700 rounded" : ""}`}
                    >
                      <AlignCenter size={14} />
                    </button>
                    <button
                      onClick={() => setHeaderAlign(colIndex, "right")}
                      className={`p-1 ${tableData.headerAlign[colIndex] === "right" ? "bg-zinc-200 dark:bg-zinc-700 rounded" : ""}`}
                    >
                      <AlignRight size={14} />
                    </button>
                  </div>
                </div>

                {tableData.headers.length > 1 && (
                  <button
                    onClick={() => deleteColumn(colIndex)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </th>
            ))}

            {/* Add Column Button */}
            <th className="border border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800">
              <button
                onClick={addColumn}
                className="w-full h-full flex items-center justify-center p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
              >
                <Plus size={16} />
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-zinc-200 dark:border-zinc-700 p-2"
                  style={{
                    textAlign: tableData.cellAlign[colIndex],
                    width: `${100 / tableData.headers.length}%`,
                  }}
                >
                  <input
                    value={cell}
                    onChange={(e) =>
                      updateCell(rowIndex, colIndex, e.target.value)
                    }
                    className="w-full bg-transparent outline-none"
                    style={{ textAlign: tableData.cellAlign[colIndex] }} // <- this line added
                  />

                  <div className="flex justify-center gap-1 mt-1">
                    <button
                      onClick={() => setCellAlign(colIndex, "left")}
                      className={`p-1 ${tableData.cellAlign[colIndex] === "left" ? "bg-zinc-200 dark:bg-zinc-700 rounded" : ""}`}
                    >
                      <AlignLeft size={12} />
                    </button>
                    <button
                      onClick={() => setCellAlign(colIndex, "center")}
                      className={`p-1 ${tableData.cellAlign[colIndex] === "center" ? "bg-zinc-200 dark:bg-zinc-700 rounded" : ""}`}
                    >
                      <AlignCenter size={12} />
                    </button>
                    <button
                      onClick={() => setCellAlign(colIndex, "right")}
                      className={`p-1 ${tableData.cellAlign[colIndex] === "right" ? "bg-zinc-200 dark:bg-zinc-700 rounded" : ""}`}
                    >
                      <AlignRight size={12} />
                    </button>
                  </div>
                </td>
              ))}

              {/* Row Controls */}
 <td className="border border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800">
  <div className="flex items-center justify-center gap-1">
    <button
      onClick={() => addRowAt(rowIndex)}
      className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
    >
      <Plus size={14} />
    </button>

    {tableData.rows.length > 1 && (
      <button
        onClick={() => deleteRow(rowIndex)}
        className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
      >
        <Trash2 size={14} />
      </button>
    )}
  </div>
</td>

            </tr>
          ))}

          {/* Bottom Add Row Button */}
          <tr>
            <td
              colSpan={tableData.headers.length + 1}
              className="border border-dashed border-zinc-300 dark:border-zinc-600"
            >
              <button
                onClick={addRow}
                className="w-full flex items-center justify-center gap-2 p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <Plus size={16} /> Add Row
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Done Button */}
      {onDone && (
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-700 text-right">
          <button
            onClick={() => onDone(tableData)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
          >
            <Check size={16} /> Done
          </button>
        </div>
      )}
    </div>
  );
};

export default TableEditorBlock;
