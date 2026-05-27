"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, FileText, Code2, Database, UploadCloud, CheckCircle, 
  Trash2, Plus, ArrowRight, Play, RefreshCw, FileCode, Check, Clock
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const tabs = ["Question Generator", "Lesson Planner", "PDF Import", "Question Bank"];

export default function TeacherAIToolsPage() {
  const [activeTab, setActiveTab] = useState("Question Generator");

  // Question Generator States
  const [topic, setTopic] = useState("Binary Trees");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Lesson Planner States
  const [planSubject, setPlanSubject] = useState("System Design");
  const [planGoal, setPlanGoal] = useState("Design a horizontal caching system with Redis.");
  const [planning, setPlanning] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string>("");

  // PDF Import States
  const [uploading, setUploading] = useState(false);
  const [ocrText, setOcrText] = useState("");

  const handleGenerateQuestions = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/ai/generate-questions", {
        topic,
        difficulty,
        type: "CODING",
        count,
      });
      
      const questionsArray = Array.isArray(res.data) ? res.data : [];
      const mapped = questionsArray.map((q: any, i: number) => ({
        id: i + 1,
        question: q.question,
        type: q.options && q.options.length > 0 ? "MCQ" : "Coding",
        points: q.marks || 20,
        options: q.options || [],
        answer: q.answer || "",
      }));
      
      setGeneratedQuestions(mapped);
      toast.success("AI Assignment Questions generated successfully! 📝");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to generate questions";
      toast.error(msg);
    }
    setGenerating(false);
  };

  const handleGeneratePlan = async () => {
    setPlanning(true);
    try {
      const res = await api.post("/ai/lesson-plan", {
        topic: planGoal,
        duration: "5 days",
        audience: planSubject,
      });
      
      const plan = res.data;
      let text = `### AI Synthesized Lesson Plan: ${planSubject}\n\n`;
      if (plan && plan.weekPlan && Array.isArray(plan.weekPlan)) {
        plan.weekPlan.forEach((wp: any, i: number) => {
          text += `#### Week/Day ${i + 1}: ${wp.day || wp.focus || "Core Topic"}\n`;
          text += `- **Topics:** ${Array.isArray(wp.topics) ? wp.topics.join(", ") : wp.topic || "N/A"}\n`;
          text += `- **Exercises:** ${Array.isArray(wp.exercises) ? wp.exercises.join(", ") : "N/A"}\n`;
          text += `- **Homework:** ${Array.isArray(wp.homework) ? wp.homework.join(", ") : wp.homework || "N/A"}\n\n`;
        });
      } else if (plan && typeof plan === "object") {
        text += JSON.stringify(plan, null, 2);
      } else {
        text += plan || "No lesson plan generated.";
      }
      
      setGeneratedPlan(text);
      toast.success("AI Lesson Plan aligned! 📅");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to generate lesson plan";
      toast.error(msg);
    }
    setPlanning(false);
  };

  const handleUploadPDF = async () => {
    setUploading(true);
    try {
      // Simulate file upload or trigger parsing
      await new Promise(r => setTimeout(r, 1500));
      setOcrText(
        `[OCR Extracted Text - Compiler Design Exam Paper May 2025]
1. Define Left Recursion and how to eliminate it.
2. Construct LL(1) parsing table for the grammar: E -> E + T | T.
3. Discuss the differences between SLR, LALR, and CLR parsers.`
      );
      toast.success("PDF Syllabus parsed via AI Scanner! 📂");
    } catch (error: any) {
      toast.error("Failed to parse PDF document");
    }
    setUploading(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-violet-400" />
          AI Course Tools™
        </h1>
        <p className="text-gray-400 text-sm">Automated lecture planning, assignment question generation, and OCR textbook scanning for teachers</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5 overflow-x-auto scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { setActiveTab(t); }}
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

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Tool Action */}
        <div className="lg:col-span-2 space-y-5">
          <AnimatePresence mode="wait">
            {/* 1. QUESTION GENERATOR */}
            {activeTab === "Question Generator" && (
              <motion.div
                key="q-gen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="glass-card rounded-xl p-5 border border-white/5 bg-[#0d0d16]/30 space-y-4">
                  <h2 className="text-sm font-bold text-white">Generation Parameters</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">Topic</label>
                      <input 
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">Difficulty</label>
                      <select 
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">Count</label>
                      <input 
                        type="number"
                        value={count}
                        onChange={e => setCount(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500/40"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateQuestions}
                    disabled={generating}
                    className="w-full py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                  >
                    {generating ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {generating ? "Generating via sandbox AI..." : "Generate Assignment Questions"}
                  </button>
                </div>

                {/* Generated Questions display */}
                {generatedQuestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card rounded-xl p-5 border border-violet-500/20 bg-[#0d0d16]/20 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-white">Generated AI Drafts</h3>
                      <button className="text-[10px] px-3 py-1 bg-violet-600 text-white font-semibold rounded hover:bg-violet-500 transition-all">
                        Publish to Students
                      </button>
                    </div>
                    <div className="space-y-3">
                      {generatedQuestions.map((q) => (
                        <div key={q.id} className="p-3.5 bg-[#131327]/60 border border-white/5 rounded-lg space-y-2 text-xs">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-cyan-400 uppercase">{q.type}</span>
                            <span className="text-gray-500">{q.points} XP Reward</span>
                          </div>
                          <p className="font-medium text-white">{q.question}</p>
                          {q.options.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {q.options.map((opt: string) => (
                                <div key={opt} className={`p-2 rounded bg-white/5 border border-white/5 flex items-center gap-1.5 ${opt === q.answer ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" : "text-gray-400"}`}>
                                  {opt === q.answer && <Check size={10} />}
                                  <span>{opt}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 2. LESSON PLANNER */}
            {activeTab === "Lesson Planner" && (
              <motion.div
                key="l-plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="glass-card rounded-xl p-5 border border-white/5 bg-[#0d0d16]/30 space-y-4">
                  <h2 className="text-sm font-bold text-white">Lesson Objectives</h2>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">Subject/Course</label>
                      <input 
                        value={planSubject}
                        onChange={e => setPlanSubject(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">Learning goal / topic details</label>
                      <textarea
                        rows={2}
                        value={planGoal}
                        onChange={e => setPlanGoal(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-violet-500/40 resize-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleGeneratePlan}
                    disabled={planning}
                    className="w-full py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                  >
                    {planning ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {planning ? "Architecting plan..." : "Generate AI Lesson Plan"}
                  </button>
                </div>

                {generatedPlan && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card rounded-xl p-5 border border-violet-500/20 bg-[#0d0d16]/20 space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h3 className="text-xs font-bold text-white">Generated 5-Day Plan</h3>
                      <button className="text-[10px] px-3 py-1 bg-white/5 text-gray-300 rounded border border-white/10 hover:bg-white/10 transition-all">Export PDF</button>
                    </div>
                    <pre className="text-xs text-gray-300 font-sans leading-relaxed whitespace-pre-wrap">{generatedPlan}</pre>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 3. PDF IMPORT */}
            {activeTab === "PDF Import" && (
              <motion.div
                key="ocr-import"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="glass-card rounded-xl p-8 border border-dashed border-white/10 bg-[#0d0d16]/30 text-center flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-violet-400">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Import lecture papers or syllabus books</h3>
                    <p className="text-[10px] text-gray-400 mt-1">Upload files (.pdf, .png, .jpg) and the AI scanner will automatically OCR and extract test questions.</p>
                  </div>
                  <button 
                    onClick={handleUploadPDF}
                    disabled={uploading}
                    className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all"
                  >
                    {uploading ? "Scanning file..." : "Browse Files & Parse"}
                  </button>
                </div>

                {ocrText && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card rounded-xl p-5 border border-white/5 space-y-3"
                  >
                    <h3 className="text-xs font-bold text-white">OCR Scanned Results</h3>
                    <textarea 
                      rows={5}
                      value={ocrText}
                      onChange={e => setOcrText(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-gray-300 outline-none resize-none font-mono"
                    />
                    <button className="px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/10 transition-all flex items-center gap-1.5">
                      <Sparkles size={12} /> Convert Scanned Text to Live Assignment
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 4. QUESTION BANK */}
            {activeTab === "Question Bank" && (
              <motion.div
                key="q-bank"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {[
                  { q: "Design a high-throughput load balancer in Node.js.", type: "Coding Task", topic: "Systems", date: "May 20" },
                  { q: "What are database isolation levels? Explain Dirty Read.", type: "MCQ / Theory", topic: "Databases", date: "May 18" },
                  { q: "Implement double hashing lookup map algorithm.", type: "Coding Task", topic: "DSA Algorithms", date: "May 15" }
                ].map((item, idx) => (
                  <div key={idx} className="glass-card rounded-xl p-4 border border-white/5 bg-[#0d0d16]/30 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-[#131327] text-cyan-400 border border-cyan-500/10 rounded">{item.topic}</span>
                        <span className="text-[10px] text-gray-500">Added {item.date}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white">{item.q}</h4>
                      <p className="text-[10px] text-gray-500">Format: {item.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"><Trash2 size={12} /></button>
                      <button className="text-[10px] px-3 py-1.5 bg-violet-600/20 text-violet-400 border border-violet-500/20 rounded hover:bg-violet-600/40 transition-all">Add to Assignment</button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar: Active Course Syllabus and Live stats */}
        <div className="space-y-5">
          {/* Active Course */}
          <div className="glass-card rounded-xl p-5 border border-white/5 bg-[#0d0d16]/20 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode size={14} className="text-cyan-400" />
              Your Active Syllabus
            </h2>
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400 font-semibold">Course: System Design CSE-B</span>
                <span className="text-cyan-400 font-bold">78% Done</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400"><CheckCircle size={12} /> Week 1: Microservices Setup</div>
                <div className="flex items-center gap-2 text-emerald-400"><CheckCircle size={12} /> Week 2: Messaging Queues (Kafka)</div>
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse"><ArrowRight size={12} /> Week 3: Distributed Cache (Redis)</div>
                <div className="flex items-center gap-2 text-gray-500"><Clock size={12} /> Week 4: Databases Sharding & Scaling</div>
              </div>
            </div>
          </div>

          {/* Teacher Stats summary */}
          <div className="glass-card rounded-xl p-5 border border-white/5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Database size={14} className="text-violet-400" />
              Syllabus Coverage & AI
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2 bg-white/3 rounded">
                <span className="text-gray-400">Total Questions Generated</span>
                <span className="text-white font-bold">142 Items</span>
              </div>
              <div className="flex justify-between p-2 bg-white/3 rounded">
                <span className="text-gray-400">Total Lessons Planned</span>
                <span className="text-white font-bold">12 Weeks</span>
              </div>
              <div className="flex justify-between p-2 bg-white/3 rounded">
                <span className="text-gray-400">Average Student Progress</span>
                <span className="text-cyan-400 font-bold">84% Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
