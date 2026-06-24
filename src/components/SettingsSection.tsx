import React from "react";
import { 
  Settings, Sparkles, Clock, GitBranch, ArrowUpRight, 
  CheckCircle2, ChevronRight, Award, Zap, ShieldCheck, Star 
} from "lucide-react";

export default function SettingsSection() {
  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      
      {/* 1. Header Banner - Designed with Premium Indigo Glow */}
      <div className="relative bg-gradient-to-r from-indigo-950/60 via-slate-900/40 to-[#090b0f] rounded-3xl p-6 sm:p-8 overflow-hidden border border-indigo-500/15 shadow-2xl">
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <span className="flex items-center gap-1.5 w-fit px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-bold text-indigo-300 font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              Tizim Kelajagi & Versiya Nazorati
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Loyiha Yangilanishlari <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">v1.1</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Zukko Kitobxon loyihasining yangiliklar xronologiyasi va kelasi relizlar rejasining boshqaruv paneli. Bu yerda siz loyihani qanday avtomatlashtirilgan holda yangilab borishni bilib olasiz.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Tizim holati</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                Faol & Stabil v1.1
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CURRENT VERSION INFO & SYNCING EXPLANATION */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Card: Current Version Info */}
          <div className="bg-[#090b0f] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Hozirgi Nashr Yangiliklari
                </h3>
                <p className="text-xs text-slate-500">v1.1 (Iyun 2026 relizi) doirasida o'rnatilgan premium funksiyalar</p>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-sm">
                YANGI RELIZ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-550/10 flex items-center justify-center text-indigo-400 mb-3">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Premium Reyting Tizimi</h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Har bitta o'quvchi o'z progress balliga ko'ra dinamik ravishda oltin, kumush, bronza va po'lat ramkali kartochkalarga ajraladi.
                </p>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-cyan-550/10 flex items-center justify-center text-cyan-400 mb-3">
                  <Star className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans">Bento Sinf Kartalari</h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Reyting sahifasida sinflar kesimida umumiy ko'rsatkichlar diagrammalari va o'quvchi statistikasi zamonaviy bento uslubda chiqarildi.
                </p>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tezkor Ma'lumot Kiritish</h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  O'quvchilarga yangi mutolaa sahifasini hisoblash va ularni vaqtinchalik o'chirish/qo'shish amallari osonlashtirildi.
                </p>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Xavfsiz Himoya</h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Tizimda barcha o'zgarishlar va hisob-kitoblar avtomatik ravishda brauzer xotirasida saqlanadi va keshlar asraladi.
                </p>
              </div>

            </div>
          </div>

          {/* Syncing explanation panel as requested */}
          <div className="bg-gradient-to-br from-indigo-950/20 via-[#0d1017] to-[#090b0f] border border-indigo-500/10 rounded-3xl p-6 sm:p-8 space-y-5 relative">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-550/10 flex items-center justify-center border border-indigo-550/20 shrink-0 text-indigo-400">
                <GitBranch className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-200">Avtomatik Kelajak Yangilash Mexanizmi</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Loyiha Iyun oyida yangilangan holatda. Keyinchalik (masalan, 2 oydan so'ng) yangiliklar yozib koddagi ma'lumotlarni yangilasangiz:
                </p>
              </div>
            </div>

            <div className="pl-0 sm:pl-14 space-y-4 font-sans text-xs text-slate-400">
              <div className="flex gap-2 items-start bg-white/[0.01] p-3 rounded-xl border border-white/5">
                <div className="font-mono text-indigo-300 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded text-[10px] mt-0.5">QOIDA:</div>
                <p className="leading-relaxed">
                  Siz o'zgarishlar kiritib loyihani <strong className="text-white">Vercel</strong> yoki <strong className="text-white">Netlify</strong> platformasiga uzatganingizdan (git push) so'ng, loyiha eski kesh ishlashini to'xtatadi. Foydalanuvchi keyingi safar ilovaga kirganda yangilangan tizim ochiladi.
                </p>
              </div>

              <div className="flex gap-2 items-start bg-emerald-500/[0.02] p-3 rounded-xl border border-emerald-500/10">
                <div className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] mt-0.5 font-sans">KESH:</div>
                <p className="leading-relaxed text-slate-355">
                  Xotiradagi o'quvchilar ma'lumotlari kesh tozalanishidan zarar ko'rmaydi, u yangilangan so'nggi dizayn bilan ravon ochiladi!
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: FUTURE v1.2 PLANS TIMELINE */}
        <div className="lg:col-span-5 bg-[#0d1017] border border-white/5 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-1 border-b border-white/[0.04] pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" /> Navbatdagi Premium Reliz
            </h3>
            <p className="text-xs text-slate-500">Kutilayotgan yangilanish muddati va statusi</p>
          </div>

          <div className="space-y-6 font-sans relative pl-5 border-l border-indigo-500/20 ml-2">
            
            {/* Future Feature Simple Overview */}
            <div className="relative">
              <span className="absolute -left-[24.5px] top-1 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-4 ring-indigo-950" />
              <div>
                <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-300 font-bold px-2 py-0.5 rounded-md border border-indigo-500/10">
                  Avgust 2026
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">v1.2 Premium Yangilanishi</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Navbatdagi yangilanish 2 oydan so'ng (Avgust oyida) to'liq ishga tushiriladi va foydalanuvchilar uchun quyidagi premium imkoniyatlarni taqdim etadi:
                </p>
              </div>
            </div>

            <div className="space-y-3 pl-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Rivojlangan grafik tahlillar va haftalik o'sish diagrammalari</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Avtomatlashtirilgan ajoyib kitobxon diplomlarini yuklash</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>O'qituvchilar va ota-onalar uchun batafsil Excel/PDF hisobotlar</span>
              </div>
            </div>

          </div>

          <div className="p-4 bg-white/[0.01] border border-white/10 rounded-2xl text-xs text-slate-455 flex gap-2 items-start leading-relaxed font-sans mt-6">
            <span className="text-indigo-400 shrink-0 font-bold">ℹ</span>
            <span>Premium reliz avtomatik tarzda keshni tozalab, yangilangan interfeys va qo'shimcha imkoniyatlarni taqdim etadi.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
