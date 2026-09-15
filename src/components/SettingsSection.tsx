import { Trash2, RefreshCw, Database, AlertTriangle, ShieldCheck } from "lucide-react";

interface SettingsSectionProps {
  onSeed100Students?: () => void;
  onClearAllStudents?: () => void;
  totalStudentsCount?: number;
}

export default function SettingsSection({
  onSeed100Students,
  onClearAllStudents,
  totalStudentsCount = 0
}: SettingsSectionProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in font-sans pb-12">
      
      {/* 1. Sarlavha Qismi */}
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          Sozlamalar
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Loyiha ma'lumotlarini boshqarish va tozalash paneli
        </p>
      </div>

      {/* 2. Asosiy Blok: Loyihani Tozalash */}
      <div className="bg-[#090b0f] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Orqa fon nur effekti */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Loyihani tozalash
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                O'quvchilar ro'yxati va mutolaa ma'lumotlarini qayta sozlash
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-slate-300">
              Mavjud o'quvchilar: <strong className="text-white font-bold">{totalStudentsCount} ta</strong>
            </span>
          </div>
        </div>

        {/* Izoh va ogohlantirish */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Loyihani tozalash orqali barcha kiritilgan o'quvchilar, mutolaa jurnallari va reyting hisob-kitoblarini nollab, yangi o'quv yili yoki yangi davr uchun bo'shatishingiz mumkin.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Xavfsizlik: Tozalash tugmasi bosilganda tasdiqlash oynasi so'raladi.</span>
          </div>
        </div>

        {/* Harakat tugmalari */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {onClearAllStudents && (
            <button
              onClick={onClearAllStudents}
              className="px-5 py-3 bg-rose-500/15 hover:bg-rose-500/25 active:bg-rose-500/30 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 hover:text-white text-sm font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              Loyihani tozalash (Barchasini o'chirish)
            </button>
          )}

          {onSeed100Students && (
            <button
              onClick={onSeed100Students}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-slate-200 hover:text-white text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              Namunaviy o'quvchilarni tiklash (100 ta)
            </button>
          )}
        </div>
      </div>

      {/* 3. Muallif ismi - Sodda, kichik va nafis */}
      <div className="pt-4 flex items-center justify-center">
        <span className="text-xs text-slate-400 font-mono tracking-widest">
          Q.Afzalbek
        </span>
      </div>

    </div>
  );
}
