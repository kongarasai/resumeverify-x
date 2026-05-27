"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Building2, Calendar, TrendingUp, ArrowRight, CheckCircle2, Loader2, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

const tabs = ["Career Plan", "Company Prep", "AI Schedule", "Salary Insights"];

const companies = [
  { name: "Google", color: "from-blue-500 to-green-500", level: "FAANG" },
  { name: "Amazon", color: "from-orange-500 to-yellow-500", level: "FAANG" },
  { name: "Microsoft", color: "from-blue-600 to-blue-400", level: "FAANG" },
  { name: "Infosys", color: "from-blue-700 to-blue-500", level: "Tier 1" },
  { name: "TCS", color: "from-blue-800 to-blue-600", level: "Tier 1" },
  { name: "Zoho", color: "from-red-500 to-orange-500", level: "Product" },
  { name: "Wipro", color: "from-purple-600 to-purple-400", level: "Tier 1" },
  { name: "Startup", color: "from-violet-500 to-cyan-500", level: "Startup" },
];

const salaryData = [
  { year: "2024", min: 4, max: 8 },
  { year: "2025", min: 6, max: 12 },
  { year: "2026", min: 9, max: 18 },
  { year: "2027", min: 14, max: 25 },
  { year: "2028", min: 20, max: 35 },
];

export default function CareerPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [careerPlan, setCareerPlan] = useState<any>(null);
  const [companyPlan, setCompanyPlan] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [freeTime, setFreeTime] = useState("6-9 PM");
  const [collegeTime, setCollegeTime] = useState("9 AM - 4 PM");
  const [trustScore, setTrustScore] = useState<any>(null);

  useEffect(() => {
    const loadTrust = async () => {
      if (user?.id) {
        try {
          const res = await api.get(`/trust-score/${user.id}`);
          setTrustScore(res.data);
        } catch {}
      }
    };
    loadTrust();
  }, [user]);

  const generateCareerPlan = async () => {
    setLoading(true);
    try {
      const weakSkills = trustScore?.weakAreas || ["DSA", "System Design"];
      const score = trustScore?.totalScore || 75;
      const res = await api.post("/ai/career-plan", {
        targetRole,
        targetCompany: selectedCompany || "Any",
        weakSkills,
        currentScore: score,
      });
      setCareerPlan(res.data);
      toast.success("AI Career Plan synthesized successfully! 🚀");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to generate AI plan";
      toast.error(msg);
    }
    setLoading(false);
  };

  const generateCompanyPlan = async (company: string) => {
    setSelectedCompany(company);
    setLoading(true);
    try {
      const currentSkills = user?.department ? ["Coding", user.department] : ["Data Structures", "Web Dev"];
      const res = await api.post("/ai/company-prep", {
        company,
        role: targetRole,
        currentSkills,
      });
      setCompanyPlan(res.data);
      toast.success(`AI Interview Preparation synthesized for ${company}! 🎯`);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to generate prep plan";
      toast.error(msg);
    }
    setLoading(false);
  };

  const generateSchedule = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/schedule", {
        freeTime,
        collegeTime,
        sleepTime: "11 PM - 6 AM",
        targetRole,
      });
      setSchedule(res.data);
      toast.success("AI Learning Schedule aligned! 📅");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to generate schedule";
      toast.error(msg);
    }
    setLoading(false);
  };

  const categoryColor: Record<string, string> = {
    CODING: "bg-blue-500/20 border-blue-500/40 text-blue-300",
    LEARNING: "bg-purple-500/20 border-purple-500/40 text-purple-300",
    INTERVIEW: "bg-orange-500/20 border-orange-500/40 text-orange-300",
    REVISION: "bg-green-500/20 border-green-500/40 text-green-300",
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Career Hub</h1>
        <p className="text-gray-400 text-sm mt-1">AI-powered career intelligence and planning</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/3 rounded-xl p-1 w-fit">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === i ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Career Plan */}
        {activeTab === 0 && (
          <motion.div key="career" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-48">
                  <label className="text-xs text-gray-400 mb-1 block">Target Role</label>
                  <input value={targetRole} onChange={e => setTargetRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-violet-500/50" />
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={generateCareerPlan} disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm rounded-lg hover:opacity-90 transition-all disabled:opacity-50">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  Generate AI Career Plan
                </motion.button>
              </div>

              {careerPlan && (
                <div className="space-y-3 mt-4">
                  <h3 className="text-sm font-semibold text-white">90-Day Roadmap</h3>
                  {careerPlan.roadmap?.map((week: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4 p-4 bg-white/3 rounded-xl border border-white/5">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">W{week.week}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white mb-2">{week.focus}</p>
                        <div className="space-y-1">
                          {week.tasks?.map((task: string, j: number) => (
                            <div key={j} className="flex items-center gap-2 text-xs text-gray-400">
                              <CheckCircle2 size={10} className="text-violet-400 flex-shrink-0" />
                              {task}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Company Prep */}
        {activeTab === 1 && (
          <motion.div key="company" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {companies.map(c => (
                <motion.button key={c.name} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => generateCompanyPlan(c.name)} className={`glass-card p-4 rounded-xl text-left border transition-all ${selectedCompany === c.name ? "border-violet-500/60" : "border-white/5 hover:border-white/15"}`}>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold mb-3`}>{c.name[0]}</div>
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.level}</p>
                </motion.button>
              ))}
            </div>
            {loading && <div className="flex justify-center py-8"><Loader2 className="animate-spin text-violet-400" size={24} /></div>}
            {companyPlan && (
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-3">Interview Process at {selectedCompany}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {companyPlan.interviewProcess?.map((step: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300">{step}</span>
                      {i < companyPlan.interviewProcess.length - 1 && <ArrowRight size={12} className="text-gray-600" />}
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-400 mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {companyPlan.keyTopics?.map((t: string, i: number) => (
                      <span key={i} className="text-xs bg-violet-500/10 border border-violet-500/30 text-violet-300 px-2 py-1 rounded">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* AI Schedule */}
        {activeTab === 2 && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Free Time (daily)</label>
                <input value={freeTime} onChange={e => setFreeTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">College Hours</label>
                <input value={collegeTime} onChange={e => setCollegeTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none" />
              </div>
              <div className="flex items-end">
                <motion.button whileTap={{ scale: 0.97 }} onClick={generateSchedule} disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Calendar size={14} />}
                  Generate AI Schedule
                </motion.button>
              </div>
            </div>
            {schedule && (
              <div className="space-y-3">
                {schedule.schedule?.map((day: any, i: number) => (
                  <div key={i} className="p-4 bg-white/3 rounded-xl border border-white/5">
                    <p className="text-sm font-medium text-white mb-2">{day.day}</p>
                    <div className="flex flex-wrap gap-2">
                      {day.slots?.map((slot: any, j: number) => (
                        <div key={j} className={`text-xs border rounded-lg px-3 py-1.5 ${categoryColor[slot.category] || "bg-white/5 border-white/10 text-gray-300"}`}>
                          <span className="font-medium">{slot.time}</span> — {slot.activity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Salary Insights */}
        {activeTab === 3 && (
          <motion.div key="salary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Salary Growth Projection (LPA)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={salaryData}>
                <defs>
                  <linearGradient id="gMax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="max" stroke="#6366f1" strokeWidth={2} fill="url(#gMax)" name="Max LPA" />
                <Area type="monotone" dataKey="min" stroke="#06b6d4" strokeWidth={2} fill="url(#gMin)" name="Min LPA" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
