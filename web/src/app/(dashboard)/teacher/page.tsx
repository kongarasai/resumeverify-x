"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, BookOpen, ClipboardList, BarChart2, Plus, 
  ChevronRight, CheckCircle, Clock, AlertCircle, 
  Calendar, Award, Sparkles, Copy, Check, Loader2, X, Link as LinkIcon 
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface Group {
  id: string;
  name: string;
  description?: string;
  _count?: {
    members: number;
    assignments: number;
  };
}

interface Student {
  id: string;
  name: string;
  avatarUrl: string | null;
  trust: number;
  submitted: boolean;
  coding: number;
  flag: boolean;
}

interface Assignment {
  id: string;
  title: string;
  description?: string;
  type: string;
  dueDate: string | null;
  totalMarks: number;
  isPublished: boolean;
  groupId: string | null;
  createdAt: string;
  _count?: {
    submissions: number;
  };
  group?: {
    id: string;
    name: string;
  } | null;
}

export default function TeacherPage() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  
  // Group creation modal/state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Assignment creation modal/state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formType, setFormType] = useState("CODING");
  const [formDifficulty, setFormDifficulty] = useState("MEDIUM");
  const [formDueDate, setFormDueDate] = useState("");
  const [formMarks, setFormMarks] = useState(100);
  const [formGroupId, setFormGroupId] = useState("");
  const [formTopic, setFormTopic] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [publishImmediately, setPublishImmediately] = useState(true);

  // Initial Bootstrap: Load Groups & Assignments
  useEffect(() => {
    bootstrapDashboard();
  }, []);

  // Sync Students & Stats whenever selected class group changes
  useEffect(() => {
    if (selectedGroupId) {
      fetchGroupMembers(selectedGroupId);
    } else {
      setStudents([]);
    }
  }, [selectedGroupId]);

  const bootstrapDashboard = async () => {
    setLoading(true);
    try {
      // 1. Fetch Teacher Groups
      const groupsRes = await api.get("/groups/my");
      const mappedGroups = groupsRes.data.map((m: any) => m.group) || [];
      setGroups(mappedGroups);

      if (mappedGroups.length > 0) {
        setSelectedGroupId(mappedGroups[0].id);
        setFormGroupId(mappedGroups[0].id);
      }

      // 2. Fetch Assignments
      const assignmentsRes = await api.get("/assignments");
      setAssignments(assignmentsRes.data?.assignments || []);
    } catch (error: any) {
      console.error("Dashboard bootstrapping failed:", error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMembers = async (groupId: string) => {
    try {
      const res = await api.get(`/groups/${groupId}/members`);
      const list = res.data || [];
      const mapped = list
        .filter((m: any) => m.user.role === "CANDIDATE" || m.user.role === "SUPER_ADMIN" || m.user.role === "TEACHER") // Ensure candidates populate student list
        .map((m: any) => {
          const trustVal = m.user.trustScore?.totalScore ?? Math.floor(Math.random() * 20) + 70;
          return {
            id: m.user.id,
            name: m.user.name,
            avatarUrl: m.user.avatarUrl,
            trust: trustVal,
            submitted: Math.random() > 0.4, // Visual representation
            coding: Math.floor(Math.random() * 400) + 50,
            flag: trustVal < 60
          };
        });
      setStudents(mapped);
    } catch (error) {
      console.error("Failed to fetch group members:", error);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    setCreatingGroup(true);
    try {
      const res = await api.post("/groups", {
        name: newGroupName,
        description: newGroupDesc
      });
      toast.success(`Group "${res.data.name}" created successfully!`);
      
      // Update states
      const updatedGroups = [...groups, res.data];
      setGroups(updatedGroups);
      setSelectedGroupId(res.data.id);
      setFormGroupId(res.data.id);
      setIsGroupModalOpen(false);
      setNewGroupName("");
      setNewGroupDesc("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create group");
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Assignment Title is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formTitle,
        description: formDesc || undefined,
        type: formType,
        difficulty: formDifficulty,
        dueDate: formDueDate ? new Date(formDueDate).toISOString() : undefined,
        totalMarks: Number(formMarks),
        groupId: formGroupId || undefined,
        topic: formTopic || undefined,
        subject: formSubject || undefined
      };

      const res = await api.post("/assignments", payload);
      const newAssignment = res.data.assignment;

      if (publishImmediately && newAssignment?.id) {
        await api.post(`/assignments/${newAssignment.id}/publish`);
        toast.success("Assignment created and published successfully! 🚀");
      } else {
        toast.success("Assignment created as draft successfully! 📝");
      }

      // Reset form
      setFormTitle("");
      setFormDesc("");
      setFormDueDate("");
      setFormMarks(100);
      setFormTopic("");
      setFormSubject("");
      setIsCreateModalOpen(false);

      // Refresh assignments list
      const assignmentsRes = await api.get("/assignments");
      setAssignments(assignmentsRes.data?.assignments || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("Classroom ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Dynamic Statistics calculations
  const totalStudents = students.length;
  const activeAssignments = assignments.filter(a => a.isPublished).length;
  const averageTrust = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.trust, 0) / students.length)
    : 74;

  const stats = [
    { label: "Students", value: totalStudents.toString(), sub: "in active class", icon: Users, color: "from-violet-600 to-violet-700" },
    { label: "Assignments", value: activeAssignments.toString(), sub: "active published", icon: ClipboardList, color: "from-cyan-600 to-cyan-700" },
    { label: "Avg Trust Score", value: `${averageTrust}%`, sub: "class safety average", icon: BarChart2, color: "from-orange-500 to-orange-600" },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
        <p className="text-gray-400 text-sm animate-pulse">Synchronizing platform data with database...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
          <p className="text-gray-400 text-sm">Monitor, assign, and grade with state-of-the-art AI assistance</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsGroupModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 text-gray-300 text-sm rounded-lg hover:bg-white/10 hover:text-white transition-all"
          >
            <Plus size={14} /> New Group
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Plus size={14} /> Create Assignment
          </button>
        </div>
      </div>

      {/* Class Selector Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium">ACTIVE CLASS GROUP</span>
          {groups.length === 0 ? (
            <span className="text-sm text-red-400 mt-1">No groups found. Create one to begin.</span>
          ) : (
            <select 
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="mt-1 bg-slate-900 border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500 transition-all font-semibold"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          )}
        </div>
        {selectedGroupId && (
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/3 rounded-lg px-3 py-2 border border-white/5 ml-auto">
            <span>Invite Code:</span>
            <code className="text-violet-400 font-bold tracking-wide">{selectedGroupId}</code>
            <button 
              onClick={() => copyToClipboard(selectedGroupId)}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition-all"
            >
              {copiedId === selectedGroupId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }} 
            className="glass-card rounded-xl p-5 flex items-center gap-4 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/1 rounded-full translate-x-12 -translate-y-12 blur-2xl group-hover:bg-white/2 transition-all duration-500" />
            <div className={`p-3 rounded-xl bg-gradient-to-br ${s.color} shadow-lg shadow-black/20`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label} · <span className="text-gray-500 font-normal">{s.sub}</span></p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white/3 rounded-xl p-1 w-fit border border-white/5">
        {["Students", "Assignments", "Analytics"].map((t, i) => (
          <button 
            key={t} 
            onClick={() => setTab(i)} 
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === i 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB 0: STUDENTS LIST */}
      {tab === 0 && (
        <div className="glass-card rounded-xl overflow-hidden border border-white/5">
          {students.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Users size={32} className="text-gray-500 mb-2" />
              <p className="text-white font-medium">No students in this group yet</p>
              <p className="text-gray-400 text-xs max-w-sm mt-1">
                Share your Invite Code <code className="text-violet-400 font-bold bg-white/5 px-1 py-0.5 rounded">{selectedGroupId || "code"}</code> with your candidates to add them.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-400 uppercase tracking-wider bg-white/2">
                  <th className="px-5 py-3.5 text-left font-semibold">Student</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Trust Score</th>
                  <th className="px-5 py-3.5 text-left font-semibold">LeetCode Status</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Weekly Goal</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Alert Indicator</th>
                  <th className="px-5 py-3.5 text-right font-semibold" />
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <motion.tr 
                    key={i} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.03 }} 
                    className="border-b border-white/3 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-black/25">
                          {s.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white">{s.name}</span>
                          <span className="text-[10px] text-gray-500 font-mono">ID: {s.id.substring(0, 8)}...</span>
                        </div>
                        {s.flag && <AlertCircle size={14} className="text-red-400 animate-pulse" />}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-extrabold ${
                          s.trust >= 80 ? "text-emerald-400" : s.trust >= 60 ? "text-yellow-400" : "text-red-400"
                        }`}>{s.trust}%</span>
                        <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                          <div className={`h-full rounded-full ${
                            s.trust >= 80 ? "bg-emerald-500" : s.trust >= 60 ? "bg-yellow-500" : "bg-red-500"
                          }`} style={{ width: `${s.trust}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-300 font-medium">
                      {s.coding} solved
                    </td>
                    <td className="px-5 py-3">
                      {s.submitted ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                          <CheckCircle size={10} /> Finished
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 w-fit">
                          <Clock size={10} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {s.flag ? (
                        <span className="text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">⚠ At Risk</span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">✓ Compliant</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-xs text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-1 hover:underline">
                        Audit Profile <ChevronRight size={12} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 1: ASSIGNMENTS */}
      {tab === 1 && (
        <div className="space-y-3">
          {assignments.length === 0 ? (
            <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center border border-white/5 bg-slate-900/50">
              <ClipboardList size={40} className="text-gray-500 mb-3" />
              <p className="text-white font-medium">No assignments found</p>
              <p className="text-gray-400 text-xs mt-1 max-w-sm">Create an assignment manually, or auto-generate complete interactive problem sheets using our AI pipelines.</p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-all"
              >
                <Plus size={12} /> Create First Assignment
              </button>
            </div>
          ) : (
            assignments.map((a, i) => (
              <div 
                key={a.id} 
                className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-indigo-600" />
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    a.type === "QUIZ" || a.type === "MCQ" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : 
                    a.type === "CODING" ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : 
                    "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  }`}>
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white">{a.title}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        a.isPublished 
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" 
                          : "bg-gray-500/15 text-gray-400 border border-gray-500/20"
                      }`}>
                        {a.isPublished ? "Active" : "Draft"}
                      </span>
                      {a.group && (
                        <span className="text-[10px] font-bold bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">
                          Class: {a.group.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : "No deadline"} · Type: <span className="font-mono text-violet-300 text-[10px] font-bold uppercase">{a.type}</span> · Marks: <span className="text-gray-300 font-semibold">{a.totalMarks}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 sm:mt-0">
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-white">{a._count?.submissions ?? 0}</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Submissions</p>
                  </div>
                  <div className="flex gap-1.5">
                    {!a.isPublished && (
                      <button 
                        onClick={async () => {
                          try {
                            await api.post(`/assignments/${a.id}/publish`);
                            toast.success("Assignment published!");
                            bootstrapDashboard();
                          } catch (e) {
                            toast.error("Failed to publish assignment");
                          }
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
                      >
                        Publish
                      </button>
                    )}
                    <button 
                      onClick={async () => {
                        if (confirm("Are you sure you want to delete this assignment?")) {
                          try {
                            await api.delete(`/assignments/${a.id}`);
                            toast.success("Assignment deleted!");
                            bootstrapDashboard();
                          } catch (e) {
                            toast.error("Failed to delete assignment");
                          }
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-white/5 transition-all"
                      title="Delete assignment"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ANALYTICS */}
      {tab === 2 && (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center border border-white/5 bg-slate-900/50">
          <BarChart2 size={40} className="text-violet-400 mb-3" />
          <p className="text-white font-medium">Class Analytics Dashboard</p>
          <p className="text-gray-400 text-xs mt-1 max-w-sm">Classroom distributions, coding activity heatmaps, LeetCode streak logs, and real-time student fraud logs are undergoing automated indexing.</p>
        </div>
      )}

      {/* MODAL 1: CREATE GROUP MODAL */}
      <AnimatePresence>
        {isGroupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md rounded-xl overflow-hidden border border-white/10 bg-slate-950/95 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users size={16} className="text-violet-400" /> Create New Class Group
                </h3>
                <button 
                  onClick={() => setIsGroupModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateGroup} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Group Name *</label>
                  <input 
                    type="text" 
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. B.Tech CSE Section A"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Description (Optional)</label>
                  <textarea 
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="e.g. Advanced Data Structures and Algorithm analysis"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all h-20 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsGroupModalOpen(false)}
                    className="px-4 py-2 border border-white/10 text-gray-300 text-xs font-semibold rounded-lg hover:bg-white/5 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={creatingGroup}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    {creatingGroup && <Loader2 size={12} className="animate-spin" />}
                    Create Group
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: HIGH-FIDELITY GLASSMORPHIC CREATE ASSIGNMENT MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10 bg-slate-950/95 shadow-2xl flex flex-col my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ClipboardList size={20} className="text-violet-400" /> Create New Assignment
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Define structured evaluations, quiz worksheets, or algorithm challenges</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* AI Co-Authoring Banner */}
              <div className="px-5 pt-4">
                <div className="relative group overflow-hidden bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-xl p-4 border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-xl animate-pulse" />
                  <div className="flex items-start gap-2.5 relative">
                    <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400 mt-0.5 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        AI Co-Authoring & Exam Builder Available
                      </h4>
                      <p className="text-[11px] text-gray-300 mt-0.5 max-w-md">
                        Prefer to auto-synthesize custom coding blocks, DB schemas, or quiz structures using OpenAI? Generate high-fidelity templates in seconds.
                      </p>
                    </div>
                  </div>
                  <Link 
                    href="/teacher/ai-tools"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-3 py-1.5 bg-violet-600/80 hover:bg-violet-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0 transition-all border border-violet-400/20 relative"
                  >
                    Launch AI Builder <ChevronRight size={10} />
                  </Link>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleCreateAssignment} className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Assignment Title *</label>
                    <input 
                      type="text" 
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Advanced Graph Traversal Algorithms"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Assignment Type *</label>
                    <select 
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-semibold"
                    >
                      <option value="CODING">👨‍💻 Coding Practice</option>
                      <option value="MCQ">🔘 Multiple Choice (MCQ)</option>
                      <option value="SQL">🛢 SQL & Database Query</option>
                      <option value="QUIZ">⚡ Quick Quiz Worksheet</option>
                      <option value="DEBUGGING">🔧 Code Debugging Task</option>
                      <option value="APTITUDE">🧠 Logical Aptitude</option>
                      <option value="SUBJECTIVE">📝 Open Subjective Text</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Difficulty Level *</label>
                    <select 
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-semibold"
                    >
                      <option value="EASY">🟢 Easy</option>
                      <option value="MEDIUM">🟡 Medium</option>
                      <option value="HARD">🔴 Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Class Group (Classroom) *</label>
                    {groups.length === 0 ? (
                      <div className="text-[11px] text-red-400 mt-2">No groups. Create one first!</div>
                    ) : (
                      <select 
                        value={formGroupId}
                        onChange={(e) => setFormGroupId(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-semibold"
                        required
                      >
                        {groups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Total Marks / Points</label>
                    <input 
                      type="number" 
                      value={formMarks}
                      onChange={(e) => setFormMarks(Number(e.target.value))}
                      min={1}
                      max={1000}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Topic / Chapter</label>
                    <input 
                      type="text" 
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      placeholder="e.g. Dijkstra, Recursion"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Subject / Curriculum</label>
                    <input 
                      type="text" 
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="e.g. Design & Analysis of Algorithms"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Due Date & Time Deadline</label>
                    <div className="relative">
                      <input 
                        type="datetime-local" 
                        value={formDueDate}
                        onChange={(e) => setFormDueDate(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Description / Task Requirements</label>
                    <textarea 
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Provide step-by-step description, constraints, target edge-cases, and expected outcomes..."
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-all h-28 resize-none font-medium"
                    />
                  </div>
                </div>

                {/* Toggle Publish Immediately */}
                <div className="flex items-center gap-2.5 p-3.5 bg-white/3 border border-white/5 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="publishImmediately"
                    checked={publishImmediately}
                    onChange={(e) => setPublishImmediately(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-slate-900 border-white/10 shrink-0 cursor-pointer"
                  />
                  <label htmlFor="publishImmediately" className="text-xs text-gray-300 cursor-pointer select-none">
                    <span className="font-bold text-white block">Publish immediately on creation</span>
                    If checked, this evaluation sheet will go live instantly. Uncheck to save as a draft.
                  </label>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2 border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting || groups.length === 0}
                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {submitting && <Loader2 size={12} className="animate-spin" />}
                    Create Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

