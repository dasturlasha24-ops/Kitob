import { useState, useEffect } from "react";
import { 
  Trophy, Users, GraduationCap, Plus, BookOpen, 
  Menu, X, Sparkles, BookMarked, ArrowUpRight 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Student } from "./types";
import { GRADES, INITIAL_STUDENTS, generate100TestStudents, normalizeGrade } from "./data/mockData";
import { db, auth, handleFirestoreError, OperationType } from "./firebase";
import { collection, onSnapshot, query, orderBy, setDoc, doc, deleteDoc, writeBatch, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import Sidebar from "./components/Sidebar";
import ClassDetailView from "./components/ClassDetailView";
import LeadershipSection from "./components/LeadershipSection";
import AddStudentModal from "./components/AddStudentModal";
import SuccessPopup from "./components/SuccessPopup";
import LogSuccessPopup from "./components/LogSuccessPopup";
import ConfirmModal from "./components/ConfirmModal";
import Login from "./components/Login";

// New modules
import SettingsSection from "./components/SettingsSection";
import { formatNameFinal } from "./utils/formatters";

export default function App() {
  // State for active menu section
  const [activeTab, setActiveTab] = useState<"students" | "rating" | "settings">("students");
  
  // State for showing the mobile sidebar trigger
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Selected grade when searching inside a class (e.g., "5-sinf")
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  // Core students state loaded from localStorage (resilient persistent storage)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("zukko_kitobxon_students");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((s: Student) => ({
            ...s,
            grade: normalizeGrade(s.grade)
          }));
        }
      } catch (e) {
        console.error("Error parsing saved students from localStorage", e);
      }
    }
    return [];
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

  // State to control reset confirmation modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // State to control logout confirmation modal
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Authentication states - default to authorized teacher session so app opens immediately
  const [user, setUser] = useState<{ email?: string | null; displayName?: string | null; uid: string } | null>(() => {
    const saved = localStorage.getItem("zukko_auth_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default logged in session for immediate usability
    return {
      email: "oqituvchi@zukko.uz",
      displayName: "Maktab O'qituvchisi",
      uid: "teacher-default"
    };
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Synchronise Firebase Auth State when user signs in with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userData = {
          email: currentUser.email,
          displayName: currentUser.displayName || "O'qituvchi",
          uid: currentUser.uid
        };
        setUser(userData);
        localStorage.setItem("zukko_auth_user", JSON.stringify(userData));
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Synchronise with Firestore Database in Real-Time (when available and permitted)
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: Student[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({ 
              id: docSnap.id, 
              ...data,
              grade: normalizeGrade(data.grade)
            } as Student);
          });
          setStudents(list);
          localStorage.setItem("zukko_kitobxon_students", JSON.stringify(list));
        }
      }, (error) => {
        // Log gracefully instead of throwing unhandled exceptions!
        console.warn("Firestore snapshot notice (operating in local persistent mode):", error.message);
      });
    } catch (err) {
      console.warn("Firestore initialization notice:", err);
    }
    return () => unsubscribe();
  }, []);

  // Synchronise Theme setting on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("zukko_library_theme") || "dark";
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

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

  // Handler to add a new student dynamically (Optimistic local + background Firestore sync)
  const handleAddStudent = async (rawFirstName: string, rawLastName: string, grade: string) => {
    const firstName = formatNameFinal(rawFirstName);
    const lastName = formatNameFinal(rawLastName);
    const studentId = `stud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newStudent: Student = {
      id: studentId,
      firstName,
      lastName,
      grade,
      totalPoints: 0,
      createdAt: new Date().toISOString(),
      readingLogs: []
    };

    // 1. Instant optimistic state update - guarantees student appears immediately
    setStudents((prev) => {
      const updated = [newStudent, ...prev];
      localStorage.setItem("zukko_kitobxon_students", JSON.stringify(updated));
      return updated;
    });

    // 2. Trigger success popup feedback
    setRecentAddedStudentName(`${firstName} ${lastName}`);
    setRecentAddedStudentGrade(grade);
    setIsSuccessPopupOpen(true);

    // 3. Background Firestore Sync
    try {
      await setDoc(doc(db, "students", studentId), newStudent);
    } catch (error) {
      console.warn("Firestore sync deferred (saved locally):", error);
    }
  };

  // Handler to log reading records for a student (Optimistic local + background Firestore sync)
  const handleAddReadingLog = async (studentId: string, bookTitle: string, pages: number) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    setRecentLogStudentName(`${targetStudent.firstName} ${targetStudent.lastName}`);
    setRecentLogBookTitle(bookTitle);
    setRecentLogPages(pages);
    setIsLogSuccessPopupOpen(true);

    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookTitle,
      pages,
      date: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...targetStudent.readingLogs];
    const newTotalPoints = targetStudent.totalPoints + pages;
    const updatedStudent: Student = {
      ...targetStudent,
      readingLogs: updatedLogs,
      totalPoints: newTotalPoints
    };

    // 1. Instant local update
    setStudents((prev) => {
      const updated = prev.map((s) => s.id === studentId ? updatedStudent : s);
      localStorage.setItem("zukko_kitobxon_students", JSON.stringify(updated));
      return updated;
    });

    // 2. Background Firestore sync
    try {
      await setDoc(doc(db, "students", studentId), updatedStudent);
    } catch (error) {
      console.warn("Firestore reading log sync deferred (saved locally):", error);
    }
  };

  // Handler to delete a student (Optimistic local + background Firestore sync)
  const handleDeleteStudent = async (studentId: string) => {
    // 1. Instant local removal
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== studentId);
      localStorage.setItem("zukko_kitobxon_students", JSON.stringify(updated));
      return updated;
    });

    // 2. Background Firestore sync
    try {
      await deleteDoc(doc(db, "students", studentId));
    } catch (error) {
      console.warn("Firestore delete student sync deferred (deleted locally):", error);
    }
  };

  // Handler to seed the 100 test students if requested in Settings
  const handleSeed100Students = async () => {
    const testStudents = generate100TestStudents();
    setStudents(testStudents);
    localStorage.setItem("zukko_kitobxon_students", JSON.stringify(testStudents));

    try {
      const batch = writeBatch(db);
      testStudents.forEach((student) => {
        const docRef = doc(db, "students", student.id);
        batch.set(docRef, student);
      });
      await batch.commit();
    } catch (error) {
      console.warn("Firestore seed sync deferred:", error);
    }
  };

  // Handler to clear all students
  const handleClearAllStudents = async () => {
    setIsResetConfirmOpen(false);
    setStudents([]);
    localStorage.setItem("zukko_kitobxon_students", JSON.stringify([]));

    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const batch = writeBatch(db);
      querySnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    } catch (error) {
      console.warn("Firestore clear sync deferred:", error);
    }
  };

  // Handler for logging out
  const handleLogout = async () => {
    setIsLogoutConfirmOpen(false);
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem("zukko_auth_user");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#07090e] text-slate-100 space-y-4 font-sans relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin relative z-10" />
        <span className="text-xs text-slate-500 font-mono tracking-wider uppercase relative z-10 animate-pulse">Tizim yuklanmoqda...</span>
      </div>
    );
  }

  if (!user) {
    return <Login onDirectAccess={(userData) => setUser(userData)} />;
  }

  return (
    <div id="app_root" className="min-h-screen flex flex-col lg:flex-row bg-[#0c0e14] text-slate-100 relative overflow-hidden font-sans">
      
      {/* Dynamic Ambient Background Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-650/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. Mobile Friendly Top Navigation Bar */}
      <header id="mobile_header" className="lg:hidden bg-[#090b0f]/95 backdrop-blur-2xl border-b border-white/10 text-white py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 shadow-md shrink-0 bg-[#090b0f]">
            <img src="/pwa-192x192.png" alt="Zukko Kitobxon" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">KUTUBXONA</span>
            <h1 className="text-sm sm:text-base font-display font-extrabold text-white leading-tight">Zukko Kitobxon</h1>
          </div>
        </div>

        <button
          onClick={() => setIsMobileSidebarOpen(prev => !prev)}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 2. Desktop constant spacer: Keeps a steady 80px gutter so the main window NEVER resizes or gets squeezed */}
      <div className="hidden lg:block w-20 shrink-0 pointer-events-none" aria-hidden="true" />

      {/* 3. Smooth Floating Sidebar (Drawer / Overlay) */}
      <div 
        id="sidebar_container"
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`fixed inset-y-0 left-0 z-50 h-screen flex flex-col sidebar-smooth-transition ${
          isMobileSidebarOpen 
            ? "translate-x-0 w-72 sm:w-80 shadow-[0_0_60px_rgba(0,0,0,0.9)]" 
            : "-translate-x-full lg:translate-x-0"
        } ${
          isSidebarHovered ? "lg:w-72 shadow-[0_0_50px_rgba(0,0,0,0.85)]" : "lg:w-20 shadow-xl"
        }`}
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
          isHovered={isSidebarHovered || isMobileSidebarOpen}
          onLogout={() => setIsLogoutConfirmOpen(true)}
        />
      </div>

      {/* Backdrop for mobile drawer */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs lg:hidden z-40 transition-opacity duration-300"
        />
      )}

      {/* 4. Main Workspace Container */}
      <main id="main_workspace" className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 pt-20 lg:pt-10 overflow-y-auto max-w-7xl mx-auto w-full z-10">
        
        {/* TAB 1: O'QUVCHILAR SECTION */}
        {activeTab === "students" && (
          <div id="students_tab" className="space-y-6">
            
            {!selectedGrade ? (
              // Case A: Render Grid of Classes (5 to 11 Grade Selection cards)
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Minimalist Top Header & Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight">
                      Kutubxona Jurnali
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      5–11 sinflar o'rtasidagi kitobxonlik va mutolaa monitoringi
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {students.length > 0 && (
                      <button
                        onClick={() => setIsResetConfirmOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-medium transition-all cursor-pointer"
                        title="Barcha o'quvchilarni o'chirish (tozalash)"
                      >
                        O'chirish (Tozalash)
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedGrade(null);
                        setIsAddModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      O'quvchi qo'shish
                    </button>
                  </div>
                </div>

                {/* Clean onboarding alert when no students exist yet */}
                {totalStudentsCount === 0 && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-300 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>
                        Tizim toza holatda foydalanishga tayyor! Yuqoridagi <strong className="text-white font-semibold">"O'quvchi qo'shish"</strong> tugmasi orqali yangi o'quvchilarni kiritishingiz mumkin.
                      </span>
                    </div>
                  </div>
                )}

                {/* 3 Minimal Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-[#0e1118] border border-white/[0.07] rounded-2xl">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Jami O'quvchilar</span>
                    <span className="text-xl font-mono font-bold text-white mt-1 block">{totalStudentsCount} nafar</span>
                  </div>
                  <div className="p-4 bg-[#0e1118] border border-white/[0.07] rounded-2xl">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Jami Mutolaa</span>
                    <span className="text-xl font-mono font-bold text-indigo-400 mt-1 block">{totalPagesRead.toLocaleString()} bet</span>
                  </div>
                  <div className="p-4 bg-[#0e1118] border border-white/[0.07] rounded-2xl">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Yetakchi Kitobxon</span>
                    <span className="text-sm font-semibold text-amber-300 mt-1.5 block truncate">
                      {topStudent ? `${topStudent.firstName} ${topStudent.lastName} (${topStudent.totalPoints.toLocaleString()} bet)` : "—"}
                    </span>
                  </div>
                </div>

                {/* Section Title */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-slate-300">Sinfni tanlang</h3>
                  <p className="text-xs text-slate-500 mt-0.5">O'quvchilar ro'yxati va yangi kitob kiritish uchun sinf kartasini bosing</p>
                </div>

                {/* The Classes Grid - Minimal & Aesthetic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {GRADES.map((gradeName) => {
                    const stats = getGradeSummaryStats(gradeName);
                    const isTraditionalClass = gradeName.includes("-sinf");
                    
                    return (
                      <div
                        key={gradeName}
                        onClick={() => setSelectedGrade(gradeName)}
                        className="bg-[#0e1118] hover:bg-[#121620] border border-white/[0.07] hover:border-indigo-500/40 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px] h-full"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                              {isTraditionalClass ? "Sinf" : "Guruh / Yo'nalish"}
                            </span>
                            <h4 className="text-lg sm:text-xl font-display font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors leading-snug break-words">
                              {gradeName}
                            </h4>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-white/[0.04] group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-300 flex items-center justify-center transition-colors shrink-0">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs mt-3">
                          <span className="text-slate-400 font-medium">
                            {stats.count} o'quvchi
                          </span>
                          <span className="font-mono font-semibold text-indigo-400">
                            {stats.pages.toLocaleString()} bet
                          </span>
                        </div>
                      </div>
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

        {/* TAB 6: SETTINGS & VERSION MANAGEMENT */}
        {activeTab === "settings" && (
          <div id="settings_tab" className="animate-fade-in duration-300">
            <SettingsSection
              onSeed100Students={handleSeed100Students}
              onClearAllStudents={() => setIsResetConfirmOpen(true)}
              totalStudentsCount={totalStudentsCount}
            />
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

      {/* 7. Custom Confirm Modal for Great System Reset */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleClearAllStudents}
        title="Ma'lumotlarni Tozalash (O'chirish)"
        message="Siz rostdan ham barcha kiritilgan o'quvchilarni va ularning mutolaa natijalarini to'liq o'chirib tashlamoqchimisiz? Keyinchalik xohlasangiz 100 ta sinov o'quvchisini birgina tugma bilan qayta tiklashingiz mumkin."
        confirmLabel="Ha, barchasini o'chirish"
        cancelLabel="Bekor qilish"
        isDanger={true}
      />

      {/* 8. Custom Confirm Modal for Logout */}
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Tizimdan Chiqish"
        message="Haqiqatan ham o'qituvchilar panelidan chiqmoqchimisiz?"
        confirmLabel="Ha, chiqish"
        cancelLabel="Bekor qilish"
        isDanger={true}
      />

    </div>
  );
}
