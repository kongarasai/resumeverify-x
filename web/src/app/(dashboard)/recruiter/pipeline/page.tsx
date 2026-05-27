"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, User, Code2, Users, ArrowRight, Star, CheckCircle, 
  MapPin, Clock, FileText, Send, Plus, Filter, KanbanSquare
} from "lucide-react";

const stages = ["APPLIED", "SCREENING", "ASSESSMENT", "HR_ROUND", "TECHNICAL", "FINAL", "OFFER", "HIRED"];

const stageLabels: Record<string, string> = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  ASSESSMENT: "Assessment",
  HR_ROUND: "HR Round",
  TECHNICAL: "Technical",
  FINAL: "Final Round",
  OFFER: "Offer",
  HIRED: "Hired",
};

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  trustScore: number;
  role: string;
  stage: string;
  skills: string[];
  codingSolved: number;
  experience: string;
  education: string;
  notes: string[];
}

const mockCandidates: Candidate[] = [
  { 
    id: "1", name: "Rahul Kumar", avatar: "RK", trustScore: 87, role: "SDE I", stage: "TECHNICAL", 
    skills: ["React", "Node.js", "TypeScript"], codingSolved: 312, experience: "Fresher (JNTU)", 
    education: "B.Tech CSE, JNTU Hyderabad", notes: ["Strong grasp of React hooks", "Solved both coding problems in 40 mins"] 
  },
  { 
    id: "2", name: "Priya Patel", avatar: "PP", trustScore: 93, role: "Backend Eng", stage: "FINAL", 
    skills: ["Go", "K8s", "PostgreSQL"], codingSolved: 487, experience: "1 Year Intern", 
    education: "B.Tech IT, BITS Pilani", notes: ["Outstanding database knowledge", "Verified Go systems project"] 
  },
  { 
    id: "3", name: "Amit Singh", avatar: "AS", trustScore: 72, role: "Frontend UI", stage: "HR_ROUND", 
    skills: ["Vue.js", "CSS", "Tailwind"], codingSolved: 198, experience: "Fresher", 
    education: "B.E. CSE, COEP Pune", notes: ["Excellent layout skills", "Needs brush up on JS fundamentals"] 
  },
  { 
    id: "4", name: "Sara Nair", avatar: "SN", trustScore: 95, role: "Full Stack SDE", stage: "OFFER", 
    skills: ["React", "Python", "Go"], codingSolved: 521, experience: "Fresher", 
    education: "B.Tech CSE, JNTU Hyderabad", notes: ["AI model correctly flagged 0% plagiarism in GitHub repo", "Excellent communication index"] 
  },
  { 
    id: "5", name: "Karan Dev", avatar: "KD", trustScore: 64, role: "Backend Eng", stage: "SCREENING", 
    skills: ["Java", "Spring Boot", "MySQL"], codingSolved: 145, experience: "Fresher", 
    education: "B.Tech CSE, COEP Pune", notes: ["Average resume score", "Low coding streak consistency"] 
  }
];

