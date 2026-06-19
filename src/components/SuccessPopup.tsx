import { motion } from "motion/react";
import { CheckCircle2, Award, Sparkles, BookOpen } from "lucide-react";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  grade: string;
}

export default function SuccessPopup({ isOpen, onClose, studentName, grade }: SuccessPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Pop-up Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md bg-[#0c0e14]/95 border border-white/10 rounded-3xl p-8 text-center shadow-2xl overflow-hidden backdrop-blur-2xl"
      >
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mb-10 pointer-events-none" />

        {/* Floating Sparkles & Icons */}
        <div className="relative flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
            className="relative p-4 bg-emerald-500/10 rounded-full text-emerald-400 ring-8 ring-emerald-500/5"
          >
            <CheckCircle2 className="w-16 h-16" strokeWidth={1.8} />
            
            {/* Pulsing rings around checkmark */}
            <span className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute -top-1 right-20 text-yellow-500"
          >
            <Sparkles className="w-6 h-6 fill-current" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-2 left-20 text-blue-400"
          >
            <BookOpen className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Header Text */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-display font-medium text-white tracking-tight"
        >
          Muvaffaqiyatli qabul qilindi!
        </motion.h3>

        {/* Detailed Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-slate-350 space-y-2"
        >
          <p className="text-sm">
            Yangi o'quvchi tizimga muvaffaqiyatli qo'shildi va kitob sahifalarini kiritishga tayyor.
          </p>
          
          {/* Badge highlighting the student and grade */}
          <div className="inline-flex flex-col items-center justify-center bg-white/5 border border-white/5 rounded-2xl p-4 w-full mt-4">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-mono font-bold">O'quvchi</span>
            <span className="text-lg font-display font-semibold text-blue-405">{studentName}</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-300 text-xs font-semibold rounded-full mt-1.5 border border-blue-500/10">
              <Award className="w-3.5 h-3.5" />
              {grade} o'quvchisi
            </span>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 transition-all font-display duration-200 focus:outline-none"
        >
          Davom etish
        </motion.button>
      </motion.div>
    </div>
  );
}
