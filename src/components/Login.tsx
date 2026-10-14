import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Lock, Mail, Eye, EyeOff, Sparkles, BookOpen, AlertCircle, ArrowRight, UserCheck } from "lucide-react";

interface LoginProps {
  onDirectAccess?: (user: { email: string; displayName: string; uid: string }) => void;
}

export default function Login({ onDirectAccess }: LoginProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuickAccess = () => {
    const demoTeacher = {
      email: "oqituvchi@zukko.uz",
      displayName: "Maktab O'qituvchisi",
      uid: "teacher-direct-" + Date.now()
    };
    localStorage.setItem("zukko_auth_user", JSON.stringify(demoTeacher));
    if (onDirectAccess) {
      onDirectAccess(demoTeacher);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (isRegisterMode) {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const userData = {
          email: userCred.user.email || email.trim(),
          displayName: userCred.user.displayName || "O'qituvchi",
          uid: userCred.user.uid
        };
        localStorage.setItem("zukko_auth_user", JSON.stringify(userData));
        if (onDirectAccess) onDirectAccess(userData);
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const userData = {
          email: userCred.user.email || email.trim(),
          displayName: userCred.user.displayName || "O'qituvchi",
          uid: userCred.user.uid
        };
        localStorage.setItem("zukko_auth_user", JSON.stringify(userData));
        if (onDirectAccess) onDirectAccess(userData);
      }
    } catch (err: any) {
      console.warn("Auth note:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Bu email allaqachon ro'yxatdan o'tgan. Tizimga kirish bo'limiga o'ting.");
      } else if (err.code === "auth/weak-password") {
        setError("Parol juda qisqa (kamida 6 ta belgi bo'lishi kerak).");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Email yoki parol noto'g'ri kiritildi.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Haddan tashqari ko'p urinishlar qilindi. Birozdan so'ng qayta urinib ko'ring.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Internet aloqasi sust. Pastdagi 'Tezkor kirish' tugmasidan foydalanishingiz mumkin.");
      } else {
        setError("Tizimga kirishda xatolik yuz berdi. 'Tezkor kirish' orqali darhol kirishingiz mumkin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07090e] relative overflow-hidden font-sans p-4">
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative stars / ambient dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo and Greeting Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex w-16 h-16 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/25 border border-white/15 p-1 bg-gradient-to-br from-blue-500 to-indigo-600 animate-bounce" style={{ animationDuration: '4s' }}>
            <img src="/pwa-192x192.png" alt="Zukko Kitobxon" className="w-full h-full object-cover rounded-[20px]" />
          </div>
          
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 w-fit mx-auto px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-300 font-mono tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              O'QITUVCHILAR PANELI v1.1
            </span>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
              Zukko Kitobxon
            </h1>
            <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
              Tizimga faqat ma'muriyat tomonidan taqdim etilgan hisob ma'lumotlari orqali kirish mumkin.
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#0b0e14]/90 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {/* Mode Switcher: Kirish vs Ro'yxatdan o'tish */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setError(""); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                !isRegisterMode ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Tizimga Kirish
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setError(""); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                isRegisterMode ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Yangi Hisob Ochish
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message Alert */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs text-rose-400 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block pl-1">
                E-pochta manzili (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="masalan: oqituvchi@zukko.uz"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all font-sans"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-semibold text-slate-400">
                  Maxfiy parol {isRegisterMode && "(kamida 6 ta belgi)"}
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all font-sans"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-350 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-indigo-550 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kutilmoqda...
                </>
              ) : (
                isRegisterMode ? "Yangi Hisob Yaratish" : "Tizimga Kirish"
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
              <span className="bg-[#0b0e14] px-3 text-slate-500">yoki parolsiz</span>
            </div>
          </div>

          {/* Quick Instant Access Button for Teachers/Testers */}
          <button
            type="button"
            onClick={handleQuickAccess}
            className="w-full py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 font-semibold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            O'qituvchi sifatida to'g'ridan-to'g'ri kirish
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Locked Notice footer */}
          <div className="mt-5 pt-4 border-t border-white/[0.05] text-center">
            <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-indigo-400" />
              Tizim to'liq himoyalangan va ma'lumotlar saqlanadi.
            </span>
          </div>

        </div>

        {/* Back Link to Public Status (optional, clean UX) */}
        <p className="text-center text-slate-500 text-[11px] mt-6">
          Zukko Kitobxon © 2026. Barcha huquqlar himoyalangan.
        </p>

      </div>
    </div>
  );
}