function TrustBadge({ score }: { score: number }) {
  const color = score >= 95 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" :
    score >= 80 ? "text-violet-400 bg-violet-500/10 border-violet-500/30" :
    score >= 60 ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" :
    "text-red-400 bg-red-500/10 border-red-500/30";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] border px-2 py-0.5 rounded-full font-bold ${color}`}>
      <Shield size={10} /> {score}
    </span>
  );
}

export default function RecruiterPipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState("");

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  const handleMoveStage = (id: string, newStage: string) => {
    setCandidates(candidates.map(c => {
      if (c.id === id) {
        return { ...c, stage: newStage };
      }
      return c;
    }));
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedCandidateId) return;
    setCandidates(candidates.map(c => {
      if (c.id === selectedCandidateId) {
        return {
          ...c,
          notes: [...c.notes, newNoteText]
        };
      }
      return c;
    }));
    setNewNoteText("");
  };

  const getCandidatesByStage = (stage: string) => {
    return candidates.filter(c => c.stage === stage);
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <KanbanSquare className="text-violet-400" />
            Recruitment Pipelines™
          </h1>
          <p className="text-gray-400 text-sm">Interactive Kanban screening boards backed by live AI plagiarism and trust audits</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1">
            <Filter size={12} /> Filter Pipeline
          </button>
          <button className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-all">
            + Add Candidate
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-4 flex gap-4 select-none">
        {stages.map(stage => {
          const list = getCandidatesByStage(stage);
          return (
            <div key={stage} className="w-64 flex-shrink-0 flex flex-col h-full bg-[#0d0d16]/30 border border-white/5 rounded-xl p-3">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1 flex-shrink-0">
                <span className="text-xs font-bold text-white">{stageLabels[stage]}</span>
                <span className="text-[10px] bg-white/10 text-gray-400 font-bold px-2 py-0.5 rounded-full">{list.length}</span>
              </div>

              {/* Cards list */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                {list.length === 0 ? (
                  <div className="h-20 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-[10px] text-gray-600">
                    Empty Stage
                  </div>
                ) : (
                  list.map(c => (
                    <motion.div
                      key={c.id}
                      layoutId={`candidate-${c.id}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCandidateId(c.id)}
                      className={`glass-card rounded-xl p-3 border cursor-pointer hover:border-violet-500/40 transition-all ${
                        selectedCandidateId === c.id ? "border-violet-500 bg-violet-500/5 shadow-lg shadow-violet-500/5" : "border-white/5"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-black">
                          {c.avatar}
                        </div>
                        <TrustBadge score={c.trustScore} />
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                      <p className="text-[10px] text-gray-400">{c.role} • {c.experience}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {c.skills.slice(0, 2).map(s => (
                          <span key={s} className="text-[9px] bg-white/5 border border-white/5 text-gray-500 px-1.5 py-0.2 rounded font-medium">{s}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 mt-3 pt-2 text-[9px] text-gray-500">
                        <span className="flex items-center gap-0.5"><Code2 size={10} /> {c.codingSolved} Solved</span>
                        <span className="flex items-center gap-0.5"><Clock size={10} /> Sync 2h ago</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side Slide-in Candidate Detail Workspace */}
      <AnimatePresence>
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-y-0 right-0 w-96 bg-[#0d0d16] border-l border-white/10 shadow-2xl p-6 overflow-y-auto z-40 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="font-bold text-white text-sm">Review Candidate Profile</h2>
              <button 
                onClick={() => setSelectedCandidateId(null)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ×
              </button>
            </div>

            {/* Profile Overview */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-lg font-black">
                  {selectedCandidate.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedCandidate.name}</h3>
                  <p className="text-xs text-gray-400">{selectedCandidate.role}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#131327]/60 border border-violet-500/20">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">AI TRUST INDEX</span>
                <TrustBadge score={selectedCandidate.trustScore} />
              </div>

              {/* Core Specs */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded bg-white/3">
                  <span className="text-gray-400">Education</span>
                  <span className="text-white font-medium text-right">{selectedCandidate.education}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/3">
                  <span className="text-gray-400">DSA Portfolio</span>
                  <span className="text-white font-medium">{selectedCandidate.codingSolved} Solved Tasks</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/3">
                  <span className="text-gray-400">Originality Rating</span>
                  <span className="text-emerald-400 font-bold">100% Plagiarism Safe</span>
                </div>
              </div>

              {/* Stage Transition Control */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Move Stage Pipeline</label>
                <select
                  value={selectedCandidate.stage}
                  onChange={e => handleMoveStage(selectedCandidate.id, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 outline-none focus:border-violet-500/40"
                >
                  {stages.map(st => (
                    <option key={st} value={st}>{stageLabels[st]}</option>
                  ))}
                </select>
              </div>

              {/* Candidate Notes section */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <FileText size={12} className="text-violet-400" /> Interviewer Logs
                </h4>
                
                <div className="space-y-2">
                  {selectedCandidate.notes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-white/3 border border-white/5 text-[10px] text-gray-300 leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    placeholder="Log recruiter feedback / interview score..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none"
                  />
                  <button 
                    onClick={handleAddNote}
                    className="p-1.5 rounded bg-violet-600 text-white hover:bg-violet-500 transition-all flex items-center justify-center"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>

              {/* Recruitment Action Buttons */}
              <div className="space-y-2 pt-4">
                <button className="w-full py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-violet-500/10 transition-all flex items-center justify-center gap-1.5">
                  <CheckCircle size={14} /> Schedule Technical Round
                </button>
                <button className="w-full py-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold rounded-lg hover:bg-white/10 transition-all">
                  Extend Official Offer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
