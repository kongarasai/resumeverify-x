// ResumeVerify X™ — Live Interview Room Component
import React, { useState, useEffect, useRef } from 'react';

interface Participant { id: string; name: string; role: string; videoEnabled: boolean; audioEnabled: boolean; }
interface Score { problemSolving: number; codeQuality: number; communication: number; timeManagement: number; culturalFit: number; }

export const LiveInterviewRoom: React.FC<{ roomId: string; currentUser: any }> = ({ roomId, currentUser }) => {
  const [code, setCode] = useState(`def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i`);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [scores, setScores] = useState<Score>({ problemSolving: 80, codeQuality: 75, communication: 88, timeManagement: 70, culturalFit: 85 });
  const [notes, setNotes] = useState('');
  const [integrity, setIntegrity] = useState({ tabSwitches: 0, pasteCount: 0, faces: 1, score: 98 });
  const [activeTab, setActiveTab] = useState<'code'|'whiteboard'|'scorecard'>('code');
  const socketRef = useRef<any>(null);

  const runCode = async () => {
    setRunning(true);
    setTimeout(() => {
      setOutput('✓ 3/3 test cases passed\nRuntime: 48ms (beats 92%)\nMemory: 14.2 MB');
      setRunning(false);
    }, 1200);
  };

  const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, height: '100%' }}>
      <div>
        {/* Video panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {['Candidate', 'Interviewer'].map((role, i) => (
            <div key={i} style={{ background: '#111827', borderRadius: 10, aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid #ffffff0d' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: i === 0 ? '#1a3560' : '#2d1a5c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{role[0]}</div>
              <span style={{ position: 'absolute', bottom: 8, left: 8, background: '#00000099', borderRadius: 5, padding: '2px 7px', fontSize: 10 }}>{role}</span>
            </div>
          ))}
        </div>
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 2, background: '#161923', borderRadius: 10, padding: 3, marginBottom: 12 }}>
          {(['code', 'whiteboard', 'scorecard'] as const).map(t => (
            <div key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '6px', textAlign: 'center', borderRadius: 7, cursor: 'pointer', fontSize: 11, background: activeTab === t ? '#0f1117' : 'transparent', color: activeTab === t ? '#e2e6f0' : '#4a5068', fontWeight: activeTab === t ? 600 : 400, transition: 'all .12s', textTransform: 'capitalize' }}>{t}</div>
          ))}
        </div>
        {activeTab === 'code' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <select value={language} onChange={e => setLanguage(e.target.value)} style={{ background: '#161923', border: '1px solid #ffffff0d', borderRadius: 6, color: '#e2e6f0', padding: '4px 8px', fontSize: 11 }}>
                {['python','java','c++','javascript','go','rust'].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
              <button onClick={runCode} disabled={running} style={{ background: running ? '#1e2330' : 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 11, cursor: 'pointer' }}>{running ? 'Running...' : '▶ Run'}</button>
              <button style={{ background: '#161923', color: '#e2e6f0', border: '1px solid #ffffff18', borderRadius: 7, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>Add Test Case</button>
              <button style={{ background: '#161923', color: '#e2e6f0', border: '1px solid #ffffff18', borderRadius: 7, padding: '5px 10px', fontSize: 11, cursor: 'pointer', marginLeft: 'auto' }}>+10 min</button>
            </div>
            <textarea value={code} onChange={e => setCode(e.target.value)} style={{ width: '100%', background: '#0d1117', border: '1px solid #ffffff0d', borderRadius: 10, padding: 12, fontFamily: "'Fira Code', monospace", fontSize: 12, color: '#c9d1d9', lineHeight: 1.7, resize: 'vertical', minHeight: 200, outline: 'none' }} />
            {output && <div style={{ background: '#0d1117', borderRadius: 8, padding: 10, fontFamily: 'monospace', fontSize: 11, color: '#3fb950', marginTop: 8, whiteSpace: 'pre' }}>{output}</div>}
          </div>
        )}
        {activeTab === 'whiteboard' && (
          <div style={{ background: '#0f1117', border: '1px solid #ffffff0d', borderRadius: 12, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 32 }}>🎨</span>
            <p style={{ fontSize: 12, color: '#4a5068' }}>Excalidraw whiteboard — System design, DB diagrams, UML</p>
            <button style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, cursor: 'pointer' }}>Open Whiteboard</button>
          </div>
        )}
        {activeTab === 'scorecard' && (
          <div>
            {Object.entries(scores).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ textTransform: 'capitalize', color: '#8b92a5' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span style={{ fontWeight: 700, color: val >= 80 ? '#34d399' : val >= 60 ? '#f59e0b' : '#f87171' }}>{val}/100</span>
                </div>
                <input type="range" min={0} max={100} value={val} onChange={e => setScores(s => ({ ...s, [key]: +e.target.value }))} style={{ width: '100%', accentColor: '#4f8ef7' }} />
              </div>
            ))}
            <div style={{ background: '#161923', borderRadius: 8, padding: 10, marginTop: 8 }}>
              <div style={{ fontSize: 10, color: '#4a5068', marginBottom: 5 }}>Overall Score</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#34d399' }}>{overallScore.toFixed(0)}<span style={{ fontSize: 12, color: '#4a5068' }}>/100</span></div>
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Interviewer notes..." style={{ width: '100%', background: '#161923', border: '1px solid #ffffff0d', borderRadius: 8, padding: 10, color: '#e2e6f0', fontSize: 11, resize: 'none', marginTop: 8, outline: 'none', lineHeight: 1.6 }} rows={3} />
            <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
              <button style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 11, cursor: 'pointer' }}>Save & Advance</button>
              <button style={{ background: '#3d1010', color: '#f87171', border: '1px solid #f8717120', borderRadius: 8, padding: '6px 14px', fontSize: 11, cursor: 'pointer' }}>Reject</button>
            </div>
          </div>
        )}
      </div>
      {/* Right panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: '#0f1117', border: '1px solid #ffffff0d', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Integrity Monitor</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['Integrity', `${integrity.score}%`, '#34d399'], ['Tab Switches', integrity.tabSwitches, '#e2e6f0'], ['Faces', integrity.faces, '#34d399'], ['Paste Events', integrity.pasteCount, '#e2e6f0']].map(([l, v, c]) => (
              <div key={String(l)} style={{ background: '#161923', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: String(c) }}>{String(v)}</div>
                <div style={{ fontSize: 9, color: '#4a5068' }}>{String(l)}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#0f1117', border: '1px solid #ffffff0d', borderRadius: 12, padding: 14, flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Candidate Trust Profile</div>
          <div style={{ background: '#161923', borderRadius: 8, padding: 10, fontSize: 11, lineHeight: 1.6, borderLeft: '2px solid #a78bfa', color: '#8b92a5' }}>
            Trust Score: <strong style={{ color: '#34d399' }}>87</strong><br />
            GitHub: 92 repos · Daily commits<br />
            LeetCode: 1,642 rating · 342 solved<br />
            Fraud Risk: <strong style={{ color: '#34d399' }}>Very Low (4%)</strong><br />
            Projects: 7 verified
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            <button style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px', fontSize: 11, cursor: 'pointer' }}>Full Trust Report</button>
            <button style={{ background: '#161923', color: '#e2e6f0', border: '1px solid #ffffff18', borderRadius: 8, padding: '7px', fontSize: 11, cursor: 'pointer' }}>Watch Skill Proofs</button>
            <button style={{ background: '#161923', color: '#e2e6f0', border: '1px solid #ffffff18', borderRadius: 8, padding: '7px', fontSize: 11, cursor: 'pointer' }}>Download Transcript</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInterviewRoom;
