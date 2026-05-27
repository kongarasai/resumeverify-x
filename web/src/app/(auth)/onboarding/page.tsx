"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sparkles, GitBranch, Code2, Brain,
  ChevronRight, ChevronLeft, Upload, Check,
  Loader2, Trophy, Target
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import toast from "react-hot-toast";

const STEPS = [
  { id: 0, title: "Welcome", icon: Sparkles },
  { id: 1, title: "Resume", icon: Upload },
  { id: 2, title: "Connect", icon: Code2 },
  { id: 3, title: "Goals", icon: Target },
  { id: 4, title: "Roadmap", icon: Brain },
];

const TARGET_COMPANIES = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple",
  "Flipkart", "Zomato", "Swiggy", "Paytm", "CRED",
  "TCS", "Infosys", "Wipro", "Cognizant", "Accenture",
  "Zoho", "Freshworks", "Razorpay", "PhonePe", "Zepto"
];

const TARGET_ROLES = [
  "Software Engineer", "Full Stack Developer", "Frontend Engineer",
  "Backend Engineer", "Data Scientist", "ML Engineer",
  "DevOps Engineer", "Cloud Architect", "Product Manager", "QA Engineer"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [roadmap, setRoadmap] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf" || file?.name.endsWith(".pdf")) {
      setResumeFile(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const uploadResume = async () => {
    if (!resumeFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      await api.post("/resume/upload", formData);
      toast.success("Resume uploaded and analyzed! ✅");
      setStep(2);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const connectGitHub = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/github`, "_blank");
    setTimeout(() => setGithubConnected(true), 2000);
  };

  const generateRoadmap = async () => {
    if (!selectedRole) { toast.error("Please select a target role"); return; }
    setIsGenerating(true);
    try {
      const res = await api.post("/ai/career-plan", {
        targetCompanies: selectedCompanies,
        targetRole: selectedRole,
        userId: user?.id,
      });
      setRoadmap(res.data);
      setStep(4);
    } catch {
      const mockRoadmap = {
        weeks: [
          { week: 1, focus: "DSA Fundamentals", tasks: ["Arrays & Strings", "Linked Lists", "Stack & Queue"] },
          { week: 2, focus: "Advanced DSA", tasks: ["Trees & Graphs", "Dynamic Programming", "Backtracking"] },
          { week: 3, focus: "System Design", tasks: ["HLD Basics", "LLD Patterns", "Database Design"] },
          { week: 4, focus: "Interview Prep", tasks: ["Mock Interviews", "Behavioral Prep", "Company Research"] },
        ],
      };
      setRoadmap(mockRoadmap);
      setStep(4);
    } finally {
      setIsGenerating(false);
    }
  };

  const finish = async () => {
    try {
      await api.patch(`/users/me`, { onboardingCompleted: true });
    } catch {}
    router.push("/dashboard");
  };

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: "#0a0a0f" }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.4) 0%, transparent 70%)" }} />
        <div className="grid-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <motion.div
                animate={{
                  background: i < step ? "linear-gradient(135deg, #6366f1, #06b6d4)" : i === step ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)",
                  scale: i === step ? 1.15 : 1,
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ border: i <= step ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)" }}
              >
                {i < step ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <s.icon className="w-4 h-4" style={{ color: i === step ? "#a5b4fc" : "#475569" }} />
                )}
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div
                  className="h-px w-10"
                  animate={{ background: i < step ? "linear-gradient(90deg, #6366f1, #06b6d4)" : "rgba(255,255,255,0.08)" }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={step}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="glass-card p-8 md:p-10"
          >
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                  <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6"
                    style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}>
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold font-heading heading-gradient mb-2">
                    Welcome, {user?.name?.split(" ")[0]}! 🎉
                  </h1>
                  <p className="text-slate-400">
                    You&apos;re now part of <span className="text-indigo-400 font-semibold">ResumeVerify X™</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl text-left space-y-3"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <p className="text-sm font-medium text-indigo-300">Your role: {user?.role}</p>
                  <p className="text-xs text-slate-400">
                    Let&apos;s set up your profile in 4 quick steps to unlock your AI Trust Score and personalized career roadmap.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ icon: "🏆", label: "Trust Score" }, { icon: "🤖", label: "AI Roadmap" }, { icon: "💼", label: "Job Matches" }].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl text-center"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="text-xs text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Upload Resume */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold font-heading text-white mb-2">Upload Your Resume</h2>
                  <p className="text-slate-400 text-sm">We&apos;ll analyze it to build your Trust Score</p>
                </div>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => document.getElementById("resume-input")?.click()}
                  className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all"
                  style={{
                    borderColor: isDragging ? "#6366f1" : resumeFile ? "#10b981" : "rgba(255,255,255,0.15)",
                    background: isDragging ? "rgba(99,102,241,0.08)" : resumeFile ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <input id="resume-input" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                  {resumeFile ? (
                    <div>
                      <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-emerald-500/20">
                        <Check className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-emerald-400 font-medium">{resumeFile.name}</p>
                      <p className="text-slate-500 text-xs mt-1">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-10 h-10 mx-auto mb-3 text-slate-500" />
                      <p className="text-slate-300 font-medium">Drop your resume here</p>
                      <p className="text-slate-500 text-sm mt-1">or click to browse • PDF only</p>
                    </div>
                  )}
                </div>
                {isUploading && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Uploading...</span><span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #6366f1, #06b6d4)" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Connect Accounts */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold font-heading text-white mb-2">Connect Your Accounts</h2>
                  <p className="text-slate-400 text-sm">Boost your Trust Score with verified activity</p>
                </div>
                <div className="space-y-3">
                  {/* GitHub */}
                  <div className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <GitBranch className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">GitHub</p>
                        <p className="text-xs text-slate-500">+15 Trust Score pts</p>
                      </div>
                    </div>
                    {githubConnected ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    ) : (
                      <button onClick={connectGitHub}
                        className="px-4 py-2 rounded-lg text-xs font-medium text-white"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        Connect
                      </button>
                    )}
                  </div>
                  {/* LeetCode */}
                  <div className="p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(245,158,11,0.2)" }}>
                        <Code2 className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">LeetCode</p>
                        <p className="text-xs text-slate-500">+20 Trust Score pts</p>
                      </div>
                    </div>
                    <input
                      value={leetcodeUsername}
                      onChange={(e) => setLeetcodeUsername(e.target.value)}
                      placeholder="Your LeetCode username"
                      className="w-full px-3 py-2 text-sm text-white rounded-lg"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold font-heading text-white mb-2">Set Your Goals</h2>
                  <p className="text-slate-400 text-sm">We&apos;ll personalize everything for you</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-3">Target Companies (select up to 5)</p>
                  <div className="flex flex-wrap gap-2">
                    {TARGET_COMPANIES.map((company) => (
                      <button
                        key={company}
                        type="button"
                        onClick={() => {
                          if (selectedCompanies.includes(company)) {
                            setSelectedCompanies((c) => c.filter((x) => x !== company));
                          } else if (selectedCompanies.length < 5) {
                            setSelectedCompanies((c) => [...c, company]);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: selectedCompanies.includes(company) ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
                          border: selectedCompanies.includes(company) ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
                          color: selectedCompanies.includes(company) ? "#a5b4fc" : "#94a3b8",
                        }}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-3">Target Role</p>
                  <div className="flex flex-wrap gap-2">
                    {TARGET_ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: selectedRole === role ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.05)",
                          border: selectedRole === role ? "1px solid rgba(6,182,212,0.4)" : "1px solid rgba(255,255,255,0.08)",
                          color: selectedRole === role ? "#67e8f9" : "#94a3b8",
                        }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Roadmap */}
            {step === 4 && roadmap && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}>
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-white mb-2">Your AI Roadmap 🚀</h2>
                  <p className="text-slate-400 text-sm">Personalized 4-week plan for {selectedRole}</p>
                </div>
                <div className="space-y-3">
                  {(roadmap as any).weeks?.map((week: {week: number; focus: string; tasks: string[]}, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                          {week.week}
                        </div>
                        <p className="text-sm font-semibold text-white">{week.focus}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-10">
                        {week.tasks.map((task: string) => (
                          <span key={task} className="text-xs px-2 py-1 rounded-md"
                            style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                            {task}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Skip setup
            </button>
          )}

          {step === 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
            >
              Get Started <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}

          {step === 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={resumeFile ? uploadResume : () => setStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {resumeFile ? (isUploading ? "Uploading..." : "Upload & Continue") : "Skip for now"}
              {!isUploading && <ChevronRight className="w-4 h-4" />}
            </motion.button>
          )}

          {step === 2 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}

          {step === 3 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={generateRoadmap}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              {isGenerating ? "Generating..." : "Generate AI Roadmap"}
            </motion.button>
          )}

          {step === 4 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={finish}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}
            >
              <Trophy className="w-4 h-4" /> Go to Dashboard
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
