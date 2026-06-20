import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const AddCourse = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Engineering',
    price: 0
  });
  
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Invalid format! Please select an MP4, MKV, or WebM file.', { style: { background: '#333', color: '#fff' } });
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File too large! Max limit is 50MB for the Free Tier.', { style: { background: '#333', color: '#fff' } });
        return;
      }
      setVideoFile(file);
      toast.success(`Video staged: ${file.name}`, { style: { background: '#333', color: '#fff' }, icon: '🎬' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return toast.error('AWS Payload missing! Attach a video.', { style: { background: '#333', color: '#fff' } });

    setIsUploading(true);
    const token = localStorage.getItem('token');

    try {
      toast.loading('Initializing AWS Secure Tunnel...', { id: 'deploy-toast', style: { background: '#1e293b', color: '#fff' } });
      
      const videoData = new FormData();
      videoData.append('video', videoFile); 

      const uploadResponse = await axios.post('/api/upload/video', videoData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });

      const s3VideoUrl = uploadResponse.data.videoUrl;
      toast.loading('Syncing with MongoDB Atlas...', { id: 'deploy-toast' });
      
      const coursePayload = { ...formData, videoUrl: s3VideoUrl };

      // YAHAN FIX KIYA HAI: '/create' hata diya hai taaki backend se match ho jaye
      await axios.post('/api/courses', coursePayload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success('Course Deployed to Enterprise Portal!', { id: 'deploy-toast', duration: 3000, icon: '🚀' });
      setTimeout(() => navigate('/dashboard/courses'), 1500);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Deployment Failed.', { id: 'deploy-toast' });
    } finally {
      setIsUploading(false);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    .god-level-container {
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      background: #000000;
      background-image: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #000000 60%);
      color: #f8fafc;
      padding: 60px 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .form-wrapper {
      width: 100%;
      max-width: 850px;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 50px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .header-section { margin-bottom: 40px; text-align: left; }
    .header-title { font-size: 36px; font-weight: 800; margin: 0 0 10px 0; letter-spacing: -1px; background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .header-subtitle { color: #64748b; font-size: 16px; margin: 0; font-weight: 400; }

    .input-group { margin-bottom: 24px; }
    .input-label { display: block; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    
    .god-input {
      width: 100%; box-sizing: border-box; padding: 18px 20px;
      background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px; color: #fff; font-size: 15px; font-family: 'Inter', sans-serif;
      transition: all 0.3s ease; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    }
    .god-input:focus { outline: none; border-color: #3b82f6; background: rgba(59, 130, 246, 0.03); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15), inset 0 2px 4px rgba(0,0,0,0.2); }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

    .upload-zone {
      width: 100%; box-sizing: border-box; padding: 50px 20px;
      border: 2px dashed rgba(255, 255, 255, 0.15); border-radius: 20px;
      background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.3s ease; margin-bottom: 40px; position: relative;
    }
    .upload-zone:hover { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); transform: translateY(-2px); }
    
    .upload-icon { 
      width: 60px; height: 60px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); 
      display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: #3b82f6; 
    }
    .upload-text { font-size: 16px; font-weight: 600; color: #e2e8f0; margin-bottom: 8px; }
    .upload-sub { font-size: 13px; color: #64748b; }

    .god-btn {
      width: 100%; padding: 20px; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      border: none; border-radius: 16px; color: #fff; font-size: 16px; font-weight: 700;
      cursor: pointer; transition: all 0.3s ease; display: flex; justify-content: center; align-items: center; gap: 12px;
      box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
    }
    .god-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 35px -5px rgba(59, 130, 246, 0.6); }
    .god-btn:disabled { opacity: 0.6; cursor: wait; background: #334155; box-shadow: none; }

    .loader-ring { width: 22px; height: 22px; border: 3px solid rgba(255,255,255,0.2); border-radius: 50%; border-top-color: #fff; animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;

  return (
    <div className="god-level-container">
      <style>{styles}</style>
      <Toaster position="top-center" />

      <div className="form-wrapper">
        <div className="header-section">
          <h1 className="header-title">Provision Infrastructure</h1>
          <p className="header-subtitle">Upload and securely deploy your video modules to AWS S3 storage.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label className="input-label">Course Title</label>
            <input className="god-input" type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Enterprise Architecture Design" />
          </div>

          <div className="input-group">
            <label className="input-label">Module Description</label>
            <textarea className="god-input" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Define the learning objectives..." style={{ minHeight: '120px', resize: 'vertical' }}></textarea>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Category</label>
              <select className="god-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Engineering">Engineering</option>
                <option value="Security">Security</option>
                <option value="Compliance">Compliance</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Price (USD)</label>
              <input className="god-input" type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Cloud Video Payload</label>
            <label className="upload-zone">
              <input type="file" accept="video/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <div className="upload-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <div className="upload-text">
                {videoFile ? videoFile.name : 'Click to Browse Local Storage'}
              </div>
              <div className="upload-sub">
                {videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for transfer` : 'Supports MP4, WebM (Max: 50MB)'}
              </div>
            </label>
          </div>

          <button type="submit" className="god-btn" disabled={isUploading}>
            {isUploading ? (
              <><div className="loader-ring"></div> Executing Cloud Deployment...</>
            ) : (
              'Deploy Module'
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddCourse;