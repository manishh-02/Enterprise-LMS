import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(data.data);
      } catch (err) { console.error("Failed to load analytics"); }
      finally { setIsLoading(false); }
    };
    fetchAnalytics();
  }, []);

  const styles = `
    .god-dashboard { 
      font-family: 'Inter', system-ui, sans-serif; 
      padding: 60px 80px; 
      width: 100%; 
      min-height: 100vh;
      background: #f8fafc;
      background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .header-block { margin-bottom: 50px; }
    .header-block h1 { font-size: 48px; font-weight: 900; letter-spacing: -2px; color: #0f172a; margin-bottom: 12px; }
    .header-block p { font-size: 18px; color: #64748b; font-weight: 400; }

    .god-stats-grid { 
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 30px; 
      margin-bottom: 50px; 
    }
    .god-stat-card { 
      background: white; 
      padding: 40px; 
      border-radius: 30px; 
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .god-stat-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.1); }
    .stat-label { font-size: 14px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
    .stat-number { font-size: 56px; font-weight: 900; color: #0f172a; line-height: 1; }

    .god-grid-layout { 
      display: grid; 
      grid-template-columns: 1.5fr 1fr; 
      gap: 30px; 
    }
    .god-panel { 
      background: white; 
      padding: 40px; 
      border-radius: 30px; 
      border: 1px solid rgba(0,0,0,0.05);
    }
    .god-panel-title { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between; }
    
    .progress-wrapper { margin-bottom: 35px; }
    .progress-meta { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 12px; color: #334155; }
    .progress-bg { height: 16px; background: #f1f5f9; border-radius: 8px; width: 100%; overflow: hidden; }
    .progress-bar { height: 100%; border-radius: 8px; transition: width 1.5s ease-in-out; }
  `;

  if (isLoading) return <div style={{ padding: '100px', textAlign: 'center', fontSize: '24px', fontWeight: 700 }}>Initializing Core Systems...</div>;

  return (
    <div className="god-dashboard">
      <style>{styles}</style>
      
      <div className="header-block">
        <h1>Command Center</h1>
        <p>Operational overview for enterprise-wide learning initiatives.</p>
      </div>

      <div className="god-stats-grid">
        {[ {l: 'Total Workforce', v: data?.stats.totalUsers}, {l: 'Active Learners', v: data?.stats.activeUsers}, {l: 'Catalog Courses', v: data?.stats.totalCourses}, {l: 'Pending Review', v: data?.stats.pendingUsers} ].map((s, i) => (
          <div key={i} className="god-stat-card">
            <div className="stat-label">{s.l}</div>
            <div className="stat-number">{s.v || 0}</div>
          </div>
        ))}
      </div>

      <div className="god-grid-layout">
        <div className="god-panel">
          <div className="god-panel-title">Departmental Velocity <span>📊</span></div>
          <div className="progress-wrapper">
            {['Engineering', 'HR Operations', 'Growth & Sales', 'Client Support'].map((dept, i) => (
              <div key={i} style={{ marginBottom: '30px' }}>
                <div className="progress-meta"><span>{dept}</span><span>{92 - i*5}%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: `${92 - i*5}%`, background: i%2===0 ? '#0f172a' : '#3b82f6' }}></div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="god-panel">
          <div className="god-panel-title">System Logs <span>📜</span></div>
          <div style={{ color: '#64748b', fontSize: '15px' }}>
            {['Sync successful', 'Database optimization', 'New Course: System Design', 'Auto-Scale triggers'].map((log, i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                <strong>{log}</strong>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>System Component v2.4.0</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsDashboard;