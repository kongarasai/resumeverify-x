"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, MessageSquare, Search, Shield, Zap, Sparkles, Code2, 
  MapPin, Heart, Share2, Plus, Calendar, Compass, Bookmark, Check
} from "lucide-react";

const tabs = ["Feed", "Communities", "Coding Rooms", "Team Finder", "Events", "Saved Posts"];

interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    trustScore: number;
    university: string;
  };
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  time: string;
  attachment?: {
    type: "project" | "achievement";
    title: string;
    details: string;
    score?: number;
  };
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Rahul Verma",
      role: "Candidate (SDE Role)",
      avatar: "RV",
      trustScore: 92,
      university: "JNTU Hyderabad"
    },
    content: "Just synced my GitHub repository and recalculated my trust score to 92! The AI auditor fully verified my decentralised job portal project. Check out the clean system architecture and verified commits.",
    tags: ["GitHubSync", "Web3", "NextJS", "AICareer"],
    likes: 24,
    comments: 6,
    time: "2 hours ago",
    attachment: {
      type: "project",
      title: "Decentralised Career Protocol",
      details: "Originality Score: 98% | NextJS, Solitidy, Prisma",
      score: 98
    }
  },
  {
    id: "2",
    author: {
      name: "Dr. Ananya Sen",
      role: "Placement Director & Mentor",
      avatar: "AS",
      trustScore: 99,
      university: "BITS Pilani"
    },
    content: "Excellent performance by our pre-final year students in yesterday's mock DSA marathon. 85% of candidates scored above 80 in placement readiness. I highly recommend recruiters to look at their verified profiles.",
    tags: ["Mentorship", "PlacementDrive", "DSA", "Hiring"],
    likes: 56,
    comments: 12,
    time: "5 hours ago"
  },
  {
    id: "3",
    author: {
      name: "Sandeep Mishra",
      role: "Lead Recruiter at Zoho",
      avatar: "SM",
      trustScore: 97,
      university: "Zoho Corporation"
    },
    content: "We are actively recruiting for full-stack interns. ResumeVerify X has streamlined our screening — we are filtering candidates strictly by Trust Score > 80 and active DSA streaks. Apply directly below!",
    tags: ["ZohoHiring", "Internships", "FullStack", "TrustScore"],
    likes: 89,
    comments: 31,
    time: "Yesterday"
  }
];

const mockCommunities = [
  { name: "LeetCode 300+ Club", members: 1240, category: "Coding", icon: Code2, desc: "For candidates with 300+ verified coding questions solved." },
  { name: "Rust Systems Group", members: 450, category: "Systems", icon: Zap, desc: "Low-level system design, memory safety, and high-performance networks." },
  { name: "Deep Learning Pioneers", members: 890, category: "AI & ML", icon: Sparkles, desc: "Neural networks, PyTorch model architectures, and LLM fine-tuning." },
  { name: "UX/UI Design Systematics", members: 630, category: "Design", icon: Compass, desc: "Design tokens, glassmorphism, responsive systems, and micro-interactions." }
];

const mockCodingRooms = [
  { id: "1", title: "DSA Practice: Dynamic Programming", activeUsers: 8, host: "Kiran Dev (Trust: 88)", lang: "C++ / Python" },
  { id: "2", title: "Mock Technical Interview Session", activeUsers: 4, host: "Nisha Rao (Mentor)", lang: "System Design" },
  { id: "3", title: "Web Dev Collaborative Hack-a-thon", activeUsers: 15, host: "Arjun P. (Trust: 95)", lang: "TypeScript / Go" }
];

const mockTeams = [
  { title: "Figma UI/UX Designer Wanted", project: "AI-powered Health-tech SaaS", contact: "Siddharth (Trust: 86)", tags: ["Figma", "SaaS", "Design"] },
  { title: "Need Go Backend Engineer", project: "Distributed Rate-Limiter API", contact: "Pooja V. (Trust: 91)", tags: ["Golang", "Redis", "Systems"] },
  { title: "Machine Learning Collaborator", project: "Automated Resumé Parser Tool", contact: "Aman Sen (Trust: 89)", tags: ["Python", "PyTorch", "NLP"] }
];

