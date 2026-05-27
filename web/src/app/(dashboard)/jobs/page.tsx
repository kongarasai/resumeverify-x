"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Bookmark, Bell, Calendar, Search, MapPin, DollarSign, Zap, Clock, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

const tabs = ["Recommended", "Applied", "Saved", "Recruiter Invites", "Interview Schedule"];

const jobs = [
  { id: "1", title: "Software Engineer II", company: "Google", location: "Bangalore", type: "Full-Time", salary: "₹18–28 LPA", match: 94, tech: ["Go", "Python", "Kubernetes"], posted: "2 days ago" },
  { id: "2", title: "Frontend Developer", company: "Zoho", location: "Chennai", type: "Full-Time", salary: "₹8–14 LPA", match: 88, tech: ["React", "TypeScript", "CSS"], posted: "1 day ago" },
  { id: "3", title: "Backend Engineer", company: "Razorpay", location: "Remote", type: "Full-Time", salary: "₹15–22 LPA", match: 82, tech: ["Node.js", "PostgreSQL", "Redis"], posted: "3 days ago" },
  { id: "4", title: "SDE Intern", company: "Amazon", location: "Hyderabad", type: "Internship", salary: "₹70K/month", match: 76, tech: ["Java", "AWS", "Spring"], posted: "5 days ago" },
];

const appliedJobs = [
  { id: "1", title: "React Developer", company: "Infosys", stage: "Technical Round", date: "Applied May 20", icon: "IF" },
  { id: "2", title: "Associate Engineer", company: "TCS", stage: "HR Round", date: "Applied May 15", icon: "TC" },
];

const stageColor: Record<string, string> = {
  "Applied": "bg-blue-500/20 text-blue-300",
  "Screening": "bg-yellow-500/20 text-yellow-300",
  "Technical Round": "bg-violet-500/20 text-violet-300",
  "HR Round": "bg-orange-500/20 text-orange-300",
  "Offer": "bg-emerald-500/20 text-emerald-300",
};

function JobCard({ job }: { job: typeof jobs[0] }) {
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuthStore();

  const handleApply = async () => {
    try {
      await api.post(`/jobs/${job.id}/apply`);
    } catch {}
    setApplied(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card rounded-xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            {job.company[0]}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{job.title}</h3>
            <p className="text-xs text-gray-400">{job.company}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${job.match >= 90 ? "bg-emerald-500/20 text-emerald-300" : job.match >= 80 ? "bg-violet-500/20 text-violet-300" : "bg-yellow-500/20 text-yellow-300"}`}>
          {job.match}% Match
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
        <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
        <span className="flex items-center gap-1"><DollarSign size={11} /> {job.salary}</span>
        <span className="flex items-center gap-1"><Clock size={11} /> {job.posted}</span>
        <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">{job.type}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.tech.map(t => (
          <span key={t} className="text-xs bg-violet-500/10 border border-violet-500/30 text-violet-300 px-2 py-0.5 rounded">{t}</span>
        ))}
      </div>

      <div className="flex gap-2 pt-1 border-t border-white/5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleApply}
          disabled={applied}
          className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all ${applied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:opacity-90"}`}
        >
          {applied ? <><CheckCircle size={12} className="inline mr-1" />Applied</> : "Apply Now"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSaved(!saved)}
          className={`p-2 rounded-lg border transition-all ${saved ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400" : "border-white/10 bg-white/5 text-gray-400 hover:text-white"}`}
        >
          <Bookmark size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Jobs</h1>
          <p className="text-gray-400 text-sm">AI-matched opportunities based on your trust score</p>
        </div>
        <div className="sm:ml-auto relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 outline-none focus:border-violet-500/50 w-64" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm whitespace-nowrap rounded-lg transition-all ${activeTab === i ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </motion.div>
        )}
        {activeTab === 1 && (
          <motion.div key="applied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {appliedJobs.map(j => (
              <div key={j.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">{j.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{j.title}</p>
                  <p className="text-xs text-gray-400">{j.company} · {j.date}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${stageColor[j.stage] || "bg-white/10 text-gray-300"}`}>{j.stage}</span>
              </div>
            ))}
          </motion.div>
        )}
        {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              {activeTab === 2 && <Bookmark size={24} className="text-gray-400" />}
              {activeTab === 3 && <Bell size={24} className="text-gray-400" />}
              {activeTab === 4 && <Calendar size={24} className="text-gray-400" />}
            </div>
            <p className="text-gray-400 text-sm">{tabs[activeTab]} is empty</p>
            <p className="text-gray-600 text-xs mt-1">Items will appear here as you use the platform</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
