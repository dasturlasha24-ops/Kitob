import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, Medal, Search, BookOpen, 
  Sparkles, TrendingUp, GraduationCap, Download,
  Crown, Zap, TrendingDown, Award
} from "lucide-react";
import { Student } from "../types";
import { GRADES } from "../data/mockData";

interface LeadershipSectionProps {
  students: Student[];
}

// Simple level title helper based on points
function getReadingLevel(points: number) {
  if (points >= 1000) return { title: "Mutolaa Qiroli", color: "text-rose-400" };
  if (points >= 500) return { title: "Zukko Olim", color: "text-amber-400" };
  if (points >= 300) return { title: "Mutolaa Ustasi", color: "text-indigo-400" };
  if (points >= 100) return { title: "G'uncha Kitobxon", color: "text-emerald-400" };
  return { title: "Kashfiyetchi", color: "text-slate-400" };
}

export default function LeadershipSection({ students }: LeadershipSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("all");

  // Calculate sorted list overall
  const sortedAllStudents = useMemo(() => {
    return [...students].sort((a, b) => b.totalPoints - a.totalPoints);
  }, [students]);

  // Aggregate stats per Grade for class competition
  const gradeAnalytics = useMemo(() => {
    const map: Record<string, { totalPages: number; studentCount: number }> = {};
    GRADES.forEach(g => {
      map[g] = { totalPages: 0, studentCount: 0 };
    });

    students.forEach(st => {
      if (map[st.grade]) {
        map[st.grade].totalPages += st.totalPoints;
        map[st.grade].studentCount += 1;
      }
    });

    return Object.entries(map)
      .map(([grade, data]) => ({
        grade,
        totalPages: data.totalPages,
        studentCount: data.studentCount,
        avgPages: data.studentCount > 0 ? Math.round(data.totalPages / data.studentCount) : 0
      }))
      .filter(g => g.totalPages > 0)
      .sort((a, b) => b.totalPages - a.totalPages);
  }, [students]);

  const maxClassPages = useMemo(() => {
    const pages = gradeAnalytics.map(g => g.totalPages);
    return Math.max(...pages, 100);
  }, [gradeAnalytics]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return sortedAllStudents.filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGradeFilter === "all" || student.grade === selectedGradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [sortedAllStudents, searchQuery, selectedGradeFilter]);

  // Podium Positions (1st, 2nd, 3rd)
  const podium = useMemo(() => {
    return sortedAllStudents.slice(0, 3);
  }, [sortedAllStudents]);

  const downloadLeaderboardCSV = () => {
    // Generate beautiful spreadsheet with premium colors and styles
    const sheetName = selectedGradeFilter === "all" ? "Barcha sinflar reytingi" : `${selectedGradeFilter}-sinf reytingi`;
    let tableRows = "";
    
    filteredStudents.forEach((st, i) => {
      const isOdd = i % 2 === 1;
      let rankStyle = "";
      let medal = "";
      
      if (i === 0) {
        rankStyle = "style='background-color: #fefaa6; color: #854d0e; font-weight: bold; font-size: 14px;'";
        medal = " 🥇";
      } else if (i === 1) {
        rankStyle = "style='background-color: #f1f5f9; color: #475569; font-weight: bold; font-size: 13px;'";
        medal = " 🥈";
      } else if (i === 2) {
        rankStyle = "style='background-color: #ffedd5; color: #c2410c; font-weight: bold; font-size: 13px;'";
        medal = " 🥉";
      } else {
        rankStyle = isOdd ? "style='background-color: #f8fafc;'" : "";
      }

      const level = getReadingLevel(st.totalPoints).title;
      
      tableRows += `
        <tr ${isOdd && i > 2 ? "style='background-color: #f8fafc;'" : ""}>
          <td align="center" ${rankStyle}>${i + 1}${medal}</td>
          <td style="font-weight: 500; font-size: 13px; color: #0f172a;">${st.firstName} ${st.lastName}</td>
          <td align="center" style="font-weight: 550;">${st.grade}</td>
          <td align="center" style="color: #6366f1; font-weight: bold;">${level}</td>
          <td align="center" style="color: #0284c7; font-weight: bold;">${st.readingLogs.length} ta kitob</td>
          <td align="center" style="color: #10b981; font-weight: bold; font-size: 13px;">${st.totalPoints} bet</td>
        </tr>
      `;
    });

    const totalBooks = filteredStudents.reduce((sum, st) => sum + st.readingLogs.length, 0);
    const totalPages = filteredStudents.reduce((sum, st) => sum + st.totalPoints, 0);

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${sheetName.substring(0, 30)}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
          th { background-color: #4f46e5; color: #ffffff; font-weight: bold; font-size: 13px; padding: 12px 10px; border: 1px solid #cbd5e1; text-transform: uppercase; }
          td { padding: 10px 12px; border: 1px solid #e2e8f0; font-size: 12px; color: #334155; }
          .meta-title { font-size: 18px; font-weight: bold; color: #1e1b4b; background-color: #f1f5f9; padding: 15px 0; }
          .meta-label { font-weight: bold; color: #475569; background-color: #f8fafc; }
          .meta-val { color: #0f172a; }
          .total-row { background-color: #f5f3ff; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td colspan="6" class="meta-title" align="center">ZUKKO KITOBXON - PESHQADAMLAR REYTINGI</td>
          </tr>
          <tr>
            <td colspan="2" class="meta-label">Sinf filtri:</td>
            <td colspan="4" class="meta-val">${selectedGradeFilter === "all" ? "Barcha sinflar" : selectedGradeFilter}</td>
          </tr>
          <tr>
            <td colspan="2" class="meta-label">Yuklangan sana:</td>
            <td colspan="4" class="meta-val">${new Date().toLocaleString("uz-UZ")}</td>
          </tr>
          <tr>
            <td colspan="2" class="meta-label">O'quvchilar soni:</td>
            <td colspan="4" class="meta-val">${filteredStudents.length} nafar</td>
          </tr>
          <tr><td colspan="6" style="border: none; height: 10px;"></td></tr>
          <thead>
            <tr>
              <th width="80">O'rin</th>
              <th width="200">O'quvchi ismi familiyasi</th>
              <th width="100">Sinf</th>
              <th width="150">Kitobxon darajasi</th>
              <th width="150">O'qilgan kitoblar</th>
              <th width="150">To'plangan ball (bet)</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr class="total-row">
              <td colspan="4" align="right" style="padding: 12px; font-size: 13px;"><b>Jami hisoblangan ko'rsatkichlar:</b></td>
              <td align="center" style="color: #4f46e5; font-size: 13px;"><b>${totalBooks} ta kitob</b></td>
              <td align="center" style="color: #10b981; font-size: 13px;"><b>${totalPages} ball</b></td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Zukko_Kitobxon_Reyting_${selectedGradeFilter === "all" ? "Barcha_sinflar" : selectedGradeFilter + "_sinf"}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Premium minimal header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Peshqadamlar Reytingi
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Kutubxonamiz kitobxon o'quvchilari o'rtasidagi eng yuqori natijalar
          </p>
        </div>
      </div>

      {/* Podium Display (Extremely clean & polished Top 3 with premium styling) */}
      {podium.length > 0 && (
        <div className="bg-gradient-to-b from-slate-900/40 via-[#0a0d14]/80 to-[#07090d]/95 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Subtle decoration glow behind the podium */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-12 relative z-10">
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-bold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 shadow-sm">
              🏆 Eng yuqori 3 kitobxonimiz
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto relative z-10">
            
            {/* 2nd Place */}
            {podium[1] && (
              <motion.div 
                whileHover={{ y: -6, scale: 1.02 }}
                className="order-2 md:order-1 bg-gradient-to-b from-slate-500/5 to-[#0b0e14] border border-slate-500/20 p-6 rounded-3xl text-center flex flex-col items-center hover:border-slate-400/40 transition-all shadow-xl shadow-black/40"
              >
                <div className="relative">
                  {/* Outer silver ring glow */}
                  <div className="absolute inset-0 bg-slate-400/10 rounded-full blur-md" />
                  <div className="relative w-18 h-18 rounded-full bg-slate-400/15 flex items-center justify-center font-display font-medium text-slate-200 text-xl border-2 border-slate-400/40 ring-4 ring-slate-400/5">
                    {podium[1].firstName[0]}
                    {podium[1].lastName[0]}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-slate-950 text-xs font-bold shadow-md shadow-slate-900/50">
                    2
                  </span>
                </div>
                
                <h4 className="font-display font-bold text-slate-100 mt-5 truncate max-w-[170px] text-base">
                  {podium[1].firstName} {podium[1].lastName}
                </h4>
                <p className="text-[11px] font-mono text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-md mt-1 w-fit">{podium[1].grade}-sinf</p>
                
                <div className="mt-5 bg-slate-405/[0.03] border border-slate-500/10 px-4 py-3 rounded-2xl text-center w-full shadow-inner">
                  <div className="text-xl font-mono font-extrabold text-slate-200 flex items-center justify-center gap-1">
                    {podium[1].totalPoints}
                    <span className="text-xs text-slate-405 font-medium uppercase font-sans">b</span>
                  </div>
                  <div className="text-[10px] text-slate-455 font-mono font-bold mt-1 uppercase tracking-wider">{getReadingLevel(podium[1].totalPoints).title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{podium[1].readingLogs.length} ta kitob o'qilgan</div>
                </div>
              </motion.div>
            )}

            {/* 1st Place Champion (Glows Golden elegantly) */}
            {podium[0] && (
              <motion.div 
                whileHover={{ y: -10, scale: 1.03 }}
                className="order-1 md:order-2 bg-gradient-to-b from-amber-500/[0.08] via-amber-500/[0.02] to-[#0f131a] border-2 border-amber-400/50 p-8 rounded-[2rem] text-center flex flex-col items-center md:scale-105 relative overflow-hidden shadow-2xl shadow-amber-500/10"
              >
                {/* Crown hovering above */}
                <div className="absolute top-2 right-2 text-amber-450 animate-bounce duration-1000">
                  <Crown className="w-5 h-5 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </div>
                
                <div className="relative mt-2">
                  {/* Golden Halo */}
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg animate-pulse" />
                  <div className="relative w-22 h-22 rounded-full bg-amber-400/15 flex items-center justify-center font-display font-medium text-amber-250 text-3xl border-2 border-amber-400/55 ring-8 ring-amber-400/5">
                    {podium[0].firstName[0]}
                    {podium[0].lastName[0]}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-sm font-black shadow-lg shadow-amber-950/80 ring-2 ring-[#0f131a]">
                    1
                  </span>
                </div>
                
                <h4 className="font-display font-black text-amber-200 mt-6 text-lg truncate max-w-[190px] drop-shadow-sm tracking-tight">
                  {podium[0].firstName} {podium[0].lastName}
                </h4>
                <p className="text-xs font-mono text-amber-400 font-bold bg-amber-550/15 px-3 py-1 rounded-md mt-1 w-fit border border-amber-450/40">
                  👑 {podium[0].grade}-sinf
                </p>
                
                <div className="mt-6 bg-amber-500/10 border border-amber-400/30 px-5 py-4 rounded-2xl text-center w-full shadow-inner">
                  <div className="text-3xl font-mono font-black text-amber-300 flex items-center justify-center gap-1">
                    {podium[0].totalPoints}
                    <span className="text-sm text-amber-405 font-bold uppercase font-sans">b</span>
                  </div>
                  <div className="text-[11px] text-amber-400 font-bold font-mono mt-1 uppercase tracking-widest">{getReadingLevel(podium[0].totalPoints).title}</div>
                  <div className="text-[10px] text-amber-400/60 mt-1">{podium[0].readingLogs.length} ta ulkan mutolaalar</div>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {podium[2] && (
              <motion.div 
                whileHover={{ y: -6, scale: 1.02 }}
                className="order-3 bg-gradient-to-b from-amber-700/5 to-[#0b0e14] border border-amber-700/20 p-6 rounded-3xl text-center flex flex-col items-center hover:border-amber-600/40 transition-all shadow-xl shadow-black/40"
              >
                <div className="relative">
                  {/* Bronze halo */}
                  <div className="absolute inset-0 bg-amber-600/10 rounded-full blur-md" />
                  <div className="relative w-18 h-18 rounded-full bg-amber-700/15 flex items-center justify-center font-display font-medium text-amber-550 text-xl border-2 border-amber-700/40 ring-4 ring-amber-700/5">
                    {podium[2].firstName[0]}
                    {podium[2].lastName[0]}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-amber-50 text-xs font-bold shadow-md shadow-amber-900/50">
                    3
                  </span>
                </div>
                
                <h4 className="font-display font-bold text-slate-100 mt-5 truncate max-w-[170px] text-base">
                  {podium[2].firstName} {podium[2].lastName}
                </h4>
                <p className="text-[11px] font-mono text-slate-400 bg-amber-700/10 px-2 py-0.5 rounded-md mt-1 w-fit">{podium[2].grade}-sinf</p>
                
                <div className="mt-5 bg-amber-700/[0.03] border border-amber-700/10 px-4 py-3 rounded-2xl text-center w-full shadow-inner">
                  <div className="text-xl font-mono font-extrabold text-slate-200 flex items-center justify-center gap-1">
                    {podium[2].totalPoints}
                    <span className="text-xs text-slate-405 font-medium uppercase font-sans">b</span>
                  </div>
                  <div className="text-[10px] text-amber-550 font-mono font-bold mt-1 uppercase tracking-wider">{getReadingLevel(podium[2].totalPoints).title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{podium[2].readingLogs.length} ta kitob o'qilgan</div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      )}

      {/* Sinf Jamoalariaro Bellashuv (Clean visual list with thin lines, no clutter) */}
      {gradeAnalytics.length > 0 && (
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
          <h3 className="text-base font-display font-medium text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Sinflararo Bellashuv (Jami o'qilgan sahifalar)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gradeAnalytics.map((g, idx) => {
              const pct = maxClassPages > 0 ? (g.totalPages / maxClassPages) * 100 : 0;
              return (
                <div key={g.grade} className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-300 font-display flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      {g.grade} sinf ({g.studentCount} o'quvchi)
                    </span>
                    <span className="font-mono font-semibold text-slate-205">{g.totalPages} bet</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="bg-[#0b0e14] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01]">
          <div>
            <h3 className="font-display font-medium text-white">O'quvchilar reyting jadvali</h3>
            <p className="text-xs text-slate-500 mt-1">Ism va sinf bo'yicha saralash</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Download button */}
            <button
              onClick={downloadLeaderboardCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all rounded-lg text-xs font-medium cursor-pointer"
              title="Jadvaldagi barcha ma'lumotlarni Excel/CSV formatida yuklab olish"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Yuklab olish
            </button>

            {/* Class filter dropdown */}
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#0f121a] border border-white/10 rounded-lg text-xs font-medium text-slate-305 outline-none"
            >
              <option value="all">Barcha sinflar</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}-sinf</option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ismni qidirish..."
                className="pl-8 pr-3 py-1.5 bg-[#0f121a] border border-white/10 rounded-lg text-xs outline-none text-white w-full sm:w-40 font-sans"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-white/[0.01]">
                <th className="py-3 px-4 text-center w-16">O'rin</th>
                <th className="py-3 px-4">O'quvchi</th>
                <th className="py-3 px-4">Sinf</th>
                <th className="py-3 px-4">Darajasi (Unvon)</th>
                <th className="py-3 px-4 text-center">Mutolaalar</th>
                <th className="py-3 px-4 text-right w-36">Jami ball (bet)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              <AnimatePresence mode="popLayout">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                      Hech qanday o'quvchi topilmadi.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st, i) => {
                    const place = i + 1;
                    const lvl = getReadingLevel(st.totalPoints);
                    const totalCount = filteredStudents.length;

                    // Determine tier categories
                    const isTopTier = place <= 3;
                    const isBottomTier = totalCount > 3 ? (place > totalCount - 3) : (totalCount > 1 && place === totalCount);
                    const isMiddleTier = !isTopTier && !isBottomTier;

                    let rowBgClass = "hover:bg-white/[0.02]";
                    let rowBorderClass = "border-l-4 border-transparent";
                    let badgeStyle = "";
                    let badgeText = `#${place}`;
                    let pointsColor = "text-indigo-300";
                    let zoneLabel = null;

                    if (isTopTier) {
                      // Green/Emerald premium tier for top ranking students
                      rowBgClass = "bg-[#042014]/30 hover:bg-[#042014]/60";
                      rowBorderClass = "border-l-4 border-emerald-500/90";
                      pointsColor = "text-emerald-400 font-extrabold font-display drop-shadow-[0_0_8px_rgba(16,185,129,0.15)]";
                      badgeStyle = place === 1 
                        ? "bg-amber-400 text-amber-950 border border-amber-300/30 font-black shadow-lg shadow-amber-400/10 scale-105" 
                        : place === 2
                        ? "bg-slate-300 text-slate-900 border border-slate-200/20 font-bold"
                        : "bg-amber-700 text-amber-50 border border-orange-500/20 font-bold";
                      zoneLabel = (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-inner">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> Peshqadam (TOP)
                        </span>
                      );
                    } else if (isBottomTier) {
                      // Red/Rose warning or active tracking tier for bottom 3 students
                      rowBgClass = "bg-[#200408]/30 hover:bg-[#200408]/60";
                      rowBorderClass = "border-l-4 border-rose-500/95";
                      pointsColor = "text-rose-400 font-extrabold font-display";
                      badgeStyle = "bg-rose-950 text-rose-300 border border-rose-500/30 font-bold";
                      zoneLabel = (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-rose-500/15 text-rose-450 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <TrendingDown className="w-2.5 h-2.5 text-rose-400" /> Harakatda
                        </span>
                      );
                    } else {
                      // Yellow/Amber active tier for average scoring middle-class-rank students
                      rowBgClass = "bg-[#1f1504]/20 hover:bg-[#1f1504]/40";
                      rowBorderClass = "border-l-4 border-amber-500/70";
                      pointsColor = "text-amber-450 font-bold font-display";
                      badgeStyle = "bg-amber-950/80 text-amber-450 border border-amber-550/20 font-semibold";
                      zoneLabel = (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/15">
                          <Zap className="w-2.5 h-2.5 text-amber-450" /> Faol
                        </span>
                      );
                    }

                    return (
                      <motion.tr 
                        key={st.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`${rowBgClass} ${rowBorderClass} transition-all duration-200 border-b border-white/[0.04]`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-400">
                          <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] min-w-[28px] ${badgeStyle}`}>
                            {badgeText}
                          </span>
                        </td>

                        {/* Name and Zone Label */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-semibold text-slate-100 text-sm">
                              {st.firstName} {st.lastName}
                            </span>
                            {zoneLabel}
                          </div>
                        </td>

                        {/* Grade */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 text-slate-300 font-semibold text-[11px] font-sans">
                            {st.grade}-sinf
                          </span>
                        </td>

                        {/* Level Title */}
                        <td className="py-4 px-4">
                          <span className={`font-semibold tracking-wide text-xs px-2 py-0.5 rounded ${
                            isTopTier ? "bg-emerald-555/10 text-emerald-400" :
                            isBottomTier ? "bg-rose-555/10 text-rose-400" :
                            "bg-amber-555/10 text-amber-405"
                          }`}>
                            {lvl.title}
                          </span>
                        </td>

                        {/* Count of logs */}
                        <td className="py-4 px-4 text-center font-mono text-slate-305">
                          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-xl text-[10px] text-slate-300 font-bold border border-white/5">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            {st.readingLogs.length} ta kitob
                          </span>
                        </td>

                        {/* Total page score */}
                        <td className="py-4 px-4 text-right font-mono text-sm">
                          <span className={`${pointsColor} tracking-tight`}>
                            {st.totalPoints.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal uppercase font-sans">ball</span>
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