const mockEvents = [
  { title: "Google Placement Talk & AMA", date: "June 2, 4:00 PM", speakers: "Senior Eng Managers @ Google", type: "PLACEMENT" },
  { title: "Resume Audit & Live Critique", date: "June 5, 2:00 PM", speakers: "Dr. Ananya Sen & Sandbox AI", type: "WORKSHOP" },
  { title: "Inter-College Coding Championship", date: "June 10, 9:00 AM", speakers: "Top 3 get direct interview invites", type: "CONTEST" }
];

function TrustBadge({ score }: { score: number }) {
  const color = score >= 95 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" :
    score >= 80 ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" :
    score >= 60 ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" :
    "text-red-400 bg-red-500/10 border-red-500/30";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] border px-2 py-0.5 rounded-full font-semibold ${color}`}>
      <Shield size={10} /> {score}
    </span>
  );
}

export default function ConnectPage() {
  const [activeTab, setActiveTab] = useState("Feed");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostText, setNewPostText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);
  const [appliedTeams, setAppliedTeams] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const newPost: Post = {
      id: String(posts.length + 1),
      author: {
        name: "Self Candidate",
        role: "Candidate (JNTU Student)",
        avatar: "SC",
        trustScore: 84,
        university: "JNTU Hyderabad"
      },
      content: newPostText,
      tags: ["MyUpdate", "CareerGrowth"],
      likes: 0,
      comments: 0,
      time: "Just now"
    };
    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  const toggleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const toggleSave = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isSaved: !p.isSaved
        };
      }
      return p;
    }));
  };

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Professional Connect™</h1>
          <p className="text-gray-400 text-sm">Real-time collaboration, verified career shares, and active team matching</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            placeholder="Search connections, posts, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13131f] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5 overflow-x-auto scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all flex-shrink-0 ${
              activeTab === t
                ? "text-violet-400 border-b-2 border-violet-500 bg-violet-500/5"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Middle: Core Contents depending on Active Tab */}
        <div className="lg:col-span-2 space-y-5">
          <AnimatePresence mode="wait">
            {/* 1. FEED TAB */}
            {activeTab === "Feed" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Create Post Card */}
                <div className="glass-card rounded-xl p-4 border border-white/5 bg-[#0d0d16]/30">
                  <textarea
                    placeholder="Share a verified career update, high-quality project, or skill endorsement..."
                    rows={3}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/40 transition-all resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">Posting as Self Candidate (Trust: 84)</span>
                    <button
                      onClick={handleCreatePost}
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-violet-500/20 transition-all flex items-center gap-1"
                    >
                      <Plus size={14} /> Post
                    </button>
                  </div>
                </div>

                {/* Posts List */}
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    layout
                    className="glass-card rounded-xl p-5 space-y-3 border border-white/5 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {post.author.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{post.author.name}</span>
                            <TrustBadge score={post.author.trustScore} />
                          </div>
                          <p className="text-[11px] text-gray-400">{post.author.role} • {post.author.university}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-500">{post.time}</span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                    {/* Attachment (e.g. Verified Project Card) */}
                    {post.attachment && (
                      <div className="bg-[#131327]/60 border border-violet-500/20 rounded-lg p-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Code2 size={14} className="text-violet-400" />
                            <span className="text-xs font-bold text-white">{post.attachment.title}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">{post.attachment.details}</p>
                        </div>
                        {post.attachment.score && (
                          <div className="text-center bg-violet-500/20 border border-violet-500/40 rounded px-2 py-0.5">
                            <p className="text-[9px] text-violet-400 font-bold leading-none">ORIGINALITY</p>
                            <p className="text-xs font-black text-violet-300 mt-0.5">{post.attachment.score}%</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map(t => (
                        <span key={t} className="text-[10px] text-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded-md font-medium border border-cyan-500/10">#{t}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 pt-3 border-t border-white/5 text-gray-400">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs hover:text-white transition-all ${post.isLiked ? "text-rose-400 hover:text-rose-300" : ""}`}
                      >
                        <Heart size={14} fill={post.isLiked ? "currentColor" : "none"} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-xs hover:text-white transition-all">
                        <MessageSquare size={14} />
                        <span>{post.comments}</span>
                      </button>
                      <button
                        onClick={() => toggleSave(post.id)}
                        className={`flex items-center gap-1.5 text-xs ml-auto hover:text-white transition-all ${post.isSaved ? "text-cyan-400 hover:text-cyan-300" : ""}`}
                      >
                        <Bookmark size={14} fill={post.isSaved ? "currentColor" : "none"} />
                        <span>{post.isSaved ? "Saved" : "Save"}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* 2. COMMUNITIES TAB */}
            {activeTab === "Communities" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {mockCommunities.map((c) => {
                  const hasJoined = joinedCommunities.includes(c.name);
                  return (
                    <div key={c.name} className="glass-card rounded-xl p-5 border border-white/5 bg-[#0d0d16]/30 flex flex-col justify-between h-44 hover:border-violet-500/20 transition-all">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-gradient-to-br from-violet-600/30 to-cyan-500/20 border border-violet-500/30 rounded-lg">
                            <c.icon size={16} className="text-violet-400" />
                          </div>
                          <span className="text-[10px] text-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded font-medium border border-cyan-500/10">{c.category}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-3">{c.name}</h3>
                        <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{c.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                        <span className="text-[10px] text-gray-500">{c.members} active students</span>
                        <button
                          onClick={() => {
                            if (hasJoined) setJoinedCommunities(joinedCommunities.filter(n => n !== c.name));
                            else setJoinedCommunities([...joinedCommunities, c.name]);
                          }}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                            hasJoined 
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                              : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                          }`}
                        >
                          {hasJoined ? "Joined ✓" : "Join"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* 3. CODING ROOMS TAB */}
            {activeTab === "Coding Rooms" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="glass-card rounded-xl p-4 border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">Need a live practice room?</h3>
                    <p className="text-[11px] text-gray-400">Launch a collaborative sandbox, code together, and sync results.</p>
                  </div>
                  <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-all">
                    + Start Sandbox
                  </button>
                </div>

                {mockCodingRooms.map((room) => {
                  const hasJoined = joinedRooms.includes(room.id);
                  return (
                    <div key={room.id} className="glass-card rounded-xl p-4 border border-white/5 bg-[#0d0d16]/30 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{room.title}</span>
                          <span className="text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.2 rounded font-medium">{room.lang}</span>
                        </div>
                        <p className="text-[10px] text-gray-500">Hosted by {room.host}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> {room.activeUsers} developers online
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (hasJoined) setJoinedRooms(joinedRooms.filter(id => id !== room.id));
                          else setJoinedRooms([...joinedRooms, room.id]);
                        }}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                          hasJoined 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-gradient-to-r from-violet-600/30 to-cyan-500/20 text-white border border-violet-500/30 hover:from-violet-600/40"
                        }`}
                      >
                        {hasJoined ? "Connected ✓" : "Join Code Room"}
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* 4. TEAM FINDER TAB */}
            {activeTab === "Team Finder" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="glass-card rounded-xl p-4 border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">Forming a Hackathon Team?</h3>
                    <p className="text-[11px] text-gray-400">Post your requirement and screen partners by trust & skill verified level.</p>
                  </div>
                  <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-all">
                    Create Listing
                  </button>
                </div>

                {mockTeams.map((team, idx) => {
                  const hasApplied = appliedTeams.includes(team.title);
                  return (
                    <div key={idx} className="glass-card rounded-xl p-4 border border-white/5 bg-[#0d0d16]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold text-white">{team.title}</h3>
                        <p className="text-[11px] text-gray-400 mt-1">Project: {team.project}</p>
                        <p className="text-[10px] text-gray-500">Contact: {team.contact}</p>
                        <div className="flex gap-1.5 mt-2">
                          {team.tags.map(t => (
                            <span key={t} className="text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded border border-white/5">{t}</span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (hasApplied) setAppliedTeams(appliedTeams.filter(t => t !== team.title));
                          else setAppliedTeams([...appliedTeams, team.title]);
                        }}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md self-start md:self-center transition-all ${
                          hasApplied 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        }`}
                      >
                        {hasApplied ? "Applied ✓" : "Apply to Team"}
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* 5. EVENTS TAB */}
            {activeTab === "Events" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {mockEvents.map((ev, i) => {
                  const isReg = registeredEvents.includes(ev.title);
                  return (
                    <div key={i} className="glass-card rounded-xl p-4 border border-white/5 bg-[#0d0d16]/30 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400">{ev.type}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={10} /> {ev.date}</span>
                        </div>
                        <h3 className="text-xs font-bold text-white">{ev.title}</h3>
                        <p className="text-[10px] text-gray-400">Speakers: {ev.speakers}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (isReg) setRegisteredEvents(registeredEvents.filter(t => t !== ev.title));
                          else setRegisteredEvents([...registeredEvents, ev.title]);
                        }}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                          isReg 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-violet-600 hover:bg-violet-500 text-white"
                        }`}
                      >
                        {isReg ? "Registered ✓" : "Register"}
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* 6. SAVED POSTS TAB */}
            {activeTab === "Saved Posts" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {posts.filter(p => p.isSaved).length === 0 ? (
                  <div className="glass-card rounded-xl p-8 border border-white/5 text-center text-gray-500">
                    <Bookmark size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No posts saved yet. Click 'Save' on any feed post.</p>
                  </div>
                ) : (
                  posts.filter(p => p.isSaved).map((post) => (
                    <div key={post.id} className="glass-card rounded-xl p-5 space-y-3 border border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white font-bold text-sm">
                            {post.author.avatar}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white">{post.author.name}</span>
                            <p className="text-[11px] text-gray-400">{post.author.role}</p>
                          </div>
                        </div>
                        <button onClick={() => toggleSave(post.id)} className="text-cyan-400 hover:text-white transition-all">
                          <Bookmark size={14} fill="currentColor" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{post.content}</p>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar: Recommended Connections & Top Performers */}
        <div className="space-y-5">
          {/* AI Recommended Connections */}
          <div className="glass-card rounded-xl p-5 border border-white/5 space-y-4 bg-[#0d0d16]/20">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400" />
              AI Recommended Connections
            </h2>
            <div className="space-y-3">
              {[
                { name: "Divya Teja", role: "DevOps Engineer", avatar: "DT", trust: 94, isConn: false },
                { name: "Kunal Shah", role: "Rust Developer", avatar: "KS", trust: 88, isConn: false },
                { name: "Neha Roy", role: "AI Research Intern", avatar: "NR", trust: 91, isConn: false }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/40 to-cyan-500/20 flex items-center justify-center text-white text-xs font-bold">
                      {c.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-white">{c.name}</span>
                        <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-1 py-0.1 rounded"><Shield size={8} className="inline mr-0.5" />{c.trust}</span>
                      </div>
                      <p className="text-[10px] text-gray-500">{c.role}</p>
                    </div>
                  </div>
                  <button className="text-[10px] px-2.5 py-1 font-semibold rounded bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/30 transition-all">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Coding streaks */}
          <div className="glass-card rounded-xl p-5 border border-white/5 space-y-4 bg-[#0d0d16]/20">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 size={14} className="text-violet-400" />
              Active Coding Streaks
            </h2>
            <div className="space-y-3 text-xs">
              {[
                { name: "Arjun P.", streak: "32 Days", solved: "142 problems", xp: "2.4K XP" },
                { name: "Sara Nair", streak: "18 Days", solved: "89 problems", xp: "1.5K XP" },
                { name: "Rahul Verma", streak: "15 Days", solved: "76 problems", xp: "1.2K XP" }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/3">
                  <div>
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-[10px] text-gray-500">{c.solved}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      🔥 {c.streak}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
