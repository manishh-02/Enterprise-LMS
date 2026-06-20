import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FiVideo, FiFileText, FiMessageCircle, FiSettings, FiPlus, FiEdit3, FiTrash2, FiUploadCloud, FiFolderPlus, FiX, FiZap, FiTarget, FiHelpCircle } from 'react-icons/fi';
import axios from 'axios';

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('studio'); 
  const navigate = useNavigate();

  const userRole = String(localStorage.getItem('userRole')).toLowerCase();
  const isAdmin = userRole === 'admin';

  const [myCourses, setMyCourses] = useState([]);
  const [allQA, setAllQA] = useState([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyCourses(res.data.data || []);
      
      // Extract QA
      const qaList = [];
      (res.data.data || []).forEach(course => {
        if (course.qaList && course.qaList.length > 0) {
          course.qaList.forEach(qa => qaList.push({ ...qa, courseId: course._id, courseTitle: course.title }));
        }
      });
      setAllQA(qaList);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // ==========================================
  // 🚨 1-STEP PRO BUILDER LOGIC
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({ 
    title: '', description: '', category: 'Engineering', price: '', 
    videoFile: null, existingVideoUrl: '', 
    curriculum: [] 
  });

  // 🚨 QUIZ STATE: Ek waqt me kis module ka quiz form khula hai
  const [activeQuizModuleIndex, setActiveQuizModuleIndex] = useState(null);
  // Temporary state for the quiz being built
  const [tempQuiz, setTempQuiz] = useState({
    title: 'New Assessment',
    isCompulsory: true,
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ title: '', description: '', category: 'Engineering', price: '', videoFile: null, existingVideoUrl: '', curriculum: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingId(course._id);
    setForm({ 
      title: course.title, description: course.description, category: course.category, price: course.price, 
      videoFile: null, existingVideoUrl: course.videoUrl || '', 
      curriculum: course.curriculum || [] 
    });
    setIsModalOpen(true);
  };

  const handleMainVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) return toast.error('Only videos allowed!');
      setForm({ ...form, videoFile: file });
      toast.success("Main Intro Video staged!");
    }
  };

  const handleAddModule = () => {
    setForm({ ...form, curriculum: [...form.curriculum, { moduleTitle: 'New Module', lessons: [] }] });
  };
  const handleRemoveModule = (mIndex) => {
    setForm({ ...form, curriculum: form.curriculum.filter((_, i) => i !== mIndex) });
  };
  const handleRemoveLesson = (mIndex, lIndex) => {
    const updated = [...form.curriculum];
    updated[mIndex].lessons = updated[mIndex].lessons.filter((_, i) => i !== lIndex);
    setForm({ ...form, curriculum: updated });
  };

  const handleUploadLessonAsset = async (e, mIndex, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading(`Encrypting & Uploading ${type}...`);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      let uploadEndpoint = '/api/upload/video';
      
      if (type === 'notes') {
        uploadEndpoint = '/api/upload/pdf'; 
        formData.append('pdf', file);
      } else {
        formData.append('video', file);
      }

      const res = await axios.post(uploadEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });

      const fileUrl = res.data.videoUrl || res.data.pdfUrl || res.data.url;

      const newLesson = {
        title: file.name, type: type,
        videoUrl: type === 'video' ? fileUrl : null,
        contentUrl: type === 'notes' ? fileUrl : null,
        duration: "10:00"
      };

      const updated = [...form.curriculum];
      updated[mIndex].lessons.push(newLesson);
      setForm({ ...form, curriculum: updated });

      toast.success(`${type} secured in S3!`, { id: toastId });
    } catch (error) {
      toast.error(`Upload Failed.`, { id: toastId });
    }
  };

  // 🚨 NEW: Function to save the built quiz into the module
  const handleSaveQuiz = (mIndex) => {
    if (!tempQuiz.questionText || tempQuiz.options.some(opt => !opt)) {
      return toast.error("Please fill the question and all 4 options!");
    }

    const newQuizLesson = {
      title: tempQuiz.title,
      type: 'quiz',
      quizData: {
        isCompulsory: tempQuiz.isCompulsory,
        questions: [{
          questionText: tempQuiz.questionText,
          options: tempQuiz.options,
          correctOption: tempQuiz.correctOption
        }]
      }
    };

    const updated = [...form.curriculum];
    updated[mIndex].lessons.push(newQuizLesson);
    setForm({ ...form, curriculum: updated });

    // Reset and close form
    setActiveQuizModuleIndex(null);
    setTempQuiz({ title: 'New Assessment', isCompulsory: true, questionText: '', options: ['', '', '', ''], correctOption: 0 });
    toast.success("Assessment added to module!");
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading(editingId ? "Updating Enterprise Payload..." : "Deploying New Enterprise Payload...");

    try {
      const token = localStorage.getItem('token');
      let finalMainVideoUrl = form.existingVideoUrl;

      if (form.videoFile) {
        toast.loading("Uploading Main Video...", { id: toastId });
        const videoData = new FormData();
        videoData.append('video', form.videoFile);
        const uploadResponse = await axios.post('/api/upload/video', videoData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        finalMainVideoUrl = uploadResponse.data.videoUrl;
      }

      const payload = {
        title: form.title, description: form.description, price: Number(form.price) || 0,
        category: form.category, videoUrl: finalMainVideoUrl,
        curriculum: form.curriculum 
      };

      if (editingId) {
        await axios.put(`/api/courses/${editingId}`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
      } else {
        await axios.post('/api/courses', payload, { headers: { 'Authorization': `Bearer ${token}` } });
      }

      toast.success(editingId ? "Course Updated!" : "Course Deployed!", { id: toastId, icon: '🚀' });
      fetchMyCourses();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Operation Failed.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`🚨 Permanently delete "${title}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMyCourses();
      toast.success("Course vaporized.");
    } catch (error) { toast.error("Failed to delete."); }
  };

  const handleDeleteQA = async (courseId, qaId) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/courses/${courseId}/qa/${qaId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Comment deleted.");
      fetchMyCourses(); 
    } catch (error) { toast.error("Failed to delete comment."); }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Session safely terminated.");
    setTimeout(() => navigate('/login'), 1000);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    .instructor-layout { font-family: 'Plus Jakarta Sans', sans-serif; display: flex; min-height: 100vh; background: #020202; color: #f8fafc; overflow: hidden; width: 100%; }
    .sidebar { width: 280px; background: rgba(10, 10, 12, 0.95); border-right: 1px solid rgba(255,255,255,0.05); padding: 32px 24px; display: flex; flex-direction: column; z-index: 10; }
    .brand-title { font-size: 22px; font-weight: 900; background: linear-gradient(135deg, #00f0ff, #8a2be2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 40px; letter-spacing: -0.5px; }
    .nav-btn { width: 100%; display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 12px; background: transparent; border: 1px solid transparent; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; margin-bottom: 8px; text-align: left; }
    .nav-btn:hover { color: #fff; background: rgba(255,255,255,0.03); transform: translateX(4px); }
    .nav-btn.active { background: rgba(0, 240, 255, 0.08); color: #00f0ff; border: 1px solid rgba(0, 240, 255, 0.2); box-shadow: 0 0 15px rgba(0,240,255,0.05); }
    .nav-btn.logout { margin-top: auto; color: #ef4444; }
    .nav-btn.logout:hover { background: rgba(239, 68, 68, 0.1); }
    .workspace { flex: 1; padding: ${isAdmin ? '20px 0px' : '40px 50px'}; overflow-y: auto; background-image: radial-gradient(circle at top right, rgba(138, 43, 226, 0.08), transparent 50%); }
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
    .page-title { font-size: 36px; font-weight: 800; margin: 0 0 8px 0; color: #fff; letter-spacing: -1px; }
    .page-desc { color: #8892b0; font-size: 15px; margin: 0; }
    .btn-glow { background: linear-gradient(135deg, #00f0ff 0%, #0077ff 100%); border: none; padding: 14px 28px; border-radius: 14px; color: #000; font-weight: 800; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; box-shadow: 0 10px 25px -5px rgba(0, 119, 255, 0.4); }
    .btn-glow:hover { transform: translateY(-3px); box-shadow: 0 15px 35px -5px rgba(0, 119, 255, 0.6); color: #fff; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
    .stat-card { background: rgba(20, 20, 22, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 20px; transition: 0.3s; }
    .stat-label { color: #8892b0; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
    .stat-value { font-size: 32px; font-weight: 800; color: #fff; }
    .glass-panel { background: rgba(20, 20, 22, 0.6); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 30px; margin-bottom: 30px; }
    
    .course-list { width: 100%; border-collapse: collapse; }
    .course-list th { text-align: left; padding: 0 16px 16px 16px; color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .course-list td { padding: 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.02); vertical-align: middle; }
    .action-icon { padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.03); color: #cbd5e1; cursor: pointer; transition: 0.3s; display: inline-flex; margin-right: 8px; border: 1px solid rgba(255,255,255,0.05); }
    .action-icon:hover { background: rgba(0, 240, 255, 0.1); color: #00f0ff; border-color: rgba(0, 240, 255, 0.2); }
    .action-icon.delete:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
    
    /* MODAL CSS */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); display: flex; justify-content: center; z-index: 2000; overflow-y: auto; padding: 40px 0;}
    .modal-content { background: #0a0a0c; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 900px; border-radius: 24px; padding: 40px; height: fit-content; margin: auto; }
    .form-group { margin-bottom: 24px; }
    .god-input { width: 100%; padding: 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; color: #fff; outline: none; box-sizing: border-box; font-family: 'Plus Jakarta Sans'; }
    .file-drop-zone { border: 2px dashed rgba(255,255,255,0.15); border-radius: 16px; padding: 30px; text-align: center; cursor: pointer; transition: 0.3s; }
    .file-drop-zone:hover { border-color: #00f0ff; background: rgba(0, 240, 255, 0.05); }

    /* Builder Inside Modal */
    .module-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
    .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .module-title-input { background: transparent; border: none; color: #fff; font-size: 18px; font-weight: 800; outline: none; width: 60%; }
    .lesson-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(0,0,0,0.4); border-radius: 10px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.03); }
    .add-asset-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(0, 240, 255, 0.1); color: #00f0ff; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid rgba(0, 240, 255, 0.2); }
    
    /* Quiz Builder Form Styles */
    .quiz-form { background: rgba(0,0,0,0.3); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 12px; padding: 16px; margin-top: 16px; }
    .quiz-input { width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 13px; outline: none; margin-bottom: 10px; box-sizing: border-box; }
    .quiz-option-row { display: flex; alignItems: center; gap: 10px; margin-bottom: 8px; }
    
    /* AI Nudge Specific */
    .nudge-card { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border-radius: 16px; padding: 20px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.05); }
    .nudge-btn { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 10px 20px; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; }
    .nudge-btn:hover { background: #ef4444; color: #fff; box-shadow: 0 0 15px rgba(239,68,68,0.4); }
  `;

  return (
    <div className="instructor-layout" style={{ background: isAdmin ? 'transparent' : '#020202' }}>
      <style>{styles}</style>
      <Toaster position="top-right" />

      {!isAdmin && (
        <div className="sidebar">
          <div className="brand-title">Creator Studio Pro</div>
          <button className={`nav-btn ${activeTab === 'studio' ? 'active' : ''}`} onClick={() => setActiveTab('studio')}><FiVideo size={18} /> Content Matrix</button>
          <button className={`nav-btn ${activeTab === 'nudge' ? 'active' : ''}`} onClick={() => setActiveTab('nudge')}><FiZap size={18} /> AI Nudge Engine</button>
          <button className={`nav-btn ${activeTab === 'qa' ? 'active' : ''}`} onClick={() => setActiveTab('qa')}><FiMessageCircle size={18} /> Priority Q&A</button>
          <button className="nav-btn logout" onClick={handleLogout}><FiSettings size={18} /> Terminate Session</button>
        </div>
      )}

      <div className="workspace">
        {activeTab === 'studio' && (
          <div>
            <div className="page-header">
              <div>
                <h1 className="page-title">{isAdmin ? "Admin Course Payload Manager" : "Content Matrix"}</h1>
                <p className="page-desc">Design, upload, and manage enterprise course payloads securely.</p>
              </div>
              <button className="btn-glow" onClick={openCreateModal}>
                <FiPlus size={20} /> Deploy New Module
              </button>
            </div>

            <div className="glass-panel">
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 24px 0' }}>Architecture Portfolio Inventory</h2>
              <table className="course-list">
                <thead>
                  <tr>
                    <th>Module Identity</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Manage Assets</th>
                  </tr>
                </thead>
                <tbody>
                  {myCourses.map(course => (
                    <tr key={course._id}>
                      <td><div style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>{course.title}</div></td>
                      <td style={{ color: '#94a3b8', fontSize: '13px' }}>{course.category}</td>
                      <td><div style={{ fontWeight: 700 }}>${course.price}</div></td>
                      <td>
                        <button className="action-icon" title="Edit Master Course" onClick={() => openEditModal(course)}>
                          <FiEdit3 size={16} />
                        </button>
                        <button className="action-icon delete" title="Delete Course" onClick={() => handleDeleteCourse(course._id, course.title)}>
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {myCourses.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No modules deployed yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NUDGE TAB */}
        {activeTab === 'nudge' && (
          <div>
            <div className="page-header">
              <div>
                <h1 className="page-title" style={{ display:'flex', alignItems:'center', gap:'10px'}}>
                  <FiZap color="#00f0ff" /> AI Automation & Nudge Hub
                </h1>
                <p className="page-desc">Identify lagging employees and fire direct UI nudges to their dashboard.</p>
              </div>
            </div>
            
            <div className="glass-panel" style={{ maxWidth: '900px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                <h2 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Lagging Subordinates Detected (Simulated)</h2>
                <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>3 Targets Found</span>
              </div>

              {[
                { name: 'David Miller', course: 'System Design', idle: '7 Days', progress: '12%' },
                { name: 'Sarah Jenkins', course: 'React Mastery', idle: '4 Days', progress: '40%' },
                { name: 'Michael Chen', course: 'Cloud Architecture', idle: '12 Days', progress: '5%' }
              ].map((emp, i) => (
                <div key={i} className="nudge-card">
                  <div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>{emp.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                      Payload: <span style={{color: '#00f0ff'}}>{emp.course}</span> • Idle for {emp.idle} • Progress: {emp.progress}
                    </div>
                  </div>
                  <button className="nudge-btn" onClick={() => toast.success(`Nudge payload fired to ${emp.name}'s Dashboard!`, {icon: '🎯'})}>
                    <FiTarget size={16}/> Fire Nudge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Q&A TAB */}
        {activeTab === 'qa' && (
          <div>
            <div className="page-header">
              <div>
                <h1 className="page-title">Priority Q&A & Comments</h1>
                <p className="page-desc">Manage student discussions and clear doubts in real-time.</p>
              </div>
            </div>
            <div className="glass-panel" style={{ maxWidth: '800px' }}>
              {allQA.length > 0 ? allQA.map((comment, index) => (
                <div key={index} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{comment.user || 'Unknown User'}</span>
                    <span>{comment.courseTitle} • {new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ color: '#fff', fontSize: '15px', marginBottom: '16px' }}>{comment.text}</div>
                  <button onClick={() => handleDeleteQA(comment.courseId, comment._id)} style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Delete Comment</button>
                </div>
              )) : (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No pending questions.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 🚨 THE 1-STEP MASTER COURSE BUILDER MODAL  */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: 0 }}>
                {editingId ? "Update Enterprise Payload" : "Deploy Enterprise Payload"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><FiX size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmitCourse}>
              {/* STAGE 1: Course Meta */}
              <h3 style={{ color: '#00f0ff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>1. Base Information</h3>
              <div className="form-group"><input type="text" className="god-input" required placeholder="Course Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} disabled={isLoading}/></div>
              <div className="form-group"><textarea className="god-input" required rows="2" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} disabled={isLoading}></textarea></div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                <select className="god-input" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} disabled={isLoading}>
                  <option value="Engineering">Engineering</option>
                  <option value="Security">Security</option>
                  <option value="Cloud">Cloud</option>
                </select>
                <input type="number" className="god-input" required placeholder="Price ($)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} disabled={isLoading}/>
              </div>
              <div className="form-group">
                <div className="file-drop-zone" onClick={() => document.getElementById('vidUpload').click()}>
                  <FiVideo size={28} color="#00f0ff" style={{ marginBottom: '10px' }}/>
                  <input type="file" accept="video/*" style={{ display: 'none' }} id="vidUpload" onChange={handleMainVideoSelect} disabled={isLoading} />
                  <div style={{ color: form.videoFile ? '#fff' : '#00f0ff', fontSize: '14px', fontWeight: 700 }}>
                    {form.videoFile ? form.videoFile.name : (form.existingVideoUrl ? "Main Video Attached. Click to Replace." : "Attach Main Intro Video (Optional)")}
                  </div>
                </div>
              </div>

              {/* STAGE 2: Curriculum Builder */}
              <h3 style={{ color: '#00f0ff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', marginTop: '40px' }}>2. Curriculum Builder</h3>
              
              {form.curriculum.map((mod, mIndex) => (
                <div key={mIndex} className="module-card">
                  <div className="module-header">
                    <input type="text" className="module-title-input" value={mod.moduleTitle} onChange={(e) => {
                        const updated = [...form.curriculum];
                        updated[mIndex].moduleTitle = e.target.value;
                        setForm({ ...form, curriculum: updated });
                      }} placeholder="Module Title..." />
                    <button type="button" onClick={() => handleRemoveModule(mIndex)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={18}/></button>
                  </div>

                  {mod.lessons.map((lesson, lIndex) => (
                    <div key={lIndex} className="lesson-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {lesson.type === 'video' ? <FiVideo color="#00f0ff"/> : lesson.type === 'notes' ? <FiFileText color="#fbbf24"/> : <FiHelpCircle color="#ef4444"/>}
                        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{lesson.title}</span>
                        {lesson.type === 'quiz' && <span style={{fontSize:'10px', background: 'rgba(2ef,68,68,0.2)', padding:'2px 6px', borderRadius:'4px', color:'#ef4444'}}>QUIZ</span>}
                      </div>
                      <button type="button" onClick={() => handleRemoveLesson(mIndex, lIndex)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><FiTrash2 size={16}/></button>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <label className="add-asset-btn">
                      <FiUploadCloud size={14}/> Add Video
                      <input type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleUploadLessonAsset(e, mIndex, 'video')} disabled={isLoading} />
                    </label>
                    <label className="add-asset-btn" style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)', background: 'rgba(251, 191, 36, 0.05)' }}>
                      <FiFileText size={14}/> Add PDF Notes
                      <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => handleUploadLessonAsset(e, mIndex, 'notes')} disabled={isLoading} />
                    </label>
                    {/* 🚨 THE NEW ADD QUIZ BUTTON */}
                    <button type="button" className="add-asset-btn" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }} onClick={() => setActiveQuizModuleIndex(mIndex)}>
                      <FiHelpCircle size={14}/> Add Assessment Quiz
                    </button>
                  </div>

                  {/* 🚨 QUIZ BUILDER FORM (Only visible if Add Quiz clicked for this module) */}
                  {activeQuizModuleIndex === mIndex && (
                    <div className="quiz-form fade-in">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h4 style={{ color: '#fbbf24', margin: 0, fontSize: '13px' }}>Assessment Configuration</h4>
                        <button type="button" onClick={() => setActiveQuizModuleIndex(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FiX size={14}/></button>
                      </div>
                      
                      <input type="text" className="quiz-input" placeholder="Assessment Title (e.g. Mid-term Quiz)" value={tempQuiz.title} onChange={(e) => setTempQuiz({...tempQuiz, title: e.target.value})} />
                      <textarea className="quiz-input" rows="2" placeholder="Enter Question text..." value={tempQuiz.questionText} onChange={(e) => setTempQuiz({...tempQuiz, questionText: e.target.value})}></textarea>
                      
                      <div style={{ marginTop: '10px', marginBottom: '10px', fontSize: '12px', color: '#94a3b8' }}>Provide 4 options and select the correct one:</div>
                      
                      {[0, 1, 2, 3].map(optIndex => (
                        <div key={optIndex} className="quiz-option-row">
                          <input type="radio" name={`correctOpt_${mIndex}`} checked={tempQuiz.correctOption === optIndex} onChange={() => setTempQuiz({...tempQuiz, correctOption: optIndex})} />
                          <input type="text" className="quiz-input" style={{ marginBottom: 0 }} placeholder={`Option ${optIndex + 1}`} value={tempQuiz.options[optIndex]} onChange={(e) => {
                            const newOptions = [...tempQuiz.options];
                            newOptions[optIndex] = e.target.value;
                            setTempQuiz({...tempQuiz, options: newOptions});
                          }} />
                        </div>
                      ))}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                        <input type="checkbox" id={`compulsory_${mIndex}`} checked={tempQuiz.isCompulsory} onChange={(e) => setTempQuiz({...tempQuiz, isCompulsory: e.target.checked})} />
                        <label htmlFor={`compulsory_${mIndex}`} style={{ color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>Make this quiz mandatory to pass (No Skip)</label>
                      </div>

                      <button type="button" onClick={() => handleSaveQuiz(mIndex)} className="btn-glow" style={{ padding: '8px 16px', fontSize: '12px', marginTop: '16px' }}>
                        Save Assessment to Module
                      </button>
                    </div>
                  )}

                </div>
              ))}

              <button type="button" onClick={handleAddModule} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <FiFolderPlus size={18}/> Add New Module
              </button>

              <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px' }}>
                <button type="submit" className="btn-glow" style={{ width: '100%', justifyContent: 'center', padding: '20px', fontSize: '16px' }} disabled={isLoading}>
                  {isLoading ? 'Executing Payload Sequence...' : (editingId ? 'Save Master Updates' : 'Deploy Full Course to Network')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;