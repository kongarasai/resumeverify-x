"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Shield, Zap, Target, Code2, Trophy, Calendar, ArrowUp, ArrowRight,
  Flame, Star, CheckCircle2, Clock, BookOpen, TrendingUp
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const weeklyData = [
  { day: "Mon", coding: 3, trust: 72, placement: 55 },
  { day: "Tue", coding: 5, trust: 73, placement: 57 },
  { day: "Wed", coding: 2, trust: 73, placement: 56 },
  { day: "Thu", coding: 7, trust: 75, placement: 60 },
  { day: "Fri", coding: 6, trust: 76, placement: 62 },
  { day: "Sat", coding: 8, trust: 78, placement: 65 },
  { day: "Sun", coding: 4, trust: 79, placement: 66 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function TrustScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 95 ? "#22c55e" : score >= 80 ? "#6366f1" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <motion.circle
          cx="80" cy="80" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-white"
        >
          {score}
        </motion.span>
        <span className="text-xs text-gray-400">Trust Score</span>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend, color }: {
  icon: any; label: string; value: string; trend: string; color: string;
}) {
  return (
    <motion.div variants={item} className="glass-card p-5 rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
        <span className="flex items-center gap-1 text-xs text-emerald-400">
          <ArrowUp size={10} /> {trend}
        </span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [trustScore, setTrustScore] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.id) {
          const [tsRes] = await Promise.all([
            api.get(`/trust-score/${user.id}`).catch(() => ({ data: null })),
          ]);
          setTrustScore(tsRes.data);

          // Fetch live daily AI missions dynamically
          const weakSkills = tsRes.data?.weakAreas || ["DSA", "System Design"];
          const missionsRes = await api.post("/ai/daily-missions", {
            weakSkills,
            streak: 3,
          }).catch(() => ({ data: [] }));

          setMissions(Array.isArray(missionsRes.data) ? missionsRes.data : []);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [user]);

  const score = trustScore?.totalScore ?? 79;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Good morning, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's your career intelligence dashboard</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Top Row: Trust Score + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Trust Score Card */}
          <motion.div variants={item} className="lg:col-span-1 glass-card rounded-xl p-6 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-violet-400" />
              <span className="text-sm font-medium text-gray-300">ResumeVerify Trust Score™</span>
            </div>
            <TrustScoreRing score={score} />
            <div className="mt-4 space-y-1">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${score >= 80 ? "bg-violet-500/20 text-violet-300" : "bg-yellow-500/20 text-yellow-300"}`}>
                {score >= 95 ? "Highly Trusted" : score >= 80 ? "Verified" : score >= 60 ? "Moderate" : "High Risk"}
              </span>
              <p className="text-xs text-gray-400 flex items-center gap-1 justify-center">
                <ArrowUp size={10} className="text-emerald-400" />
                <span className="text-emerald-400">+2.3</span> this week
              </p>
            </div>
            <div className="flex gap-2 mt-4 w-full">
              <button className="flex-1 text-xs py-1.5 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/40 transition-all border border-violet-500/30">
                Analyze
              </button>
              <button className="flex-1 text-xs py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-all border border-white/10">
                Improve
              </button>
            </div>
          </motion.div>

          {/* Metric Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard icon={Target} label="Placement Readiness" value="66%" trend="+4%" color="from-violet-600 to-violet-700" />
            <MetricCard icon={Flame} label="Career Health Score" value="78/100" trend="+6" color="from-orange-500 to-orange-600" />
            <MetricCard icon={Trophy} label="University Rank" value="#14" trend="↑3" color="from-amber-500 to-amber-600" />
          </div>
        </div>

        {/* Middle Row: Missions + Interviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Daily Missions */}
          <motion.div variants={item} className="lg:col-span-2 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-cyan-400" />
                <h2 className="text-sm font-semibold text-white">Daily AI Missions</h2>
              </div>
              <span className="text-xs text-gray-400">
                {missions.filter((m: any) => m.done).length}/{missions.length || 5} done
              </span>
            </div>
            {/* Progress */}
            <div className="w-full h-1.5 bg-white/5 rounded-full mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(missions.filter((m: any) => m.done).length / (missions.length || 5)) * 100}%`,
                }}
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
              />
            </div>
            <div className="space-y-3">
              {missions.length > 0 ? (
                missions.map((m: any, i: number) => {
                  const mIcon: Record<string, any> = {
                    CODING: Code2,
                    GITHUB: Star,
                    LEARNING: BookOpen,
                    INTERVIEW: Target,
                    PROJECT: TrendingUp,
                  };
                  const IconComponent = mIcon[m.type] || Target;
                  const isDone = m.done || false;

                  return (
                    <div
                      key={i}
                      onClick={async () => {
                        const updated = [...missions];
                        updated[i] = { ...updated[i], done: !isDone };
                        setMissions(updated);
                        if (!isDone) {
                          toast.success(`Completed! +${m.xp || 50} XP! 🌟`);
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5 ${
                        isDone ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-white/3 border border-white/5"
                      }`}
                    >
                      <div className={`p-1.5 rounded-md ${isDone ? "bg-emerald-500/20" : "bg-white/5"}`}>
                        {isDone ? <CheckCircle2 size={14} className="text-emerald-400" /> : <IconComponent size={14} className="text-gray-400" />}
                      </div>
                      <span className={`flex-1 text-sm ${isDone ? "text-gray-400 line-through" : "text-gray-200"}`}>
                        {m.title || m.description}
                      </span>
                      <span className={`text-xs font-medium ${isDone ? "text-emerald-400" : "text-yellow-400"}`}>
                        +{m.xp || 50} XP
                      </span>
                    </div>
                  );
                })
              ) : (
                [
                  { title: "Solve 2 LeetCode Medium problems", xp: 100, done: true, icon: Code2 },
                  { title: "Push code to GitHub (1 commit)", xp: 50, done: true, icon: Star },
                  { title: "Watch system design video (30 min)", xp: 75, done: false, icon: BookOpen },
                  { title: "Practice 10 aptitude questions", xp: 60, done: false, icon: Target },
                  { title: "Update resume with new project", xp: 120, done: false, icon: TrendingUp },
                ].map((m, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${m.done ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-white/3 border border-white/5"}`}>
                    <div className={`p-1.5 rounded-md ${m.done ? "bg-emerald-500/20" : "bg-white/5"}`}>
                      {m.done ? <CheckCircle2 size={14} className="text-emerald-400" /> : <m.icon size={14} className="text-gray-400" />}
                    </div>
                    <span className={`flex-1 text-sm ${m.done ? "text-gray-400 line-through" : "text-gray-200"}`}>{m.title}</span>
                    <span className={`text-xs font-medium ${m.done ? "text-emerald-400" : "text-yellow-400"}`}>{m.xp >= 0 ? `+${m.xp}` : m.xp} XP</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Upcoming */}
          <motion.div variants={item} className="glass-card rounded-xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Upcoming</h2>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { title: "Mock Interview – DSA", time: "Today, 3:00 PM", type: "INTERVIEW" },
                { title: "SQL Assignment Due", time: "Tomorrow, 11:59 PM", type: "ASSIGNMENT" },
                { title: "Placement Drive – TCS", time: "Fri, Jun 2", type: "PLACEMENT" },
              ].map((ev, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/3 border border-white/5">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-medium text-white">{ev.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      ev.type === "INTERVIEW" ? "bg-violet-500/20 text-violet-300" :
                      ev.type === "ASSIGNMENT" ? "bg-cyan-500/20 text-cyan-300" :
                      "bg-orange-500/20 text-orange-300"
                    }`}>{ev.type}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {ev.time}
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 text-xs text-violet-400 border border-violet-500/30 rounded-lg hover:bg-violet-500/10 transition-all flex items-center justify-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </motion.div>
        </div>

        {/* Bottom: Weekly Growth Chart */}
        <motion.div variants={item} className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Weekly Growth</h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> Trust Score</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Placement %</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gTrust" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPlacement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Area type="monotone" dataKey="trust" stroke="#6366f1" strokeWidth={2} fill="url(#gTrust)" dot={false} />
              <Area type="monotone" dataKey="placement" stroke="#06b6d4" strokeWidth={2} fill="url(#gPlacement)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </div>
  );
}
