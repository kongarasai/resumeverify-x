// ResumeVerify X™ — Trust Score Ring Component (React/TypeScript)
import React, { useEffect, useState } from 'react';

interface TrustScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showBreakdown?: boolean;
  breakdown?: {
    github: number;
    leetcode: number;
    resume: number;
    projects: number;
    fraud: number;
  };
}

const TRUST_LEVELS = {
  95: { label: 'Highly Trusted', color: '#34d399' },
  80: { label: 'Verified', color: '#4f8ef7' },
  60: { label: 'Moderate', color: '#f59e0b' },
  0:  { label: 'High Risk', color: '#f87171' },
};

export const TrustScoreRing: React.FC<TrustScoreRingProps> = ({
  score, size = 120, strokeWidth = 10, showBreakdown = false, breakdown
}) => {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  const level = Object.entries(TRUST_LEVELS)
    .sort(([a], [b]) => Number(b) - Number(a))
    .find(([threshold]) => score >= Number(threshold));
  const color = level?.[1]?.color || '#f87171';
  const label = level?.[1]?.label || 'High Risk';

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1e2330" strokeWidth={strokeWidth} />
          <circle
            cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size * 0.2, fontWeight: 800, color }}>{score}</span>
          <span style={{ fontSize: 10, color: '#4a5068' }}>/ 100</span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 700, color, fontSize: 13 }}>{label}</div>
        <div style={{ fontSize: 10, color: '#4a5068' }}>AI Verified</div>
      </div>
      {showBreakdown && breakdown && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.entries(breakdown).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 70, fontSize: 10, color: '#4a5068', textTransform: 'capitalize' }}>{key}</span>
              <div style={{ flex: 1, height: 4, background: '#1e2330', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${val}%`, background: color, borderRadius: 2, transition: 'width 1s' }} />
              </div>
              <span style={{ fontSize: 10, color: '#4a5068', width: 20, textAlign: 'right' }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrustScoreRing;
