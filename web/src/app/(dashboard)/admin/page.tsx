"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Server, Users, AlertTriangle, CheckCircle, 
  MapPin, Clock, ShieldAlert, Check, X, RefreshCw, Database, 
  Search, Terminal
} from "lucide-react";

interface FraudAlert {
  id: string;
  candidateName: string;
  avatar: string;
  riskType: string;
  score: number;
  description: string;
  time: string;
  status: "resolved" | "pending";
}

interface UniversityApproval {
  id: string;
  name: string;
  location: string;
  domain: string;
  domainVerified: boolean;
  dateApplied: string;
}

const mockFraudAlerts: FraudAlert[] = [
  { 
    id: "f1", candidateName: "Karan Dev", avatar: "KD", riskType: "GitHub Plagiarism", score: 87, 
    description: "Plagiarism analysis detected 87% codebase copy of repository 'distributed-redis-limiter' from public repo.",
    time: "15 mins ago", status: "pending" 
  },
  { 
    id: "f2", candidateName: "Amit Singh", avatar: "AS", riskType: "Resume Fabrication", score: 78, 
    description: "Extracted resume text contains fabricated experience claims. Listed work history does not align with corporate registers.",
    time: "2 hours ago", status: "pending" 
  },
  { 
    id: "f3", candidateName: "Rohan Patel", avatar: "RP", riskType: "Interview Proctoring Alert", score: 92, 
    description: "Sandbox proctoring flagged multiple human voices and browser tab switching during live DSA coding round.",
    time: "Yesterday", status: "resolved" 
  }
];

const mockApprovals: UniversityApproval[] = [
  { id: "u1", name: "University of Delhi (DU)", location: "New Delhi, India", domain: "du.ac.in", domainVerified: true, dateApplied: "May 25" },
  { id: "u2", name: "Anna University", location: "Chennai, India", domain: "annauniv.edu", domainVerified: false, dateApplied: "May 26" }
];

export default function AdminDashboardPage() {
  const [alerts, setAlerts] = useState<FraudAlert[]>(mockFraudAlerts);
  const [approvals, setApprovals] = useState<UniversityApproval[]>(mockApprovals);
  const [searchQuery, setSearchQuery] = useState("");

  const handleResolveAlert = (id: string) => {
    setAlerts(alerts.map(a => {
      if (a.id === id) return { ...a, status: "resolved" };
      return a;
    }));
  };

  const handleApproveUniversity = (id: string) => {
    setApprovals(approvals.filter(app => app.id !== id));
  };

  const stats = [
    { label: "Active Universities", value: "48", icon: Database, color: "text-violet-400" },
    { label: "Total Platform Users", value: "8,940", icon: Users, color: "text-cyan-400" },
    { label: "Daily Active (DAU)", value: "3,124", icon: Clock, color: "text-emerald-400" },
    { label: "Active Fraud Alerts", value: alerts.filter(a => a.status === "pending").length, icon: AlertTriangle, color: "text-red-400" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="text-red-400" />
            Super Admin Control Center™
          </h1>
          <p className="text-gray-400 text-sm">Monitor cluster metrics, audit live fraud signals, and authorize university workspaces</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 font-mono">
          <Server size={12} className="text-emerald-400 animate-pulse" /> Cluster: US-EAST-1 Active
        </div>
      </div>

      {/* Cluster Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="glass-card rounded-xl p-4 border border-white/5 bg-[#0d0d16]/30 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-black text-white mt-1">{s.value}</p>
            </div>
            <div className={`p-2 bg-white/5 border border-white/5 rounded-lg ${s.color}`}>
              <s.icon size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Administrative Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fraud alerts feed & Audit Logs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Live Fraud signal feed */}
          <div className="glass-card rounded-xl border border-white/5 bg-[#0d0d16]/20 p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert size={14} className="text-red-400" />
              Live Integrity & Plagiarism Feed
            </h2>
            <div className="space-y-3">
              {alerts.map((a) => {
                const isPending = a.status === "pending";
                return (
                  <div key={a.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isPending ? "bg-red-500/5 border-red-500/20" : "bg-white/3 border-white/5"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isPending ? "bg-red-500/20 text-red-400" : "bg-white/5 text-gray-400"
                      }`}>{a.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{a.candidateName}</h4>
                          <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.2 rounded border border-red-500/20 font-semibold">{a.riskType}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{a.description}</p>
                        <p className="text-[9px] text-gray-500 mt-1 flex items-center gap-1"><Clock size={10} /> Flagged {a.time}</p>
                      </div>
                    </div>
                    {isPending ? (
                      <button 
                        onClick={() => handleResolveAlert(a.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-500 transition-all flex-shrink-0 self-end sm:self-center"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex-shrink-0 self-end sm:self-center flex items-center gap-0.5">
                        <CheckCircle size={10} /> Resolved
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="glass-card rounded-xl border border-white/5 bg-[#0d0d16]/20 p-5 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Terminal size={14} className="text-cyan-400 font-mono" />
              Live Audit Trails & Shell Records
            </h3>
            <div className="font-mono text-[9px] text-gray-500 space-y-1 bg-black/40 border border-white/5 rounded-lg p-3 overflow-y-auto max-h-40">
              <p className="text-gray-400">[2026-05-27T08:50:12Z] INFO: Syncing Google API connections for JNTU Hyderabad ... OK</p>
              <p className="text-gray-400">[2026-05-27T08:51:45Z] SECURE: Rotated encryption keys for JWT auth token generation.</p>
              <p className="text-gray-400">[2026-05-27T08:53:01Z] AUDIT: Plagiarism analyzer completed scan on commit #f28da ... Plagiarism 0%</p>
              <p className="text-red-400">[2026-05-27T08:54:19Z] WARN: Proctoring module flagged suspicious browser tab switching for candidate KD.</p>
            </div>
          </div>
        </div>

        {/* University Approval queue: Right Sidebar */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl border border-white/5 bg-[#0d0d16]/20 p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Server size={14} className="text-violet-400" />
              University Approval Queue
            </h2>
            <div className="space-y-3">
              {approvals.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-xs">No pending university approvals.</div>
              ) : (
                approvals.map((app) => (
                  <div key={app.id} className="p-3.5 rounded-xl bg-white/3 border border-white/5 space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{app.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{app.location}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500">Domain: {app.domain}</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        app.domainVerified ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                      }`}>{app.domainVerified ? "DNS Checked ✓" : "DNS Pending"}</span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <button 
                        onClick={() => handleApproveUniversity(app.id)}
                        className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] transition-all flex items-center justify-center gap-0.5"
                      >
                        <Check size={10} /> Authorize Workspace
                      </button>
                      <button 
                        onClick={() => handleApproveUniversity(app.id)}
                        className="p-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/20 rounded transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
