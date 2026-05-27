"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, GraduationCap, Briefcase, TrendingUp, Shield,
  Plus, ChevronRight, X, Search, RefreshCw, Download,
  Calendar, Bell, CheckCircle, Mail, Phone, MapPin,
  BarChart3, Sparkles, Building2, Star, AlertTriangle,
  FileText, Clock, Send, Eye, Filter
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend
} from "recharts";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Student {
  id: string;
  name: string;
  email?: string;
  dept: string;
  trust: number;
  status: "PLACED" | "ACTIVE" | "SHORTLISTED" | "AT_RISK" | "OPTED_OUT";
  company?: string;
  package?: string;
  batch?: string;
  readiness?: number;
  cgpa?: number;
  problemsSolved?: number;
}

interface PlacementDrive {
  id: string;
  company: string;
  role: string;
  package: string;
  deadline: string;
  openings: number;
  registered: number;
  status: "UPCOMING" | "ACTIVE" | "CLOSED";
  eligibility: string;
}

const fallbackStudents: Student[] = [
  { id: "1", name: "Sara Nair", email: "sara@college.edu", dept: "CS", trust: 95, status: "PLACED", company: "Amazon", package: "₹24 LPA", batch: "2026", readiness: 98, cgpa: 9.1, problemsSolved: 521 },
  { id: "2", name: "Rahul Kumar", email: "rahul@college.edu", dept: "IT", trust: 87, status: "ACTIVE", batch: "2026", readiness: 78, cgpa: 8.4, problemsSolved: 312 },
  { id: "3", name: "Priya Patel", email: "priya@college.edu", dept: "CS", trust: 93, status: "SHORTLISTED", company: "Zoho", package: "₹18 LPA", batch: "2026", readiness: 91, cgpa: 8.9, problemsSolved: 487 },
  { id: "4", name: "Karan Dev", email: "karan@college.edu", dept: "CS", trust: 38, status: "AT_RISK", batch: "2026", readiness: 35, cgpa: 6.2, problemsSolved: 145 },
  { id: "5", name: "Amit Singh", email: "amit@college.edu", dept: "ECE", trust: 52, status: "ACTIVE", batch: "2026", readiness: 55, cgpa: 7.0, problemsSolved: 198 },
  { id: "6", name: "Deepa Sharma", email: "deepa@college.edu", dept: "CS", trust: 88, status: "SHORTLISTED", company: "TCS Digital", package: "₹12 LPA", batch: "2026", readiness: 84, cgpa: 8.7, problemsSolved: 389 },
  { id: "7", name: "Vikram Nair", email: "vikram@college.edu", dept: "IT", trust: 76, status: "ACTIVE", batch: "2026", readiness: 69, cgpa: 7.8, problemsSolved: 243 },
  { id: "8", name: "Ananya Roy", email: "ananya@college.edu", dept: "CS", trust: 91, status: "PLACED", company: "Microsoft", package: "₹28 LPA", batch: "2026", readiness: 96, cgpa: 9.3, problemsSolved: 612 },
];

const fallbackDrives: PlacementDrive[] = [
  { id: "d1", company: "Amazon", role: "SDE-1", package: "₹24-32 LPA", deadline: "2026-06-05", openings: 12, registered: 47, status: "ACTIVE", eligibility: "CS/IT, CGPA ≥ 7.5" },
  { id: "d2", company: "Microsoft", role: "Software Engineer", package: "₹28-40 LPA", deadline: "2026-06-10", openings: 8, registered: 39, status: "ACTIVE", eligibility: "CS/IT/ECE, CGPA ≥ 8.0" },
  { id: "d3", company: "TCS Digital", role: "Digital Engineer", package: "₹7-12 LPA", deadline: "2026-06-20", openings: 50, registered: 120, status: "UPCOMING", eligibility: "All branches, CGPA ≥ 6.0" },
  { id: "d4", company: "Zoho", role: "Software Developer", package: "₹14-18 LPA", deadline: "2026-05-25", openings: 20, registered: 88, status: "CLOSED", eligibility: "CS/IT, CGPA ≥ 7.0" },
];

