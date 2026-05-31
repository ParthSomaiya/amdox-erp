import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { Layers, CheckCircle, RefreshCw, ChevronRight } from "lucide-react";
import notifier from "../../utils/notifier";


export default function InvoiceBuilder() {
  const [enabled, setEnabled] = useState(false);
  const [items, setItems] = useState([
    { id: "1", name: "GST (CGST 9% + SGST 9%)", value: "18%" },
    { id: "2", name: "Corporate Volume Discount", value: "5%" },
    { id: "3", name: "Service Tax Surcharge", value: "2%" },
    { id: "4", name: "Local Freight Logistics Fee", value: "₹2500" }
  ]);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
    notifier.invoiceBuilderOpened();
  };

  if (!enabled) return null;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Invoice Compiler</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">🧩 Invoice Drag-Builder</h1>
          <p className="text-indigo-100 text-sm mt-2">Compile custom invoice tax & surcharge hierarchies with ease.</p>
        </div>
      </div>

      {/* Drag Container */}
      <div className="bg-white rounded-[32px] border p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Arrange Tax & Fee Priorities</h2>
          <p className="text-xs text-slate-400">Drag and drop variables to change tax calculation priorities</p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="invoice">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 min-h-[150px]">
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-slate-50 hover:bg-indigo-50/10 border hover:border-indigo-500/30 p-5 rounded-2xl flex items-center justify-between transition cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {index + 1}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-white border rounded-lg text-xs font-extrabold text-slate-800 shadow-inner">
                            {item.value}
                          </span>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}