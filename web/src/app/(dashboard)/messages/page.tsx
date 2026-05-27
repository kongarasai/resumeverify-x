"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search, Send, Paperclip, Smile, Phone, Video, Pin, Circle } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useSocket } from "@/hooks/useSocket";

const conversations = [
  { id: "1", name: "Priya Sharma", avatar: "PS", role: "Mentor", last: "Good luck with your interview!", time: "2m ago", online: true, unread: 2 },
  { id: "2", name: "SQL Bootcamp Group", avatar: "SB", role: "Group", last: "Assignment deadline extended", time: "1h ago", online: false, unread: 5 },
  { id: "3", name: "Rahul Verma", avatar: "RV", role: "Recruiter", last: "Can we schedule a call?", time: "3h ago", online: true, unread: 0 },
  { id: "4", name: "Dr. Anand Kumar", avatar: "AK", role: "Teacher", last: "Please submit by Friday", time: "Yesterday", online: false, unread: 1 },
];

const chatMessages = [
  { id: "1", sender: "Priya Sharma", content: "Hi! How's your preparation going?", time: "10:30 AM", isMe: false },
  { id: "2", sender: "me", content: "Going well! Just finished the DSA module.", time: "10:31 AM", isMe: true },
  { id: "3", sender: "Priya Sharma", content: "Great! Make sure to practice dynamic programming questions for your TCS interview.", time: "10:32 AM", isMe: false },
  { id: "4", sender: "me", content: "Will do! Can you share some resources?", time: "10:33 AM", isMe: true },
  { id: "5", sender: "Priya Sharma", content: "Good luck with your interview! You've got this 💪", time: "10:45 AM", isMe: false },
];

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [selected, setSelected] = useState(conversations[0]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const { emit } = useSocket({ namespace: "/messages" });

  const send = () => {
    if (!message.trim()) return;
    emit("send_message", { receiverId: selected.id, content: message });
    setMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversations Sidebar */}
      <div className="w-72 border-r border-white/5 bg-[#0d0d16] flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={16} className="text-violet-400" />
            <h2 className="font-semibold text-white text-sm">Messages</h2>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-300 placeholder-gray-500 outline-none focus:border-violet-500/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(conv => (
            <motion.button
              key={conv.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(conv)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/3 transition-all text-left ${selected.id === conv.id ? "bg-violet-500/10 border-r-2 border-violet-500" : ""}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {conv.avatar}
                </div>
                {conv.online && <Circle size={8} className="absolute bottom-0 right-0 fill-emerald-400 text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">{conv.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-gray-400 truncate">{conv.last}</p>
                  {conv.unread > 0 && (
                    <span className="bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#0d0d16]/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {selected.avatar}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{selected.name}</p>
              <p className="text-xs text-emerald-400">{selected.online ? "Online" : "Offline"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"><Phone size={16} /></button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"><Video size={16} /></button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"><Pin size={16} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-sm ${msg.isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {!msg.isMe && <span className="text-xs text-gray-500">{msg.sender}</span>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  msg.isMe
                    ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-br-sm"
                    : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
            </motion.div>
          ))}
          {/* Typing indicator */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {selected.avatar}
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl rounded-bl-sm">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5 bg-[#0d0d16]/50">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-violet-500/50 transition-all">
            <button className="text-gray-400 hover:text-white transition-all"><Paperclip size={16} /></button>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={`Message ${selected.name}...`}
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
            />
            <button className="text-gray-400 hover:text-white transition-all"><Smile size={16} /></button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={send}
              className="p-1.5 bg-violet-600 rounded-lg text-white hover:bg-violet-500 transition-all"
            >
              <Send size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
