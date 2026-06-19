import { useState, useEffect } from "react";
import { 
  Trophy, Users, GraduationCap, Plus, BookOpen, 
  Menu, X, Sparkles, BookMarked, ArrowUpRight 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Student } from "./types";
import { GRADES, INITIAL_STUDENTS } from "./data/mockData";
import Sidebar from "./components/Sidebar";
import ClassDetailView from "./components/ClassDetailView";
import LeadershipSection from "./components/LeadershipSection";
import AddStudentModal from "./components/AddStudentModal";
import SuccessPopup from "./components/SuccessPopup";
import LogSuccessPopup from "./components/LogSuccessPopup";

export default function App() {
  // State for active menu section
  const [activeTab, setActiveTab] = useState<"students" | "rating">("students");
  
  // State for showing the mobile sidebar trigger
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Selected grade when searching inside a class (e.g., "5-sinf")
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  // Core students state loaded from localStorage
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("zukko_kitobxon_students");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved students from localStorage", e);
      }
    }
    return INITIAL_STUDENTS;
  });

  // State to control add student modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State to control success pop-up overlay
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [recentAddedStudentName, setRecentAddedStudentName] = useState("");
  const [recentAddedStudentGrade, setRecentAddedStudentGrade] = useState("");

  // States for logging-reading success pop-up
  const [isLogSuccessPopupOpen, setIsLogSuccessPopupOpen] = useState(false);
  const [recentLogStudentName, setRecentLogStudentName] = useState("");
  const [recentLogBookTitle, setRecentLogBookTitle] = useState("");
  const [recentLogPages, setRecentLogPages] = useState<number>(0);

  // Hover tracking status for desktop collapsible sidebar
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Persist students to localStorage anytime the state is modified
  useEffect(() => {
    localStorage.setItem("zukko_kitobxon_students", JSON.stringify(students));
  }, [students]);

  // Aggregate stats
  const totalStudentsCount = students.length;
  const totalPagesRead = students.reduce((sum, s) => sum + s.totalPoints, 0);

  // Discover overall top reader
  const topStudent = [...students].sort((a, b) => b.totalPoints - a.totalPoints)[0];

  // Grade helper counts for Class Selection menu
  const getGradeSummaryStats = (gradeName: string) => {
    const classStudents = students.filter(st => st.grade === gradeName);
    const classPages = classStudents.reduce((sum, s) => sum + s.totalPoints, 0);
    return {
      count: classStudents.length,
      pages: classPages
    };
  };

  // Handler to add a new student dynamically
  const handleAddStudent = (firstName: string, lastName: string, grade: string) => {
    const newStudent: Student = {
      id: `stud-${Date.now()}`,
      firstName,
      lastName,
      grade,
      totalPoints: 0,
      createdAt: new Date().toISOString(),
      readingLogs: []
    };

    setStudents(prev => [newStudent, ...prev]);
    
    // Set parameters for success popup and trigger it
    setRecentAddedStudentName(`${firstName} ${lastName}`);
    setRecentAddedStudentGrade(grade);
    setIsSuccessPopupOpen(true);
  };

  // Handler to log reading records for a student
  const handleAddReadingLog = (studentId: string, bookTitle: string, pages: number) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (targetStudent) {
      setRecentLogStudentName(`${targetStudent.firstName} ${targetStudent.lastName}`);
      setRecentLogBookTitle(bookTitle);
      setRecentLogPages(pages);
      setIsLogSuccessPopupOpen(true);
    }

    setStudents(prevStudents => prevStudents.map(student => {
      if (student.id === studentId) {
        const newLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          bookTitle,
          pages,
          date: new Date().toISOString()
        };
        const updatedLogs = [newLog, ...student.readingLogs];
        const newTotalPoints = student.totalPoints + pages;
        
        return {
          ...student,
          readingLogs: updatedLogs,
          totalPoints: newTotalPoints
        };
      }
      return student;
    }));
  };

  // Handler to delete a student if necessary
  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(st => st.id !== studentId));
  };

  return (
    <div id="app_root" className="min-h-screen flex flex-col lg:flex-row bg-[#0c0e14] text-slate-100 relative overflow-hidden font-sans">
      
      {/* Dynamic Ambient Background Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-650/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. Mobile Friendly Top Navigation Bar */}
      <header id="mobile_header" className="lg:hidden bg-white/5 backdrop-blur-2xl border-b border-white/10 text-white py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 rounded-xl">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-widest">KUTUBXONA</span>
            <h1 className="text-base font-display font-extrabold text-white">Zukko Kitobxon</h1>
          </div>
        </div>

        <button
          onClick={() => setIsMobileSidebarOpen(prev => !prev)}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 2. Responsive Side Navigation Panel */}
      <div 
        id="sidebar_container"
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:static inset-y-0 left-0 w-72 sm:w-80 lg:w-auto ${
          isSidebarHovered ? "lg:w-72" : "lg:w-20"
        } z-50 lg:z-auto sidebar-smooth-transition`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedGrade(null); // Reset inside-class selection when switching core layouts
            setIsMobileSidebarOpen(false); // Close mobile drawer
          }}
          totalStudentsCount={totalStudentsCount}
          totalPagesRead={totalPagesRead}
          topStudentName={topStudent ? `${topStudent.firstName} ${topStudent.lastName}` : undefined}
          topStudentPoints={topStudent ? topStudent.totalPoints : undefined}
          isHovered={isSidebarHovered}
        />

        {/* Backdrop for mobile drawer */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm lg:hidden z-[-1]"
          />
        )}
      </div>

      {/* 3. Main Workspace Container */}
      <main id="main_workspace" className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full z-10">
        
        {/* TAB 1: O'QUVCHILAR SECTION */}
        {activeTab === "students" && (
          <div id="students_tab" className="space-y-8">
            
            {!selectedGrade ? (
              // Case A: Render Grid of Classes (5 to 11 Grade Selection cards)
              <div className="space-y-8">
                {/* Hero Greeting Panel with Premium Frosted Glass */}
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-10 overflow-hidden border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />

                  <div className="relative max-w-2xl space-y-4">
                    <span className="flex items-center gap-1.5 w-fit px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-semibold text-blue-300 font-mono tracking-wide">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-450 animate-pulse" />
                      Yangi o'quv yili loyihasi
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                      Kitobxon O'quvchilar Reyting Platformasi
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      Maktab kutubxonasiga moslashtirilgan ball tizimi. O'quvchilar o'qigan kitoblarining betlarini kiritib boradilar, 
                      har bir o'qilgan sahifa 1 ball sifatida hisoblanadi va sinflararo sog'lom raqobatni shakllantiradi!
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                          <span className="text-xs text-slate-400">5-11 sinflar o'rtasida</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookMarked className="w-4 h-4 text-emerald-450" />
                          <span className="text-xs text-slate-400">1 bet = 1 ball formula</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setStudents([]);
                          localStorage.setItem("zukko_kitobxon_students", JSON.stringify([]));
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 hover:text-rose-400 border border-rose-500/20 text-[11px] font-medium font-sans rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-rose-950/10"
                        title="Barcha kiritilgan o'quvchilarni o'chirish va toza holatga qaytarish"
                      >
                        Ma'lumotlarni Tozalash (Reset)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">Sinflarni Tanlang</h3>
                    <p className="text-slate-400 text-sm mt-0.5">Sinf o'quvchilari va jurnali bilan tanishish uchun kerakli sinf ustiga bosing</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedGrade(null); // No pre-selection
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 cursor-pointer transition-all font-display duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    O'quvchi qo'shish
                  </button>
                </div>

                {/* The 5-11 Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {GRADES.map((gradeName) => {
                    const stats = getGradeSummaryStats(gradeName);
                    
                    return (
                      <motion.div
                        key={gradeName}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedGrade(gradeName)}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-3xl p-6 shadow-xl hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-between h-48 group relative overflow-hidden text-slate-200"
                      >
                        {/* Decorative subtle visual top bar change on hover */}
                        <span className="absolute top-0 left-0 right-0 h-1.5 bg-white/5 group-hover:bg-blue-500 transition-colors" />

                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="p-2.5 bg-white/5 text-blue-400 rounded-2xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors duration-250">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <h4 className="text-xl font-display font-bold text-white pt-2 tracking-tight">
                              {gradeName}
                            </h4>
                          </div>

                          <span className="p-1 px-2.5 bg-white/5 border border-white/10 text-[10px] text-slate-400 font-bold font-mono rounded-lg uppercase tracking-wider">
                            Sinf
                          </span>
                        </div>

                        {/* Stats Summary Panel */}
                        <div className="flex items-end justify-between pt-4 border-t border-white/5">
                          <div className="space-y-0.5">
                            <p className="text-xs text-slate-500 font-mono">Batafsil ma'lumot</p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-semibold text-slate-300 flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                {stats.count} o'quvchi
                              </span>
                              <span className="text-slate-650">|</span>
                              <span className="font-bold text-blue-400 flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                                {stats.pages} ball
                              </span>
                            </div>
                          </div>

                          <div className="p-2 bg-white/5 text-slate-400 rounded-xl group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Case B: Go Inside Selected Class Details view
              <ClassDetailView
                grade={selectedGrade}
                students={students.filter(s => s.grade === selectedGrade)}
                onBack={() => setSelectedGrade(null)}
                onOpenAddStudent={() => setIsAddModalOpen(true)}
                onAddReadingLog={handleAddReadingLog}
                onDeleteStudent={handleDeleteStudent}
              />
            )}
            
          </div>
        )}

        {/* TAB 2: INTERACTIVE LEADERBOARD SECTION */}
        {activeTab === "rating" && (
          <div id="rating_tab" className="animate-fade-in duration-300">
            <LeadershipSection students={students} />
          </div>
        )}

      </main>

      {/* 4. Smooth Animated Global Modal: Yangi o'quvchi qo'shish */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddStudentModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={handleAddStudent}
            defaultGrade={selectedGrade || undefined}
          />
        )}
      </AnimatePresence>

      {/* 5. Custom Success Toast Overlay: "Muvaffaqiyatli qabul qilindi!" */}
      <AnimatePresence>
        {isSuccessPopupOpen && (
          <SuccessPopup
            isOpen={isSuccessPopupOpen}
            onClose={() => setIsSuccessPopupOpen(false)}
            studentName={recentAddedStudentName}
            grade={recentAddedStudentGrade}
          />
        )}
      </AnimatePresence>

      {/* 6. Custom Log Success Centered Popup Overlay */}
      <AnimatePresence>
        {isLogSuccessPopupOpen && (
          <LogSuccessPopup
            isOpen={isLogSuccessPopupOpen}
            onClose={() => setIsLogSuccessPopupOpen(false)}
            studentName={recentLogStudentName}
            bookTitle={recentLogBookTitle}
            pages={recentLogPages}
            onViewLeaderboard={() => {
              setActiveTab("rating");
              setSelectedGrade(null);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
