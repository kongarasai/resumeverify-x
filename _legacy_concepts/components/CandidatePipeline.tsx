// ResumeVerify X™ — Candidate Hiring Pipeline (Kanban)
import React, { useState } from 'react';

type Stage = 'Applied' | 'Screening' | 'Assessment' | 'HR Round' | 'Technical' | 'Final Round' | 'Offer Sent' | 'Hired' | 'Rejected';

interface Candidate { id: string; name: string; trust: number; college: string; role: string; }

const STAGES: Stage[] = ['Applied','Screening','Assessment','HR Round','Technical','Final Round','Offer Sent','Hired','Rejected'];

const STAGE_COLORS: Record<Stage, string> = {
  'Applied': '#4a5068', 'Screening': '#4f8ef7', 'Assessment': '#a78bfa',
  'HR Round': '#f59e0b', 'Technical': '#22d3ee', 'Final Round': '#f472b6',
  'Offer Sent': '#34d399', 'Hired': '#059669', 'Rejected': '#f87171'
};

const MOCK_DATA: Record<Stage, Candidate[]> = {
  'Applied': [{ id:'1', name:'Meena P.', trust:72, college:'JNTU', role:'SDE-1' }, { id:'2', name:'Suresh K.', trust:68, college:'VIT', role:'SDE-1' }],
  'Screening': [{ id:'3', name:'Sriram K.', trust:83, college:'NIT', role:'SDE-1' }],
  'Assessment': [{ id:'4', name:'Arjun Kumar', trust:87, college:'JNTU', role:'SDE-1' }, { id:'5', name:'Priya S.', trust:81, college:'VIT', role:'SDE-1' }],
  'HR Round': [{ id:'6', name:'Vikram N.', trust:79, college:'BITS', role:'SDE-2' }],
  'Technical': [{ id:'7', name:'Karthi R.', trust:94, college:'BITS', role:'SDE-2' }],
  'Final Round': [{ id:'8', name:'Meera T.', trust:82, college:'NIT', role:'SDE-1' }],
  'Offer Sent': [{ id:'9', name:'Rahul K.', trust:88, college:'VIT', role:'SDE-1' }],
  'Hired': [{ id:'10', name:'Ravi M.', trust:85, college:'JNTU', role:'SDE-1' }],
  'Rejected': [{ id:'11', name:'Ankit S.', trust:44, college:'Other', role:'SDE-1' }],
};

export const CandidatePipeline: React.FC = () => {
  const [pipeline, setPipeline] = useState(MOCK_DATA);
  const [dragging, setDragging] = useState<{ candidateId: string; fromStage: Stage } | null>(null);

  const moveCandidate = (candidateId: string, fromStage: Stage, toStage: Stage) => {
    if (fromStage === toStage) return;
    const candidate = pipeline[fromStage].find(c => c.id === candidateId);
    if (!candidate) return;
    setPipeline(prev => ({
      ...prev,
      [fromStage]: prev[fromStage].filter(c => c.id !== candidateId),
      [toStage]: [...prev[toStage], candidate]
    }));
  };

  const total = Object.values(pipeline).flat().length;
  const hired = pipeline['Hired'].length;
  const offers = pipeline['Offer Sent'].length;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {[['Total Tracked', total, '#4f8ef7'], ['Hired', hired, '#34d399'], ['Offers Out', offers, '#f59e0b'], ['In Process', total - hired - pipeline['Rejected'].length, '#a78bfa']].map(([l, v, c]) => (
          <div key={String(l)} style={{ flex: 1, background: '#0f1117', border: '1px solid #ffffff0d', borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: '#4a5068', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: String(c) }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
        {STAGES.map(stage => (
          <div key={stage}
            onDragOver={e => e.preventDefault()}
            onDrop={() => dragging && moveCandidate(dragging.candidateId, dragging.fromStage, stage)}
            style={{ background: '#161923', border: `1px solid ${STAGE_COLORS[stage]}22`, borderRadius: 10, padding: 10, minWidth: 150, flexShrink: 0 }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.5px', color: STAGE_COLORS[stage], marginBottom: 8, fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
              <span>{stage}</span><span>{pipeline[stage].length}</span>
            </div>
            {pipeline[stage].map(c => (
              <div key={c.id}
                draggable
                onDragStart={() => setDragging({ candidateId: c.id, fromStage: stage })}
                onDragEnd={() => setDragging(null)}
                style={{ background: '#0f1117', border: '1px solid #ffffff0d', borderRadius: 7, padding: 9, marginBottom: 6, cursor: 'grab', transition: 'all .12s', fontSize: 11 }}>
                <div style={{ fontWeight: 600, marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 9, color: '#4a5068' }}>{c.college}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                  <span style={{ fontSize: 9, background: '#0d3d2a', color: '#34d399', borderRadius: 8, padding: '1px 6px' }}>T:{c.trust}</span>
                  <span style={{ fontSize: 9, color: '#4a5068' }}>{c.role}</span>
                </div>
              </div>
            ))}
            {pipeline[stage].length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#4a5068', fontSize: 10 }}>Drop here</div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        <button style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, cursor: 'pointer' }}>Add Candidate</button>
        <button style={{ background: '#161923', color: '#e2e6f0', border: '1px solid #ffffff18', borderRadius: 8, padding: '6px 12px', fontSize: 11, cursor: 'pointer' }}>Bulk Move Stage</button>
        <button style={{ background: '#161923', color: '#e2e6f0', border: '1px solid #ffffff18', borderRadius: 8, padding: '6px 12px', fontSize: 11, cursor: 'pointer' }}>Export Pipeline</button>
        <button style={{ background: '#0d3d2a', color: '#34d399', border: '1px solid #34d39920', borderRadius: 8, padding: '6px 12px', fontSize: 11, cursor: 'pointer' }}>Generate Offer Letters</button>
      </div>
    </div>
  );
};

export default CandidatePipeline;
