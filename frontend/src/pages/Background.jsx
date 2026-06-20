import React from 'react';
import './Login.css';

const Background = () => {
  const particles = Array.from({ length: 20 });

  return (
    <div className="ambient-bg-layer">
      <div className="aurora-1"></div>
      <div className="aurora-2"></div>
      <div className="aurora-3"></div>

      {particles.map((_, i) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDuration = Math.random() * 10 + 10;
        const randomDelay = Math.random() * 5;

        return (
          <div
            key={i}
            className="particle"
            style={{
              left: `${randomX}vw`,
              top: `${randomY}vh`,
              animationDuration: `${randomDuration}s`,
              animationDelay: `${randomDelay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Background;