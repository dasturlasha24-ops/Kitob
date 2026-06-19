import { BookOpen, Award, Users, Trophy, Flame } from "lucide-react";

interface SidebarProps {
  activeTab: "students" | "rating";
  setActiveTab: (tab: "students" | "rating") => void;
  totalStudentsCount: number;
  totalPagesRead: number;
  topStudentName?: string;
  topStudentPoints?: number;
  isHovered?: boolean;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  totalStudentsCount,
  totalPagesRead,
  topStudentName = "Yuklanmoqda...",
  topStudentPoints = 0,
  isHovered = false
}: SidebarProps) {
  return (
    <aside className={`w-full ${isHovered ? "lg:w-72" : "lg:w-20"} bg-[#090b0f]/98 backdrop-blur-3xl border-r border-white/10 text-slate-100 flex flex-col shrink-0 md:h-screen sticky top-0 z-40 sidebar-smooth-transition overflow-hidden shadow-2xl`}>
      {/* Brand logo & title */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/25 shrink-0 hover:scale-105 transition-transform duration-250">
          <BookOpen className="w-6 h-6" strokeWidth={2} />
        </div>
        <div className={`sidebar-smooth-transition flex flex-col overflow-hidden whitespace-nowrap ${isHovered ? "lg:opacity-100 lg:w-44 lg:translate-x-0" : "lg:opacity-0 lg:w-0 lg:-translate-x-4"}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 text-blue-400 px-2 py-0.5 rounded-md font-mono w-fit">
            SmartLibrary
          </span>
          <h1 className="text-base font-display font-bold tracking-tight text-white mt-0.5">
            Zukko Kitobxon
          </h1>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <p className={`px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono sidebar-smooth-transition overflow-hidden whitespace-nowrap ${isHovered ? "lg:opacity-100 lg:h-4 lg:scale-100" : "lg:opacity-0 lg:h-0 lg:scale-95"}`}>
          Asosiy Bo'limlar
        </p>

        {/* O'quvchilar Section Button */}
        <button
          onClick={() => setActiveTab("students")}
          className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-2xl sidebar-smooth-transition outline-none cursor-pointer ${
            activeTab === "students"
              ? "bg-white/10 text-white border border-white/10 font-semibold shadow-lg"
              : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
          }`}
          title="O'quvchilar bo'limi"
        >
          <div className="flex items-center gap-3">
            <Users className={`w-5 h-5 shrink-0 ${activeTab === "students" ? "text-blue-400" : "text-slate-400"}`} />
            <span className={`font-display sidebar-smooth-transition whitespace-nowrap overflow-hidden ${isHovered ? "lg:opacity-100 lg:w-28 lg:translate-x-0" : "lg:opacity-0 lg:w-0 lg:-translate-x-4"}`}>
              O'quvchilar
            </span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono sidebar-smooth-transition whitespace-nowrap overflow-hidden ${
              activeTab === "students" ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"
            } ${isHovered ? "lg:opacity-100 lg:scale-100 lg:w-8" : "lg:opacity-0 lg:scale-0 lg:w-0"}`}
          >
            5-11
          </span>
        </button>

        {/* Reyting Section Button */}
        <button
          onClick={() => setActiveTab("rating")}
          className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-2xl sidebar-smooth-transition outline-none cursor-pointer ${
            activeTab === "rating"
              ? "bg-white/10 text-white border border-white/10 font-semibold shadow-lg"
              : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
          }`}
          title="Chempionlar reyting jurnali"
        >
          <div className="flex items-center gap-3">
            <Trophy className={`w-5 h-5 shrink-0 ${activeTab === "rating" ? "text-yellow-400" : "text-slate-400"}`} />
            <span className={`font-display sidebar-smooth-transition whitespace-nowrap overflow-hidden ${isHovered ? "lg:opacity-100 lg:w-36 lg:translate-x-0" : "lg:opacity-0 lg:w-0 lg:-translate-x-4"}`}>
              Reyting & Statlar
            </span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono sidebar-smooth-transition whitespace-nowrap overflow-hidden ${
              activeTab === "rating" ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"
            } ${isHovered ? "lg:opacity-100 lg:scale-100 lg:w-8" : "lg:opacity-0 lg:scale-0 lg:w-0"}`}
          >
            TOP
          </span>
        </button>
      </nav>

      {/* Mini Stats Card in Sidebar footer */}
      <div className={`p-4 m-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-4 sidebar-smooth-transition overflow-hidden ${isHovered ? "lg:opacity-100 lg:scale-100 lg:max-h-80" : "lg:opacity-0 lg:scale-95 lg:max-h-0 lg:p-0 lg:m-0 lg:border-none"}`}>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          Kutubxona statistikasi
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap overflow-hidden">Jami</div>
            <div className="text-xl font-display font-extrabold text-white mt-0.5">
              {totalStudentsCount}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 font-sans min-w-0">
            <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap overflow-hidden">Sahifalar</div>
            <div className="text-sm font-display font-bold text-blue-400 mt-0.5 truncate">
              {totalPagesRead.toLocaleString()}
            </div>
          </div>
        </div>

        {topStudentPoints > 0 && (
          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-blue-400 font-mono font-bold whitespace-nowrap">ENG FAOL</div>
              <div className="text-xs font-bold text-slate-200 truncate">{topStudentName}</div>
              <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{topStudentPoints} ball</div>
            </div>
          </div>
        )}
      </div>

      {/* Small design attribution footer */}
      <div className={`p-4 text-center border-t border-white/10 text-[10px] text-slate-500 font-mono sidebar-smooth-transition whitespace-nowrap overflow-hidden ${isHovered ? "lg:opacity-100 lg:h-auto" : "lg:opacity-0 lg:h-0 lg:p-0 lg:border-none"}`}>
        Kutubxona © 2026
      </div>
    </aside>
  );
}
