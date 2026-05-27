import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  private async chat(prompt: string, fallbackTemplate: string): Promise<string> {
    // 1. Try OpenAI
    try {
      if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('exceeded')) {
        const res = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        });
        const content = res.choices[0]?.message?.content;
        if (content) return content;
      }
    } catch (err: any) {
      console.warn('⚠️ OpenAI API Error (possibly quota exceeded):', err.message);
    }

    // 2. Try Groq Llama3
    try {
      if (process.env.GROQ_API_KEY) {
        console.log('🔄 Attempting Groq Llama-3 API Fallback...');
        const groq = new OpenAI({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: 'https://api.groq.com/openai/v1',
        });
        const res = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        });
        const content = res.choices[0]?.message?.content;
        if (content) return content;
      }
    } catch (err: any) {
      console.warn('⚠️ Groq API Fallback Error:', err.message);
    }

    // 3. Structured fallback
    console.warn('⚠️ Both live AI providers failed. Returning high-fidelity schema template.');
    return fallbackTemplate;
  }

  async generateCareerPlan(targetRole: string, targetCompany: string, weakSkills: string[], currentScore: number) {
    const prompt = `You are an expert AI career coach for ResumeVerify X platform.
Generate a detailed 90-day career plan for a candidate targeting the role of "${targetRole}" at "${targetCompany}".
Current trust score: ${currentScore}/100. Weak skills: ${weakSkills.join(', ')}.
Return JSON: { roadmap: [{week: number, tasks: string[], focus: string}], keySkills: string[], timeline: string, expectedOutcome: string }`;
    
    const fallback = JSON.stringify({
      roadmap: [
        { week: 1, focus: "DSA foundation & Arrays", tasks: ["Complete Arrays module", "Solve 10 LeetCode Easy problems", "Commit daily to GitHub"] },
        { week: 2, focus: "Advanced System Design Basics", tasks: ["Study consistent hashing", "Draw scale-out cache diagrams", "Prepare microservices checklist"] },
        { week: 3, focus: "Interview Preparation & Mocks", tasks: ["Practice 5 mock technical interview questions", "Watch resume parser optimizations", "Complete weekly assignment"] }
      ],
      keySkills: ["Data Structures", "System Design", "SQL Optimization", "Cloud Computing"],
      timeline: "90 Days",
      expectedOutcome: "Placement Readiness at Top-Tier Tech Companies"
    });

    const raw = await this.chat(prompt, fallback);
    try { return JSON.parse(raw.replace(/```json\n?|\n?```/g, '')); }
    catch { return JSON.parse(fallback); }
  }

  async generateDailyMissions(role: string, weakSkills: string[], streak: number) {
    const prompt = `Generate 5 daily AI missions for a ${role} candidate with ${streak} day streak.
Weak skills: ${weakSkills.join(', ')}.
Return JSON array: [{title: string, type: "CODING"|"COMMUNICATION"|"PROJECT"|"INTERVIEW"|"GITHUB", xp: number, description: string, estimatedMinutes: number}]`;
    
    const fallback = JSON.stringify([
      { title: "Solve 2 LeetCode Medium problems", type: "CODING", xp: 100, description: "Strengthen dynamic programming and graphs", estimatedMinutes: 45 },
      { title: "Push code to GitHub (1 commit)", type: "GITHUB", xp: 50, description: "Maintain active streak consistency", estimatedMinutes: 15 },
      { title: "Watch system design caching session", type: "LEARNING", xp: 75, description: "Understand Redis and Memcached rings", estimatedMinutes: 30 },
      { title: "Practice 10 technical aptitude questions", type: "INTERVIEW", xp: 60, description: "Improve analytical placement metrics", estimatedMinutes: 20 },
      { title: "Draft live project documentation", type: "PROJECT", xp: 120, description: "Write a descriptive README for your key repo", estimatedMinutes: 40 }
    ]);

    const raw = await this.chat(prompt, fallback);
    try { return JSON.parse(raw.replace(/```json\n?|\n?```/g, '')); }
    catch { return JSON.parse(fallback); }
  }

  async generateSchedule(freeTime: string, collegeTime: string, sleepTime: string, targetRole: string) {
    const prompt = `Create a personalized weekly study schedule for a student preparing for ${targetRole}.
Available free time: ${freeTime}. College hours: ${collegeTime}. Sleep: ${sleepTime}.
Return JSON: { schedule: [{day: string, slots: [{time: string, activity: string, category: "CODING"|"REVISION"|"INTERVIEW"|"LEARNING", duration: number}]}] }`;
    
    const fallback = JSON.stringify({
      schedule: [
        { day: "Monday", slots: [{ time: "6:00 PM - 7:00 PM", activity: "LeetCode Practice", category: "CODING", duration: 60 }, { time: "7:00 PM - 8:30 PM", activity: "System Design foundations", category: "LEARNING", duration: 90 }] },
        { day: "Tuesday", slots: [{ time: "6:00 PM - 7:00 PM", activity: "Mock Interviews", category: "INTERVIEW", duration: 60 }, { time: "7:00 PM - 8:00 PM", activity: "Weekly revision", category: "REVISION", duration: 60 }] },
        { day: "Wednesday", slots: [{ time: "6:00 PM - 8:00 PM", activity: "Consistent Hashing study", category: "LEARNING", duration: 120 }] }
      ]
    });

    const raw = await this.chat(prompt, fallback);
    try { return JSON.parse(raw.replace(/```json\n?|\n?```/g, '')); }
    catch { return JSON.parse(fallback); }
  }

  async generateLessonPlan(topic: string, duration: string, audience: string) {
    const prompt = `Create a comprehensive lesson plan for teaching "${topic}" to ${audience} over ${duration}.
Return JSON: { weekPlan: [{day: string, topics: string[], exercises: string[], homework: string}], assessments: string[], resources: string[] }`;
    
    const fallback = JSON.stringify({
      weekPlan: [
        { day: "Day 1", topics: ["Introduction to Cache", "RAM speed comparisons"], exercises: ["Plot memory read times"], homework: "Calculate cache hit rates" },
        { day: "Day 2", topics: ["Consistent Hashing algorithms"], exercises: ["Draw slot rings"], homework: "Implement ring mapping in JS" },
        { day: "Day 3", topics: ["Redis vs Memcached"], exercises: ["Boot caching instances"], homework: "Compare latency stats" }
      ],
      assessments: ["Mid-term caching quiz", "Implement cache eviction homework"],
      resources: ["Designing Data-Intensive Applications", "Redis Official docs"]
    });

    const raw = await this.chat(prompt, fallback);
    try { return JSON.parse(raw.replace(/```json\n?|\n?```/g, '')); }
    catch { return JSON.parse(fallback); }
  }

  async generateQuestions(topic: string, difficulty: string, type: string, count: number) {
    const prompt = `Generate ${count} ${difficulty} ${type} questions about "${topic}" for technical interviews/assessments.
Return JSON array: [{question: string, options?: string[], answer: string, explanation: string, marks: number}]`;
    
    const fallback = JSON.stringify([
      { question: "Given the root of a binary tree, return its maximum depth.", options: [], answer: "Coding task", explanation: "Use depth-first search or breadth-first search to find depth.", marks: 50 },
      { question: "Which traversal strategy visits nodes in order of their level from top to bottom?", options: ["Inorder", "Preorder", "Level Order", "Postorder"], answer: "Level Order", explanation: "Level Order uses a Queue to traverse node levels.", marks: 20 },
      { question: "What is the time complexity to find the lowest common ancestor (LCA) in a balanced BST?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], answer: "O(log N)", explanation: "In a balanced BST, we traverse heights with logarithmic steps.", marks: 20 }
    ]);

    const raw = await this.chat(prompt, fallback);
    try { return JSON.parse(raw.replace(/```json\n?|\n?```/g, '')); }
    catch { return JSON.parse(fallback); }
  }

  async companyPreparationPlan(company: string, role: string, currentSkills: string[]) {
    const prompt = `Create a company-specific preparation plan for ${company} - ${role} position.
Candidate current skills: ${currentSkills.join(', ')}.
Return JSON: { overview: string, interviewProcess: string[], keyTopics: string[], timeline: string, resources: string[], weeklyPlan: [{week: number, focus: string, tasks: string[]}] }`;
    
    const fallback = JSON.stringify({
      overview: "Placement focuses heavily on problem-solving, structural design, and scaling metrics.",
      interviewProcess: ["Online Assessment", "Technical Round 1", "Technical Round 2 (System Design)", "HR culture round"],
      keyTopics: ["Arrays & Strings", "Trees & Graphs", "DP optimization", "Cache sharding", "Consistency metrics"],
      timeline: "30 Days Prep",
      resources: ["LeetCode Top Interview 150", "Grokking the System Design"],
      weeklyPlan: [
        { week: 1, focus: "DSA foundational algorithms", tasks: ["Solve 20 Easy LeetCode", "Setup Git streak"] },
        { week: 2, focus: "Advanced system scalability", tasks: ["Analyze cache sharding rings", "Solve 5 Medium scaling problems"] }
      ]
    });

    const raw = await this.chat(prompt, fallback);
    try { return JSON.parse(raw.replace(/```json\n?|\n?```/g, '')); }
    catch { return JSON.parse(fallback); }
  }

  async analyzeSalaryTrends(role: string, skills: string[], yearsOfExp: number) {
    const prompt = `Analyze salary trends for ${role} with ${yearsOfExp} years experience and skills: ${skills.join(', ')}.
Return JSON: { currentRange: {min: number, max: number, currency: string}, projections: [{year: number, min: number, max: number}], topPayingCompanies: string[], topPayingSkills: string[] }`;
    
    const fallback = JSON.stringify({
      currentRange: { min: 600000, max: 1800000, currency: "INR" },
      projections: [
        { year: 2024, min: 600000, max: 1800000 },
        { year: 2025, min: 850000, max: 2400000 },
        { year: 2026, min: 1200000, max: 3200000 }
      ],
      topPayingCompanies: ["Google", "Microsoft", "Zoho", "Atlassian"],
      topPayingSkills: ["System Design", "Kafka Sharding", "Go Lang", "Kubernetes"]
    });

    const raw = await this.chat(prompt, fallback);
    try { return JSON.parse(raw.replace(/```json\n?|\n?```/g, '')); }
    catch { return JSON.parse(fallback); }
  }
}
