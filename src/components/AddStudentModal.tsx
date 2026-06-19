import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, UserPlus, GraduationCap, AlertCircle } from "lucide-react";
import { GRADES } from "../data/mockData";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (firstName: string, lastName: string, grade: string) => void;
  defaultGrade?: string; // Preloaded grade if opened from inside a grade view
}

export default function AddStudentModal({ isOpen, onClose, onSuccess, defaultGrade }: AddStudentModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");

  // Pre-fill grade if defaultGrade changes or modal opens
  useEffect(() => {
    if (defaultGrade) {
      setGrade(defaultGrade);
    } else {
      setGrade(GRADES[0]); // default to 5-sinf
    }
    // Reset state
    setFirstName("");
    setLastName("");
    setError("");
  }, [defaultGrade, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName) {
      setError("Iltimos, o'quvchining ismini kiriting.");
      return;
    }
    if (!trimmedLastName) {
      setError("Iltimos, o'quvchining familiyasini kiriting.");
      return;
    }
    if (!grade) {
      setError("Iltimos, sinfni tanlang.");
      return;
    }

    onSuccess(trimmedFirstName, trimmedLastName, grade);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-lg bg-[#0c0e14]/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Banner/Header with custom pattern background */}
        <div className="relative py-6 px-8 bg-white/5 border-b border-white/10 text-white flex items-center justify-between">
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <UserPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-display font-medium tracking-tight text-white">Yangi O'quvchi Qo'shish</h2>
              <p className="text-xs text-slate-400 mt-0.5">Kutubxona reyting tizimiga o'quvchi kiritish</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl flex items-start gap-3 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-display">
                Ism
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Masalan: Asadbek"
                autoFocus
                className="w-full px-4 py-3 rounded-2xl border border-white/10 focus:border-blue-500 transition-colors bg-white/5 outline-none text-white text-sm"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-display">
                Familiya
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Masalan: Karimov"
                className="w-full px-4 py-3 rounded-2xl border border-white/10 focus:border-blue-500 transition-colors bg-white/5 outline-none text-white text-sm"
              />
            </div>
          </div>

          {/* Grade selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-display flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              Sinfni tanlang
            </label>
            
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {GRADES.map((g) => {
                const isSelected = grade === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl text-center border transition-all ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    {g.replace("-sinf", "")}
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-slate-500 font-mono mt-1 text-right">
              Faol tanlangan sinf: <span className="font-semibold text-slate-300">{grade}</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-2xl transition-all font-display"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-600/10 hover:shadow-blue-650/20 transition-all font-display"
            >
              Saqlash va qo'shish
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
