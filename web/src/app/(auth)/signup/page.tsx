"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Building2, Shield, Loader2, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
  role: z.string().min(1, "Please select a role"),
  university: z.string().optional(),
  department: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const ROLES = [
  { value: "CANDIDATE", label: "Student / Candidate", desc: "Looking for opportunities" },
  { value: "TEACHER", label: "Teacher / Faculty", desc: "Educating the next generation" },
  { value: "MENTOR", label: "Industry Mentor", desc: "Guiding students with expertise" },
  { value: "RECRUITER", label: "Recruiter / HR", desc: "Hiring verified talent" },
  { value: "PLACEMENT_OFFICER", label: "Placement Officer", desc: "Coordinating campus placements" },
  { value: "ADMIN", label: "Administrator", desc: "Managing the platform" },
];

const STEPS = ["Account", "Role", "Institute", "Confirm"];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signUp, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "" },
  });

  const watchedRole = watch("role");

  const nextStep = async () => {
    const fieldsPerStep: (keyof SignupFormData)[][] = [
      ["name", "email"],
      ["role"],
      ["university"],
      ["password", "confirmPassword"],
    ];
    const valid = await trigger(fieldsPerStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const onSubmit = async (data: SignupFormData) => {
    await signUp({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      university: data.university,
      department: data.department,
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)" }} />
        <div className="grid-pattern absolute inset-0 opacity-30" />
      </div>

      <div className="w-full max-w-md px-4 py-8 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-heading heading-gradient">ResumeVerify X™</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading">Create account</h1>
          <p className="text-slate-400 text-sm">Join thousands of verified professionals</p>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <motion.div
                animate={{
                  background: i < step
                    ? "linear-gradient(135deg, #6366f1, #06b6d4)"
                    : i === step
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(255,255,255,0.08)",
                  scale: i === step ? 1.1 : 1,
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ color: i <= step ? "white" : "#64748b" }}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </motion.div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-8 h-px"
                  style={{
                    background: i < step
                      ? "linear-gradient(90deg, #6366f1, #06b6d4)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 0: Account Info */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="Arjun Sharma"
                        className="glass-input w-full pl-10 pr-4 py-3 text-sm text-white"
                        style={{ background: "rgba(255,255,255,0.06)", border: errors.name ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="arjun@university.edu"
                        className="glass-input w-full pl-10 pr-4 py-3 text-sm text-white"
                        style={{ background: "rgba(255,255,255,0.06)", border: errors.email ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Role */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <h2 className="text-lg font-semibold text-white mb-4">Select Your Role</h2>
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setValue("role", role.value)}
                      className="w-full text-left p-4 rounded-xl transition-all"
                      style={{
                        background: watchedRole === role.value
                          ? "rgba(99,102,241,0.15)"
                          : "rgba(255,255,255,0.04)",
                        border: watchedRole === role.value
                          ? "1px solid rgba(99,102,241,0.4)"
                          : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: watchedRole === role.value ? "#a5b4fc" : "#e2e8f0" }}>
                            {role.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{role.desc}</p>
                        </div>
                        {watchedRole === role.value && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                  {errors.role && <p className="text-red-400 text-xs">{errors.role.message}</p>}
                </motion.div>
              )}

              {/* Step 2: Institute */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-white mb-4">Your Institution</h2>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">University / Company</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        {...register("university")}
                        type="text"
                        placeholder="IIT Madras / Google / Wipro..."
                        className="glass-input w-full pl-10 pr-4 py-3 text-sm text-white"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Department (optional)</label>
                    <input
                      {...register("department")}
                      type="text"
                      placeholder="Computer Science & Engineering"
                      className="glass-input w-full px-4 py-3 text-sm text-white"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Password */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-white mb-4">Secure Your Account</h2>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 8 chars, uppercase + number"
                        className="glass-input w-full pl-10 pr-12 py-3 text-sm text-white"
                        style={{ background: "rgba(255,255,255,0.06)", border: errors.password ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        {...register("confirmPassword")}
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        className="glass-input w-full pl-10 pr-12 py-3 text-sm text-white"
                        style={{ background: "rgba(255,255,255,0.06)", border: errors.confirmPassword ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                  <p className="text-xs text-slate-500">
                    By creating an account you agree to our{" "}
                    <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">Terms</Link> and{" "}
                    <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-300 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
                >
                  Continue
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-sm relative"
                  style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
                >
                  <span className={isLoading ? "opacity-0" : ""}>Create Account 🚀</span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-500 mt-6"
        >
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
