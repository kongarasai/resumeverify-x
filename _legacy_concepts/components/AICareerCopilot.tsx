// ResumeVerify X™ — AI Career Copilot Floating Widget
import React, { useState, useRef, useEffect } from 'react';

interface Message { role: 'user' | 'assistant'; content: string; }

const QUICK_ACTIONS = [
  'Analyze my weak skills',
  'Generate today\'s schedule',
  'What companies am I eligible for?',
  'Improve my Trust Score',
  'Mock interview now',
  'Show salary prediction',
];

export const AICareerCopilot: React.FC<{ candidateId: string }> = ({ candidateId }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m your AI Career Copilot. You have a Zoho interview tomorrow. Want me to run a quick 15-min mock now?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    // Call AI API
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, candidateId })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I\'m here! Based on your profile, focus on System Design today — it\'s your weakest area at 38%. Want me to generate a study plan?' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100 }}>
      {open && (
        <div style={{ position: 'absolute', bottom: 60, right: 0, width: 320, background: '#0f1117', border: '1px solid #ffffff18', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px #00000080' }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #ffffff0d', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#4f8ef7,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✨</div>
            <div><div style={{ fontSize: 12, fontWeight: 700 }}>AI Career Copilot</div><div style={{ fontSize: 10, color: '#34d399' }}>● Always available</div></div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#4a5068', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
          <div style={{ height: 280, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ maxWidth: '85%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#1a3560' : '#161923', borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px', padding: '9px 12px', fontSize: 11, lineHeight: 1.6, color: '#e2e6f0', borderLeft: m.role === 'assistant' ? '2px solid #a78bfa' : 'none' }}>{m.content}</div>
            ))}
            {loading && <div style={{ alignSelf: 'flex-start', background: '#161923', borderRadius: 10, padding: '9px 12px', fontSize: 11, color: '#4a5068', borderLeft: '2px solid #a78bfa' }}>Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '8px 12px', borderTop: '1px solid #ffffff0d' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
              {QUICK_ACTIONS.slice(0, 3).map(a => (
                <button key={a} onClick={() => sendMessage(a)} style={{ background: '#1a3560', color: '#4f8ef7', border: '1px solid #4f8ef715', borderRadius: 10, padding: '3px 8px', fontSize: 10, cursor: 'pointer' }}>{a}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask me anything..." style={{ flex: 1, background: '#161923', border: '1px solid #ffffff18', borderRadius: 8, padding: '7px 10px', color: '#e2e6f0', fontSize: 11, outline: 'none' }} />
              <button onClick={() => sendMessage()} style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 11, cursor: 'pointer' }}>→</button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#4f8ef7,#a78bfa)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px #4f8ef750', fontSize: 20, transition: 'transform .15s' }}>✨</button>
    </div>
  );
};

export default AICareerCopilot;
