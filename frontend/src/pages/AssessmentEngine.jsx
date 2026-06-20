import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// Dummy Questions (Baad mein backend se fetch karenge)
const mockQuestions = [
  {
    id: 1,
    text: "What is the primary benefit of React's Virtual DOM?",
    options: [
      "Direct manipulation of the actual DOM",
      "Improved performance by minimizing DOM updates",
      "Easier Server-Side Rendering implementation",
      "Built-in state management without Redux"
    ],
    correct: 1
  },
  {
    id: 2,
    text: "In Node.js, which module is used to create a web server?",
    options: ["fs", "path", "http", "events"],
    correct: 2
  },
  {
    id: 3,
    text: "What does CSS Grid excel at compared to Flexbox?",
    options: [
      "One-dimensional layouts (rows or columns)",
      "Two-dimensional layouts (rows and columns simultaneously)",
      "Animating complex vector graphics",
      "Handling text typography automatically"
    ],
    correct: 1
  },
  {
    id: 4,
    text: "Which HTTP method is fully idempotent?",
    options: ["POST", "PATCH", "PUT", "CONNECT"],
    correct: 2
  }
];

const AssessmentEngine = () => {
  const navigate = useNavigate();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Timer: 10 minutes (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (isSubmitted) return;
    
    if (timeLeft <= 0) {
      toast.error("Time is up! Auto-submitting assessment.");
      handleSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitted]);

  // UPDATE: Toggle Logic for Deselection
  const handleOptionSelect = (optionIndex) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      if (newAnswers[currentQIndex] === optionIndex) {
        // Agar pehle se wahi select hai, toh use delete kar do (Deselect)
        delete newAnswers[currentQIndex];
      } else {
        // Naya option select karo
        newAnswers[currentQIndex] = optionIndex;
      }
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQIndex < mockQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate Score
    let calculatedScore = 0;
    mockQuestions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        calculatedScore += 1;
      }
    });
    
    setScore(calculatedScore);
    setIsSubmitted(true);
    toast.success("Assessment submitted successfully!");
  };

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercentage = ((Object.keys(answers).length) / mockQuestions.length) * 100;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    .assessment-container { 
      font-family: 'Plus Jakarta Sans', sans-serif; 
      min-height: 100vh; 
      background: #000000; 
      background-image: radial-gradient(circle at 50% -20%, #1e1b4b 0%, #000000 70%); 
      color: #f8fafc; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      padding: 40px 20px;
    }

    .top-bar { width: 100%; max-width: 900px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    
    .timer-badge { 
      padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 18px; letter-spacing: 2px;
      background: ${timeLeft < 60 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)'}; 
      color: ${timeLeft < 60 ? '#ef4444' : '#fff'};
      border: 1px solid ${timeLeft < 60 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)'};
      box-shadow: ${timeLeft < 60 ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none'};
      display: flex; align-items: center; gap: 8px; transition: 0.3s;
    }

    .glass-card { 
      width: 100%; max-width: 900px; 
      background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(24px); 
      border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; 
      padding: 40px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); 
    }

    .progress-track { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 40px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6); border-radius: 6px; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }

    .question-meta { color: #94a3b8; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; display: block; }
    .question-text { font-size: 28px; font-weight: 800; line-height: 1.4; margin-bottom: 40px; }

    .options-grid { display: flex; flex-direction: column; gap: 16px; }
    
    .option-btn { 
      width: 100%; text-align: left; padding: 20px 24px; border-radius: 16px; 
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); 
      color: #cbd5e1; font-size: 16px; font-weight: 500; cursor: pointer; 
      transition: all 0.2s ease; display: flex; align-items: center; gap: 16px;
    }
    .option-btn:hover:not(.selected) { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); transform: translateX(5px); }
    
    .option-btn.selected { 
      background: rgba(59, 130, 246, 0.1); border-color: #3b82f6; color: #fff; 
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.15), inset 0 0 0 1px #3b82f6; 
    }
    
    .option-indicator { 
      width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); 
      display: flex; align-items: center; justify-content: center; transition: 0.2s;
    }
    .option-btn.selected .option-indicator { border-color: #3b82f6; background: #3b82f6; }
    .option-btn.selected .option-indicator::after { content: ''; width: 8px; height: 8px; background: #fff; border-radius: 50%; }

    .nav-buttons { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); }
    
    .btn-secondary { padding: 14px 28px; border-radius: 14px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 700; cursor: pointer; transition: 0.2s; }
    .btn-secondary:hover:not(:disabled) { background: rgba(255,255,255,0.05); }
    .btn-secondary:disabled { opacity: 0.3; cursor: not-allowed; }
    
    .btn-primary { padding: 14px 32px; border-radius: 14px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: none; color: #fff; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37, 99, 235, 0.5); }
    .btn-submit { background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
    .btn-submit:hover { box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5); }

    /* Result Screen Specific */
    .result-ring { 
      width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 30px;
      display: flex; align-items: center; justify-content: center;
      background: conic-gradient(#10b981 ${(score/mockQuestions.length)*100}%, rgba(255,255,255,0.05) 0);
      position: relative;
    }
    .result-ring::before { content: ''; position: absolute; inset: 10px; background: #0f1219; border-radius: 50%; }
    .result-score { position: relative; font-size: 36px; font-weight: 800; color: #fff; }
  `;

  if (isSubmitted) {
    const percentage = (score / mockQuestions.length) * 100;
    const isPassed = percentage >= 50;

    return (
      <div className="assessment-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '600px', padding: '60px 40px' }}>
          <div className="result-ring">
            <div className="result-score">{score}/{mockQuestions.length}</div>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: isPassed ? '#34d399' : '#f87171' }}>
            {isPassed ? "Assessment Cleared!" : "Assessment Failed"}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>
            {isPassed 
              ? "Excellent work. Your evaluation data has been securely synced with the Enterprise database." 
              : "You did not meet the minimum passing criteria. Please review the course materials and try again."}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/employee/dashboard')} className="btn-secondary">Return to Dashboard</button>
            {isPassed && <button className="btn-primary" style={{ background: '#8b5cf6', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }}>View Certificate</button>}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = mockQuestions[currentQIndex];
  const allAnswered = Object.keys(answers).length === mockQuestions.length;

  return (
    <div className="assessment-container">
      <style>{styles}</style>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/employee/dashboard')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Quarterly Security Compliance</h2>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Enterprise Evaluation Portal</span>
          </div>
        </div>
        
        <div className="timer-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="glass-card">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <span className="question-meta">Question {currentQIndex + 1} of {mockQuestions.length}</span>
        <h1 className="question-text">{currentQ.text}</h1>

        <div className="options-grid">
          {currentQ.options.map((opt, index) => (
            <div 
              key={index} 
              className={`option-btn ${answers[currentQIndex] === index ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="option-indicator"></div>
              {opt}
            </div>
          ))}
        </div>

        <div className="nav-buttons">
          <button 
            className="btn-secondary" 
            onClick={handlePrev} 
            disabled={currentQIndex === 0}
          >
            Previous
          </button>
          
          {currentQIndex === mockQuestions.length - 1 ? (
            <button 
              className={`btn-primary btn-submit`} 
              onClick={handleSubmit}
              disabled={!allAnswered} 
              style={{ opacity: !allAnswered ? 0.5 : 1 }}
            >
              Submit Evaluation
            </button>
          ) : (
            <button 
              className="btn-primary" 
              onClick={handleNext}
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentEngine;