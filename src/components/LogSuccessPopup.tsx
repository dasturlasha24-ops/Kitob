import { motion } from "motion/react";
import { CheckCircle2, Award, Sparkles, BookOpen, ChevronRight } from "lucide-react";

interface LogSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  bookTitle: string;
  pages: number;
  onViewLeaderboard: () => void;
}

export default function LogSuccessPopup({ 
  isOpen, 
  onClose, 
  studentName, 
  bookTitle, 
  pages,
  onViewLeaderboard 
}: LogSuccessPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Pop-up Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md bg-[#0c0e14]/95 border border-white/15 rounded-3xl p-8 text-center shadow-2xl overflow-hidden backdrop-blur-3xl"
      >
        {/* Subtle premium decorative background gold/emerald-toned blobs */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl -ml-12 -mt-12 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl -mr-12 -mb-12 pointer-events-none" />

        {/* Floating Sparkles & Book Icon */}
        <div className="relative flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
            className="relative p-5 bg-emerald-500/10 rounded-3xl text-emerald-400 ring-8 ring-emerald-500/5 border border-emerald-500/20"
          >
            <CheckCircle2 className="w-14 h-14" strokeWidth={2} />
            {/* Pulsing rings around checkmark */}
            <span className="absolute inset-0 rounded-3xl border-2 border-emerald-500/30 animate-pulse" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute top-1 right-20 text-yellow-400"
          >
            <Sparkles className="w-5 h-5 fill-current" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut", delay: 0.3 }}
            className="absolute bottom-1 left-20 text-blue-400"
          >
            <BookOpen className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Header Text */}
        <h3 className="text-2xl font-display font-bold text-white tracking-tight">
          Muvaffaqiyatli qabul qilindi!
        </h3>
        
        <p className="mt-2 text-xs text-slate-400">
          O'quvchining kitobxonlik hisobiga yangi ballar qo'shildi
        </p>

        {/* Detailed Description Panel */}
        <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-650/20 flex items-center justify-center font-display font-semibold text-blue-450 border border-blue-500/10 text-sm">
              {studentName[0]}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">O'quvchi</p>
              <p className="text-sm font-semibold text-white">{studentName}</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">O'qilgan kitob</p>
              <p className="text-xs font-medium text-slate-305 truncate max-w-[200px] mt-0.5">{bookTitle}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-right">
              <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">Erishilgan ball</span>
              <span className="text-sm font-display font-extrabold text-emerald-400">+{pages} ball</span>
            </div>
          </div>
        </div>

        {/* Action Button CTA Row */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={() => {
              onViewLeaderboard();
              onClose();
            }}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 transition-all font-display duration-200 flex items-center justify-center gap-2 group"
          >
            Reytingni ko'rish
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 hover:border-white/10 font-semibold rounded-2xl transition-all font-display duration-205 text-sm"
          >
            Yopish va davom etish
          </button>
        </div>
      </motion.div>
    </div>
  );
}
