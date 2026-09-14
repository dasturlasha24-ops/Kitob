import { useState, useMemo } from "react";
import { 
  Trophy, Search, BookOpen, 
  Download, X, LayoutGrid, List
} from "lucide-react";
import { Student } from "../types";
import { GRADES } from "../data/mockData";

interface LeadershipSectionProps {
  students: Student[];
}

export type ZoneType = "green" | "yellow" | "red";

export interface ZoneStyle {
  type: ZoneType;
  name: string;
  badgeLabel: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  cardBorder: string;
  rowHighlight: string;
}

function formatGrade(grade: string): string {
  if (!grade) return "";
  return grade.endsWith("-sinf") ? grade : `${grade}-sinf`;
}

export function getStudentZone(rank: number, total: number, points: number): ZoneStyle {
  const greenCutoff = Math.max(3, Math.ceil(total * 0.3));
  const yellowCutoff = Math.max(greenCutoff + 1, Math.ceil(total * 0.7));

  if (rank <= greenCutoff && points > 0) {
    return {
      type: "green",
      name: "Yashil zona",
      badgeLabel: "Peshqadam",
      textColor: "text-emerald-600",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      badgeBorder: "border-emerald-200",
      dotColor: "bg-emerald-500",
      cardBorder: "border-emerald-200 hover:border-emerald-400 bg-white",
      rowHighlight: "hover:bg-emerald-50/40",
    };
  } else if (rank <= yellowCutoff && points > 0) {
    return {
      type: "yellow",
      name: "Sariq zona",
      badgeLabel: "O'rtacha",
      textColor: "text-amber-600",
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-700",
      badgeBorder: "border-amber-200",
      dotColor: "bg-amber-500",
      cardBorder: "border-amber-200 hover:border-amber-400 bg-white",
      rowHighlight: "hover:bg-amber-50/40",
    };
  } else {
    return {
      type: "red",
      name: "Qizil zona",
      badgeLabel: "Harakat kerak",
      textColor: "text-rose-600",
      badgeBg: "bg-rose-50",
      badgeText: "text-rose-700",
      badgeBorder: "border-rose-200",
      dotColor: "bg-rose-500",
      cardBorder: "border-rose-200 hover:border-rose-400 bg-white",
      rowHighlight: "hover:bg-rose-50/40",
    };
  }
}

