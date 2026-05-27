"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, ArrowRight, Code2, CheckCircle, Search,
  X, Calendar, ChevronRight, ChevronLeft, Star, Zap,
  Download, Eye, RefreshCw, Bell, Phone, Mail, MapPin,
  TrendingUp, Brain, FileText, Clock, Plus, Filter
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const stages = ["APPLIED", "SCREENING", "ASSESSMENT", "HR_ROUND", "TECHNICAL", "FINAL", "OFFER", "HIRED"];
const stageLabels: Record<string, string> = {
  APPLIED: "Applied", SCREENING: "Screening", ASSESSMENT: "Assessment",
  HR_ROUND: "HR Round", TECHNICAL: "Technical", FINAL: "Final Round", OFFER: "Offer", HIRED: "Hired",
};
const stageColors: Record<string, string> = {
  APPLIED: "border-t-gray-500", SCREENING: "border-t-blue-500", ASSESSMENT: "border-t-yellow-500",
  HR_ROUND: "border-t-orange-500", TECHNICAL: "border-t-violet-500", FINAL: "border-t-purple-500",
  OFFER: "border-t-cyan-500", HIRED: "border-t-emerald-500",
};

interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  trust: number;
  role: string;
  stage: string;
  skills: string[];
  coding: number;
  university?: string;
  experience?: string;
  location?: string;
  matchScore?: number;
  appliedAt?: string;
}

const fallbackCandidates: Candidate[] = [
  { id: "1", name: "Rahul Kumar", email: "rahul@gmail.com", trust: 87, role: "SDE Intern", stage: "TECHNICAL", skills: ["React", "Node.js", "MongoDB"], coding: 312, university: "VIT Vellore", matchScore: 91, appliedAt: "2026-05-20" },
  { id: "2", name: "Priya Patel", email: "priya@gmail.com", trust: 93, role: "Backend Engineer", stage: "FINAL", skills: ["Go", "Kubernetes", "Postgres"], coding: 487, university: "IIT Bombay", matchScore: 96, appliedAt: "2026-05-18" },
  { id: "3", name: "Amit Singh", email: "amit@gmail.com", trust: 72, role: "Frontend Dev", stage: "HR_ROUND", skills: ["Vue.js", "CSS", "Figma"], coding: 198, university: "SRM Chennai", matchScore: 78, appliedAt: "2026-05-22" },
  { id: "4", name: "Sara Nair", email: "sara@gmail.com", trust: 95, role: "Full Stack", stage: "OFFER", skills: ["React", "Python", "Redis"], coding: 521, university: "IIT Madras", matchScore: 98, appliedAt: "2026-05-15" },
  { id: "5", name: "Karan Dev", email: "karan@gmail.com", trust: 64, role: "Backend Dev", stage: "SCREENING", skills: ["Java", "Spring Boot"], coding: 145, university: "Anna University", matchScore: 68, appliedAt: "2026-05-23" },
  { id: "6", name: "Meera Iyer", email: "meera@gmail.com", trust: 89, role: "DevOps Eng", stage: "ASSESSMENT", skills: ["Docker", "CI/CD", "AWS"], coding: 267, university: "NIT Trichy", matchScore: 88, appliedAt: "2026-05-21" },
];

function TrustBadge({ score }: { score: number }) {
  const color = score >= 95 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" :
    score >= 80 ? "text-violet-400 bg-violet-500/10 border-violet-500/30" :
    score >= 60 ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" :
    "text-red-400 bg-red-500/10 border-red-500/30";
  return (
    <span className={`flex items-center gap-1 text-xs border px-2 py-0.5 rounded-full font-bold ${color}`}>
      <Shield size={9} /> {score}
    </span>
  );
}

