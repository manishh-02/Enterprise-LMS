import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // LIVE CORE STATES
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, compliance: 0, critical: 0 });
  
  // ADVANCED MODAL STATES
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmpForReport, setSelectedEmpForReport] = useState(null);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'employee', password: '' });

  // 🚨 CUSTOM NUDGE STATES
  const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
  const [nudgeData, setNudgeData] = useState({ empId: null, empName: '', message: '' });
  const [isSendingNudge, setIsSendingNudge] = useState(false);

  useEffect(() => {
    fetchHRData();
  }, []);

  const fetchHRData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/hr/workforce', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        setEmployees(data.data);
        setStats({
          total: data.totalEmployees,
          compliance: data.orgCompliance,
          critical: data.criticalRisks
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Cloud Datalake Sync Failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/users', newUserForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Identity Provisioned: ${newUserForm.name}`, { icon: '👤' });
      setIsAddModalOpen(false);
      setNewUserForm({ name: '', email: '', role: 'employee', password: '' });
      fetchHRData(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to provision workspace user.");
    }
  };

  const openNudgeModal = (id, name, role) => {
    if (role?.toLowerCase() === 'admin') {
      return toast.error("Security Protocol: Cannot send nudges to System Admins.");
    }
    setNudgeData({ empId: id, empName: name, message: '' });
    setIsNudgeModalOpen(true);
  };

  // 🚨 SEND CUSTOM NUDGE - NOW CONNECTED TO DATABASE
  const handleSendCustomNudge = async (e) => {
    e.preventDefault();
    if (!nudgeData.message.trim()) return toast.error("Nudge message cannot be empty.");
    
    setIsSendingNudge(true);
    try {
      const token = localStorage.getItem('token');
      // Sending to our newly created backend route
      await axios.post(`/api/hr/nudge/${nudgeData.empId}`, { message: nudgeData.message }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success(`Direct Nudge sent to ${nudgeData.empName}'s telemetry node.`, {
        icon: '📨',
        style: { background: '#0f172a', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)' }
      });
      setIsSendingNudge(false);
      setIsNudgeModalOpen(false);
      setNudgeData({ empId: null, empName: '', message: '' });
    } catch (error) {
      toast.error("Nudge broadcast failed.");
      setIsSendingNudge(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    if (activeTab === 'critical') return emp.risk === 'Critical';
    return true;
  }).filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    .god-dashboard { font-family: 'Plus Jakarta Sans', sans-serif; background: #020617; min-height: 100vh; color: #f8fafc; padding: 40px; display: flex; flex-direction: column; gap: 32px; background-image: radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 50%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 50%); }
    .header-bar { display: flex; justify-content: space-between; align-items: flex-end; }
    .title-gradient { font-size: 36px; font-weight: 800; background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px 0; letter-spacing: -1px; }
    .subtitle { color: #64748b; font-size: 15px; display: flex; align-items: center; gap: 8px; }
    
    .action-header-btns { display: flex; gap: 16px; }
    .btn-report { padding: 14px 24px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: none; border-radius: 14px; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4); display: flex; align-items: center; gap: 8px; }
    .btn-report:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.6); }
    .btn-sec { padding: 14px 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; }
    .btn-sec:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }

    .kpi-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .kpi-card { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 24px; position: relative; overflow: hidden; transition: 0.3s; }
    .kpi-card:hover { border-color: rgba(59, 130, 246, 0.3); transform: translateY(-4px); }
    .kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase; }
    .kpi-value { font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 8px; }
    
    .main-grid { display: grid; grid-template-columns: 2.5fr 1fr; gap: 24px; }
    .glass-panel { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 24px; }
    .panel-title { font-size: 18px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
    
    .filter-bar { display: flex; gap: 16px; margin-bottom: 24px; }
    .search-input { flex: 1; padding: 14px 20px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #fff; font-size: 14px; outline: none; transition: 0.3s; font-family: 'Plus Jakarta Sans'; }
    .search-input:focus { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
    .tab-btn { padding: 10px 20px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.3s; }
    .tab-btn.active { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); color: #60a5fa; }

    .god-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
    .god-table th { color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; padding: 0 16px 12px 16px; text-align: left; }
    .god-row { background: rgba(255,255,255,0.015); transition: 0.3s; cursor: pointer; }
    .god-row:hover { background: rgba(255,255,255,0.04); }
    .god-cell { padding: 16px; }

    .user-info { display: flex; align-items: center; gap: 12px; }
    .user-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #1e293b, #0f172a); display: flex; align-items: center; justify-content: center; font-weight: 800; border: 1px solid rgba(255,255,255,0.1); }
    
    .badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .badge-critical { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
    .badge-low { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
    .badge-medium { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }

    .btn-nudge { padding: 8px 16px; background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; transition: 0.3s; }
    .btn-nudge:hover { background: #3b82f6; color: #fff; }
    .btn-nudge:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .ai-alert-box { background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0,0,0,0) 100%); border-left: 3px solid #8b5cf6; padding: 16px; border-radius: 12px; margin-bottom: 16px; font-size: 14px; color: #cbd5e1; }
    .ai-tag { display: inline-block; background: #8b5cf6; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px; text-transform: uppercase; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 40px 0; overflow-y: auto;}
    .input-premium { width: 100%; padding: 14px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; color: #fff; font-size: 15px; outline: none; margin-bottom: 16px; box-sizing: border-box; font-family: 'Plus Jakarta Sans'; }
    .input-premium:focus { border-color: #3b82f6; }
    
    .god-loader { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.05); border-radius: 50%; border-top-color: #3b82f6; animation: spin 1s infinite linear; margin: 0 auto 20px; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    .progress-track { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-top: 8px; }
    .progress-fill { height: 100%; border-radius: 4px; transition: 0.5s ease-out; }
  `;

  if (isLoading) {
    return (
      <div style={{ background: '#020617', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <style>{styles}</style>
        <div className="god-loader"></div>
        <div style={{ color: '#64748b', fontWeight: 600 }}>SYNCHRONIZING SECURE TELEMETRY DATALAKE...</div>
      </div>
    );
  }

  return (
    <div className="god-dashboard">
      <style>{styles}</style>
      <Toaster position="top-right" />

      {/* HEADER BAR */}
      <div className="header-bar">
        <div>
          <h1 className="title-gradient">Global Workforce Intelligence</h1>
          <div className="subtitle">Enterprise HQ • Role-Based HR Dashboard Control</div>
        </div>
        <div className="action-header-btns">
          <button className="btn-sec" onClick={() => setIsAddModalOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Add New Employee
          </button>
          <button className="btn-report" onClick={() => toast.success("Compiling system log summary matrix...")}>
            Export Global Compliance Log
          </button>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="kpi-container">
        <div className="kpi-card">
          <div className="kpi-header"><span>Org Readiness Index</span></div>
          <div className="kpi-value">{stats.compliance}%</div>
          <div style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>Organization live status average</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span>Critical Risk Alerts</span></div>
          <div className="kpi-value" style={{ color: '#f87171' }}>{stats.critical}</div>
          <div style={{ color: '#64748b', fontSize: '13px' }}>Nodes under compliance limits</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span>Total Monitored Workforce</span></div>
          <div className="kpi-value">{stats.total}</div>
          <div style={{ color: '#38bdf8', fontSize: '13px' }}>Active users tracked in system</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span>Skill Velocity Matrix</span></div>
          <div className="kpi-value">3.8 Days</div>
          <div style={{ color: '#a855f7', fontSize: '13px' }}>Avg duration to complete modules</div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT GRID */}
      <div className="main-grid">
        
        {/* LEFT WORKFORCE MATRIX TABLE */}
        <div className="glass-panel">
          <div className="panel-title">Workforce Analysis Matrix</div>
          <div className="filter-bar">
            <input type="text" className="search-input" placeholder="Search employee name, metrics, parameters..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Personnel</button>
              <button className={`tab-btn ${activeTab === 'critical' ? 'active' : ''}`} onClick={() => setActiveTab('critical')}>Critical Alerts</button>
            </div>
          </div>

          <table className="god-table">
            <thead>
              <tr>
                <th>Employee Profile</th>
                <th>Access Identity</th>
                <th>Compliance Status</th>
                <th>Risk Matrix Vector</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="god-row" onClick={() => setSelectedEmpForReport(emp)}>
                  <td className="god-cell">
                    <div className="user-info">
                      <div className="user-avatar" style={{ borderLeft: `3px solid ${emp.risk === 'Critical' ? '#ef4444' : '#10b981'}` }}>{emp.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{emp.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="god-cell" style={{ color: '#cbd5e1', fontSize: '14px' }}>{emp.dept}</td>
                  <td className="god-cell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${emp.compliance}%`, height: '100%', background: emp.compliance > 70 ? '#10b981' : emp.compliance > 40 ? '#fbbf24' : '#ef4444', borderRadius: '4px' }}></div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{emp.compliance}%</span>
                    </div>
                  </td>
                  <td className="god-cell">
                    <span className={`badge badge-${emp.risk.toLowerCase()}`}>{emp.risk}</span>
                  </td>
                  <td className="god-cell" onClick={(e) => e.stopPropagation()}>
                    {/* 🚨 THE FIX: Admin check applied here */}
                    {emp.role?.toLowerCase() !== 'admin' ? (
                      <button className="btn-nudge" onClick={() => openNudgeModal(emp.id, emp.name, emp.role)}>
                        Send Custom Nudge
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>System Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT ANALYTICS SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel">
            <div className="panel-title" style={{ color: '#c084fc' }}>Cortana AI Predictions</div>
            <div className="ai-alert-box">
              <div className="ai-tag">Risk Assessment Vector</div>
              <div>Based on cloud metric patterns, <strong>{stats.critical} employees</strong> are trailing completion timelines. Automated nudges recommended to enforce system sync data.</div>
            </div>
          </div>
          
          <div className="glass-panel">
            <div className="panel-title">System Status Log Feed</div>
            <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>🟢 Live directory sync connection verified with cluster database node successfully.</div>
              <div>📊 Extracted {stats.total} total employee vectors from server workspace.</div>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM NUDGE INPUT MODAL */}
      {isNudgeModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel" style={{ width: '450px', padding: '40px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 800 }}>Send Direct Nudge</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Target: <strong style={{color: '#fff'}}>{nudgeData.empName}</strong></p>
            
            <form onSubmit={handleSendCustomNudge}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>NUDGE MESSAGE</label>
              <textarea 
                className="input-premium" 
                rows="4" 
                required 
                value={nudgeData.message} 
                onChange={e => setNudgeData({ ...nudgeData, message: e.target.value })} 
                placeholder="E.g., Please complete your pending quarterly compliance training by Friday." 
              ></textarea>
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <button type="button" className="btn-sec" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsNudgeModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-report" style={{ flex: 1, justifyContent: 'center' }} disabled={isSendingNudge}>
                  {isSendingNudge ? 'Broadcasting...' : 'Fire Nudge Payload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EMPLOYEE INTERACTIVE FORM */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel" style={{ width: '450px', padding: '40px' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: 800 }}>Provision New Employee Vector</h2>
            <form onSubmit={handleAddEmployeeSubmit}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>NAME</label>
              <input className="input-premium" type="text" required value={newUserForm.name} onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })} placeholder="Alex Mercer" />
              
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>EMAIL ADDRESS</label>
              <input className="input-premium" type="email" required value={newUserForm.email} onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })} placeholder="alex@enterprise.com" />
              
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>WORKSPACE INITIAL ACCOUNT PASSWORD</label>
              <input className="input-premium" type="password" value={newUserForm.password} onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })} placeholder="Leave blank for default (Password@123)" />
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button type="button" className="btn-sec" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-report" style={{ flex: 1, justifyContent: 'center' }}>Deploy Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED PROGRESS REPORT MODAL */}
      {selectedEmpForReport && (
        <div className="modal-overlay" onClick={() => setSelectedEmpForReport(null)}>
          <div className="glass-panel" style={{ width: '600px', padding: '40px', margin: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <span className="badge badge-low" style={{ marginBottom: '8px', display: 'inline-block' }}>Internal System Report</span>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '26px', fontWeight: 800 }}>{selectedEmpForReport.name}</h2>
                <div style={{ color: '#64748b', fontSize: '14px' }}>Identity Node Link ID: {selectedEmpForReport.id}</div>
              </div>
              <button className="btn-report" style={{ padding: '10px 16px', fontSize: '12px' }} onClick={() => window.print()}>Print Performance Audit</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>ASSIGNED DEPARTMENT</div>
                <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: '#fff' }}>{selectedEmpForReport.dept}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>OVERALL COMPLIANCE SCORE</div>
                <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: selectedEmpForReport.compliance > 70 ? '#10b981' : '#ef4444' }}>{selectedEmpForReport.compliance}% Completion</div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Detailed Course Matrix Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedEmpForReport.courses ? (
                selectedEmpForReport.courses.map((course, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>{course.title}</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: course.progress === 100 ? '#10b981' : '#38bdf8' }}>{course.progress}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.progress === 100 ? '#10b981' : '#38bdf8' }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>Enterprise Security Compliance</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: selectedEmpForReport.compliance === 100 ? '#10b981' : '#38bdf8' }}>{selectedEmpForReport.compliance}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${selectedEmpForReport.compliance}%`, background: selectedEmpForReport.compliance === 100 ? '#10b981' : '#38bdf8' }}></div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button className="btn-sec" style={{ width: '100%', marginTop: '32px', justifyContent: 'center' }} onClick={() => setSelectedEmpForReport(null)}>Close Security File View</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HRDashboard;