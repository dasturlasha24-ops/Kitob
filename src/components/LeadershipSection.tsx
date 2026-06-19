import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Trophy, Medal, Search, Flame, Award, BookOpen, 
  Sparkles, TrendingUp, ChevronRight, GraduationCap, Users
} from "lucide-react";
import { Student } from "../types";
import { GRADES } from "../data/mockData";

interface LeadershipSectionProps {
  students: Student[];
}

export default function LeadershipSection({ students }: LeadershipSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("all");

  // Calculate top 3 list overall
  const sortedAllStudents = useMemo(() => {
    return [...students].sort((a, b) => b.totalPoints - a.totalPoints);
  }, [students]);

  // Aggregate stats per Grade for our dynamic class competition bars
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

    return Object.entries(map).map(([grade, data]) => ({
      grade,
      totalPages: data.totalPages,
      studentCount: data.studentCount,
      avgPages: data.studentCount > 0 ? Math.round(data.totalPages / data.studentCount) : 0
    }));
  }, [students]);

  // Find the highest page score amongst classes to set proportional rendering heights/widths
  const maxClassPages = useMemo(() => {
    const pages = gradeAnalytics.map(g => g.totalPages);
    return Math.max(...pages, 100); // default fallback to 100 to avoid divide-by-zero
  }, [gradeAnalytics]);

  // Filter students for the leaderboard list based on search and grade filters
  const filteredStudents = useMemo(() => {
    return sortedAllStudents.filter(student => {
      const matchesSearch = `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGradeFilter === "all" || student.grade === selectedGradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [sortedAllStudents, searchQuery, selectedGradeFilter]);

  // Podium Positions (1st, 2nd, 3rd)
  const podium = useMemo(() => {
    return sortedAllStudents.slice(0, 3);
  }, [sortedAllStudents]);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-display font-medium text-white tracking-tight">
            Umumiy Reyting & Peshqadamlar
          </h2>
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-yellow-500/10 text-yellow-300 text-xs font-semibold rounded-full border border-yellow-500/20">
            <Trophy className="w-3 h-3 text-yellow-500" />
            Eng faollar
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-0.5 font-sans">
          Maktab kutubxonasi kitobxonlari o'rtasidagi umumiy reyting va raqobat maydoni
        </p>
      </div>

      {/* Podium Display (Top 3 visual stack) */}
      {students.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-base font-display font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Kitobxonlik Shon-sharaf Shaxmatchasi (TOP 3)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Eng ko'p kitob o'qigan maktab chempionlari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 max-w-3xl mx-auto">
            
            {/* 2nd Place */}
            {podium[1] && (
              <motion.div 
                whileHover={{ y: -4 }}
                className="order-2 md:order-1 bg-white/5 border border-white/10 p-6 rounded-3xl text-center shadow-lg flex flex-col items-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center font-display font-extrabold text-white text-xl border border-white/10 shadow-md">
                    {podium[1].firstName[0]}
                    {podium[1].lastName[0]}
                  </div>
                  <span className="absolute -top-3 -right-3 p-1.5 bg-slate-500 text-white rounded-full border border-white shadow-xs">
                    <Medal className="w-4 h-4" />
                  </span>
                </div>
                <h4 className="font-display font-bold text-slate-200 mt-4 truncate max-w-[150px]">
                  {podium[1].firstName} {podium[1].lastName}
                </h4>
                <p className="text-xs text-blue-400 font-semibold">{podium[1].grade}</p>
                <div className="mt-3 bg-white/5 px-3.5 py-1.5 rounded-xl border border-white/5 font-display flex items-baseline gap-1 shadow-xs">
                  <span className="font-extrabold text-white text-base">{podium[1].totalPoints}</span>
                  <span className="text-[10px] text-slate-400 font-bold">ball</span>
                </div>
                <div className="text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold mt-2">2-O'RIN</div>
              </motion.div>
            )}

            {/* 1st Place Champion */}
            {podium[0] && (
              <motion.div 
                whileHover={{ y: -6 }}
                className="order-1 md:order-2 bg-amber-500/10 border-2 border-amber-400 p-8 rounded-3xl text-center shadow-2xl flex flex-col items-center scale-100 md:scale-105 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center font-display font-black text-white text-3xl border-4 border-amber-400 shadow-lg">
                    {podium[0].firstName[0]}
                    {podium[0].lastName[0]}
                  </div>
                  <span className="absolute -top-3.5 -right-3.5 p-2 bg-amber-500 text-white rounded-full ring-4 ring-amber-100 shadow-md">
                    <Trophy className="w-5 h-5 text-yellow-300 animate-bounce" />
                  </span>
                </div>
                <h4 className="font-display font-extrabold text-amber-250 mt-4 text-lg truncate max-w-[170px]">
                  {podium[0].firstName} {podium[0].lastName}
                </h4>
                <p className="text-xs text-amber-400 font-bold tracking-wide uppercase mt-0.5">{podium[0].grade}</p>
                <div className="mt-3 bg-white/10 border border-[#f59e0b]/30 px-4 py-2 rounded-2xl font-display flex items-baseline gap-1 shadow-md">
                  <span className="font-black text-amber-300 text-xl">{podium[0].totalPoints}</span>
                  <span className="text-xs text-amber-400 font-bold">ball</span>
                </div>
                <div className="text-[10px] font-mono text-amber-350 uppercase tracking-widest font-bold mt-2">CHEMPION</div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {podium[2] && (
              <motion.div 
                whileHover={{ y: -4 }}
                className="order-3 bg-white/5 border border-white/10 p-6 rounded-3xl text-center shadow-lg flex flex-col items-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/15 flex items-center justify-center font-display font-extrabold text-orange-400 text-xl border-2 border-white/10 shadow-md">
                    {podium[2].firstName[0]}
                    {podium[2].lastName[0]}
                  </div>
                  <span className="absolute -top-3 -right-3 p-1.5 bg-orange-500 text-white rounded-full border border-white shadow-xs">
                    <Medal className="w-4 h-4" />
                  </span>
                </div>
                <h4 className="font-display font-bold text-slate-200 mt-4 truncate max-w-[150px]">
                  {podium[2].firstName} {podium[2].lastName}
                </h4>
                <p className="text-xs text-blue-400 font-semibold">{podium[2].grade}</p>
                <div className="mt-3 bg-white/5 px-3.5 py-1.5 rounded-xl border border-white/5 font-display flex items-baseline gap-1 shadow-xs">
                  <span className="font-extrabold text-white text-base">{podium[2].totalPoints}</span>
                  <span className="text-[10px] text-slate-400 font-bold">ball</span>
                </div>
                <div className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold mt-2">3-O'RIN</div>
              </motion.div>
            )}

          </div>
        </div>
      )}

      {/* Visual Inter-Class Battle Chart (Total Pages read per Grade) */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl">
        <h3 className="text-lg font-display font-medium text-white flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Sinflararo Bellashuv (O'qilgan Betlar Tahlili)
        </h3>
        <p className="text-xs text-slate-400 mb-6 font-sans">
          Qaysi sinf o'quvchilari eng ko'p kitob sahifalarini zabt etdi? (Reyting sinf bo'yicha)
        </p>

        <div className="space-y-4">
          {gradeAnalytics.map((g) => {
            const percentage = maxClassPages > 0 ? (g.totalPages / maxClassPages) * 100 : 0;
            return (
              <div key={g.grade} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-display font-bold text-slate-300 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                    {g.grade} (Jami: {g.studentCount} ta o'quvchi)
                  </span>
                  <span className="font-mono font-bold text-slate-300">
                    {g.totalPages} bet <span className="text-slate-500 font-medium">({g.avgPages} b / o'rtacha)</span>
                  </span>
                </div>
                
                {/* Visual custom bar chart */}
                <div className="w-full h-3 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(percentage, 2.5)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      percentage >= 70 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
                        : percentage >= 35 
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500" 
                        : "bg-gradient-to-r from-blue-450/80 to-blue-300"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Leaderboard List & Search Filters */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-display font-medium text-white text-lg flex items-center gap-2">
            Chempionlar Jadvali
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Class filter dropdown */}
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="px-4 py-2 bg-[#0c0e14] hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 outline-none transition-colors"
            >
              <option value="all">Barcha sinflar</option>
              {GRADES.map((g) => (
                <option key={g} value={g} className="bg-[#0f111a]">{g}</option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ismni qidirish..."
                className="pl-9 pr-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 focus:border-blue-500 transition-colors rounded-xl text-xs outline-none text-white w-full sm:w-48"
              />
            </div>
          </div>
        </div>

        {/* Leaderboard Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-4 px-3 sm:px-6 text-center w-16">O'rin</th>
                <th className="py-4 px-3 sm:px-6">O'quvchi</th>
                <th className="py-4 px-3 sm:px-6">Sinf</th>
                <th className="py-4 px-3 sm:px-6 text-center">Kitoblar soni</th>
                <th className="py-4 px-3 sm:px-6 text-right w-36">Jami ball (bet)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                    Hech qanday o'quvchi topilmadi.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, i) => {
                  const place = i + 1;
                  const isTop3 = place <= 3;
                  
                  return (
                    <tr 
                      key={st.id}
                      className="hover:bg-white/5 transition-colors duration-150"
                    >
                      {/* Place/Rank */}
                      <td className="py-4 px-3 sm:px-6 text-center font-mono font-bold">
                        {isTop3 ? (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${
                            place === 1 
                              ? "bg-amber-500/10 text-yellow-500 font-black ring-2 ring-amber-400/30"
                              : place === 2
                              ? "bg-slate-500/10 text-slate-200 ring-2 ring-slate-400/20"
                              : "bg-orange-500/10 text-orange-450 ring-2 ring-orange-500/20"
                          }`}>
                            {place}
                          </span>
                        ) : (
                          <span className="text-slate-400">{place}</span>
                        )}
                      </td>

                      {/* Name / Avatar info */}
                      <td className="py-4 px-3 sm:px-6 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center font-display ${
                            isTop3 ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" : "bg-white/10 text-slate-300"
                          }`}>
                            {st.firstName[0]}{st.lastName[0]}
                          </div>
                          <div>
                            <p className="font-display font-semibold hover:text-blue-400 transition-colors">
                              {st.firstName} {st.lastName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="py-4 px-3 sm:px-6 text-slate-300 font-medium">
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <GraduationCap className="w-4 h-4 text-slate-500" />
                          {st.grade}
                        </span>
                      </td>

                      {/* Books count logged */}
                      <td className="py-4 px-3 sm:px-6 text-center font-semibold text-slate-300 font-mono">
                        {st.readingLogs.length} ta
                      </td>

                      {/* Score points display */}
                      <td className="py-4 px-3 sm:px-6 text-right font-display">
                        <div className="flex items-center justify-end gap-1 font-extrabold text-blue-300">
                          <span>{st.totalPoints}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">ball</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
