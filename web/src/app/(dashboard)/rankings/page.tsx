"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Shield, Code2, Users, Star, ArrowUpCircle, Sparkles, 
  Search, Award, CheckCircle, ChevronRight, GraduationCap
} from "lucide-react";

interface RankingItem {
  rank: number;
  name: string;
  avatar: string;
  trustScore: number;
  codingXP: number;
  problemsSolved: number;
  placementReadiness: number;
  university: string;
  department: string;
  badges: string[];
}

const mockRankings: RankingItem[] = [
  {
    rank: 1,
    name: "Sara Nair",
    avatar: "SN",
    trustScore: 98,
    codingXP: 4850,
    problemsSolved: 512,
    placementReadiness: 96,
    university: "JNTU Hyderabad",
    department: "Computer Science",
    badges: ["DSA Master", "Top Trusted", "100% Genuine"]
  },
  {
    rank: 2,
    name: "Priya Patel",
    avatar: "PP",
    trustScore: 96,
    codingXP: 4520,
    problemsSolved: 487,
    placementReadiness: 94,
    university: "BITS Pilani",
    department: "Information Technology",
    badges: ["Backend Guru", "Highly Endorsed"]
  },
  {
    rank: 3,
    name: "Arjun Prasanna",
    avatar: "AP",
    trustScore: 95,
    codingXP: 4410,
    problemsSolved: 472,
    placementReadiness: 93,
    university: "JNTU Hyderabad",
    department: "Computer Science",
    badges: ["Full Stack Lead", "Hackathon Champ"]
  },
  {
    rank: 4,
    name: "Rahul Verma",
    avatar: "RV",
    trustScore: 92,
    codingXP: 3820,
    problemsSolved: 398,
    placementReadiness: 88,
    university: "JNTU Hyderabad",
    department: "Computer Science",
    badges: ["React Architect"]
  },
  {
    rank: 5,
    name: "Neha Roy",
    avatar: "NR",
    trustScore: 91,
    codingXP: 3740,
    problemsSolved: 385,
    placementReadiness: 87,
    university: "BITS Pilani",
    department: "Computer Science",
    badges: ["AI Specialist"]
  },
  {
    rank: 6,
    name: "Divya Teja",
    avatar: "DT",
    trustScore: 89,
    codingXP: 3510,
    problemsSolved: 342,
    placementReadiness: 85,
    university: "JNTU Hyderabad",
    department: "Information Technology",
    badges: ["DevOps Pro"]
  },
  {
    rank: 7,
    name: "Kunal Shah",
    avatar: "KS",
    trustScore: 88,
    codingXP: 3420,
    problemsSolved: 330,
    placementReadiness: 84,
    university: "COEP Pune",
    department: "Computer Science",
    badges: ["Rust Systems"]
  }
];

const universityStats = [
  { rank: 1, name: "JNTU Hyderabad", avgTrust: 86.4, activeUsers: 842, score: 9420, logo: "JH" },
  { rank: 2, name: "BITS Pilani", avgTrust: 85.2, activeUsers: 620, score: 8950, logo: "BP" },
  { rank: 3, name: "COEP Pune", avgTrust: 82.8, activeUsers: 450, score: 7890, logo: "CP" },
  { rank: 4, name: "IIT Madras", avgTrust: 82.1, activeUsers: 380, score: 7120, logo: "IM" }
];

