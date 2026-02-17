import React from "react";

const TablePreview = ({ content }) => (
  <div className="overflow-x-auto rounded-xl border border-zinc-300 dark:border-zinc-700">
    <table className="w-full text-xs sm:text-sm border-collapse border border-zinc-300 dark:border-zinc-600">
      <thead className="bg-zinc-100 dark:bg-zinc-800">
        <tr>
          {(content?.headers || []).map((h, i) => (
            <th
              key={i}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-600"
              style={{ textAlign: (content?.headerAlign || [])[i] || "left" }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(content?.rows || []).map((row, i) => (
          <tr key={i}>
            {(row || []).map((cell, j) => (
              <td
                key={j}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-600"
                style={{ textAlign: (content?.cellAlign || [])[j] || "left" }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TablePreview;
