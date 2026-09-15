import { useState, useMemo } from "react";
import { Search, BookOpen, Download, X } from "lucide-react";
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
      cardBorder: "border-emerald-200 hover:border-emerald-300 bg-white",
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
      cardBorder: "border-amber-200 hover:border-amber-300 bg-white",
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
      cardBorder: "border-rose-200 hover:border-rose-300 bg-white",
      rowHighlight: "hover:bg-rose-50/40",
    };
  }
}

export default function LeadershipSection({ students }: LeadershipSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("all");

  // Saralash: eng ko'p bet o'qiganlar yuqorida
  const sortedAllStudents = useMemo(() => {
    return [...students].sort((a, b) => b.totalPoints - a.totalPoints);
  }, [students]);

  // Sinf bo'yicha saralash
  const gradeFilteredList = useMemo(() => {
    return sortedAllStudents.filter((student) => {
      return selectedGradeFilter === "all" || student.grade === selectedGradeFilter;
    });
  }, [sortedAllStudents, selectedGradeFilter]);

  // O'quvchilar va ularning zonalari hamda o'rinlari
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

  // Qidiruv bo'yicha filtrlash
  const displayedStudents = useMemo(() => {
    return studentsWithZones.filter((st) => {
      const fullName = `${st.firstName} ${st.lastName}`.toLowerCase();
      return !searchQuery.trim() || fullName.includes(searchQuery.toLowerCase().trim());
    });
  }, [studentsWithZones, searchQuery]);

  // Excel formatida yuklash
  const downloadLeaderboardExcel = () => {
    let tableRows = "";
    displayedStudents.forEach((st) => {
      const isOdd = st.rank % 2 === 1;
      const medal = st.rank === 1 ? " 🥇" : st.rank === 2 ? " 🥈" : st.rank === 3 ? " 🥉" : "";
      const zoneColor = st.zone.type === "green" ? "#059669" : st.zone.type === "yellow" ? "#d97706" : "#e11d48";

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
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
          th { background-color: #0f172a; color: #ffffff; padding: 10px; border: 1px solid #cbd5e1; font-size: 12px; }
          td { padding: 9px; border: 1px solid #e2e8f0; font-size: 12px; }
        </style>
      </head>
      <body>
        <h2 style="font-family: sans-serif; margin-bottom: 12px;">O'quvchilar Reytingi</h2>
        <table>
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

  // Top 3 o'quvchilar (Podium uchun)
  const top1 = displayedStudents.find((s) => s.rank === 1);
  const top2 = displayedStudents.find((s) => s.rank === 2);
  const top3 = displayedStudents.find((s) => s.rank === 3);
  const hasTopThree = Boolean(top1 || top2 || top3);
  const remainingStudents = displayedStudents.filter((s) => s.rank > 3);

  // 1, 2, 3-o'rinlar uchun nafis podium box
  const renderTopBox = (st: typeof studentsWithZones[0], position: "first" | "second" | "third") => {
    const isFirst = position === "first";
    const isSecond = position === "second";

    return (
      <div
        key={st.id}
        className={`rounded-2xl p-6 sm:p-7 border bg-white flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
          isFirst 
            ? "border-amber-300 ring-2 ring-amber-400/30 shadow-xl md:-translate-y-1 z-10" 
            : isSecond 
            ? "border-slate-200/90 shadow-md hover:shadow-lg" 
            : "border-slate-200/90 shadow-md hover:shadow-lg"
        }`}
      >
        {/* Yuqori qator: O'rin nishoni va Sinf */}
        <div>
          <div className="flex items-center justify-between mb-4">
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
            {!isFirst && !isSecond && (
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/90 rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-xs">
                🥉 3-o'rin
              </span>
            )}

            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg font-mono">
              {formatGrade(st.grade)}
            </span>
          </div>

          {/* Zona va O'qilgan betlar */}
          <div className="pt-1 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${st.zone.badgeBg} ${st.zone.badgeText} ${st.zone.badgeBorder}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.zone.dotColor}`} />
                {st.zone.name}
              </span>

              {/* O'qilgan betlar */}
              <div className={`text-2xl sm:text-3xl font-mono font-extrabold ${st.zone.textColor} tracking-tight`}>
                {st.totalPoints.toLocaleString()} <span className="text-xs font-sans font-medium text-slate-400">bet</span>
              </div>
            </div>

            {/* Ism va Familiyasi */}
            <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 tracking-tight mt-3 truncate">
              {st.firstName} {st.lastName}
            </h3>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{st.readingLogs.length} ta kitob o'qigan</span>
            </p>
          </div>
        </div>

        {/* Holati */}
        <div className="pt-3.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Holati:</span>
          <span className={`font-semibold ${st.zone.textColor}`}>
            {st.zone.badgeLabel}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-slate-200/80 space-y-7 max-w-6xl mx-auto font-sans">
      
      {/* Sarlavha: Faqat "O'quvchilar Reytingi", premium, sodda va estetik */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
          O'quvchilar Reytingi
        </h2>

        {/* Nozik, sodda qidiruv va sinf filtri */}
        <div className="flex items-center gap-2.5">
          <select
            value={selectedGradeFilter}
            onChange={(e) => setSelectedGradeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer transition-all"
          >
            <option value="all">Barcha sinflar</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>{formatGrade(g)}</option>
            ))}
          </select>

          <div className="relative w-40 sm:w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidirish..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
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

          <button
            onClick={downloadLeaderboardExcel}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            title="Excel yuklab olish"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Asosiy Reyting: 1, 2, 3-o'rinlar Box ko'rinishida va qolganlar ketma-ketlikda */}
      <div className="space-y-6">
        {displayedStudents.length === 0 ? (
          <div className="py-16 px-6 text-center text-slate-500 text-sm bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <p className="font-semibold text-slate-700">Hozircha o'quvchilar reytingi mavjud emas</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              O'quvchilar bo'limida o'quvchilar va ularning o'qigan kitoblari kiritilgach, avtomatik ravishda reyting va zonalar shu yerda hisoblab boriladi.
            </p>
          </div>
        ) : (
          <>
            {/* TOP 3 BOX (1-O'RIN O'RTADA, 2-CHAPDA, 3-O'NGDA) */}
            {hasTopThree && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch pt-1">
                {/* 2-O'RIN (CHAPDA: Desktopda 1-ustun) */}
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

                {/* 1-O'RIN (O'RTADA: Desktopda 2-ustun, baland va ajralib turuvchi) */}
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

                {/* 3-O'RIN (O'NGDA: Desktopda 3-ustun) */}
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
            )}

            {/* QOLGAN O'QUVCHILAR KETMA-KETLIK RO'YXATI (4-O'RINDAN BOSHLAB) */}
            {(remainingStudents.length > 0 || !hasTopThree) && (
              <div className="pt-2">
                <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs divide-y divide-slate-100">
                  {(hasTopThree ? remainingStudents : displayedStudents).map((st) => (
                    <div
                      key={st.id}
                      className={`px-4 sm:px-6 py-4 flex items-center justify-between gap-3 transition-colors ${st.zone.rowHighlight}`}
                    >
                      {/* Chap qism: O'rin raqami, Ism-Familiya, Sinf, Kitoblar */}
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                          #{st.rank}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm sm:text-base truncate">
                              {st.firstName} {st.lastName}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono shrink-0">
                              {formatGrade(st.grade)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{st.readingLogs.length} ta kitob o'qigan</span>
                          </p>
                        </div>
                      </div>

                      {/* O'ng qism: Zona va O'qilgan betlar */}
                      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${st.zone.badgeBg} ${st.zone.badgeText} ${st.zone.badgeBorder}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.zone.dotColor}`} />
                          {st.zone.name}
                        </span>

                        <div className="text-right font-mono min-w-[70px] sm:min-w-[85px]">
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

    </div>
  );
}
