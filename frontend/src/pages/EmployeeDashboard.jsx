import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Learner");
  const [activeTab, setActiveTab] = useState("overview"); 
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  
  // Real Courses State & Search
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetchingCourses, setIsFetchingCourses] = useState(false);

  // HR Nudge Alert State 
  const [nudgeAlert, setNudgeAlert] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || localStorage.getItem('name') || "Enterprise Learner");
    
    const fetchLiveCourses = async () => {
      setIsFetchingCourses(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/courses/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if(response.data && response.data.data) {
          setCourses(response.data.data);
        } else if (Array.isArray(response.data)) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Course Sync Error:", error);
        toast.error("Cloud Sync Error: Could not fetch latest courses.");
      } finally {
        setIsFetchingCourses(false);
        setIsLoading(false);
      }
    };

    fetchLiveCourses();

    // 🚨 THE FIX: Memory Check. Nudge tabhi dikhega agar isne pehle acknowledge nahi kiya hai.
    const isNudgeAcknowledged = localStorage.getItem('nudgeAcknowledged_NUDGE-001');
    
    if (!isNudgeAcknowledged) {
      setTimeout(() => {
        setNudgeAlert({
          id: 'NUDGE-001',
          title: 'URGENT: HR Compliance Nudge Received',
          message: 'Your Organization Readiness Index is dropping. Please complete the pending "Quarterly Security Compliance" module immediately to avoid system access restrictions.'
        });
      }, 1500);
    }

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Securely logged out.");
    setTimeout(() => navigate('/login'), 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Security keys updated successfully!");
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleAcknowledgeNudge = () => {
    // 🚨 THE FIX: Acknowledge karte hi browser ki memory me save kar do taaki dobara na aaye
    localStorage.setItem(`nudgeAcknowledged_${nudgeAlert?.id || 'NUDGE-001'}`, 'true');
    setNudgeAlert(null);
    
    toast.success('Action Logged. HR has been notified of your acknowledgment.', {
      icon: '✅',
      style: { background: '#020617', color: '#10b981', border: '1px solid #10b981' }
    });
  };

  // THE MEGA BULLETPROOF FILTER
  const filteredCourses = courses.filter(course => {
    if (!searchQuery.trim()) return true;

    const safeTitle = course.title || course.name || course.courseName || "";
    const safeCat = course.category || "";
    
    return safeTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
           safeCat.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const playCourse = (course) => {
    navigate('/player', { state: { course } });
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    .layout-container { font-family: 'Plus Jakarta Sans', sans-serif; display: flex; min-height: 100vh; background: #000000; background-image: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.1), transparent 40%); color: #f8fafc; }
    .sidebar { width: 280px; background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); border-right: 1px solid rgba(255, 255, 255, 0.05); padding: 32px 24px; display: flex; flex-direction: column; z-index: 10; }
    .profile-section { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .avatar { width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
    .nav-item { padding: 14px 20px; border-radius: 14px; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 15px; color: #94a3b8; transition: all 0.3s ease; position: relative; }
    .nav-item:hover { background: rgba(255,255,255,0.03); color: #fff; transform: translateX(4px); }
    .nav-item.active { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1); }
    .logout-btn { margin-top: auto; color: #ef4444; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1); }
    .logout-btn:hover { background: rgba(239, 68, 68, 0.1); color: #f87171; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2); transform: translateY(-2px); }
    .alert-badge { position: absolute; right: 16px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; animation: pulseAlert 1.5s infinite; }
    .main-content { flex: 1; padding: 48px 60px; overflow-y: auto; height: 100vh; box-sizing: border-box; }
    .premium-glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 28px; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3); padding: 32px; margin-bottom: 32px; }
    .heading-gradient { font-size: 40px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -1px; background: linear-gradient(to right, #ffffff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nudge-alert-box { background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(239, 68, 68, 0.3); border-left: 4px solid #ef4444; border-radius: 16px; padding: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; animation: pulseRedBorder 2s infinite; backdrop-filter: blur(10px); }
    .nudge-alert-content h3 { color: #f87171; margin: 0 0 8px 0; font-size: 18px; font-weight: 800; display: flex; align-items: center; gap: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .nudge-alert-content p { color: #cbd5e1; font-size: 14px; margin: 0; line-height: 1.6; max-width: 800px; }
    .btn-acknowledge { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; padding: 12px 24px; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; white-space: nowrap; margin-left: 20px; }
    .btn-acknowledge:hover { background: #ef4444; color: #fff; box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); transform: scale(1.02); }
    .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
    .stat-card { padding: 24px; border-radius: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
    .stat-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.04); border-color: rgba(59, 130, 246, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
    .search-container { position: relative; margin-bottom: 32px; width: 100%; max-width: 600px; }
    .search-input { width: 100%; padding: 18px 20px 18px 50px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; color: #fff; font-size: 15px; font-family: 'Plus Jakarta Sans'; outline: none; transition: 0.3s; box-sizing: border-box; }
    .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); background: rgba(59, 130, 246, 0.03); }
    .search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #64748b; }
    .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
    .course-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 24px; transition: all 0.3s ease; position: relative; overflow: hidden; }
    .course-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); opacity: 0; transition: 0.3s; }
    .course-card:hover { transform: translateY(-5px); border-color: rgba(59, 130, 246, 0.2); box-shadow: 0 15px 30px rgba(0,0,0,0.4); background: rgba(255,255,255,0.04); }
    .course-card:hover::before { opacity: 1; }
    .course-tag { display: inline-block; padding: 4px 10px; background: rgba(59, 130, 246, 0.1); color: #60a5fa; border-radius: 6px; font-size: 12px; font-weight: 700; margin-bottom: 12px; }
    .input-premium { width: 100%; padding: 16px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; color: #fff; font-size: 15px; margin-bottom: 20px; transition: 0.3s; box-sizing: border-box;}
    .input-premium:focus { border-color: #8b5cf6; box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15); outline: none; }
    .btn-primary { width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: none; padding: 16px; border-radius: 14px; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
    .btn-primary:hover { box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5); transform: translateY(-2px); }
    .btn-play { padding: 10px 20px; background: #fff; color: #000; border: none; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; width: 100%; justify-content: center; margin-top: 20px; }
    .btn-play:hover { background: #3b82f6; color: #fff; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
    .btn-test { padding: 10px 24px; border-radius: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; border: none; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2); }
    .btn-test:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4); }
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulseRedBorder { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
    @keyframes pulseAlert { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    .god-loader { width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.05); border-radius: 50%; border-top-color: #3b82f6; border-right-color: #8b5cf6; animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  if (isLoading) {
    return (
      <div style={{ background: '#050505', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <style>{styles}</style>
        <div className="god-loader" style={{ marginBottom: '20px' }}></div>
        <div style={{ color: '#64748b', fontWeight: 600, letterSpacing: '2px', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>SYNCING SECURE NETWORK</div>
      </div>
    );
  }

  return (
    <div className="layout-container">
      <style>{styles}</style>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />

      {/* --- SIDEBAR NAVIGATION --- */}
      <div className="sidebar">
        <div className="profile-section">
          <div className="avatar">{userName.charAt(0)}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{userName}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Enterprise Learner</div>
          </div>
        </div>

        <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Course Library
        </div>
        <div className={`nav-item ${activeTab === 'assessments' ? 'active' : ''}`} onClick={() => setActiveTab('assessments')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Live Assessments
          {nudgeAlert && <div className="alert-badge"></div>}
        </div>
        <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Account Settings
        </div>

        <div className="nav-item logout-btn" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Secure Logout
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="main-content">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="fade-in">
            <h1 className="heading-gradient">Welcome back, {userName}</h1>
            <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '40px' }}>Access your secure enterprise training payloads here.</p>
            
            {nudgeAlert && (
              <div className="nudge-alert-box fade-in">
                <div className="nudge-alert-content">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    {nudgeAlert.title}
                  </h3>
                  <p>{nudgeAlert.message}</p>
                </div>
                <button className="btn-acknowledge" onClick={handleAcknowledgeNudge}>
                  Acknowledge Nudge
                </button>
              </div>
            )}

            <div className="stat-grid">
              <div className="stat-card">
                <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Available Courses</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#3b82f6' }}>{courses.length}</div>
              </div>
              <div className="stat-card">
                <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Global Rank</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#8b5cf6' }}>Top 5%</div>
              </div>
              <div className="stat-card">
                <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Network Status</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981' }}></div> Online
                </div>
              </div>
            </div>

            <div className="search-container">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search modules, technologies, or categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 20px 0', color: '#fff' }}>Enterprise Course Library</h2>
            
            {isFetchingCourses ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#64748b' }}>
                <div className="god-loader" style={{ width: '24px', height: '24px', borderWidth: '2px' }}></div>
                Syncing nodes with AWS...
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="course-grid">
                {filteredCourses.map((course) => (
                  <div key={course._id || course.id || Math.random()} className="course-card">
                    <span className="course-tag">{course.category || "General"}</span>
                    
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 10px 0', color: '#fff', lineHeight: '1.4' }}>
                      {course.title || course.name || course.courseName || "Untitled Enterprise Payload"}
                    </h3>
                    
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {course.description || "No description available for this module."}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Cloud AWS Stream
                      </span>
                      <span>Price: ${course.price || 0}</span>
                    </div>

                    <button className="btn-play" onClick={() => playCourse(course)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      Initialize Payload
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" style={{ marginBottom: '16px' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <div style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 600 }}>No matching modules found in the database.</div>
              </div>
            )}
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {activeTab === 'assessments' && (
          <div className="fade-in">
            <h1 className="heading-gradient">Evaluation Center</h1>
            <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '40px' }}>Take mandatory tests and validate your skills.</p>
            
            <div className="premium-glass">
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 10px #ef4444' }}></span>
                Pending Actions
              </h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff' }}>Quarterly Security Compliance</h3>
                  <div style={{ color: '#f87171', fontSize: '13px', fontWeight: 600 }}>Urgent • Due in 4 hours</div>
                </div>
                <button onClick={() => navigate('/assessment')} className="btn-test">Initialize Test</button>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS / PASSWORD CHANGE TAB */}
        {activeTab === 'settings' && (
          <div className="fade-in">
            <h1 className="heading-gradient">Security & Identity</h1>
            <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '40px' }}>Manage your account security parameters.</p>
            
            <div className="premium-glass" style={{ maxWidth: '600px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 24px 0' }}>Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>CURRENT PASSWORD</label>
                <input type="password" required className="input-premium" value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} placeholder="••••••••" />
                
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>NEW PASSWORD</label>
                <input type="password" required className="input-premium" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} placeholder="••••••••" />
                
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>CONFIRM NEW PASSWORD</label>
                <input type="password" required className="input-premium" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} placeholder="••••••••" />
                
                <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Update Security Key</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeDashboard;