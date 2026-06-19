import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Users, BookOpen, UserPlus, Search, 
  ChevronRight, Award, Plus, Trash2, Calendar, FileText, Check
} from "lucide-react";
import { Student, ReadingLog } from "../types";
import { MOCK_BOOKS } from "../data/mockData";

interface ClassDetailViewProps {
  grade: string;
  students: Student[];
  onBack: () => void;
  onOpenAddStudent: () => void;
  onAddReadingLog: (studentId: string, bookTitle: string, pages: number) => void;
  onDeleteStudent?: (studentId: string) => void;
}

export default function ClassDetailView({
  grade,
  students,
  onBack,
  onOpenAddStudent,
  onAddReadingLog,
  onDeleteStudent
}: ClassDetailViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  
  // State for new reading log input
  const [bookTitle, setBookTitle] = useState("");
  const [pagesRead, setPagesRead] = useState<number | "">("");
  const [logSuccessStudentId, setLogSuccessStudentId] = useState<string | null>(null);

  // Filter students by name
  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Calculate stats for this class
  const totalStudents = students.length;
  const totalClassPages = students.reduce((sum, s) => sum + s.totalPoints, 0);
  const avgPages = totalStudents > 0 ? Math.round(totalClassPages / totalStudents) : 0;
  
  // Find top reader in this class
  const classLeader = [...students].sort((a, b) => b.totalPoints - a.totalPoints)[0];

  const handleLogSubmit = (e: React.FormEvent, studentId: string) => {
    e.preventDefault();
    const finalBookTitle = bookTitle.trim();
    
    if (!finalBookTitle) return alert("Iltimos, kitob nomini kiriting!");
    if (!pagesRead || pagesRead <= 0) return alert("Iltimos, o'qilgan betlar sonini to'g'ri kiriting!");

    // Add the log
    onAddReadingLog(studentId, finalBookTitle, Number(pagesRead));
    
    // Reset state & show instant micro-success toast
    setBookTitle("");
    setPagesRead("");
    setLogSuccessStudentId(studentId);
    setTimeout(() => setLogSuccessStudentId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header back & action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-350 hover:text-white transition-colors cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-medium text-white tracking-tight">
                {grade} O'quvchilari
              </h2>
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-300 text-slice font-semibold rounded-full border border-blue-500/20 text-xs text-mono">
                Sinf tahlili
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-0.5 font-sans">
              Sinf doirasidagi o'quvchilar ro'yxati, natijalari va o'qish jurnali
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 cursor-pointer transition-all font-display"
        >
          <UserPlus className="w-5 h-5" />
          O'quvchi qo'shish
        </button>
      </div>

      {/* Analytical Quick Stats Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-white/5 text-blue-400 border border-white/5 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">O'quvchilar soni</p>
            <p className="text-2xl font-display font-extrabold text-white mt-0.5">{totalStudents} ta</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-white/5 text-emerald-400 border border-white/5 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold font-sans">O'qilgan betlar</p>
            <p className="text-2xl font-display font-extrabold text-blue-400 mt-0.5">{totalClassPages} bet</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-white/5 text-yellow-400 border border-white/5 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">Sinf yetakchisi</p>
            <p className="text-base font-display font-bold text-white truncate mt-0.5">
              {classLeader ? `${classLeader.firstName} ${classLeader.lastName}` : "Mavjud emas"}
            </p>
            {classLeader && (
              <p className="text-xs text-yellow-500 font-mono mt-0.5">
                {classLeader.totalPoints} sahifa (ball)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search & filters inside class */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md shadow-lg justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism yoki familiya bo'yicha qidirish..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-white placeholder-slate-500 text-sm"
          />
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Natijalar: <span className="font-semibold text-blue-400">{filteredStudents.length} ta o'quvchi</span>
        </p>
      </div>

      {/* Students list */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white/5 border border-dashed border-white/10 text-center py-16 px-4 rounded-3xl shadow-xl">
          <div className="max-w-sm mx-auto space-y-3">
            <div className="p-4 bg-white/5 border border-white/5 rounded-full w-fit mx-auto text-slate-400">
              <Users className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">Hech qanday o'quvchi topilmadi</h3>
            <p className="text-slate-400 text-sm">
              Ushbu sinfga hali o'quvchilar qo'shilmagan yoki qidiruv so'rovingizga mos natija chiqmadi.
            </p>
            <button
              onClick={onOpenAddStudent}
              className="mt-2 py-2 px-4 bg-white/10 text-white hover:bg-white/15 border border-white/10 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer"
            >
              Yangi o'quvchi qo'shish
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStudents.map((student, index) => {
            const isExpanded = expandedStudentId === student.id;
            const hasSuccess = logSuccessStudentId === student.id;

            return (
              <div
                key={student.id}
                className={`bg-white/5 backdrop-blur-xl border rounded-3xl transition-all duration-300 overflow-hidden shadow-xl ${
                  isExpanded ? "border-blue-550/40 ring-4 ring-blue-500/5 bg-white/10" : "border-white/10"
                }`}
              >
                {/* Main Card Header (clickable to expand / collapse log view) */}
                <div 
                  onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    {/* Position and avatar */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-center text-xs font-mono font-bold text-blue-400/80">
                        #{index + 1}
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-display font-semibold text-white text-lg border border-white/10">
                        {student.firstName[0]}
                        {student.lastName[0]}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-display font-bold text-white">
                        {student.firstName} {student.lastName}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Kitoblar: <span className="font-semibold text-slate-300">{student.readingLogs.length} ta</span> | Kiritilgan: {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Points Display and Expand Indicator */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-white/5">
                    <div className="flex items-baseline gap-1 bg-blue-600/10 text-blue-300 border border-blue-500/20 px-4 py-2 rounded-2xl font-display">
                      <span className="text-xl font-extrabold">{student.totalPoints}</span>
                      <span className="text-xs font-semibold">ball</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={`text-xs font-semibold py-2 px-3 rounded-xl border transition-colors cursor-pointer ${
                          isExpanded 
                            ? "bg-white/15 border-white/20 text-white" 
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {isExpanded ? "Yopish" : "Bet qo'shish & Tarix"}
                      </button>

                      {onDeleteStudent && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if(confirm(`${student.firstName} ${student.lastName}ni o'chirishni istaysizmi?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="p-2 text-slate-450 hover:text-rose-450 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                          title="O'quvchini o'chirish"
                        >
                          <Trash2 className="w-4 h-4 opacity-70 hover:opacity-100" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/10 bg-white/0"
                    >
                      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* 1. Log New Book / Pages Form */}
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-display font-bold text-slate-200 flex items-center gap-2 text-sm">
                              <Plus className="w-4 h-4 text-blue-400" />
                              O'qilgan kitob betlarini kiritish
                            </h5>
                            
                            {hasSuccess && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1 text-emerald-400 text-xs font-semibold"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Muvaffaqiyatli saqlandi!
                              </motion.div>
                            )}
                          </div>

                          <form onSubmit={(e) => handleLogSubmit(e, student.id)} className="space-y-3">
                            {/* Book Title INPUT directly (No selector) */}
                            <div className="space-y-1.5">
                              <label className="block text-xs font-semibold text-slate-400 font-display">
                                Kitob nomi
                              </label>
                              <input
                                type="text"
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                                placeholder="Masalan: Sariq devni minib, O'tkan kunlar..."
                                required
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-white/10 outline-none focus:border-blue-500 transition-colors bg-[#080a11] text-white placeholder-slate-600 focus:ring-4 focus:ring-blue-500/10"
                              />
                            </div>

                            {/* Pages Input */}
                            <div className="space-y-1.5">
                              <label className="block text-xs font-semibold text-slate-400 font-display">
                                O'qilgan betlar soni (1 bet = 1 ball)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={pagesRead}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPagesRead(val === "" ? "" : Number(val));
                                  }}
                                  placeholder="Masalan: 45"
                                  min={1}
                                  required
                                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/10 outline-none focus:border-blue-500 transition-all bg-[#0f111a] text-white"
                                />
                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono font-bold font-mono">
                                  bet
                                </span>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-colors font-display cursor-pointer"
                            >
                              Kitob betini saqlash
                            </button>
                          </form>
                        </div>

                        {/* 2. Reading History Logs */}
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col">
                          <h5 className="font-display font-bold text-slate-200 flex items-center gap-2 text-sm mb-4">
                            <FileText className="w-4 h-4 text-emerald-400" />
                            O'qish tarixi (Kitob jurnali)
                          </h5>

                          <div className="flex-1 overflow-y-auto max-h-48 pr-1 space-y-2.5">
                            {student.readingLogs.length === 0 ? (
                              <p className="text-slate-450 text-xs italic py-6 text-center">
                                Hali o'qilgan kitob jurnali kiritilmagan.
                              </p>
                            ) : (
                              [...student.readingLogs]
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((log) => (
                                  <div
                                    key={log.id}
                                    className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between gap-3 hover:bg-white/10 transition-colors"
                                  >
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-white truncate">
                                        {log.bookTitle}
                                      </p>
                                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-0.5">
                                        <Calendar className="w-3 h-3 text-slate-500" />
                                        {new Date(log.date).toLocaleDateString("uz-UZ", {
                                          day: "numeric",
                                          month: "short"
                                        })}
                                      </div>
                                    </div>
                                    <span className="shrink-0 px-2.5 py-1 bg-blue-500/10 border border-blue-500/10 text-blue-300 font-bold font-mono text-xs rounded-lg">
                                      +{log.pages} b
                                    </span>
                                  </div>
                                ))
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