export default function RankingsPage() {
  const [activeLeaderboard, setActiveLeaderboard] = useState<"Students" | "Universities" | "Departments">("Students");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");

  const filteredRankings = mockRankings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.university.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === "All" || item.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            Global Leaderboards
          </h1>
          <p className="text-gray-400 text-sm">Real-time placement rankings, verified DSA benchmarks, and university performance leagues</p>
        </div>
        <div className="flex gap-2">
          {(["Students", "Universities", "Departments"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveLeaderboard(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                activeLeaderboard === tab
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-violet-500/30"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            placeholder="Search candidates or colleges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13131f] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
        {activeLeaderboard === "Students" && (
          <div className="flex gap-2 self-end sm:self-center">
            {["All", "Computer Science", "Information Technology"].map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDeptFilter(dept)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  selectedDeptFilter === dept
                    ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                    : "bg-transparent border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Leaderboards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Board: Left 2 Columns */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {/* STUDENTS LEADERBOARD */}
            {activeLeaderboard === "Students" && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {filteredRankings.map((c, i) => {
                  const isTop3 = c.rank <= 3;
                  const glowColor = c.rank === 1 ? "border-yellow-500/40 shadow-yellow-500/5" :
                                    c.rank === 2 ? "border-slate-400/40 shadow-slate-400/5" :
                                    "border-amber-600/40 shadow-amber-600/5";
                  return (
                    <motion.div
                      key={c.name}
                      whileHover={{ scale: 1.01 }}
                      className={`glass-card rounded-xl p-4 border flex items-center justify-between gap-4 transition-all relative overflow-hidden ${
                        isTop3 ? `border-2 bg-gradient-to-r from-white/3 to-white/5 shadow-md ${glowColor}` : "border-white/5"
                      }`}
                    >
                      {/* Left: Rank & Avatar */}
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-center flex justify-center items-center">
                          {c.rank === 1 ? <Award size={20} className="text-yellow-400" /> :
                           c.rank === 2 ? <Award size={20} className="text-slate-400" /> :
                           c.rank === 3 ? <Award size={20} className="text-amber-600" /> :
                           <span className="text-xs font-semibold text-gray-500">#{c.rank}</span>}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm">
                          {c.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-white">{c.name}</h3>
                            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.2 rounded-full border border-indigo-500/20 font-bold flex items-center gap-0.5">
                              <Shield size={8} /> {c.trustScore}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">{c.department} • {c.university}</p>
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {c.badges.map(b => (
                              <span key={b} className="text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.2 rounded border border-white/5 font-medium">{b}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Metrics */}
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] text-gray-500">Coding Solved</p>
                          <p className="text-xs font-bold text-white mt-0.5 flex items-center justify-end gap-1">
                            <Code2 size={12} className="text-cyan-400" /> {c.problemsSolved}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-500">Placement %</p>
                          <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                              <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500" style={{ width: `${c.placementReadiness}%` }} />
                            </div>
                            <span className="text-xs font-bold text-cyan-400">{c.placementReadiness}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* UNIVERSITIES LEADERBOARD */}
            {activeLeaderboard === "Universities" && (
              <motion.div
                key="universities"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {universityStats.map((u) => (
                  <div key={u.name} className="glass-card rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-center text-xs font-semibold text-gray-400">#{u.rank}</span>
                      <div className="w-10 h-10 rounded-xl bg-[#131327]/60 border border-white/10 flex items-center justify-center text-white font-bold text-xs">{u.logo}</div>
                      <div>
                        <h3 className="text-xs font-bold text-white">{u.name}</h3>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <GraduationCap size={12} className="text-violet-400" /> {u.activeUsers} students active on platform
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500">Avg Trust Score</p>
                        <p className="text-xs font-bold text-violet-400 mt-0.5 flex items-center justify-end gap-1">
                          <Shield size={12} /> {u.avgTrust}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500">League Score</p>
                        <p className="text-xs font-black text-cyan-400 mt-0.5">{u.score} pts</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* DEPARTMENTS LEADERBOARD */}
            {activeLeaderboard === "Departments" && (
              <motion.div
                key="departments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {[
                  { rank: 1, name: "Computer Science & Eng (CSE)", avgPlacement: "92.4%", avgTrust: 85.6, active: 432 },
                  { rank: 2, name: "Information Technology (IT)", avgPlacement: "88.2%", avgTrust: 82.4, active: 310 },
                  { rank: 3, name: "Electronics & Comm (ECE)", avgPlacement: "81.5%", avgTrust: 79.2, active: 254 },
                  { rank: 4, name: "Mechanical Engineering (ME)", avgPlacement: "74.8%", avgTrust: 72.1, active: 112 }
                ].map((d) => (
                  <div key={d.name} className="glass-card rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-center text-xs font-semibold text-gray-400">#{d.rank}</span>
                      <div>
                        <h3 className="text-xs font-bold text-white">{d.name}</h3>
                        <p className="text-[10px] text-gray-400 mt-1">{d.active} candidates registered</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500">Avg Placement</p>
                        <p className="text-xs font-bold text-cyan-400 mt-0.5">{d.avgPlacement}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500">Avg Trust</p>
                        <p className="text-xs font-bold text-violet-400 mt-0.5 flex items-center justify-end gap-1">
                          <Shield size={12} /> {d.avgTrust}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Panel: Top Performers & Stats */}
        <div className="space-y-5">
          {/* Platform Champions Hero */}
          <div className="glass-card rounded-xl p-5 border border-violet-500/20 bg-gradient-to-b from-[#131327]/60 to-[#0a0a0f] space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400" />
              Platform Champions
            </h2>
            <div className="p-4 rounded-xl bg-violet-600/10 border border-violet-500/30 text-center relative overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 mx-auto flex items-center justify-center text-white text-base font-black border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/20">
                SN
              </div>
              <h3 className="text-xs font-bold text-white mt-3">Sara Nair</h3>
              <p className="text-[10px] text-gray-400">JNTU CSE • #1 Developer League</p>
              <div className="flex items-center justify-center gap-1.5 mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-0.5 w-max mx-auto text-yellow-400 text-[10px] font-bold">
                🔥 32 Days Coding Streak
              </div>
              <p className="text-[10px] text-gray-500 mt-3">Verified trust index: 9.8 / 10. Direct placement eligible for Tier-1 companies.</p>
            </div>
          </div>

          {/* Leaderboard stats summary */}
          <div className="glass-card rounded-xl p-5 border border-white/5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users size={14} className="text-cyan-400" />
              Leaderboard Stats
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2 rounded bg-white/3">
                <span className="text-gray-400">Platform Active</span>
                <span className="text-white font-bold">2,292 Candidates</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/3">
                <span className="text-gray-400">Avg Platform Trust</span>
                <span className="text-violet-400 font-bold">81.6%</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/3">
                <span className="text-gray-400">Verified Portfolios</span>
                <span className="text-cyan-400 font-bold">1,824 Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
