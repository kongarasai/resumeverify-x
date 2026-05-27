"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, MessageSquare, Shield, Folder, Trophy, Calendar, Plus, 
  ArrowRight, Search, FileText, CheckCircle, Clock, Volume2, UserPlus
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  description: string;
  isJoined?: boolean;
  announcements: {
    id: string;
    author: string;
    avatar: string;
    content: string;
    time: string;
  }[];
  files: {
    name: string;
    size: string;
    type: string;
    time: string;
  }[];
  tasks: {
    id: string;
    title: string;
    dueDate: string;
    xp: number;
    status: "pending" | "completed";
  }[];
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "JNTU CSE - Batch of 2026",
    category: "University",
    membersCount: 154,
    description: "Official workspace for JNTU Computer Science engineering batch of 2026. Contains university notifications, lecture notes, placement schedules, and internal assignments.",
    isJoined: true,
    announcements: [
      {
        id: "a1",
        author: "Placement Officer JNTU",
        avatar: "PO",
        content: "Microsoft placement drive scheduled for June 15th. Eligibility criteria: SGPA > 8.0 AND verified ResumeVerify Trust Score > 82. Recalculate your score and complete any pending DSA tasks before June 10th.",
        time: "1 hour ago"
      },
      {
        id: "a2",
        author: "Prof. Suresh Kumar",
        avatar: "SK",
        content: "The final Compiler Design assignment has been posted. Submissions close this Sunday. Make sure to run your codes through the sandboxed compiler for verified submission status.",
        time: "Yesterday"
      }
    ],
    files: [
      { name: "Microsoft_Eligibility_List_2026.pdf", size: "1.2 MB", type: "PDF", time: "Yesterday" },
      { name: "Compiler_Design_Final_Lab_Spec.pdf", size: "850 KB", type: "PDF", time: "3 days ago" },
      { name: "Aptitude_Questions_Bank_v4.docx", size: "3.4 MB", type: "DOCX", time: "1 week ago" }
    ],
    tasks: [
      { id: "t1", title: "Complete Compiler Design Final Assignment", dueDate: "Sunday, 11:59 PM", xp: 150, status: "pending" },
      { id: "t2", title: "Verify GitHub commits for Web dev project", dueDate: "June 5", xp: 100, status: "completed" },
      { id: "t3", title: "Practice Mock Interview (Self Video Audit)", dueDate: "June 8", xp: 120, status: "pending" }
    ]
  },
  {
    id: "2",
    name: "FAANG Aspirants Prep Club",
    category: "Coding Circles",
    membersCount: 84,
    description: "Dedicated peer group for high-intensity FAANG interview preparation. Covers advanced algorithm design, distributed systems scaling, and live peer reviews.",
    isJoined: true,
    announcements: [
      {
        id: "a3",
        author: "Kiran Dev (Admin)",
        avatar: "KD",
        content: "Live Systems Design peer discussion on 'Designing a Global Real-time Leaderboard' today at 8:00 PM in the coding room. Be ready to sketch systems.",
        time: "3 hours ago"
      }
    ],
    files: [
      { name: "System_Design_Prime_Book.pdf", size: "14.2 MB", type: "PDF", time: "May 20" },
      { name: "Top_50_DP_Questions.pdf", size: "2.1 MB", type: "PDF", time: "May 15" }
    ],
    tasks: [
      { id: "t4", title: "Solve 'Serialize and Deserialize Binary Tree'", dueDate: "Today", xp: 80, status: "pending" },
      { id: "t5", title: "Draw System Architecture for Distributed Cache", dueDate: "June 3", xp: 200, status: "pending" }
    ]
  },
  {
    id: "3",
    name: "TCS & Zoho Prep Hub",
    category: "Corporate Placement",
    membersCount: 342,
    description: "Mass hiring prep circle focusing on Zoho, TCS, Infosys, and Cognizant eligibility. Daily quantitative aptitude prep, basic SQL, and core coding questions.",
    isJoined: false,
    announcements: [],
    files: [],
    tasks: []
  }
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("1");
  const [activeSubTab, setActiveSubTab] = useState<"Announcements" | "Files" | "Tasks">("Announcements");
  const [searchQuery, setSearchQuery] = useState("");
  const [newAnnouncementText, setNewAnnouncementText] = useState("");
  const [joinedTasks, setJoinedTasks] = useState<string[]>([]);

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const handleCreateAnnouncement = () => {
    if (!newAnnouncementText.trim()) return;
    const updated = groups.map(g => {
      if (g.id === selectedGroupId) {
        return {
          ...g,
          announcements: [
            {
              id: String(g.announcements.length + 1),
              author: "Self Candidate",
              avatar: "SC",
              content: newAnnouncementText,
              time: "Just now"
            },
            ...g.announcements
          ]
        };
      }
      return g;
    });
    setGroups(updated);
    setNewAnnouncementText("");
  };

  const handleToggleJoin = (gId: string) => {
    setGroups(groups.map(g => {
      if (g.id === gId) {
        return {
          ...g,
          isJoined: !g.isJoined,
          membersCount: g.isJoined ? g.membersCount - 1 : g.membersCount + 1
        };
      }
      return g;
    }));
  };

  const handleCompleteTask = (tId: string) => {
    const updated = groups.map(g => {
      if (g.id === selectedGroupId) {
        return {
          ...g,
          tasks: g.tasks.map(t => {
            if (t.id === tId) {
              return {
                ...t,
                status: t.status === "completed" ? "pending" : "completed" as any
              };
            }
            return t;
          })
        };
      }
      return g;
    });
    setGroups(updated);
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Groups & Workspaces</h1>
          <p className="text-gray-400 text-sm">Collaborative academic workspaces, placement study circles, and peer teams</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#13131f] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-violet-500/50 transition-all"
            />
          </div>
          <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center gap-1 hover:shadow-lg hover:shadow-violet-500/10 transition-all flex-shrink-0">
            <Plus size={14} /> Create
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden gap-5">
        {/* Left Panel: Groups List */}
        <div className="w-80 border-r border-white/5 pr-4 flex flex-col gap-3 overflow-y-auto flex-shrink-0">
          <p className="text-xs font-bold text-gray-500 tracking-wider">YOUR COLLABORATIVES</p>
          <div className="space-y-2 flex-1">
            {filteredGroups.map(g => (
              <div 
                key={g.id}
                onClick={() => { setSelectedGroupId(g.id); setActiveSubTab("Announcements"); }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedGroupId === g.id
                    ? "bg-violet-600/10 border-violet-500/40"
                    : "bg-[#0d0d16]/30 border-white/5 hover:border-white/10 hover:bg-[#0d0d16]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">{g.category}</span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1"><Users size={10} /> {g.membersCount}</span>
                </div>
                <h3 className="text-xs font-bold text-white truncate">{g.name}</h3>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{g.description}</p>
                {!g.isJoined && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleToggleJoin(g.id); }}
                    className="mt-3 w-full py-1 text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-500 rounded transition-all"
                  >
                    Join Collaborative
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Selected Group Detail Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0d16]/10 rounded-xl border border-white/5">
          {/* Active Group Header */}
          <div className="p-5 border-b border-white/5 bg-[#0d0d16]/40 flex items-center justify-between flex-shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full">{selectedGroup.category}</span>
                <span className="text-xs text-gray-400">• {selectedGroup.membersCount} Members</span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">{selectedGroup.name}</h2>
            </div>
            {selectedGroup.isJoined && (
              <button 
                onClick={() => handleToggleJoin(selectedGroup.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
              >
                Leave Group
              </button>
            )}
          </div>

          {!selectedGroup.isJoined ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#070709]">
              <Users size={36} className="text-gray-600 mb-3" />
              <h3 className="font-bold text-white text-sm">Join this Collaborative Workspace</h3>
              <p className="text-xs text-gray-400 max-w-sm mt-1 mb-4">You need to join "{selectedGroup.name}" to view ongoing announcements, access resources, and solve collaborative assignments.</p>
              <button 
                onClick={() => handleToggleJoin(selectedGroup.id)}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-lg hover:shadow-violet-500/10 rounded-lg transition-all"
              >
                Join Collaborative
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-white/5 px-5 bg-[#0d0d16]/20 flex-shrink-0">
                {(["Announcements", "Files", "Tasks"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`px-4 py-3 text-xs font-medium border-b-2 transition-all ${
                      activeSubTab === tab
                        ? "text-violet-400 border-violet-500 bg-violet-500/5"
                        : "text-gray-400 hover:text-white border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <AnimatePresence mode="wait">
                  {/* ANNOUNCEMENTS */}
                  {activeSubTab === "Announcements" && (
                    <motion.div
                      key="Announcements"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Post Announcement */}
                      <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">SC</div>
                        <div className="flex-1 space-y-2">
                          <input
                            placeholder="Share an announcement with the group..."
                            value={newAnnouncementText}
                            onChange={(e) => setNewAnnouncementText(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500/40"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-500">Post as Candidate</span>
                            <button
                              onClick={handleCreateAnnouncement}
                              className="px-3 py-1 text-[10px] font-bold text-white bg-violet-600 rounded hover:bg-violet-500 transition-all flex items-center gap-1"
                            >
                              <Volume2 size={12} /> Announce
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Announcement list */}
                      {selectedGroup.announcements.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-xs">No announcements in this group.</div>
                      ) : (
                        selectedGroup.announcements.map(ann => (
                          <div key={ann.id} className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-gradient-to-br from-violet-500/40 to-cyan-500/20 flex items-center justify-center text-white text-xs font-bold">{ann.avatar}</div>
                                <div>
                                  <p className="text-xs font-bold text-white">{ann.author}</p>
                                  <p className="text-[9px] text-gray-500">{ann.time}</p>
                                </div>
                              </div>
                              <span className="text-[9px] text-violet-400 bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/10">Staff/Mentor</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {/* FILES */}
                  {activeSubTab === "Files" && (
                    <motion.div
                      key="Files"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">{selectedGroup.files.length} Shared Resources</span>
                        <button className="text-[10px] px-2.5 py-1 font-bold text-white bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-all flex items-center gap-1">
                          + Upload File
                        </button>
                      </div>

                      {selectedGroup.files.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-xs">No shared files in this group.</div>
                      ) : (
                        selectedGroup.files.map((file, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between hover:border-violet-500/20 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-violet-400">
                                <FileText size={16} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">{file.name}</h4>
                                <p className="text-[10px] text-gray-500 mt-0.5">{file.size} • Shared {file.time}</p>
                              </div>
                            </div>
                            <button className="text-[10px] px-2.5 py-1 text-cyan-400 hover:text-white border border-cyan-500/30 rounded hover:bg-cyan-500/10 transition-all">
                              Download
                            </button>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {/* TASKS */}
                  {activeSubTab === "Tasks" && (
                    <motion.div
                      key="Tasks"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">Tasks & Skill Verification Drives</span>
                        <span className="text-[10px] text-gray-500">XP rewards automatically increase Trust Score.</span>
                      </div>

                      {selectedGroup.tasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-xs">No active tasks assigned to this group.</div>
                      ) : (
                        selectedGroup.tasks.map((task) => {
                          const isDone = task.status === "completed";
                          return (
                            <div key={task.id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                              isDone ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/3 border-white/5"
                            }`}>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => handleCompleteTask(task.id)}
                                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                    isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-600 hover:border-violet-500"
                                  }`}
                                >
                                  {isDone && <CheckCircle size={14} />}
                                </button>
                                <div>
                                  <h4 className={`text-xs font-bold ${isDone ? "text-gray-400 line-through" : "text-white"}`}>{task.title}</h4>
                                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                    <Clock size={10} /> Due {task.dueDate}
                                  </p>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDone ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                +{task.xp} XP
                              </span>
                            </div>
                          );
                        })
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