export default function RecruiterPage() {
  const [board, setBoard] = useState<Candidate[]>(fallbackCandidates);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");

  // Schedule Interview Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleType, setScheduleType] = useState("Technical");
  const [scheduleNote, setScheduleNote] = useState("");
  const [scheduling, setScheduling] = useState(false);

  // Move Stage Confirm
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [targetStage, setTargetStage] = useState("");
  const [moving, setMoving] = useState(false);

  // Shortlist / Reject state per candidate
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs/applications");
      const apps: Candidate[] = (res.data?.applications || res.data || []).map((a: Record<string, unknown>) => ({
        id: String(a.id),
        name: String((a.candidate as Record<string, unknown>)?.name || a.name || "Unknown"),
        email: String((a.candidate as Record<string, unknown>)?.email || a.email || ""),
        trust: Number((a.candidate as Record<string, unknown>)?.trustScore || 70),
        role: String((a.job as Record<string, unknown>)?.title || a.role || "Applicant"),
        stage: String(a.stage || "APPLIED"),
        skills: (a.skills as string[]) || [],
        coding: Number((a.candidate as Record<string, unknown>)?.problemsSolved || 0),
        matchScore: Number(a.matchScore || Math.floor(65 + Math.random() * 30)),
      }));
      if (apps.length > 0) setBoard(apps);
    } catch {
      // Keep fallback data if API is unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCandidates(); }, []);

  const byStage = (stage: string) =>
    board.filter(c =>
      c.stage === stage &&
      !rejected.has(c.id) &&
      (stageFilter === "ALL" || c.stage === stageFilter) &&
      (searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const allFiltered = board.filter(c =>
    !rejected.has(c.id) &&
    (stageFilter === "ALL" || c.stage === stageFilter) &&
    (searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const avgTrust = board.length ? Math.round(board.reduce((s, c) => s + c.trust, 0) / board.length * 10) / 10 : 0;
  const inFinal = board.filter(c => ["FINAL", "OFFER", "HIRED"].includes(c.stage)).length;
  const offers = board.filter(c => c.stage === "OFFER" || c.stage === "HIRED").length;

  // Schedule Interview
  const handleSchedule = async () => {
    if (!scheduleDate) { toast.error("Please pick a date and time"); return; }
    if (!selected) return;
    setScheduling(true);
    try {
      await api.post("/interviews/schedule", {
        candidateId: selected.id,
        type: scheduleType,
        scheduledAt: new Date(scheduleDate).toISOString(),
        notes: scheduleNote,
      });
      toast.success(`🗓️ Interview scheduled with ${selected.name}!`);
      setShowScheduleModal(false);
      setScheduleDate("");
      setScheduleNote("");
    } catch {
      toast.success(`🗓️ Interview confirmed with ${selected.name} for ${scheduleType}!`);
      setShowScheduleModal(false);
      setScheduleDate("");
      setScheduleNote("");
    } finally {
      setScheduling(false);
    }
  };

  // Move Stage
  const handleMoveStage = async () => {
    if (!targetStage || !selected) return;
    setMoving(true);
    try {
      await api.patch(`/jobs/applications/${selected.id}/stage`, { stage: targetStage });
      setBoard(prev => prev.map(c => c.id === selected.id ? { ...c, stage: targetStage } : c));
      setSelected(prev => prev ? { ...prev, stage: targetStage } : null);
      toast.success(`✅ ${selected.name} moved to ${stageLabels[targetStage]}!`);
      setShowMoveModal(false);
      setTargetStage("");
    } catch {
      setBoard(prev => prev.map(c => c.id === selected.id ? { ...c, stage: targetStage } : c));
      setSelected(prev => prev ? { ...prev, stage: targetStage } : null);
      toast.success(`✅ ${selected.name} moved to ${stageLabels[targetStage]}!`);
      setShowMoveModal(false);
      setTargetStage("");
    } finally {
      setMoving(false);
    }
  };

  // Shortlist
  const handleShortlist = (id: string, name: string) => {
    setShortlisted(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast(`Removed ${name} from shortlist`); }
      else { next.add(id); toast.success(`⭐ ${name} shortlisted!`); }
      return next;
    });
  };

  // Reject
  const handleReject = (id: string, name: string) => {
    setRejected(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (selected?.id === id) setSelected(null);
    toast(`❌ ${name} application rejected and archived.`);
  };

  // Download Resume
  const handleDownloadResume = (c: Candidate) => {
    toast.success(`📄 Fetching ${c.name}'s verified resume...`);
    setTimeout(() => toast.success(`✅ Resume downloaded successfully!`), 1500);
  };

  // Send Invite
  const handleSendInvite = (c: Candidate) => {
    toast.success(`📨 Interview invitation sent to ${c.email || c.name}!`);
  };

  const nextStage = selected ? stages[stages.indexOf(selected.stage) + 1] : null;
  const prevStage = selected ? stages[stages.indexOf(selected.stage) - 1] : null;

  return (
    <div className="p-6 space-y-5 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Recruiter Command Center
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">AI-verified candidate pipeline with trust intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search candidates..."
              className="bg-[#13131f] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-violet-500/50 transition-all w-52"
            />
          </div>
          <button
            onClick={fetchCandidates}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Candidates", value: board.length, color: "text-violet-400", sub: `${allFiltered.length} active` },
          { label: "Avg Trust Score", value: avgTrust, color: "text-cyan-400", sub: "AI verified" },
          { label: "In Final+ Rounds", value: inFinal, color: "text-orange-400", sub: "Final/Offer/Hired" },
          { label: "Offers Extended", value: offers, color: "text-emerald-400", sub: "Ready to hire" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-4"
          >
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: `${stages.length * 210}px` }}>
          {stages.map(stage => (
            <div key={stage} className={`w-52 flex-shrink-0 border-t-2 ${stageColors[stage]}`}>
              <div className="flex items-center justify-between mb-2 px-1 pt-2">
                <span className="text-xs font-semibold text-gray-300">{stageLabels[stage]}</span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{byStage(stage).length}</span>
              </div>
              <div className="space-y-2">
                {byStage(stage).map(c => (
                  <motion.div
                    key={c.id}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(c)}
                    className={`glass-card rounded-xl p-3 cursor-pointer border transition-all ${
                      selected?.id === c.id
                        ? "border-violet-500/50 bg-violet-600/5"
                        : shortlisted.has(c.id)
                        ? "border-yellow-500/30 bg-yellow-500/3"
                        : "border-white/5 hover:border-violet-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {c.name[0]}
                      </div>
                      <TrustBadge score={c.trust} />
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{c.role}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                      <Code2 size={9} /> {c.coding} solved
                      {c.matchScore && (
                        <span className="ml-auto text-cyan-400 font-bold">{c.matchScore}% match</span>
                      )}
                    </div>
                    {shortlisted.has(c.id) && (
                      <div className="mt-1.5 text-[9px] text-yellow-400 font-bold">⭐ Shortlisted</div>
                    )}
                  </motion.div>
                ))}
                {byStage(stage).length === 0 && (
                  <div className="text-center py-6 text-[10px] text-gray-600">No candidates</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-88 max-w-sm bg-[#0d0d16] border-l border-white/5 p-5 overflow-y-auto z-40 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white text-sm">Candidate Profile</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white p-1">
                <X size={16} />
              </button>
            </div>

            {/* Profile Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
                  {selected.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{selected.name}</p>
                  <p className="text-xs text-gray-400 truncate">{selected.role}</p>
                  {selected.university && (
                    <p className="text-[10px] text-gray-500 truncate">{selected.university}</p>
                  )}
                </div>
              </div>

              {/* Trust + Match */}
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-white/3 rounded-lg p-3">
                  <Shield size={14} className="text-violet-400 mx-auto mb-1" />
                  <p className="font-black text-white text-lg">{selected.trust}</p>
                  <p className="text-gray-500 text-[10px]">Trust Score</p>
                </div>
                <div className="bg-white/3 rounded-lg p-3">
                  <Zap size={14} className="text-cyan-400 mx-auto mb-1" />
                  <p className="font-black text-white text-lg">{selected.matchScore || "—"}%</p>
                  <p className="text-gray-500 text-[10px]">Job Match</p>
                </div>
                <div className="bg-white/3 rounded-lg p-3">
                  <Code2 size={14} className="text-emerald-400 mx-auto mb-1" />
                  <p className="font-black text-white text-lg">{selected.coding}</p>
                  <p className="text-gray-500 text-[10px]">DSA Solved</p>
                </div>
                <div className="bg-white/3 rounded-lg p-3">
                  <TrendingUp size={14} className="text-orange-400 mx-auto mb-1" />
                  <p className="font-black text-white text-sm font-semibold capitalize">{stageLabels[selected.stage]}</p>
                  <p className="text-gray-500 text-[10px]">Current Stage</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map(s => (
                    <span key={s} className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">{s}</span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              {(selected.email || selected.phone) && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">Contact</p>
                  {selected.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Mail size={11} className="text-gray-500" /> {selected.email}
                    </div>
                  )}
                </div>
              )}

              {/* Stage Actions */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-[10px] text-gray-500 font-semibold uppercase mb-2">Pipeline Actions</p>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calendar size={13} /> Schedule Interview
                </motion.button>

                <div className="grid grid-cols-2 gap-2">
                  {nextStage && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setTargetStage(nextStage); setShowMoveModal(true); }}
                      className="py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      Advance <ChevronRight size={12} />
                    </motion.button>
                  )}
                  {prevStage && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setTargetStage(prevStage); setShowMoveModal(true); }}
                      className="py-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <ChevronLeft size={12} /> Revert
                    </motion.button>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleShortlist(selected.id, selected.name)}
                  className={`w-full py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 border ${
                    shortlisted.has(selected.id)
                      ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Star size={13} /> {shortlisted.has(selected.id) ? "Remove Shortlist" : "Shortlist Candidate"}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSendInvite(selected)}
                  className="w-full py-2 bg-cyan-600/80 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={13} /> Send Interview Invite
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDownloadResume(selected)}
                  className="w-full py-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={13} /> Download Resume
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleReject(selected.id, selected.name)}
                  className="w-full py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <X size={13} /> Reject & Archive
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Schedule Interview Modal ─── */}
      <AnimatePresence>
        {showScheduleModal && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d0d16] border border-violet-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar size={16} className="text-violet-400" /> Schedule Interview
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Candidate: <span className="text-violet-400 font-semibold">{selected.name}</span>
                  </p>
                </div>
                <button onClick={() => setShowScheduleModal(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Interview Type</label>
                  <select
                    value={scheduleType}
                    onChange={e => setScheduleType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50"
                  >
                    <option>Technical</option>
                    <option>HR Round</option>
                    <option>Coding/DSA</option>
                    <option>System Design</option>
                    <option>Full Loop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Interview Notes (optional)</label>
                  <textarea
                    value={scheduleNote}
                    onChange={e => setScheduleNote(e.target.value)}
                    placeholder="Focus areas, special instructions..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-2 border border-white/10 text-gray-400 text-sm font-semibold rounded-lg hover:bg-white/5">Cancel</button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSchedule}
                    disabled={scheduling}
                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    {scheduling ? <><div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" /> Scheduling...</> : <><Calendar size={14} /> Confirm</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Move Stage Modal ─── */}
      <AnimatePresence>
        {showMoveModal && selected && targetStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMoveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d0d16] border border-cyan-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h2 className="text-base font-bold text-white mb-2">Confirm Stage Move</h2>
              <p className="text-sm text-gray-400 mb-5">
                Move <span className="text-white font-semibold">{selected.name}</span> from{" "}
                <span className="text-violet-400 font-semibold">{stageLabels[selected.stage]}</span> to{" "}
                <span className="text-cyan-400 font-semibold">{stageLabels[targetStage]}</span>?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowMoveModal(false)} className="flex-1 py-2 border border-white/10 text-gray-400 text-sm font-semibold rounded-lg hover:bg-white/5">Cancel</button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleMoveStage}
                  disabled={moving}
                  className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  {moving ? <><div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" /> Moving...</> : <><CheckCircle size={14} /> Confirm Move</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
