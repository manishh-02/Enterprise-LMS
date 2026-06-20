import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight, FiZap } from 'react-icons/fi';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      
      // Show God-Level Success Message
      setSuccessMsg(response.data.message);
      
      // 3 seconds baad automatically Login page par bhej do
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { margin: 0; padding: 0; background-color: #050505; }

    .god-layout {
      display: flex; width: 100vw; height: 100vh; overflow: hidden; position: relative;
      background-color: #050505 !important; font-family: 'Inter', sans-serif;
    }

    /* --- Left Side: The Form Panel --- */
    .auth-panel {
      flex: 0.9; position: relative; display: flex; justify-content: center; align-items: center; padding: 40px; z-index: 10;
      background: linear-gradient(135deg, #050505 0%, #0a0a0c 100%);
      border-right: 1px solid rgba(255, 255, 255, 0.03);
    }

    /* Glowing Orb Behind Form */
    .auth-panel::before {
      content: ''; position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%);
      top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; pointer-events: none;
    }

    .auth-box {
      width: 100%; max-width: 420px; position: relative; z-index: 1;
      background: rgba(20, 20, 22, 0.6); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 48px;
      box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
      animation: formEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .auth-header { margin-bottom: 36px; text-align: left; }
    .auth-header h2 { font-size: 32px; font-weight: 800; color: white; margin: 0 0 8px 0; letter-spacing: -1px; }
    .auth-header p { color: #8892b0; font-size: 15px; margin: 0; }

    .input-wrap { position: relative; margin-bottom: 20px; }
    .icon-left { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 18px; transition: 0.3s; }
    
    .god-input {
      width: 100%; padding: 16px 16px 16px 48px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px;
      color: white; font-size: 15px; outline: none; transition: all 0.3s ease; box-sizing: border-box; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    }
    .god-input:focus { border-color: #8a2be2; background: rgba(138, 43, 226, 0.03); box-shadow: 0 0 0 4px rgba(138, 43, 226, 0.1), inset 0 2px 4px rgba(0,0,0,0.2); }
    .god-input:focus + .icon-left, .god-input:not(:placeholder-shown) + .icon-left { color: #8a2be2; }

    .icon-right { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #64748b; cursor: pointer; transition: 0.3s; }
    .icon-right:hover { color: white; }

    .god-btn {
      width: 100%; padding: 16px; margin-top: 16px;
      background: linear-gradient(135deg, #8a2be2 0%, #00f0ff 100%);
      color: #fff; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer;
      display: flex; justify-content: center; align-items: center; gap: 10px; transition: all 0.3s ease; position: relative; overflow: hidden;
    }
    .god-btn::after {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
      transform: translateX(-100%); transition: 0.5s;
    }
    .god-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(138, 43, 226, 0.4); }
    .god-btn:hover::after { transform: translateX(100%); }
    .god-btn:disabled { opacity: 0.7; cursor: not-allowed; }

    .auth-footer { margin-top: 32px; text-align: center; color: #8892b0; font-size: 14px; }
    .auth-link { color: #8a2be2; text-decoration: none; font-weight: 600; transition: 0.3s; }
    .auth-link:hover { text-shadow: 0 0 10px rgba(138, 43, 226, 0.5); }
    
    .error-banner { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 14px; border-radius: 12px; font-size: 14px; text-align: center; margin-bottom: 24px; animation: shake 0.4s; }
    .success-banner { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #34d399; padding: 14px; border-radius: 12px; font-size: 14px; text-align: center; margin-bottom: 24px; animation: formEnter 0.4s; }

    /* --- Right Side: Hero --- */
    .hero-section { flex: 1.1; position: relative; display: flex; flex-direction: column; justify-content: center; padding: 0 5vw 0 8vw; z-index: 2; }
    .hero-section::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(circle at 85% 50%, rgba(0, 240, 255, 0.15), transparent 30%), radial-gradient(circle at 15% 30%, rgba(138, 43, 226, 0.1), transparent 30%);
      z-index: -1; animation: pulseGlow 8s infinite alternate;
    }
    .badge-pill {
      display: inline-flex; align-items: center; gap: 8px; background: rgba(138, 43, 226, 0.05); border: 1px solid rgba(138, 43, 226, 0.2); color: #d8b4fe; padding: 8px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 30px; width: fit-content; box-shadow: 0 0 20px rgba(138, 43, 226, 0.1);
    }
    .hero-title { font-size: 4.5vw; font-weight: 900; color: #ffffff !important; line-height: 1.1; margin: 0 0 24px 0; letter-spacing: -2px; }
    .gradient-text { background: linear-gradient(135deg, #8a2be2 0%, #00f0ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; }
    .hero-desc { font-size: 1.1vw; color: #8892b0; max-width: 85%; line-height: 1.7; font-weight: 400; }

    @keyframes pulseGlow { 0% { opacity: 0.4; } 100% { opacity: 0.8; } }
    @keyframes formEnter { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes shake { 0%, 100% {transform: translateX(0);} 25% {transform: translateX(-5px);} 75% {transform: translateX(5px);} }
  `;

  return (
    <div className="god-layout">
      <style>{styles}</style>
      
      {/* LEFT: Auth Panel (Flipped for Signup) */}
      <div className="auth-panel">
        <div className="auth-box">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join the enterprise learning ecosystem</p>
          </div>

          {/* DYNAMIC BANNERS */}
          {error && <div className="error-banner">{error}</div>}
          {successMsg && <div className="success-banner">{successMsg}</div>}

          <form onSubmit={handleSignup}>
            <div className="input-wrap">
              <input type="text" className="god-input" placeholder="Full Legal Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
              <FiUser className="icon-left" />
            </div>

            <div className="input-wrap">
              <input type="email" className="god-input" placeholder="Corporate Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
              <FiMail className="icon-left" />
            </div>

            <div className="input-wrap">
              <input type={showPassword ? "text" : "password"} className="god-input" placeholder="Create Secure Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
              <FiLock className="icon-left" />
              <div className="icon-right" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </div>
            </div>

            <button type="submit" className="god-btn" disabled={isLoading || successMsg}>
              {isLoading ? 'Creating Profile...' : <>Initialize Profile <FiArrowRight size={20}/></>}
            </button>
          </form>

          <div className="auth-footer">
            Already registered? <Link to="/login" className="auth-link">Sign In to Matrix</Link>
          </div>
        </div>
      </div>

      {/* RIGHT: Immersive Hero Area */}
      <div className="hero-section">
        <div className="badge-pill">
          <FiZap /> Future-Ready Skilling
        </div>
        <h1 className="hero-title">
          Architect the <br />
          <span className="gradient-text">Future of Work.</span>
        </h1>
        <p className="hero-desc">
          Gain access to world-class certifications in Generative AI, Cloud Infrastructure, and Enterprise Architecture. Your journey to mastery begins right here.
        </p>
      </div>
    </div>
  );
};

export default Signup;