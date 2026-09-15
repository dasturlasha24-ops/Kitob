import { BookOpen, Award, Users, Trophy, Flame, Settings, LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: "students" | "rating" | "settings";
  setActiveTab: (tab: "students" | "rating" | "settings") => void;
  totalStudentsCount: number;
  totalPagesRead: number;
  topStudentName?: string;
  topStudentPoints?: number;
  isHovered?: boolean;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  totalStudentsCount,
  totalPagesRead,
  topStudentName = "Yuklanmoqda...",
  topStudentPoints = 0,
  isHovered = false,
  onLogout
}: SidebarProps) {

  return (
    <aside className="w-full h-full bg-[#090b0f]/98 backdrop-blur-3xl border-r border-white/10 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Brand logo & title */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/25 shrink-0 hover:scale-105 transition-transform duration-250">
          <BookOpen className="w-6 h-6" strokeWidth={2} />
        </div>
        <div className={`transition-all duration-300 flex flex-col overflow-hidden whitespace-nowrap ${isHovered ? "opacity-100 w-44 translate-x-0" : "opacity-0 w-0 -translate-x-3 pointer-events-none"}`}>
          <span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 text-blue-400 px-2 py-0.5 rounded-md font-mono w-fit">
            SmartLibrary
          </span>
          <h1 className="text-base font-display font-bold tracking-tight text-white mt-0.5">
            Zukko Kitobxon
          </h1>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
        <p className={`px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono transition-all duration-300 overflow-hidden whitespace-nowrap ${isHovered ? "opacity-100 h-4 scale-100" : "opacity-0 h-0 scale-95 pointer-events-none"}`}>
          Asosiy Bo'limlar
        </p>

        {/* O'quvchilar Section Button */}
        <button
          onClick={() => setActiveTab("students")}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl sidebar-smooth-transition outline-none cursor-pointer ${
            activeTab === "students"
              ? "bg-white/10 text-white border border-white/10 font-semibold shadow-lg"
              : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
          }`}
          title="O'quvchilar bo'limi"
        >
          <div className="flex items-center gap-3">
            <Users className={`w-5 h-5 shrink-0 ${activeTab === "students" ? "text-blue-400" : "text-slate-400"}`} />
            <span className={`font-display transition-all duration-300 whitespace-nowrap overflow-hidden ${isHovered ? "opacity-100 w-28 translate-x-0" : "opacity-0 w-0 -translate-x-3 pointer-events-none"}`}>
              O'quvchilar
            </span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-all duration-300 whitespace-nowrap overflow-hidden ${
              activeTab === "students" ? "bg-blue-500/20 text-blue-400 font-bold" : "bg-white/5 text-slate-500"
            } ${isHovered ? "opacity-100 scale-100 w-fit" : "opacity-0 scale-0 w-0 p-0 pointer-events-none"}`}
          >
            5-11
          </span>
        </button>

        {/* Reyting Section Button */}
        <button
          onClick={() => setActiveTab("rating")}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl sidebar-smooth-transition outline-none cursor-pointer ${
            activeTab === "rating"
              ? "bg-white/10 text-white border border-white/10 font-semibold shadow-lg"
              : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
          }`}
          title="Chempionlar reyting jurnali"
        >
          <div className="flex items-center gap-3">
            <Trophy className={`w-5 h-5 shrink-0 ${activeTab === "rating" ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
            <span className={`font-display transition-all duration-300 whitespace-nowrap overflow-hidden ${isHovered ? "opacity-100 w-36 translate-x-0" : "opacity-0 w-0 -translate-x-3 pointer-events-none"}`}>
              Reyting & Statlar
            </span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-all duration-300 whitespace-nowrap overflow-hidden ${
              activeTab === "rating" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "bg-white/5 text-slate-500"
            } ${isHovered ? "opacity-100 scale-100 w-fit" : "opacity-0 scale-0 w-0 p-0 pointer-events-none"}`}
          >
            TOP
          </span>
        </button>

        {/* Sozlamalar Section Button */}
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl sidebar-smooth-transition outline-none cursor-pointer ${
            activeTab === "settings"
              ? "bg-white/10 text-white border border-white/10 font-semibold shadow-lg"
              : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
          }`}
          title="Tizim sozlamalari"
        >
          <div className="flex items-center gap-3">
            <Settings className={`w-5 h-5 shrink-0 ${activeTab === "settings" ? "text-indigo-400 animate-spin" : "text-slate-400"}`} style={{ animationDuration: activeTab === "settings" ? '12s' : '0s' }} />
            <span className={`font-display transition-all duration-300 whitespace-nowrap overflow-hidden ${isHovered ? "opacity-100 w-28 translate-x-0" : "opacity-0 w-0 -translate-x-3 pointer-events-none"}`}>
              Sozlamalar
            </span>
          </div>
        </button>

        {/* Chiqish (Logout) Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl sidebar-smooth-transition outline-none cursor-pointer text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 group"
          title="Tizimdan Chiqish"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-rose-400" />
            <span className={`font-display transition-all duration-300 whitespace-nowrap overflow-hidden ${isHovered ? "opacity-100 w-28 translate-x-0" : "opacity-0 w-0 -translate-x-3 pointer-events-none"}`}>
              Chiqish
            </span>
          </div>
        </button>
      </nav>

      {/* Mini Stats Card in Sidebar footer */}
      <div className={`p-4 m-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-4 transition-all duration-300 overflow-hidden ${isHovered ? "opacity-100 scale-100 max-h-80" : "opacity-0 scale-95 max-h-0 p-0 m-0 border-none pointer-events-none"}`}>
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
              <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{topStudentPoints.toLocaleString()} bet</div>
            </div>
          </div>
        )}
      </div>

      {/* Small design attribution footer */}
      <div className={`p-4 text-center border-t border-white/10 text-[10px] text-slate-500 font-mono transition-all duration-300 whitespace-nowrap overflow-hidden ${isHovered ? "opacity-100 h-auto" : "opacity-0 h-0 p-0 border-none pointer-events-none"}`}>
        Kutubxona © 2026
      </div>
    </aside>
  );
}
