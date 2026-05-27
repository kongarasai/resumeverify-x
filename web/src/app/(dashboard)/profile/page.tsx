"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, GitBranch, Code2, Award, Upload, Sparkles, Edit3, Camera, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import api from "@/lib/api";
import toast from "react-hot-toast";

const tabs = ["Overview", "Skills", "Projects", "Experience", "Certifications", "Verification", "Financial", "Activity"];

const dsaData = [
  { subject: "Arrays", A: 90 }, { subject: "Trees", A: 70 }, { subject: "DP", A: 55 },
  { subject: "Graphs", A: 65 }, { subject: "SQL", A: 80 }, { subject: "OS", A: 45 },
];

const skills = [
  { name: "JavaScript", level: 85, verified: true }, { name: "React", level: 80, verified: true },
  { name: "Node.js", level: 75, verified: false }, { name: "Python", level: 70, verified: true },
  { name: "PostgreSQL", level: 65, verified: false }, { name: "System Design", level: 40, verified: false },
];

const projects = [
  { title: "E-Commerce Platform", tech: ["React", "Node.js", "MongoDB"], originality: 88, deployed: true, github: true, teamVerified: false },
  { title: "AI Resume Parser", tech: ["Python", "OpenAI", "FastAPI"], originality: 94, deployed: true, github: true, teamVerified: true },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editLeetcode, setEditLeetcode] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");

  // Resume Upload States
  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Feedback States
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditBio(user.bio || "");
      setEditPhone(user.phone || "");
      setEditGithub(user.githubUsername || "");
      setEditLeetcode(user.leetcodeUsername || "");
      setEditLinkedin(user.linkedinUrl || "");
    }
  }, [user]);

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.patch("/users/me", {
        name: editName,
        bio: editBio,
        phone: editPhone,
        githubUsername: editGithub,
        leetcodeUsername: editLeetcode,
        linkedinUrl: editLinkedin,
      });
      updateUser(res.data.user);
      toast.success("Profile saved successfully! 💾");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
    setSavingProfile(false);
  };

  const handleResumeUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded successfully! 📂");
      
      // Auto analyze after upload
      toast.loading("AI scanner parsing resume context...", { id: "analyze" });
      const analyzeRes = await api.post("/resume/analyze");
      setAiFeedback(analyzeRes.data);
      toast.success("AI resume analysis complete! 🤖", { id: "analyze" });
    } catch (error: any) {
      toast.dismiss("analyze");
      toast.error(error?.response?.data?.message || "Failed to upload/analyze resume");
    }
    setUploadingResume(false);
  };

  const handleGetAIFeedback = async () => {
    setIsFeedbackOpen(true);
    setLoadingFeedback(true);
    try {
      const res = await api.get("/resume/me/feedback");
      setAiFeedback(res.data);
    } catch {
      // Trigger new analysis if feedback doesn't exist
      try {
        const res = await api.post("/resume/analyze");
        setAiFeedback(res.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load AI feedback");
      }
    }
    setLoadingFeedback(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.doc,.docx,.txt" 
        className="hidden" 
      />

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center hover:bg-violet-500 transition-all">
              <Camera size={12} className="text-white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-white">{user?.name}</h1>
              {/* Trust Badge */}
              <div className="flex items-center gap-1.5 bg-violet-500/20 border border-violet-500/40 px-3 py-1 rounded-full">
                <Shield size={12} className="text-violet-400" />
                <span className="text-xs text-violet-300 font-medium">Verified · 79</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-1">{user?.role?.replace(/_/g," ")} · Computer Science Engineering</p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><Code2 size={12} className="text-violet-400" />LeetCode: {user?.leetcodeUsername || "Not Connected"}</span>
              <span className="flex items-center gap-1.5"><GitBranch size={12} className="text-cyan-400" />GitHub: {user?.githubUsername || "Not Connected"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleResumeUploadClick}
              disabled={uploadingResume}
              className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white text-xs rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50"
            >
              {uploadingResume ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              Upload Resume
            </button>
            <button 
              onClick={handleGetAIFeedback}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg hover:bg-white/10 transition-all"
            >
              <Sparkles size={12} /> AI Feedback
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg hover:bg-white/10 transition-all"
            >
              <Edit3 size={12} /> Edit Profile
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm whitespace-nowrap rounded-lg transition-all ${activeTab === i ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {/* Overview */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: "Trust Score", value: "79 / 100", sub: "Verified", color: "violet" },
              { label: "Coding Score", value: user?.leetcodeUsername ? "Connected" : "Pending Connection", sub: "LeetCode", color: "cyan" },
              { label: "Career Health", value: "78 / 100", sub: "+6 this month", color: "orange" },
            ].map((m, i) => (
              <div key={i} className="glass-card rounded-xl p-5">
                <p className="text-xs text-gray-400">{m.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{m.value}</p>
                <p className="text-xs text-gray-500">{m.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeTab === 1 && (
          <div className="space-y-3">
            {skills.map((s, i) => (
              <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm text-white font-medium">{s.name}</span>
                    {s.verified && <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded">AI Verified</span>}
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.level}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-white w-10 text-right">{s.level}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p, i) => (
              <div key={i} className="glass-card rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                  <div className="relative w-12 h-12">
                    <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray={`${2*Math.PI*15*p.originality/100} ${2*Math.PI*15*(1-p.originality/100)}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-violet-400">{p.originality}%</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map(t => <span key={t} className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">{t}</span>)}
                </div>
                <div className="flex gap-2">
                  {p.deployed && <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded">✓ Deployed</span>}
                  {p.github && <span className="text-xs bg-violet-500/10 border border-violet-500/30 text-violet-400 px-2 py-1 rounded">✓ GitHub</span>}
                  {p.teamVerified && <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-1 rounded">✓ Team</span>}
                </div>
                <button className="w-full py-2 text-xs border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all">Verify Project</button>
              </div>
            ))}
          </div>
        )}

        {/* Verification - GitHub & LeetCode */}
        {activeTab === 5 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Code2 size={16} className="text-violet-400" /> LeetCode Analysis
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={dsaData} cx="50%" cy="50%">
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">GitHub Activity</h3>
              <div className="grid grid-cols-13 gap-1">
                {Array.from({length: 91}).map((_, i) => {
                  const intensity = Math.random();
                  return (
                    <div key={i} className={`w-3 h-3 rounded-sm ${intensity > 0.7 ? "bg-violet-500" : intensity > 0.4 ? "bg-violet-700" : intensity > 0.2 ? "bg-violet-900" : "bg-white/5"}`} />
                  );
                })}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-gray-400">Repositories</span><span className="text-white font-medium">23</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">Contributions (90d)</span><span className="text-white font-medium">523</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">Languages</span><span className="text-white font-medium">JS, Python, Go</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs */}
        {![0,1,2,5].includes(activeTab) && (
          <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3"><Award size={20} className="text-gray-400" /></div>
            <p className="text-gray-400 text-sm">{tabs[activeTab]} tab coming next</p>
          </div>
        )}
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#0d0d16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 size={16} className="text-violet-400" /> Edit Profile Details
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Name</label>
                    <input 
                      type="text"
                      required
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Phone Number</label>
                    <input 
                      type="text"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Bio / Overview</label>
                  <textarea 
                    rows={2}
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-violet-500/40 resize-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">GitHub Username</label>
                    <input 
                      type="text"
                      value={editGithub}
                      onChange={e => setEditGithub(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">LeetCode User</label>
                    <input 
                      type="text"
                      value={editLeetcode}
                      onChange={e => setEditLeetcode(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">LinkedIn URL</label>
                    <input 
                      type="text"
                      value={editLinkedin}
                      onChange={e => setEditLinkedin(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                >
                  {savingProfile ? <Loader2 size={12} className="animate-spin" /> : null}
                  {savingProfile ? "Saving Profile..." : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#0d0d16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-400" /> AI Resume Intelligence
                </h3>
                <button onClick={() => setIsFeedbackOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {loadingFeedback ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={24} className="animate-spin text-violet-400" />
                  <p className="text-xs text-gray-400">Loading AI scorecards...</p>
                </div>
              ) : aiFeedback ? (
                <div className="space-y-4 text-xs text-gray-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                      <span className="text-gray-400">Overall Score</span>
                      <p className="text-xl font-bold text-white mt-1">{aiFeedback.overallScore || 0}/100</p>
                    </div>
                    <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                      <span className="text-gray-400">Structure Rating</span>
                      <p className="text-xl font-bold text-violet-400 mt-1">{aiFeedback.structureScore || 0}/100</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Summary Analysis:</h4>
                    <p className="leading-relaxed text-gray-400">{aiFeedback.aiFeedback || "Your resume is fully synced! AI verification recommends strengthening system designs."}</p>
                  </div>

                  {aiFeedback.improvementTips && aiFeedback.improvementTips.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="font-semibold text-white">Key Action Items:</h4>
                      <div className="space-y-1">
                        {aiFeedback.improvementTips.map((tip: string, i: number) => (
                          <p key={i} className="text-gray-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block flex-shrink-0" />
                            {tip}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-6 text-center">No resume feedback available. Please upload a resume first!</p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