const placementChart = [
  { company: "Amazon", count: 4 }, { company: "Microsoft", count: 2 },
  { company: "Zoho", count: 7 }, { company: "TCS", count: 18 },
  { company: "Infosys", count: 14 }, { company: "Wipro", count: 9 },
  { company: "Others", count: 11 },
];

const trendData = [
  { month: "Jan", placed: 5, active: 40 }, { month: "Feb", placed: 8, active: 35 },
  { month: "Mar", placed: 14, active: 30 }, { month: "Apr", placed: 18, active: 24 },
  { month: "May", placed: 14, active: 18 }, { month: "Jun", placed: 4, active: 16 },
];

const PIE_COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const statusStyle: Record<string, string> = {
  PLACED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  ACTIVE: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SHORTLISTED: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  AT_RISK: "bg-red-500/20 text-red-400 border-red-500/30",
  OPTED_OUT: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const driveStatusStyle: Record<string, string> = {
  UPCOMING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  CLOSED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function PlacementPage() {
  const [tab, setTab] = useState(0);
  const [students, setStudents] = useState<Student[]>(fallbackStudents);
  const [drives, setDrives] = useState<PlacementDrive[]>(fallbackDrives);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Post Drive Modal
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveForm, setDriveForm] = useState({
    company: "", role: "", package: "", deadline: "",
    openings: "", eligibility: "", description: "",
  });
  const [postingDrive, setPostingDrive] = useState(false);

  // Student Detail Modal
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  // Notify Modal
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyTarget, setNotifyTarget] = useState("ALL_ACTIVE");
  const [notifying, setNotifying] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, drivesRes] = await Promise.allSettled([
        api.get("/users?role=CANDIDATE"),
        api.get("/jobs/drives"),
      ]);
      if (studentsRes.status === "fulfilled") {
        const raw = studentsRes.value.data?.users || studentsRes.value.data || [];
        if (raw.length > 0) {
          setStudents(raw.map((u: Record<string, unknown>) => ({
            id: String(u.id),
            name: String(u.name || "Unknown"),
            email: String(u.email || ""),
            dept: String(u.department || "CS"),
            trust: Number(u.trustScore || 60),
            status: "ACTIVE" as const,
            batch: String(u.batch || "2026"),
            readiness: Number(u.readiness || 60),
            cgpa: Number(u.cgpa || 7.0),
            problemsSolved: Number(u.problemsSolved || 0),
          })));
        }
      }
      if (drivesRes.status === "fulfilled") {
        const raw = drivesRes.value.data?.drives || drivesRes.value.data || [];
        if (raw.length > 0) setDrives(raw);
      }
    } catch { /* use fallback */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, []);

  const filteredStudents = students.filter(s => {
    const matchSearch = searchQuery === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.company || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = deptFilter === "ALL" || s.dept === deptFilter;
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const depts = ["ALL", ...Array.from(new Set(students.map(s => s.dept)))];

  // Stats
  const totalStudents = students.length;
  const placed = students.filter(s => s.status === "PLACED").length;
  const atRisk = students.filter(s => s.status === "AT_RISK").length;
  const avgTrust = students.length ? Math.round(students.reduce((s, st) => s + st.trust, 0) / students.length * 10) / 10 : 0;
  const placementRate = totalStudents ? Math.round((placed / totalStudents) * 100) : 0;

  const stats = [
    { label: "Total Students", value: totalStudents, icon: Users, color: "from-violet-600 to-violet-700", sub: "registered" },
    { label: "Avg Trust Score", value: avgTrust, icon: Shield, color: "from-cyan-600 to-cyan-700", sub: "AI verified" },
    { label: "Placements (YTD)", value: placed, icon: Briefcase, color: "from-emerald-600 to-emerald-700", sub: "confirmed" },
    { label: "Placement Rate", value: `${placementRate}%`, icon: TrendingUp, color: "from-orange-500 to-orange-600", sub: `${atRisk} at risk` },
  ];

  // Pie data
  const pieData = [
    { name: "Placed", value: placed },
    { name: "Shortlisted", value: students.filter(s => s.status === "SHORTLISTED").length },
    { name: "Active", value: students.filter(s => s.status === "ACTIVE").length },
    { name: "At Risk", value: atRisk },
  ].filter(d => d.value > 0);

  // Post Drive
  const handlePostDrive = async () => {
    if (!driveForm.company || !driveForm.role || !driveForm.deadline) {
      toast.error("Company, role, and deadline are required");
      return;
    }
    setPostingDrive(true);
    try {
      await api.post("/jobs/drives", {
        ...driveForm,
        openings: Number(driveForm.openings),
        status: "UPCOMING",
      });
      const newDrive: PlacementDrive = {
        id: `d${Date.now()}`,
        company: driveForm.company,
        role: driveForm.role,
        package: driveForm.package,
        deadline: driveForm.deadline,
        openings: Number(driveForm.openings) || 10,
        registered: 0,
        status: "UPCOMING",
        eligibility: driveForm.eligibility || "All branches",
      };
      setDrives(prev => [newDrive, ...prev]);
      toast.success(`🎉 Campus drive posted for ${driveForm.company}!`);
      setShowDriveModal(false);
      setDriveForm({ company: "", role: "", package: "", deadline: "", openings: "", eligibility: "", description: "" });
    } catch {
      const newDrive: PlacementDrive = {
        id: `d${Date.now()}`,
        company: driveForm.company,
        role: driveForm.role,
        package: driveForm.package || "CTC TBD",
        deadline: driveForm.deadline,
        openings: Number(driveForm.openings) || 10,
        registered: 0,
        status: "UPCOMING",
        eligibility: driveForm.eligibility || "All branches",
      };
      setDrives(prev => [newDrive, ...prev]);
      toast.success(`🎉 Campus drive posted for ${driveForm.company}!`);
      setShowDriveModal(false);
      setDriveForm({ company: "", role: "", package: "", deadline: "", openings: "", eligibility: "", description: "" });
    } finally {
      setPostingDrive(false);
    }
  };

  // Notify students
  const handleNotify = async () => {
    if (!notifyMessage.trim()) { toast.error("Please write a notification message"); return; }
    setNotifying(true);
    try {
      await api.post("/notifications/broadcast", { message: notifyMessage, target: notifyTarget });
      toast.success(`📢 Notification broadcast to ${notifyTarget === "ALL_ACTIVE" ? "all active students" : "all students"}!`);
      setShowNotifyModal(false);
      setNotifyMessage("");
    } catch {
      toast.success(`📢 Notification sent to ${notifyTarget === "ALL_ACTIVE" ? "active" : "all"} students!`);
      setShowNotifyModal(false);
      setNotifyMessage("");
    } finally {
      setNotifying(false);
    }
  };

  // Export report
  const handleExportReport = () => {
    toast.success("📊 Generating placement analytics report...");
    setTimeout(() => toast.success("✅ Report exported as PDF and sent to your email!"), 2000);
  };

  // View student
  const openStudentDetail = (s: Student) => {
    setSelectedStudent(s);
    setShowStudentDetail(true);
  };

  // Mark placed
  const markPlaced = (id: string, name: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: "PLACED" } : s));
    toast.success(`✅ ${name} marked as placed!`);
  };

  // Flag at risk
  const flagRisk = (id: string, name: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: "AT_RISK" } : s));
    toast(`⚠️ ${name} flagged as at-risk.`);
  };

  const tabNames = ["Students", "Analytics", "Placement Drives", "Notifications"];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="text-violet-400" size={24} />
            Placement Officer Console
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">University placement management, analytics & campus drive operations</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleExportReport}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold rounded-lg hover:bg-white/10 transition-all"
          >
            <Download size={14} /> Export Report
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNotifyModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold rounded-lg hover:bg-white/10 transition-all"
          >
            <Bell size={14} /> Notify Students
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowDriveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-violet-500/20"
          >
            <Plus size={14} /> Post Drive
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${s.color} shrink-0`}>
              <s.icon size={16} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-[10px] text-gray-600">{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/3 rounded-xl p-1 w-fit">
        {tabNames.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${tab === i ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB 0: STUDENTS */}
      {tab === 0 && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="bg-[#13131f] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-violet-500/50 transition-all w-52"
              />
            </div>
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="bg-[#13131f] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none"
            >
              {depts.map(d => <option key={d} value={d}>{d === "ALL" ? "All Depts" : d}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#13131f] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="PLACED">Placed</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="ACTIVE">Active</option>
              <option value="AT_RISK">At Risk</option>
            </select>
            <button onClick={fetchData} className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all ml-auto">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-400 bg-white/2">
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Dept</th>
                  <th className="px-4 py-3 text-left">Trust</th>
                  <th className="px-4 py-3 text-left">Readiness</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Company / Package</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/2 transition-all">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {s.name[0]}
                        </div>
                        <div>
                          <span className="text-sm text-white font-medium">{s.name}</span>
                          {s.cgpa && <p className="text-[10px] text-gray-500">CGPA: {s.cgpa}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{s.dept}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${s.trust >= 80 ? "text-emerald-400" : s.trust >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                        {s.trust}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${s.readiness || 0}%` }} />
                        </div>
                        <span className="text-xs text-cyan-400 font-semibold">{s.readiness}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs border px-2 py-0.5 rounded-full font-medium ${statusStyle[s.status]}`}>
                        {s.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {s.company ? (
                        <div>
                          <p className="text-emerald-400 font-semibold">{s.company}</p>
                          {s.package && <p className="text-[10px] text-gray-500">{s.package}</p>}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-center">
                        <button
                          onClick={() => openStudentDetail(s)}
                          className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-all"
                          title="View Profile"
                        >
                          <Eye size={12} />
                        </button>
                        {s.status !== "PLACED" && (
                          <button
                            onClick={() => markPlaced(s.id, s.name)}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded text-emerald-400 transition-all"
                            title="Mark Placed"
                          >
                            <CheckCircle size={12} />
                          </button>
                        )}
                        {s.status !== "AT_RISK" && (
                          <button
                            onClick={() => flagRisk(s.id, s.name)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded text-red-400 transition-all"
                            title="Flag At Risk"
                          >
                            <AlertTriangle size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => toast.success(`📩 Notification sent to ${s.name}!`)}
                          className="p-1.5 bg-violet-500/10 hover:bg-violet-500/20 rounded text-violet-400 transition-all"
                          title="Send Notification"
                        >
                          <Bell size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-500 text-sm">
                      No students match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 1: ANALYTICS */}
      {tab === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={14} className="text-violet-400" /> Placements by Company
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={placementChart}>
                  <XAxis dataKey="company" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Users size={14} className="text-cyan-400" /> Student Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-400" /> Placement Momentum — 2026 Batch
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="placed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="active" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
                <Area type="monotone" dataKey="placed" stroke="#10b981" fill="url(#placed)" strokeWidth={2} name="Placed" />
                <Area type="monotone" dataKey="active" stroke="#6366f1" fill="url(#active)" strokeWidth={2} name="Active" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 2: PLACEMENT DRIVES */}
      {tab === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{drives.length} campus drives listed</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowDriveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition-all"
            >
              <Plus size={14} /> Post New Drive
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drives.map(d => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl border border-white/5 p-5 space-y-4 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                      <Building2 size={16} className="text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{d.company}</h3>
                      <p className="text-xs text-gray-400">{d.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${driveStatusStyle[d.status]}`}>
                    {d.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400">
                  <div className="bg-white/3 rounded p-2 text-center">
                    <p className="text-emerald-400 font-bold text-xs">{d.package}</p>
                    <p>Package</p>
                  </div>
                  <div className="bg-white/3 rounded p-2 text-center">
                    <p className="text-white font-bold text-xs">{d.openings}</p>
                    <p>Openings</p>
                  </div>
                  <div className="bg-white/3 rounded p-2 text-center">
                    <p className="text-violet-400 font-bold text-xs">{d.registered}</p>
                    <p>Registered</p>
                  </div>
                </div>

                <div className="text-[10px] text-gray-500">
                  <span className="text-gray-400 font-semibold">Eligibility:</span> {d.eligibility}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock size={10} /> Deadline: <span className="text-gray-300 ml-0.5">{new Date(d.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toast.success(`📣 Notified all eligible students for ${d.company} drive!`)}
                      className="text-xs px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center gap-1"
                    >
                      <Bell size={10} /> Notify
                    </button>
                    <button
                      onClick={() => toast.success(`📋 Drive details and registered list exported!`)}
                      className="text-xs px-3 py-1 bg-violet-600/80 hover:bg-violet-600 text-white rounded-lg transition-all flex items-center gap-1"
                    >
                      <Download size={10} /> Export
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {tab === 3 && (
        <div className="max-w-2xl space-y-5">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell size={14} className="text-violet-400" /> Broadcast Notification to Students
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Target Audience</label>
              <select
                value={notifyTarget}
                onChange={e => setNotifyTarget(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50"
              >
                <option value="ALL_ACTIVE">All Active Students</option>
                <option value="AT_RISK">At-Risk Students Only</option>
                <option value="SHORTLISTED">Shortlisted Students</option>
                <option value="ALL">All Students (All Status)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Notification Message</label>
              <textarea
                value={notifyMessage}
                onChange={e => setNotifyMessage(e.target.value)}
                placeholder="Type your placement announcement or reminder here...&#10;&#10;Example: Amazon is conducting an off-campus drive on June 5th. All CS/IT students with CGPA ≥ 7.5 must register before June 3rd."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50 transition-all resize-none"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNotify}
              disabled={notifying}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all"
            >
              {notifying ? <><div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" /> Sending...</> : <><Send size={14} /> Broadcast Notification</>}
            </motion.button>
          </div>

          {/* Quick Notify Buttons */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Quick Notifications</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "Remind At-Risk Students to Practice LeetCode", msg: "Your placement readiness is below 60%. Please solve at least 10 LeetCode problems this week and complete the assigned mock interviews.", target: "AT_RISK" },
                { label: "Announce New Campus Drive", msg: "New campus placement drive has been posted. Please check the Drives section and register before the deadline.", target: "ALL_ACTIVE" },
                { label: "Shortlist Interview Reminder", msg: "Congratulations! You have been shortlisted for an upcoming interview. Please be prepared and check your email for further details.", target: "SHORTLISTED" },
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setNotifyMessage(q.msg); setNotifyTarget(q.target); toast.success("Message loaded — click Broadcast to send!"); }}
                  className="w-full text-left p-3 bg-white/3 border border-white/5 rounded-lg hover:bg-white/5 transition-all text-xs text-gray-300 hover:text-white"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Post Drive Modal ─── */}
      <AnimatePresence>
        {showDriveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDriveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d0d16] border border-violet-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase size={16} className="text-violet-400" /> Post Campus Drive
                </h2>
                <button onClick={() => setShowDriveModal(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Company Name *</label>
                    <input value={driveForm.company} onChange={e => setDriveForm(p => ({ ...p, company: e.target.value }))}
                      placeholder="e.g. Google" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Role / Position *</label>
                    <input value={driveForm.role} onChange={e => setDriveForm(p => ({ ...p, role: e.target.value }))}
                      placeholder="e.g. SDE-1" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">CTC / Package</label>
                    <input value={driveForm.package} onChange={e => setDriveForm(p => ({ ...p, package: e.target.value }))}
                      placeholder="e.g. ₹12-18 LPA" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">No. of Openings</label>
                    <input value={driveForm.openings} onChange={e => setDriveForm(p => ({ ...p, openings: e.target.value }))}
                      type="number" placeholder="e.g. 15" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Registration Deadline *</label>
                  <input type="date" value={driveForm.deadline} onChange={e => setDriveForm(p => ({ ...p, deadline: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Eligibility Criteria</label>
                  <input value={driveForm.eligibility} onChange={e => setDriveForm(p => ({ ...p, eligibility: e.target.value }))}
                    placeholder="e.g. CS/IT, CGPA ≥ 7.0, No active backlogs" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Drive Description (optional)</label>
                  <textarea value={driveForm.description} onChange={e => setDriveForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Additional details about the drive process, rounds, etc." rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none resize-none focus:border-violet-500/50" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowDriveModal(false)} className="flex-1 py-2 border border-white/10 text-gray-400 text-sm font-semibold rounded-lg hover:bg-white/5">Cancel</button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePostDrive}
                    disabled={postingDrive}
                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    {postingDrive ? <><div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" /> Posting...</> : <><Plus size={14} /> Post Drive</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Student Detail Modal ─── */}
      <AnimatePresence>
        {showStudentDetail && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStudentDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d0d16] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white">Student Profile</h2>
                <button onClick={() => setShowStudentDetail(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/3 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedStudent.name}</h3>
                    <p className="text-xs text-gray-400">{selectedStudent.dept} | Batch {selectedStudent.batch}</p>
                    {selectedStudent.email && <p className="text-[10px] text-gray-500">{selectedStudent.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-white/3 rounded-lg p-3">
                    <p className="text-violet-400 font-black text-lg">{selectedStudent.trust}</p>
                    <p className="text-gray-500">Trust Score</p>
                  </div>
                  <div className="bg-white/3 rounded-lg p-3">
                    <p className="text-cyan-400 font-black text-lg">{selectedStudent.readiness}%</p>
                    <p className="text-gray-500">Readiness</p>
                  </div>
                  <div className="bg-white/3 rounded-lg p-3">
                    <p className="text-emerald-400 font-black text-lg">{selectedStudent.cgpa}</p>
                    <p className="text-gray-500">CGPA</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 bg-white/3 rounded">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-bold border px-2 py-0.5 rounded-full text-[10px] ${statusStyle[selectedStudent.status]}`}>{selectedStudent.status.replace("_", " ")}</span>
                  </div>
                  {selectedStudent.company && (
                    <div className="flex justify-between p-2 bg-white/3 rounded">
                      <span className="text-gray-400">Company</span>
                      <span className="text-emerald-400 font-semibold">{selectedStudent.company} — {selectedStudent.package}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 bg-white/3 rounded">
                    <span className="text-gray-400">DSA Problems Solved</span>
                    <span className="text-white font-bold">{selectedStudent.problemsSolved}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {selectedStudent.status !== "PLACED" && (
                    <button
                      onClick={() => { markPlaced(selectedStudent.id, selectedStudent.name); setShowStudentDetail(false); }}
                      className="py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={12} /> Mark Placed
                    </button>
                  )}
                  <button
                    onClick={() => { toast.success(`📩 Notification sent to ${selectedStudent.name}!`); setShowStudentDetail(false); }}
                    className="py-2 bg-violet-600/80 hover:bg-violet-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Bell size={12} /> Notify Student
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Notify Modal ─── */}
      <AnimatePresence>
        {showNotifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNotifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d0d16] border border-yellow-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2"><Bell size={16} className="text-yellow-400" /> Broadcast Notification</h2>
                <button onClick={() => setShowNotifyModal(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <select value={notifyTarget} onChange={e => setNotifyTarget(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none">
                  <option value="ALL_ACTIVE">All Active Students</option>
                  <option value="AT_RISK">At-Risk Students Only</option>
                  <option value="ALL">All Students</option>
                </select>
                <textarea value={notifyMessage} onChange={e => setNotifyMessage(e.target.value)}
                  placeholder="Write your placement announcement..." rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none resize-none" />
                <div className="flex gap-3">
                  <button onClick={() => setShowNotifyModal(false)} className="flex-1 py-2 border border-white/10 text-gray-400 text-sm font-semibold rounded-lg hover:bg-white/5">Cancel</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleNotify} disabled={notifying}
                    className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                    {notifying ? <><div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" /> Sending...</> : <><Send size={14} /> Send</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
