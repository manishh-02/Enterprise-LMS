import React from 'react';

const AnalyticsEngine = () => {
  const data = [10, 25, 18, 40, 32, 50, 45];
  const max = Math.max(...data);
  const width = 600;
  const height = 60; // Height bahut kam kar di hai (Super compact)
  const barWidth = width / data.length;

  return (
    <div style={{ background: '#1e293b', padding: '15px 20px', borderRadius: '16px', marginBottom: '25px', color: '#fff', width: '100%' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#94a3b8' }}>User Growth Trend</h3>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {data.map((val, i) => (
          <rect 
            key={i} 
            x={i * barWidth + 5} 
            y={height - (val / max * height)} 
            width={barWidth - 10} 
            height={(val / max * height)} 
            fill="#38bdf8" 
            rx="3"
          />
        ))}
      </svg>
    </div>
  );
};

export default AnalyticsEngine;