export default function LeadershipSection({ students }: LeadershipSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("all");
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<"all" | ZoneType>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Sorted list descending by totalPoints
  const sortedAllStudents = useMemo(() => {
    return [...students].sort((a, b) => b.totalPoints - a.totalPoints);
  }, [students]);

  // Grade filtered list
  const gradeFilteredList = useMemo(() => {
    return sortedAllStudents.filter((student) => {
      return selectedGradeFilter === "all" || student.grade === selectedGradeFilter;
    });
  }, [sortedAllStudents, selectedGradeFilter]);

  // Students with zone & rank
  const studentsWithZones = useMemo(() => {
    const total = gradeFilteredList.length;
    return gradeFilteredList.map((st, index) => {
      const rank = index + 1;
      const zone = getStudentZone(rank, total, st.totalPoints);
      return {
        ...st,
        rank,
        zone
      };
    });
  }, [gradeFilteredList]);

  // Zone statistics
  const zoneStats = useMemo(() => {
    let green = 0;
    let yellow = 0;
    let red = 0;

    studentsWithZones.forEach((s) => {
      if (s.zone.type === "green") green++;
      else if (s.zone.type === "yellow") yellow++;
      else if (s.zone.type === "red") red++;
    });

    return { green, yellow, red, total: studentsWithZones.length };
  }, [studentsWithZones]);

  // Displayed students after search & zone filter
  const displayedStudents = useMemo(() => {
    return studentsWithZones.filter((st) => {
      const fullName = `${st.firstName} ${st.lastName}`.toLowerCase();
      const matchesSearch = !searchQuery.trim() || fullName.includes(searchQuery.toLowerCase().trim());
      const matchesZone = selectedZoneFilter === "all" || st.zone.type === selectedZoneFilter;
      return matchesSearch && matchesZone;
    });
  }, [studentsWithZones, searchQuery, selectedZoneFilter]);

  // Export to Excel
  const downloadLeaderboardExcel = () => {
    let tableRows = "";
    displayedStudents.forEach((st) => {
      const isOdd = st.rank % 2 === 1;
      let medal = st.rank === 1 ? " 🥇 (1-o'rin)" : st.rank === 2 ? " 🥈 (2-o'rin)" : st.rank === 3 ? " 🥉 (3-o'rin)" : "";
      let zoneColor = st.zone.type === "green" ? "#059669" : st.zone.type === "yellow" ? "#d97706" : "#e11d48";

      tableRows += `
        <tr ${isOdd && st.rank > 3 ? "style='background-color: #f8fafc;'" : ""}>
          <td align="center" style="font-weight: bold;">${st.rank}${medal}</td>
          <td style="font-weight: 600;">${st.firstName} ${st.lastName}</td>
          <td align="center">${formatGrade(st.grade)}</td>
          <td align="center" style="color: ${zoneColor}; font-weight: bold;">${st.zone.name} (${st.zone.badgeLabel})</td>
          <td align="center">${st.readingLogs.length} ta kitob</td>
          <td align="center" style="font-weight: bold; color: ${zoneColor}; font-size: 13px;">${st.totalPoints} bet</td>
        </tr>
      `;
    });

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; }
          th { background-color: #0f172a; color: #ffffff; font-weight: 600; font-size: 12px; padding: 10px; border: 1px solid #cbd5e1; }
          td { padding: 9px 12px; border: 1px solid #e2e8f0; font-size: 12px; color: #334155; }
          .title { font-size: 16px; font-weight: bold; padding: 14px 0; background: #f8fafc; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="6" class="title" align="center">ZUKKO KITOBXON - REYTING JADVALI</td></tr>
          <thead>
            <tr>
              <th width="80">O'rin</th>
              <th width="240">O'quvchi</th>
              <th width="90">Sinf</th>
              <th width="160">Zona</th>
              <th width="120">Kitoblar</th>
              <th width="120">O'qilgan betlar</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reyting_${selectedGradeFilter === "all" ? "Barcha_sinflar" : formatGrade(selectedGradeFilter)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Top 3 students for podium boxes
  const top1 = displayedStudents.find((s) => s.rank === 1);
  const top2 = displayedStudents.find((s) => s.rank === 2);
  const top3 = displayedStudents.find((s) => s.rank === 3);
  const hasTopThree = Boolean(top1 || top2 || top3);
  const remainingStudents = displayedStudents.filter((s) => s.rank > 3);

  // Helper to render Top 1, 2, 3 Box
  const renderTopBox = (st: typeof studentsWithZones[0], position: "first" | "second" | "third") => {
    const isFirst = position === "first";
    const isSecond = position === "second";
    const isThird = position === "third";

    return (
      <div
        key={st.id}
        className={`rounded-2xl p-5 sm:p-6 border bg-white flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
          isFirst 
            ? "border-amber-300 ring-2 ring-amber-400/40 shadow-lg md:scale-105 z-10" 
            : isSecond 
            ? "border-slate-300 shadow-md hover:shadow-lg" 
            : "border-amber-200 shadow-md hover:shadow-lg"
        }`}
      >
        {/* Top row: O'rin nishoni va Sinf */}
        <div>
          <div className="flex items-center justify-between mb-3">
            {/* O'rin nishoni */}
            {isFirst && (
              <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-xs">
                🥇 1-o'rin
              </span>
            )}
            {isSecond && (
              <span className="px-3 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-xs">
                🥈 2-o'rin
              </span>
            )}
            {isThird && (
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/90 rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-xs">
                🥉 3-o'rin
              </span>
            )}

            {/* Sinf */}
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg font-mono">
              {formatGrade(st.grade)}
            </span>
          </div>

          {/* Zona va Ball */}
          <div className="pt-2 pb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${st.zone.badgeBg} ${st.zone.badgeText} ${st.zone.badgeBorder}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.zone.dotColor}`} />
                {st.zone.name}
              </span>

              {/* O'qilgan betlar: yashil bo'lsa yashil, sariq bo'lsa sariq, qizil bo'lsa qizil */}
              <div className={`text-2xl sm:text-3xl font-mono font-extrabold ${st.zone.textColor} tracking-tight`}>
                {st.totalPoints.toLocaleString()} <span className="text-xs font-sans font-medium text-slate-400">bet</span>
              </div>
            </div>

            {/* Ism va Familiyasi */}
            <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 tracking-tight mt-2 truncate">
              {st.firstName} {st.lastName}
            </h3>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{st.readingLogs.length} ta kitob o'qigan</span>
            </p>
          </div>
        </div>

        {/* Footer: Holati */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Holati:</span>
          <span className={`font-semibold ${st.zone.textColor}`}>
            {st.zone.badgeLabel}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl border border-slate-200/80 space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* 1. Yuqori Boshqaruv Qismi: Soddalashgan, Premium oq fonda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              O'quvchilar Reytingi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Jami {displayedStudents.length} nafar o'quvchining mutolaa ballari va reytingi
          </p>
        </div>

        {/* View Toggle va Excel Yuklash */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Kartalar ko'rinishi"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kartalar</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Jadval ko'rinishi"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Jadval</span>
            </button>
          </div>

          <button
            onClick={downloadLeaderboardExcel}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white transition-all rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
            title="Excel formatida yuklab olish"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel yuklash</span>
          </button>
        </div>
      </div>

      {/* 2. Filtrlash va Qidiruv Bar: Yashil, Sariq, Qizil zonalar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
        
        {/* Zona Filtri Tugmalari */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedZoneFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedZoneFilter === "all"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Barchasi ({zoneStats.total})
          </button>

          <button
            onClick={() => setSelectedZoneFilter("green")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedZoneFilter === "green"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${selectedZoneFilter === "green" ? "bg-white" : "bg-emerald-500"}`} />
            Yashil zona ({zoneStats.green})
          </button>

          <button
            onClick={() => setSelectedZoneFilter("yellow")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedZoneFilter === "yellow"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${selectedZoneFilter === "yellow" ? "bg-white" : "bg-amber-500"}`} />
            Sariq zona ({zoneStats.yellow})
          </button>

          <button
            onClick={() => setSelectedZoneFilter("red")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedZoneFilter === "red"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${selectedZoneFilter === "red" ? "bg-white" : "bg-rose-500"}`} />
            Qizil zona ({zoneStats.red})
          </button>
        </div>

        {/* Sinf Filtri va Qidiruv */}
        <div className="flex items-center gap-2">
          <select
            value={selectedGradeFilter}
            onChange={(e) => setSelectedGradeFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:border-slate-300 shadow-sm"
          >
            <option value="all">Barcha sinflar</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>{formatGrade(g)}</option>
            ))}
          </select>

          <div className="relative w-44 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O'quvchini qidirish..."
              className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 3. REYTING ASOSIY KO'RINISHI: TOP 3 TA BOX (2-CHAP, 1-O'RTADA, 3-O'NGDA) VA QOLGANLAR KETMA-KETLIKDA */}
      {viewMode === "cards" && (
        <div className="space-y-6 pt-1">
          {displayedStudents.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              Hech qanday o'quvchi topilmadi. Qidiruv yoki filtrlarni tekshiring.
            </div>
          ) : (
            <>
              {/* TOP 3 BOX (FAKAT 1, 2, 3-O'RINLAR UCHUN KATTA BOXLAR) */}
              {hasTopThree && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Top 3 Yetakchi O'quvchilar
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      1-o'rin o'rtada, 2-chapda, 3-o'ngda
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch pt-1">
                    {/* 2-O'RIN (CHAPDA: desktopda 1-ustun) */}
                    <div className="order-2 md:order-1 flex flex-col">
                      {top2 ? (
                        renderTopBox(top2, "second")
                      ) : (
                        <div className="h-full min-h-[190px] rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-slate-400 text-xs">
                          <span className="font-bold text-slate-500 mb-1">🥈 2-o'rin</span>
                          <span>Mavjud emas</span>
                        </div>
                      )}
                    </div>

                    {/* 1-O'RIN (O'RTADA: desktopda 2-ustun, balandroq va ajralib turuvchi) */}
                    <div className="order-1 md:order-2 flex flex-col">
                      {top1 ? (
                        renderTopBox(top1, "first")
                      ) : (
                        <div className="h-full min-h-[190px] rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-slate-400 text-xs">
                          <span className="font-bold text-slate-500 mb-1">🥇 1-o'rin</span>
                          <span>Mavjud emas</span>
                        </div>
                      )}
                    </div>

                    {/* 3-O'RIN (O'NGDA: desktopda 3-ustun) */}
                    <div className="order-3 md:order-3 flex flex-col">
                      {top3 ? (
                        renderTopBox(top3, "third")
                      ) : (
                        <div className="h-full min-h-[190px] rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-slate-400 text-xs">
                          <span className="font-bold text-slate-500 mb-1">🥉 3-o'rin</span>
                          <span>Mavjud emas</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* QOLGAN O'QUVCHILAR KETMA-KETLIK RO'YXATI (4-o'rindan boshlab) */}
              {(remainingStudents.length > 0 || !hasTopThree) && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
                        Ketma-ketlik reytingi
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        ({hasTopThree ? "4-o'rindan boshlab" : "barcha topilganlar"})
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {(hasTopThree ? remainingStudents : displayedStudents).length} nafar o'quvchi
                    </span>
                  </div>

                  <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs divide-y divide-slate-100">
                    {(hasTopThree ? remainingStudents : displayedStudents).map((st) => (
                      <div
                        key={st.id}
                        className={`px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 transition-colors ${st.zone.rowHighlight}`}
                      >
                        {/* Chap qism: O'rin, Ism-Familiya, Sinf, Kitoblar */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/70 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            #{st.rank}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 text-sm sm:text-base truncate">
                                {st.firstName} {st.lastName}
                              </span>
                              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg font-mono shrink-0">
                                {formatGrade(st.grade)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{st.readingLogs.length} ta kitob o'qigan</span>
                            </p>
                          </div>
                        </div>

                        {/* O'ng qism: Zona va Rangli Ball */}
                        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                          {/* Zona nishoni */}
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${st.zone.badgeBg} ${st.zone.badgeText} ${st.zone.badgeBorder}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.zone.dotColor}`} />
                            {st.zone.name}
                            <span className="hidden sm:inline font-normal opacity-75">({st.zone.badgeLabel})</span>
                          </span>

                          {/* O'qilgan betlar: Qizil bo'lsa qizil, yashil bo'lsa yashil, sariq bo'lsa sariq */}
                          <div className="text-right font-mono min-w-[70px]">
                            <span className={`text-base sm:text-lg font-extrabold ${st.zone.textColor}`}>
                              {st.totalPoints.toLocaleString()}
                            </span>
                            <span className="text-xs font-sans text-slate-400 ml-1">bet</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 4. REYTING JADVALI KO'RINISHI (Jadval shaklida oq fonda) */}
      {viewMode === "table" && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-20">O'rin</th>
                  <th className="py-3.5 px-4">O'quvchi Ism-Familiyasi</th>
                  <th className="py-3.5 px-4 text-center">Sinf</th>
                  <th className="py-3.5 px-4">Reyting Zonasi</th>
                  <th className="py-3.5 px-4 text-center">Kitoblar</th>
                  <th className="py-3.5 px-4 text-right pr-6">O'qilgan betlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-slate-400">
                      Hech qanday o'quvchi topilmadi
                    </td>
                  </tr>
                ) : (
                  displayedStudents.map((st) => {
                    return (
                      <tr
                        key={st.id}
                        className={`transition-colors ${st.zone.rowHighlight}`}
                      >
                        {/* O'rin */}
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          {st.rank === 1 ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 text-xs">
                              🥇 1
                            </span>
                          ) : st.rank === 2 ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800 border border-slate-300 text-xs">
                              🥈 2
                            </span>
                          ) : st.rank === 3 ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs">
                              🥉 3
                            </span>
                          ) : (
                            <span className="text-slate-500">#{st.rank}</span>
                          )}
                        </td>

                        {/* Ism Familiyasi */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 text-sm">
                            {st.firstName} {st.lastName}
                          </span>
                        </td>

                        {/* Sinf */}
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold text-xs font-mono">
                            {formatGrade(st.grade)}
                          </span>
                        </td>

                        {/* Zona */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${st.zone.badgeBg} ${st.zone.badgeText} ${st.zone.badgeBorder}`}>
                            <span className={`w-2 h-2 rounded-full ${st.zone.dotColor}`} />
                            {st.zone.name}
                            <span className="font-normal opacity-80">({st.zone.badgeLabel})</span>
                          </span>
                        </td>

                        {/* Kitoblar */}
                        <td className="py-3 px-4 text-center">
                          <span className="text-slate-600 font-medium">
                            {st.readingLogs.length} ta
                          </span>
                        </td>

                        {/* O'qilgan betlar: Yashil, Sariq yoki Qizil */}
                        <td className="py-3 px-4 text-right pr-6 font-mono">
                          <span className={`text-base font-extrabold ${st.zone.textColor}`}>
                            {st.totalPoints.toLocaleString()}
                          </span>
                          <span className="text-xs font-sans text-slate-400 ml-1">bet</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Pastki tushuntirish paneli */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Yashil zona: Peshqadam
          </span>
          <span className="flex items-center gap-1.5 text-amber-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Sariq zona: O'rtacha
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Qizil zona: Harakat kerak
          </span>
        </div>
        <span className="font-mono text-slate-400">
          Reyting o'qilgan kitob sahifalari (betlari) bo'yicha hisoblanadi
        </span>
      </div>

    </div>
  );
}
