import { useEffect, useRef } from "react";
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

  // 🧠 Close panel when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const insidePanel = panelRef.current?.contains(e.target);
      const insideTable = e.target.closest("table");
      if (!insidePanel && !insideTable) setSelectedTable(null);
    };
    if (selectedTable)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedTable]);

  return (
    <AnimatePresence>
      {selectedTable && (
        <motion.div
          ref={panelRef}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 1000,
          }}
          className="w-[520px] h-auto bg-white/90 dark:bg-zinc-900/90 
                     backdrop-blur-xl border border-gray-200/60 dark:border-zinc-700/60 
                     shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                     rounded-2xl p-4 transition-all"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Table2 size={18} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Table ({selectedTable.rows.length}×
                {selectedTable.rows[0]?.cells.length || 0})
              </span>
            </div>
            <button
              onClick={() => setSelectedTable(null)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              title="Close"
            >
              <X size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-3 gap-3">
            {/* ➕ Add / Delete */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Structure
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => performTableAction("addRow")}
                  className="flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-green-950/30 transition"
                >
                  <Plus size={14} className="text-green-600" /> Row
                </button>
                <button
                  onClick={() => performTableAction("addColumn")}
                  className="flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-green-950/30 transition"
                >
                  <Columns3 size={14} className="text-green-600" /> Col
                </button>
                <button
                  onClick={() => performTableAction("deleteRow")}
                  className="flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  <Minus size={14} /> Row
                </button>
                <button
                  onClick={() => performTableAction("deleteColumn")}
                  className="flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  <Minus size={14} /> Col
                </button>
              </div>
              <button
                onClick={() => performTableAction("equalize")}
                className="w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
              >
                <ArrowLeftRight size={14} className="text-blue-600" />
                Equalize
              </button>
            </div>

            {/* 🎨 Styling */}
            {selectedRows.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Row Style
                </h3>
                <div className="flex flex-wrap gap-1">
                  {[
                    "#fef3c7",
                    "#dbeafe",
                    "#f3f4f6",
                    "#dcfce7",
                    "#fee2e2",
                    "#fae8ff",
                    "#cffafe",
                    "#fde68a",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => applyRowStyle("backgroundColor", color)}
                      className="w-6 h-6 rounded-md border border-gray-200 hover:scale-110 hover:ring-2 hover:ring-primary/60 transition-all"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => applyRowStyle("fontWeight", "bold")}
                    className="flex-1 py-1 text-xs items-center flex rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  >
                    <Bold size={12} /> Bold
                  </button>
                  <button
                    onClick={() => applyRowStyle("textAlign", "center")}
                    className="flex-1 flex py-1 text- items-center rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  >
                    <AlignCenter size={12} /> Center
                  </button>
                 
                </div>
              </div>
            )}

            {/* 📐 Alignment */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Align
              </h3>
              <div className="flex justify-around">
                <button
                  onClick={() => performTableAction("alignLeft")}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  onClick={() => performTableAction("justifyCenter")}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  onClick={() => performTableAction("justifyRight")}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <AlignRight size={16} />
                </button>
              </div>

              <button
                onClick={() => performTableAction("deleteTable")}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold mt-2 py-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-950/40 transition"
              >
                <Trash2 size={14} /> Delete Table
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableActionsPanel;
