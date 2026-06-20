import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import AnalyticsEngine from './AnalyticsEngine';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null });
  
  // FIX: Default role is now lowercase to match database strictness
  const [formData, setFormData] = useState({ name: '', email: '', role: 'employee', password: '' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(data.data || []);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    const payload = { ...formData };
    if (!payload.password) delete payload.password; // Don't send empty password

    try {
      if (editingUser) {
        // Edit Existing User API Call
        await axios.put(`http://localhost:5000/api/admin/users/${editingUser._id}`, payload, config);
        toast.success("Identity updated in Database!", { icon: '🟢' });
      } else {
        // Create New User API Call
        await axios.post("http://localhost:5000/api/admin/users", payload, config);
        toast.success("New User provisioned successfully!", { icon: '🚀' });
      }
      
      setIsModalOpen(false);
      fetchUsers(); // Refresh the list from DB immediately
    } catch (err) { 
      toast.error(err.response?.data?.message || "Failed to save user."); 
    }
  };

  const handleStatusToggle = (user) => {
    setConfirmModal({ isOpen: true, user: user });
  };

  const confirmVerification = async () => {
    const { user } = confirmModal;
    const newStatus = user.status === 'Active' ? 'Pending' : 'Active';
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${user._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
      setConfirmModal({ isOpen: false, user: null });
      toast.success('System Status updated!');
    } catch (err) { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this user permanently from the Enterprise Network?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        toast.success('Identity permanently erased.');
        setUsers(users.filter(user => user._id !== id));
      } catch (err) { toast.error('Deletion failed.'); }
    }
  };

  // Helper to color-code Roles
  const getRoleBadgeStyle = (role) => {
    const r = role.toLowerCase();
    if (r === 'admin') return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
    if (r === 'hr') return { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' };
    if (r === 'instructor') return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
    return { bg: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: 'rgba(255, 255, 255, 0.1)' }; // Employee
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    .max-container { font-family: 'Plus Jakarta Sans', sans-serif; background: #020617; background-image: radial-gradient(circle at 50% 0%, rgba(30, 41, 59, 0.5) 0%, #020617 70%); min-height: 100vh; padding: 50px; color: #f8fafc; }
    .glass-panel { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); }
    
    .stat-card { padding: 30px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; }
    .stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); opacity: 0; transition: 0.3s; }
    .stat-card:hover::before { opacity: 1; }
    .stat-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.03); border-color: rgba(59, 130, 246, 0.2); }

    .input-premium { width: 100%; padding: 16px 20px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; color: #fff; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box;}
    .input-premium:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); outline: none; background: rgba(59, 130, 246, 0.02); }

    .btn-primary { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: none; padding: 14px 28px; border-radius: 14px; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); transition: all 0.3s ease; }
    .btn-primary:hover { box-shadow: 0 8px 25px rgba(37, 99, 235, 0.5); transform: translateY(-2px); }

    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { color: #64748b; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: left; }
    .data-row { transition: all 0.2s; border-bottom: 1px solid rgba(255, 255, 255, 0.02); }
    .data-row:hover { background: rgba(255, 255, 255, 0.02); }
    .data-row td { padding: 20px 24px; vertical-align: middle; }

    .role-badge { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }

    .badge-status { padding: 8px 16px; border-radius: 30px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s; }
    .badge-active { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #34d399; }
    .badge-active:hover { background: rgba(16, 185, 129, 0.2); }
    .badge-pending { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .badge-pending:hover { background: rgba(245, 158, 11, 0.2); }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }

    .action-icon-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 10px; color: #94a3b8; font-weight: 600; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .action-icon-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }
    .action-icon-btn.delete:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-content { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); width: 100%; max-width: 480px; padding: 40px; box-sizing: border-box; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  `;

  return (
    <div className="max-container">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <style>{styles}</style>

      <AnalyticsEngine />

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {[
          { t: 'Total Directory', v: users.length, color: '#3b82f6' },
          { t: 'Active Systems', v: users.filter(u => u.status === 'Active').length, color: '#10b981' },
          { t: 'Pending Verification', v: users.filter(u => u.status === 'Pending').length, color: '#f59e0b' }
        ].map((s, i) => (
          <div key={i} className="glass-panel stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, boxShadow: `0 0 12px ${s.color}` }}></div>
              <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.t}</div>
            </div>
            <div style={{ fontSize: '42px', fontWeight: 800, color: '#fff', lineHeight: '1' }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-1px' }}>Identity Control Center</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>Centrally provision and control enterprise workspace access.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingUser(null); setFormData({name:'', email:'', role:'employee', password:''}); setIsModalOpen(true); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Provision User
        </button>
      </div>

      <div style={{ marginBottom: '30px', position: 'relative', maxWidth: '500px' }}>
        <svg style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input style={{ paddingLeft: '50px' }} className="input-premium" placeholder="Search employees by name or email..." onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          Syncing Enterprise Directory...
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '40px' }}>Identity Record</th>
                <th>Access Role</th>
                <th>Network Status</th>
                <th style={{ textAlign: 'right', paddingRight: '40px' }}>Operations</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(u => {
                const roleStyle = getRoleBadgeStyle(u.role);
                return (
                  <tr key={u._id} className="data-row">
                    <td style={{ paddingLeft: '40px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{u.name}</div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="role-badge" style={{ background: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.border}` }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleStatusToggle(u)} 
                        className={`badge-status ${u.status === 'Active' ? 'badge-active' : 'badge-pending'}`}
                      >
                        <div className="status-dot" style={{ background: u.status === 'Active' ? '#34d399' : '#fbbf24' }}></div>
                        {u.status}
                      </button>
                    </td>
                    <td style={{ paddingRight: '40px' }}>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button 
                          className="action-icon-btn"
                          // FIX: Ensuring role is set to lowercase in formData so the dropdown matches correctly!
                          onClick={() => { setEditingUser(u); setFormData({name: u.name, email: u.email, role: u.role.toLowerCase(), password: ''}); setIsModalOpen(true); }} 
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          Edit
                        </button>
                        
                        <button 
                          className="action-icon-btn delete"
                          onClick={() => handleDelete(u._id)} 
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && !isLoading && (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No users found in the system.</div>
          )}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 800, color: '#fff' }}>{editingUser ? 'Configure Identity' : 'Provision Identity'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 700, letterSpacing: '1px' }}>FULL NAME</label>
                <input className="input-premium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 700, letterSpacing: '1px' }}>EMAIL ADDRESS</label>
                <input className="input-premium" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required/>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 700, letterSpacing: '1px' }}>SYSTEM ROLE</label>
                {/* FIX: Values match the backend lowercase expectations strictly */}
                <select className="input-premium" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 700, letterSpacing: '1px' }}>{editingUser ? 'NEW PASSWORD (OPTIONAL)' : 'PASSWORD'}</label>
                <input className="input-premium" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} {...(!editingUser && { required: true })} />
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', cursor: 'pointer', fontWeight: 700, transition: '0.2s' }} onMouseOver={e=>e.target.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.target.style.background='transparent'}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{editingUser ? 'Save Changes' : 'Provision User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 style={{ fontSize: '24px', margin: '0 0 12px 0', color: '#fff' }}>Confirm Status Change</h3>
            <p style={{ color: '#94a3b8', margin: '0 0 32px 0', lineHeight: '1.6', fontSize: '15px' }}>You are about to switch the access status for <strong style={{color:'#fff'}}>{confirmModal.user.name}</strong> to <strong style={{color: confirmModal.user.status === 'Active' ? '#f59e0b' : '#10b981'}}>{confirmModal.user.status === 'Active' ? 'Pending' : 'Active'}</strong>.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setConfirmModal({isOpen: false, user: null})} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
              <button onClick={confirmVerification} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Confirm Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;