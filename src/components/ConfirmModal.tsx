import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Trash2, ShieldAlert } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Tasdiqlash",
  message,
  confirmLabel = "Ha, o'chirish",
  cancelLabel = "Bekor qilish",
  isDanger = true
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#06080c]/85 backdrop-blur-md"
          />

          {/* Modal layout box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative bg-[#0e121a] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl overflow-hidden z-10"
          >
            {/* Ambient pattern */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${isDanger ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`} />

            <div className="flex gap-4">
              <div className={`p-3 rounded-2xl shrink-0 h-fit ${isDanger ? "bg-rose-500/10 text-rose-400 border border-rose-500/10" : "bg-blue-500/10 text-blue-450 border border-blue-500/10"}`}>
                {isDanger ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-display font-extrabold text-white tracking-tight">
                  {title}
                </h3>
                <p className="text-slate-350 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {message}
                </p>
              </div>
            </div>

            {/* Actions button group */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 font-sans">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-medium text-sm rounded-xl cursor-pointer transition-all duration-200"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full sm:w-auto px-6 py-2.5 text-white font-semibold text-sm rounded-xl cursor-pointer transition-all duration-200 shadow-lg ${
                  isDanger 
                    ? "bg-rose-600 hover:bg-rose-500 shadow-rose-950/20" 
                    : "bg-blue-600 hover:bg-blue-500 shadow-blue-950/20"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
