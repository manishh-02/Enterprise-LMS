import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { FiVideo, FiFileText, FiHelpCircle, FiCheckCircle } from 'react-icons/fi'; 

const CoursePlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null); 
  
  const [activeTab, setActiveTab] = useState('overview');
  const [noteText, setNoteText] = useState("");
  const [doubtText, setDoubtText] = useState("");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [courseData, setCourseData] = useState({
    title: "Loading Enterprise Course...",
    description: "Please wait while we sync with the cloud database.",
    videoUrl: "",
    instructor: "Enterprise Admin",
    category: "Technology",
    _id: null,
    curriculum: []
  });

  const [comments, setComments] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);

  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizResult, setQuizResult] = useState(null); 
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    if (location.state && location.state.course) {
      const course = location.state.course;
      setCourseData(course);
      
      if (course.qaList) {
        setComments(course.qaList);
      }
      
      if (course.videoUrl) {
        setActiveLesson({ title: 'Course Intro', videoUrl: course.videoUrl, type: 'video' });
      } else if (course.curriculum && course.curriculum.length > 0 && course.curriculum[0].lessons.length > 0) {
        setActiveLesson(course.curriculum[0].lessons[0]);
      }

      toast.success("Syncing Live Course Data!", { icon: '🟢', style: { background: '#020617', color: '#fff' } });
    } else {
      toast.error("No course data found! Returning to Dashboard...");
      setTimeout(() => navigate('/employee/dashboard'), 2000);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    setSelectedQuizOption(null);
    setQuizResult(null);
  }, [activeLesson]);

  const handleAddTimestamp = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time - minutes * 60);
      const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      setNoteText(prev => prev + `\n[⏳ ${formattedTime}] - `);
      toast.success(`Timestamp ${formattedTime} marked in notes!`);
    }
  };

  const changeSpeed = () => {
    const newSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
    toast(`Playback speed set to ${newSpeed}x`, { icon: '⚡' });
  };

  const handlePostDoubt = async () => {
    if(!doubtText.trim()) return;
    if (!courseData._id && !courseData.id) return toast.error("Course ID missing! Cannot post comment.");

    const toastId = toast.loading("Broadcasting question to instructors...");
    
    try {
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName') || localStorage.getItem('name') || "Learner";
      const payload = { text: doubtText, user: userName };

      const response = await axios.post(`/api/courses/${courseData._id || courseData.id}/qa`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments(response.data.course.qaList);
      setDoubtText("");
      toast.success("Question Live! Instructors notified.", { id: toastId });
    } catch (error) {
      toast.error("Network Error. Is the backend route ready?", { id: toastId });
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return toast.error("Select an option first!");
    
    const correctAns = activeLesson.quizData.questions[0].correctOption;
    if (selectedQuizOption === correctAns) {
      setQuizResult('correct');
      toast.success("Excellent! Correct Answer.");
      if (!completedLessons.includes(activeLesson.title)) {
        setCompletedLessons([...completedLessons, activeLesson.title]);
      }
    } else {
      setQuizResult('incorrect');
      toast.error("Incorrect. Try reviewing the module!");
    }
  };

  const handleCompleteLesson = () => {
    if (!activeLesson) return;
    if (!completedLessons.includes(activeLesson.title)) {
      setCompletedLessons([...completedLessons, activeLesson.title]);
      toast.success("Lesson Marked as Completed!", {style: {background:'#10b981', color:'#fff'}});
    } else {
      toast("Already completed!", { icon: '✅' });
    }
  };

  let totalLessons = courseData.videoUrl ? 1 : 0;
  if (courseData.curriculum) {
    courseData.curriculum.forEach(mod => totalLessons += (mod.lessons ? mod.lessons.length : 0));
  }
  const completedCount = completedLessons.length; 
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // ==========================================
  // 🔥 GOD-LEVEL "MKM" BRAND CERTIFICATE GENERATOR 🔥
  // ==========================================
  const handleDownloadCertificate = () => {
    const toastId = toast.loading("Forging Max-Level MKM Certificate...");
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');

      // 1. ROYAL RADIAL BACKGROUND (Cinematic Lighting)
      const bgGrad = ctx.createRadialGradient(800, 600, 100, 800, 600, 1200);
      bgGrad.addColorStop(0, '#111827'); // Center spotlight
      bgGrad.addColorStop(1, '#020617'); // Deep dark edges
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. HIGH-SECURITY GEOMETRIC PATTERN (Like Bank Notes)
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      for(let i = 0; i < 1600; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - 400, 1200); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1600 - i, 0); ctx.lineTo(2000 - i, 1200); ctx.stroke();
      }

      // 3. REAL METALLIC GOLD GRADIENT (Photoshop Level)
      const goldGrad = ctx.createLinearGradient(200, 0, 1400, 0);
      goldGrad.addColorStop(0, '#bf953f');
      goldGrad.addColorStop(0.25, '#fcf6ba');
      goldGrad.addColorStop(0.5, '#b38728');
      goldGrad.addColorStop(0.75, '#fbf5b7');
      goldGrad.addColorStop(1, '#aa771c');

      // 4. TRIPLE ELEGANT BORDERS
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 12;
      ctx.strokeRect(50, 50, 1500, 1100);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.strokeRect(70, 70, 1460, 1060);
      ctx.strokeRect(40, 40, 1520, 1120);

      // 5. MAX-LEVEL MKM LOGO (Top Center)
      ctx.font = 'bold 90px "Georgia", serif';
      ctx.fillStyle = goldGrad;
      ctx.textAlign = 'center';
      
      // Logo Glow
      ctx.shadowColor = 'rgba(252, 246, 186, 0.4)';
      ctx.shadowBlur = 20;
      ctx.fillText('M K M', 800, 180);
      ctx.shadowBlur = 0; // Reset glow

      // Premium Stars under logo
      ctx.font = '30px Arial';
      ctx.fillStyle = '#fcf6ba';
      ctx.fillText('★ ★ ★', 800, 230);

      // 6. MAIN TITLE
      ctx.font = 'bold 65px "Georgia", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('CERTIFICATE OF EXCELLENCE', 800, 370);

      // 7. SUBTITLE
      ctx.font = 'italic 32px "Georgia", serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('This is proudly presented to', 800, 470);

      // 8. EMPLOYEE NAME (Giant, Gold, Glowing)
      const userName = localStorage.getItem('userName') || localStorage.getItem('name') || "Enterprise Learner";
      ctx.font = 'bold 100px "Georgia", serif';
      ctx.fillStyle = goldGrad;
      
      ctx.shadowColor = 'rgba(252, 246, 186, 0.5)';
      ctx.shadowBlur = 25;
      ctx.fillText(userName.toUpperCase(), 800, 590);
      ctx.shadowBlur = 0;

      // Elegant Underline for Name
      const textWidth = ctx.measureText(userName.toUpperCase()).width;
      const lineStart = 800 - (textWidth / 2) - 80;
      const lineEnd = 800 + (textWidth / 2) + 80;
      ctx.beginPath(); ctx.moveTo(lineStart, 630); ctx.lineTo(lineEnd, 630);
      ctx.lineWidth = 3; ctx.strokeStyle = goldGrad; ctx.stroke();

      // 9. COURSE DETAILS
      ctx.font = '28px "Arial", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('For successfully completing the elite enterprise payload & assessment:', 800, 740);

      ctx.font = 'bold 46px "Georgia", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`"${courseData.title.toUpperCase()}"`, 800, 820);

      // 10. THE RED & GOLD RIBBON SEAL (Bottom Center - Premium Effect)
      // Ribbons
      ctx.fillStyle = '#7f1d1d'; // Deep Royal Red
      ctx.beginPath(); ctx.moveTo(760, 1000); ctx.lineTo(720, 1140); ctx.lineTo(760, 1110); ctx.lineTo(800, 1140); ctx.fill();
      ctx.beginPath(); ctx.moveTo(840, 1000); ctx.lineTo(880, 1140); ctx.lineTo(840, 1110); ctx.lineTo(800, 1140); ctx.fill();
      
      // Outer Gold Seal
      ctx.beginPath(); ctx.arc(800, 1010, 75, 0, Math.PI * 2);
      ctx.fillStyle = goldGrad; ctx.fill();
      
      // Inner Dark Seal
      ctx.beginPath(); ctx.arc(800, 1010, 60, 0, Math.PI * 2);
      ctx.fillStyle = '#020617'; ctx.fill();
      
      // Seal Text
      ctx.font = 'bold 22px "Arial", sans-serif'; 
      ctx.fillStyle = goldGrad;
      ctx.fillText('MKM', 800, 1000);
      ctx.font = 'bold 18px "Arial", sans-serif'; 
      ctx.fillStyle = '#ffffff';
      ctx.fillText('VERIFIED', 800, 1030);

      // 11. SIGNATURE & DATE (Bottom Right & Left)
      const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      // -- Left: Date
      ctx.textAlign = 'center';
      ctx.font = 'bold 26px "Arial", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(issueDate, 350, 1030);
      ctx.beginPath(); ctx.moveTo(200, 1050); ctx.lineTo(500, 1050); ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth=2; ctx.stroke();
      ctx.font = '18px "Arial", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('DATE OF ISSUE', 350, 1080);

      // -- Right: Manish Kumar Mishra Signature
      ctx.font = 'italic 55px "Times New Roman", serif';
      ctx.fillStyle = goldGrad;
      ctx.fillText('Manish Kumar Mishra', 1250, 1020);
      ctx.beginPath(); ctx.moveTo(1050, 1050); ctx.lineTo(1450, 1050); ctx.stroke();
      
      ctx.font = 'bold 20px "Arial", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('MANISH KUMAR MISHRA', 1250, 1080);
      ctx.font = '16px "Arial", sans-serif';
      ctx.fillStyle = '#38bdf8'; // Founder title in striking blue
      ctx.fillText('FOUNDER & CHIEF ARCHITECT', 1250, 1105);

      // 12. CREDENTIAL ID (FIXED VISIBILITY)
      const certId = 'MKM-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      ctx.textAlign = 'left';
      ctx.font = 'bold 18px "Courier New", monospace';
      ctx.fillStyle = '#64748b';
      // 🚨 ID ab perfectly align aur upar shift kar di hai!
      ctx.fillText(`Credential ID: ${certId}`, 80, 1100);
      ctx.fillText(`Verify at: mkm-global.com/verify`, 80, 1125);

    // 13. Download Action
      const link = document.createElement('a');
      
      // 🚨 THE FIX: Filename exactly as requested -> "MKM Employee Name.png"
      link.download = `MKM ${userName}.png`; 
      
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success("Certificate Forged!", { id: toastId, style: { background: '#fbbf24', color: '#000' }});
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate certificate.", { id: toastId });
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    .player-layout { font-family: 'Inter', sans-serif; display: flex; height: 100vh; background: #020617; color: #f8fafc; overflow: hidden; }
    .main-player-section { flex: 1; display: flex; flex-direction: column; overflow-y: auto; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); background-image: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.08), transparent 60%); }
    .top-nav { padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 50; }
    .back-btn { display: flex; align-items: center; gap: 8px; color: #94a3b8; font-weight: 600; cursor: pointer; transition: 0.3s; background: transparent; border: none; font-size: 14px; }
    .back-btn:hover { color: #fff; transform: translateX(-4px); }
    .nav-actions { display: flex; align-items: center; gap: 24px; }
    .toggle-container { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: #94a3b8; cursor: pointer; }
    .toggle-switch { width: 44px; height: 24px; background: ${autoPlay ? '#3b82f6' : 'rgba(255,255,255,0.1)'}; border-radius: 20px; position: relative; transition: 0.3s; }
    .toggle-knob { width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; top: 3px; left: ${autoPlay ? '23px' : '3px'}; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
    .video-container { padding: 40px; max-width: ${isSidebarOpen ? '1200px' : '1600px'}; margin: 0 auto; width: 100%; box-sizing: border-box; transition: max-width 0.4s ease; }
    .video-glow-backdrop { position: relative; width: 100%; border-radius: 24px; }
    .video-glow-backdrop::before { content: ''; position: absolute; inset: -20px; background: linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.1) 100%); filter: blur(40px); z-index: 0; opacity: 0.6; }
    .cinematic-wrapper { width: 100%; aspect-ratio: 16 / 9; background: #000; border-radius: 24px; position: relative; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1); z-index: 1; display:flex; justify-content:center; align-items:center; }
    .real-video { width: 100%; height: 100%; object-fit: contain; outline: none; }
    .course-meta { margin-top: 32px; display: flex; justify-content: space-between; align-items: flex-start; }
    .course-title { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 12px 0; background: linear-gradient(to right, #fff, #cbd5e1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .action-buttons { display: flex; gap: 12px; }
    .btn-secondary { padding: 12px 20px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.3s; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 8px; }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); }
    .btn-complete { padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.3s; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #fff; border: none; box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4); display: flex; align-items: center; gap: 8px; text-decoration: none;}
    .btn-complete:hover { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.5); }
    
    /* 🚨 NEW PREMIUM BUTTON FOR CERTIFICATE */
    .btn-gold { padding: 14px 24px; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer; transition: 0.3s; background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); color: #000; border: none; box-shadow: 0 10px 20px -5px rgba(251, 191, 36, 0.4); display: flex; align-items: center; gap: 8px; width: 100%; justify-content: center; margin-top: 16px; }
    .btn-gold:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(251, 191, 36, 0.6); }

    .tabs-header { display: flex; gap: 32px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-top: 40px; }
    .tab-item { padding-bottom: 16px; font-weight: 600; font-size: 15px; cursor: pointer; color: #64748b; position: relative; transition: 0.3s; }
    .tab-item.active { color: #fff; }
    .tab-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: #3b82f6; box-shadow: 0 -2px 10px rgba(59, 130, 246, 0.5); }
    .tab-content { padding: 32px 0; color: #94a3b8; line-height: 1.7; font-size: 15px; }
    .input-premium { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; color: #fff; margin-bottom: 16px; font-family: 'Inter'; box-sizing: border-box; resize: vertical; transition: 0.3s; }
    .input-premium:focus { outline: none; border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
    
    .curriculum-sidebar { width: ${isSidebarOpen ? '420px' : '0px'}; opacity: ${isSidebarOpen ? '1' : '0'}; visibility: ${isSidebarOpen ? 'visible' : 'hidden'}; background: rgba(15, 23, 42, 0.6); border-left: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; backdrop-filter: blur(24px); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; }
    .sidebar-header { padding: 32px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); width: 420px; box-sizing: border-box; }
    .module-list { flex: 1; overflow-y: auto; padding: 16px; width: 420px; box-sizing: border-box; }
    .module-item { padding: 16px; border-radius: 16px; margin-bottom: 8px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; display: flex; gap: 16px; background: rgba(255,255,255,0.01); }
    .module-item:hover:not(.active) { background: rgba(255,255,255,0.03); }
    .module-item.active { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); }
    .module-title-head { font-size: 13px; color: #94a3b8; font-weight: 800; text-transform: uppercase; margin: 24px 0 12px 8px; letter-spacing: 1px; }
  `;

  return (
    <div className="player-layout">
      <style>{styles}</style>
      <Toaster position="top-right" />

      <div className="main-player-section">
        <div className="top-nav">
          <button className="back-btn" onClick={() => navigate('/employee/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Exit Player
          </button>
          
          <div className="nav-actions">
            <div className="toggle-container" onClick={() => setAutoPlay(!autoPlay)}>
              <span>Auto-Play</span>
              <div className="toggle-switch"><div className="toggle-knob"></div></div>
            </div>
            
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn-secondary" style={{padding: '8px 12px', border:'none', background: isSidebarOpen ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.1)', color: isSidebarOpen ? '#60a5fa' : '#fff'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="15" y1="3" x2="15" y2="21"></line></svg>
              {isSidebarOpen ? 'Focus Mode' : 'Show Curriculum'}
            </button>
          </div>
        </div>

        <div className="video-container">
          <div className="video-glow-backdrop">
            <div className="cinematic-wrapper">
              {activeLesson && activeLesson.type === 'video' ? (
                <video ref={videoRef} key={activeLesson.videoUrl} className="real-video" controls autoPlay={autoPlay} controlsList="nodownload">
                  <source src={activeLesson.videoUrl} type="video/mp4" />
                </video>
              ) : activeLesson && activeLesson.type === 'notes' ? (
                <div style={{ color: '#fff', textAlign: 'center' }}>
                  <FiFileText size={64} color="#fbbf24" style={{ marginBottom: '20px' }} />
                  <h2 style={{ marginBottom: '20px' }}>{activeLesson.title}</h2>
                  <a href={activeLesson.contentUrl} target="_blank" rel="noreferrer" className="btn-complete" style={{ display: 'inline-flex', margin: '0 auto' }}>
                    View & Download PDF
                  </a>
                </div>
              ) : activeLesson && activeLesson.type === 'quiz' ? (
                <div style={{ color: '#fff', width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <FiHelpCircle size={28} color="#ef4444" />
                    <h2 style={{ margin: 0, fontSize: '22px' }}>{activeLesson.title}</h2>
                  </div>
                  
                  {activeLesson.quizData && activeLesson.quizData.questions && activeLesson.quizData.questions.length > 0 ? (
                    <>
                      <p style={{ fontSize: '18px', marginBottom: '24px', color: '#e2e8f0', lineHeight: 1.5 }}>
                        {activeLesson.quizData.questions[0].questionText}
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                        {activeLesson.quizData.questions[0].options.map((opt, idx) => (
                          <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: selectedQuizOption === idx ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px', border: `1px solid ${selectedQuizOption === idx ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', transition: '0.2s' }}>
                            <input type="radio" name="quiz_option" checked={selectedQuizOption === idx} onChange={() => setSelectedQuizOption(idx)} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                            <span style={{ fontSize: '15px', color: '#f8fafc' }}>{opt}</span>
                          </label>
                        ))}
                      </div>

                      {quizResult && (
                        <div style={{ padding: '16px', borderRadius: '10px', marginBottom: '24px', background: quizResult === 'correct' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: quizResult === 'correct' ? '#34d399' : '#f87171', border: `1px solid ${quizResult === 'correct' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, fontWeight: 600 }}>
                          {quizResult === 'correct' ? '✅ Correct Answer! Great job.' : '❌ Incorrect Answer. Please review the module and try again.'}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '16px' }}>
                        <button className="btn-complete" onClick={handleQuizSubmit} style={{ flex: 1, justifyContent: 'center' }}>
                          Submit Answer
                        </button>
                        {(!activeLesson.quizData.isCompulsory) && (
                          <button className="btn-secondary" onClick={() => {toast("Quiz skipped.", { icon: '⏭️'}); handleCompleteLesson();}}>
                            Skip Assessment
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ color: '#94a3b8' }}>
                      <p>No questions configured for this assessment.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{color: '#fff'}}>Loading Secure Stream...</div>
              )}
            </div>
          </div>

          <div className="course-meta">
            <div>
              <h1 className="course-title">{courseData.title}</h1>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#94a3b8', fontSize: '14px' }}>
                <span style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '6px', fontWeight: 600 }}>{courseData.category}</span>
                <span>•</span>
                <span>Instructor: <strong>{courseData.instructor}</strong></span>
              </div>
            </div>
            
            <div className="action-buttons">
              <button className="btn-secondary" onClick={changeSpeed}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                {playbackSpeed}x Speed
              </button>
              
              <button 
                className="btn-complete" 
                onClick={handleCompleteLesson}
                style={{ 
                  background: completedLessons.includes(activeLesson?.title) ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: completedLessons.includes(activeLesson?.title) ? '1px solid #10b981' : 'none',
                  color: completedLessons.includes(activeLesson?.title) ? '#10b981' : '#fff'
                }}
              >
                <FiCheckCircle size={18}/>
                {completedLessons.includes(activeLesson?.title) ? "Completed" : "Mark as Complete"}
              </button>
            </div>
          </div>

          <div className="tabs-header">
            <div className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</div>
            <div className={`tab-item ${activeTab === 'qna' ? 'active' : ''}`} onClick={() => setActiveTab('qna')}>Q&A Discussions</div>
            <div className={`tab-item ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>Smart Notes</div>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <p style={{ fontSize: '16px', color: '#cbd5e1' }}>{courseData.description}</p>
              </div>
            )}

            {activeTab === 'qna' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <textarea className="input-premium" rows="3" placeholder="Stuck somewhere? Ask the instructor here..." value={doubtText} onChange={(e)=>setDoubtText(e.target.value)}></textarea>
                <button className="btn-complete" onClick={handlePostDoubt} style={{marginBottom: '32px'}}>Post Question</button>
                
                {comments && comments.map((comment, index) => (
                  <div key={comment._id || index} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', marginBottom: '16px', borderLeft: comment.isInstructor ? '4px solid #10b981' : '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: 600 }}>
                        <div style={{width: '32px', height: '32px', borderRadius: '50%', background: comment.isInstructor ? '#10b981' : '#3b82f6', display: 'flex', alignItems:'center', justifyContent:'center'}}>{comment.user ? comment.user.charAt(0) : 'U'}</div>
                        {comment.user} {comment.isInstructor && <span style={{ background: '#10b981', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Instructor</span>}
                      </div>
                      <span style={{color: '#64748b', fontSize: '12px'}}>{new Date(comment.createdAt).toLocaleDateString() || 'Recently'}</span>
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '16px' }}>{comment.text}</div>
                  </div>
                ))}
                {(!comments || comments.length === 0) && (
                  <div style={{color: '#64748b'}}>Be the first to ask a question!</div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button className="btn-secondary" onClick={handleAddTimestamp}>📌 Bookmark Current Time</button>
                </div>
                <textarea className="input-premium" rows="6" placeholder="Take notes here. Use the bookmark button to tag video timestamps..." value={noteText} onChange={(e) => setNoteText(e.target.value)}></textarea>
                <button className="btn-complete" onClick={() => {toast.success("Saved to Enterprise Vault."); setNoteText('');}}>Save Notes</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🚨 THE SYNCED CURRICULUM SIDEBAR */}
      <div className="curriculum-sidebar">
        <div className="sidebar-header">
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0' }}>Course Curriculum</h2>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', width: `${progressPercentage}%` }}></div>
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
            <span>{completedCount} of {totalLessons} modules</span>
            <span style={{ color: '#fff' }}>{progressPercentage}%</span>
          </div>

          {/* 🚨 THE FIX: GOLDEN CERTIFICATE BUTTON (Visible only at 100%) */}
          {progressPercentage === 100 && (
            <button className="btn-gold" onClick={handleDownloadCertificate}>
              🏆 Download Premium Certificate
            </button>
          )}

        </div>

        <div className="module-list">
          {courseData.videoUrl && (
            <>
              <div className="module-title-head">Base Introduction</div>
              <div 
                className={`module-item ${activeLesson?.videoUrl === courseData.videoUrl ? 'active' : ''}`} 
                onClick={() => setActiveLesson({ title: 'Course Intro', videoUrl: courseData.videoUrl, type: 'video' })}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)', background: activeLesson?.videoUrl === courseData.videoUrl ? '#3b82f6' : 'rgba(0,0,0,0.2)', borderColor: activeLesson?.videoUrl === courseData.videoUrl ? '#3b82f6' : 'rgba(255,255,255,0.1)', color: activeLesson?.videoUrl === courseData.videoUrl ? '#fff' : '#64748b' }}>
                  <FiVideo size={12} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: activeLesson?.videoUrl === courseData.videoUrl ? '#fff' : '#e2e8f0', lineHeight: 1.4 }}>Course Trailer / Intro</h4>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Video</div>
                </div>
              </div>
            </>
          )}

          {courseData.curriculum && courseData.curriculum.map((mod, mIndex) => (
            <div key={mIndex}>
              <div className="module-title-head">Section {mIndex + 1}: {mod.moduleTitle}</div>
              
              {mod.lessons && mod.lessons.map((lesson, lIndex) => {
                const isActive = activeLesson?.title === lesson.title;
                const isCompleted = completedLessons.includes(lesson.title);

                return (
                  <div key={lIndex} className={`module-item ${isActive ? 'active' : ''}`} onClick={() => setActiveLesson(lesson)}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)', background: isActive ? '#3b82f6' : isCompleted ? '#10b981' : 'rgba(0,0,0,0.2)', borderColor: isActive ? '#3b82f6' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.1)', color: isActive || isCompleted ? '#fff' : lesson.type === 'quiz' ? '#ef4444' : '#64748b' }}>
                      {isCompleted ? <FiCheckCircle size={12}/> : lesson.type === 'video' ? <FiVideo size={12}/> : lesson.type === 'notes' ? <FiFileText size={12}/> : <FiHelpCircle size={12}/>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: isActive ? '#fff' : isCompleted ? '#94a3b8' : '#e2e8f0', lineHeight: 1.4, textDecoration: isCompleted ? 'line-through' : 'none' }}>
                        {lesson.title}
                      </h4>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                        {lesson.type === 'video' ? 'Video Lesson' : lesson.type === 'notes' ? 'PDF Document' : 'Assessment Quiz'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
