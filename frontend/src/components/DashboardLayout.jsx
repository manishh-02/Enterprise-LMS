import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUsers, FiBarChart2, FiBook, FiLogOut, FiShield, FiMenu, FiX, FiActivity, FiBell, FiSearch } from 'react-icons/fi';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userName = localStorage.getItem('userName') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const styles = `
    .dashboard-root { display: flex; height: 100vh; background-color: #050505; color: #fff; font-family: 'Inter', sans-serif; overflow: hidden; }
    
    .sidebar-container { 
      width: ${isSidebarOpen ? '280px' : '80px'}; 
      background: #0a0a0c; 
      border-right: 1px solid #1a1a1e; 
      display: flex; flex-direction: column; 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
      z-index: 100; 
    }

    .brand-section { padding: 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1a1a1e; }
    .brand-logo { display: flex; align-items: center; gap: 12px; font-weight: 900; font-size: 18px; }
    
    .nav-list { flex: 1; padding: 20px 10px; display: flex; flex-direction: column; gap: 8px; }
    .nav-item { 
      display: flex; align-items: center; gap: 16px; padding: 14px 16px; 
      color: #8892b0; text-decoration: none; border-radius: 12px; 
      transition: all 0.2s; white-space: nowrap; overflow: hidden; 
    }
    .nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
    .nav-item.active { color: #00f0ff; background: rgba(0,240,255,0.1); }
    
    .profile-section { padding: 20px; border-top: 1px solid #1a1a1e; }
    .user-card { display: flex; align-items: center; gap: 12px; padding: 10px; background: #1a1a1e; border-radius: 12px; }
    
    .main-content { flex: 1; overflow-y: auto; background: radial-gradient(circle at top right, #1a1a2e, #050505); padding: 40px; }
    .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
  `;

  return (
    <div className="dashboard-root">
      <style>{styles}</style>
      
      <aside className="sidebar-container">
        <div className="brand-section">
          <div className="brand-logo">
            <FiShield size={24} color="#00f0ff" />
            {isSidebarOpen && <span>Enterprise OS</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}>
            {isSidebarOpen ? <FiX/> : <FiMenu/>}
          </button>
        </div>

        <nav className="nav-list">
          <Link to="/dashboard/analytics" className={`nav-item ${location.pathname.includes('analytics') ? 'active' : ''}`}>
            <FiActivity size={20} /> {isSidebarOpen && "Analytics Engine"}
          </Link>
          <Link to="/dashboard/users" className={`nav-item ${location.pathname.includes('users') ? 'active' : ''}`}>
            <FiUsers size={20} /> {isSidebarOpen && "Identity Control"}
          </Link>
          <Link to="/dashboard/courses" className={`nav-item ${location.pathname.includes('courses') ? 'active' : ''}`}>
            <FiBook size={20} /> {isSidebarOpen && "Course Matrix"}
          </Link>
        </nav>

        <div className="profile-section">
          {isSidebarOpen && (
            <div className="user-card">
              <div style={{width:'36px', height:'36px', borderRadius:'8px', background:'#8a2be2', display:'flex', alignItems:'center', justifyContent:'center'}}>{userName.charAt(0)}</div>
              <div style={{overflow:'hidden'}}>
                <div style={{fontWeight:700, fontSize:'13px'}}>{userName}</div>
                <div style={{fontSize:'10px', color:'#00f0ff'}}>ADMIN</div>
              </div>
            </div>
          )}
          <button className="nav-item" style={{width:'100%', background:'none', border:'none', marginTop:'10px', color:'#ef4444'}} onClick={handleLogout}>
            <FiLogOut/> {isSidebarOpen && "Terminate Session"}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div><h2 style={{margin:0}}>System Overview</h2></div>
          <div style={{display:'flex', gap:'20px'}}>
            <FiSearch size={20} style={{cursor:'pointer'}}/>
            <FiBell size={20} style={{cursor:'pointer'}}/>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;