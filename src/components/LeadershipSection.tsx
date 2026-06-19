import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, Medal, Search, BookOpen, 
  Sparkles, TrendingUp, GraduationCap, Download
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
    // Generate CSV headers with excel compatibility
    const headers = ["O'rin", "O'quvchi", "Sinf", "Darajasi", "Mutolaalar Soni", "To'plangan ball (bet)"];
    
    // Rows
    const rows = filteredStudents.map((st, i) => [
      i + 1,
      `${st.firstName} ${st.lastName}`,
      `${st.grade}-sinf`,
      getReadingLevel(st.totalPoints).title,
      st.readingLogs.length,
      st.totalPoints
    ]);
    
    // Convert to CSV format with unicode BOM for Cyrillic / Uzbek support
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))].join("\r\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Zukko_Kitobxon_Reyting_${selectedGradeFilter === "all" ? "Barcha_sinflar" : selectedGradeFilter + "_sinf"}.csv`);
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

      {/* Podium Display (Extremely clean & polished Top 3) */}
      {podium.length > 0 && (
        <div className="bg-white/[0.02] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="text-center mb-10">
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-bold bg-amber-550/10 px-3 py-1 rounded-full border border-amber-500/20">
              Eng yaxshi 3 kitobxonimiz
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
            
            {/* 2nd Place */}
            {podium[1] && (
              <motion.div 
                whileHover={{ y: -4 }}
                className="order-2 md:order-1 bg-white/[0.02] border border-white/10 p-6 rounded-2xl text-center flex flex-col items-center hover:bg-white/[0.04] transition-all"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-slate-500/20 flex items-center justify-center font-display font-bold text-slate-300 text-xl border-2 border-slate-400/30">
                    {podium[1].firstName[0]}
                    {podium[1].lastName[0]}
                  </div>
                  <span className="absolute -bottom-1 -right-1 p-1 bg-slate-400 text-slate-900 rounded-full text-xs font-bold">
                    2
                  </span>
                </div>
                <h4 className="font-display font-semibold text-slate-200 mt-4 truncate max-w-[170px]">
                  {podium[1].firstName} {podium[1].lastName}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{podium[1].grade} sinf</p>
                
                <div className="mt-4 bg-white/[0.04] px-4 py-2 rounded-xl text-center w-full">
                  <div className="text-lg font-mono font-bold text-slate-200">{podium[1].totalPoints} <span className="text-xs text-slate-400 font-normal">ball</span></div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{podium[1].readingLogs.length} ta kitob</div>
                </div>
              </motion.div>
            )}

            {/* 1st Place Champion */}
            {podium[0] && (
              <motion.div 
                whileHover={{ y: -6 }}
                className="order-1 md:order-2 bg-amber-500/[0.03] border-2 border-amber-400/40 p-8 rounded-3xl text-center flex flex-col items-center md:scale-105 relative overflow-hidden shadow-amber-500/5 shadow-2xl"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center font-display font-bold text-amber-300 text-2xl border-2 border-amber-400/50 ring-4 ring-amber-400/10">
                    {podium[0].firstName[0]}
                    {podium[0].lastName[0]}
                  </div>
                  <span className="absolute -bottom-1 -right-1 p-1.5 bg-amber-400 text-amber-950 rounded-full text-sm font-black">
                    1
                  </span>
                </div>
                <h4 className="font-display font-bold text-amber-250 mt-4 text-lg truncate max-w-[190px]">
                  {podium[0].firstName} {podium[0].lastName}
                </h4>
                <p className="text-xs text-amber-400 font-medium mt-1">{podium[0].grade} sinf</p>
                
                <div className="mt-4 bg-amber-500/10 border border-amber-400/20 px-5 py-2.5 rounded-2xl text-center w-full">
                  <div className="text-2xl font-mono font-bold text-amber-300">{podium[0].totalPoints} <span className="text-sm text-amber-400/80 font-normal">ball</span></div>
                  <div className="text-[10px] text-amber-400/60 mt-0.5">{podium[0].readingLogs.length} ta mutolaa</div>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {podium[2] && (
              <motion.div 
                whileHover={{ y: -4 }}
                className="order-3 bg-white/[0.02] border border-white/10 p-6 rounded-2xl text-center flex flex-col items-center hover:bg-white/[0.04] transition-all"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-amber-700/20 flex items-center justify-center font-display font-bold text-amber-600 text-xl border-2 border-amber-700/30">
                    {podium[2].firstName[0]}
                    {podium[2].lastName[0]}
                  </div>
                  <span className="absolute -bottom-1 -right-1 p-1 bg-amber-655 text-amber-950 rounded-full text-xs font-bold">
                    3
                  </span>
                </div>
                <h4 className="font-display font-semibold text-slate-200 mt-4 truncate max-w-[170px]">
                  {podium[2].firstName} {podium[2].lastName}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{podium[2].grade} sinf</p>
                
                <div className="mt-4 bg-white/[0.04] px-4 py-2 rounded-xl text-center w-full">
                  <div className="text-lg font-mono font-bold text-slate-200">{podium[2].totalPoints} <span className="text-xs text-slate-400 font-normal">ball</span></div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{podium[2].readingLogs.length} ta kitob</div>
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
                    const isTop3 = place <= 3;
                    const lvl = getReadingLevel(st.totalPoints);
                    
                    return (
                      <motion.tr 
                        key={st.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                          {isTop3 ? (
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                              place === 1 
                                ? "bg-amber-500/10 text-amber-400 font-extrabold border border-amber-500/20"
                                : place === 2
                                ? "bg-slate-300/10 text-slate-300 font-bold border border-slate-300/25"
                                : "bg-amber-800/10 text-orange-500 font-bold border border-orange-500/20"
                            }`}>
                              #{place}
                            </span>
                          ) : (
                            <span>{place}</span>
                          )}
                        </td>

                        {/* Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-100">
                          {st.firstName} {st.lastName}
                        </td>

                        {/* Grade */}
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {st.grade}-sinf
                        </td>

                        {/* Level Title */}
                        <td className="py-3.5 px-4">
                          <span className={`font-medium ${lvl.color}`}>
                            {lvl.title}
                          </span>
                        </td>

                        {/* Count of logs */}
                        <td className="py-3.5 px-4 text-center font-mono text-slate-305">
                          <span className="inline-flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded text-[10px] text-slate-405">
                            <BookOpen className="w-3 h-3 text-slate-500" />
                            {st.readingLogs.length} ta
                          </span>
                        </td>

                        {/* Total page score */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-300">
                          {st.totalPoints} <span className="text-[10px] text-slate-500 font-normal">ball</span>
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
