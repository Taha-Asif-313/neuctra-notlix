import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Table2,
  X,
  Plus,
  Columns3,
  Minus,
  ArrowLeftRight,
  Palette,
  Bold,
  AlignCenter,
  AlignLeft,
  AlignRight,
  LayoutGrid,
  Eraser,
  Trash2,
} from "lucide-react";

const TableActionsPanel = ({
  selectedTable,
  setSelectedTable,
  selectedRows,
  applyRowStyle,
  performTableAction,
}) => {
  const panelRef = useRef(null);

  // 🧩 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setSelectedTable(null);
      }
    };

    if (selectedTable) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedTable]);

  return (
    /* 🧩 Modern Table Actions Panel */
    <AnimatePresence>
      {selectedTable && (
    <motion.div
  ref={panelRef}
  initial={{ opacity: 0, scale: 0.95, y: 6 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 6 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
  drag
  dragMomentum={false}
  dragElastic={0.2}
  // ✅ Allow full free dragging anywhere on screen
  dragConstraints={{
    top: -window.innerHeight,
    left: -window.innerWidth,
    right: window.innerWidth,
    bottom: window.innerHeight,
  }}
  style={{
    position: "fixed",
    top: 60,
    right: 24,
  }}
  className="z-50 w-64 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-zinc-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl p-4 transition-all cursor-grab active:cursor-grabbing"
>


          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Table2 size={16} className="text-green-600" />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                Table ({selectedTable.rows.length}×
                {selectedTable.rows[0]?.cells.length || 0})
              </span>
            </div>
            <button
              onClick={() => setSelectedTable(null)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              title="Close"
            >
              <X size={15} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Row / Column Controls */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <button
              onClick={() => performTableAction("addRow")}
              className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-green-950/30 transition"
            >
              <Plus size={14} className="text-green-600" /> Add Row
            </button>
            <button
              onClick={() => performTableAction("addColumn")}
              className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-green-950/30 transition"
            >
              <Columns3 size={14} className="text-green-600" /> Add Col
            </button>

            <button
              onClick={() => performTableAction("deleteRow")}
              className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              <Minus size={14} className="text-red-500" /> Del Row
            </button>
            <button
              onClick={() => performTableAction("deleteColumn")}
              className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              <Minus size={14} className="text-red-500" /> Del Col
            </button>

            <button
              onClick={() => performTableAction("equalize")}
              className="col-span-2 text-xs font-medium py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
            >
              <ArrowLeftRight size={14} className="inline mr-1 text-blue-600" />
              Equalize Widths
            </button>
          </div>

          {/* Style Selected Rows */}
          {selectedRows.length > 0 && (
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-2 mt-2">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Palette size={13} className="text-yellow-500" />
                Style Rows ({selectedRows.length})
              </div>

              {/* 🎨 Background Colors */}
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  { color: "#fef3c7", label: "Soft Yellow" },
                  { color: "#dbeafe", label: "Sky Blue" },
                  { color: "#f3f4f6", label: "Light Gray" },
                  { color: "#dcfce7", label: "Mint Green" },
                  { color: "#fee2e2", label: "Rose" },
                  { color: "#fae8ff", label: "Lavender" },
                  { color: "#cffafe", label: "Aqua" },
                  { color: "#fde68a", label: "Amber" },
                  { color: "#e0e7ff", label: "Periwinkle" },
                  { color: "#fbcfe8", label: "Pink" },
                  { color: "#bbf7d0", label: "Pastel Green" },
                  { color: "#f5d0fe", label: "Lilac" },
                ].map((opt) => (
                  <button
                    key={opt.color}
                    title={opt.label}
                    onClick={() =>
                      applyRowStyle("backgroundColor", opt.color)
                    }
                    className="w-7 h-7 rounded-md border border-gray-200 hover:scale-110 hover:ring-2 hover:ring-primary/60 transition-all shadow-sm"
                    style={{ backgroundColor: opt.color }}
                  ></button>
                ))}
              </div>

              {/* Text Style Buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => applyRowStyle("fontWeight", "bold")}
                  className="flex-1 flex items-center justify-center gap-1 py-1 text-xs rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <Bold size={12} /> Bold
                </button>
                <button
                  onClick={() => applyRowStyle("textAlign", "center")}
                  className="flex-1 flex items-center justify-center gap-1 py-1 text-xs rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <AlignCenter size={12} /> Center
                </button>
                <button
                  onClick={() => setSelectedRows([])}
                  className="flex-1 flex items-center justify-center gap-1 py-1 text-xs rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  <Eraser size={12} /> Clear
                </button>
              </div>
            </div>
          )}

          {/* Align Cells */}
          <div className="border-t border-gray-200 dark:border-zinc-700 pt-2 mt-2">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
              <LayoutGrid size={13} className="text-blue-500" />
              Align Cells
            </div>
            <div className="flex justify-around">
              <button
                onClick={() => performTableAction("alignLeft")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                title="Align Left"
              >
                <AlignLeft size={16} />
              </button>
              <button
                onClick={() => performTableAction("justifyCenter")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                title="Align Center"
              >
                <AlignCenter size={16} />
              </button>
              <button
                onClick={() => performTableAction("justifyRight")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                title="Align Right"
              >
                <AlignRight size={16} />
              </button>
            </div>
          </div>

          {/* Delete Table */}
          <button
            onClick={() => performTableAction("deleteTable")}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold mt-4 py-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-950/40 transition"
          >
            <Trash2 size={14} /> Delete Table
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableActionsPanel;
