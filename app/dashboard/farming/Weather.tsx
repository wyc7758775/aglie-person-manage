'use client';

import { useEffect, useState } from 'react';

export type WeatherType = 'sunny' | 'rainy' | 'snowy';

interface WeatherProps {
  weather: WeatherType;
}

export default function Weather({ weather }: WeatherProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    if (weather === 'sunny') {
      setParticles([]);
      return;
    }

    const newParticles = Array.from({ length: weather === 'rainy' ? 50 : 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: weather === 'rainy' ? 0.8 + Math.random() * 0.4 : 2 + Math.random() * 2,
    }));

    setParticles(newParticles);
  }, [weather]);

  if (weather === 'sunny') {
    return (
      <div className="absolute top-4 right-4">
        <div className="w-16 h-16 rounded-full bg-yellow-400 shadow-lg shadow-yellow-200 animate-pulse">
          <div className="absolute inset-0 rounded-full bg-yellow-300 opacity-50" style={{ animation: 'sun-glow 2s ease-in-out infinite' }} />
        </div>
        <style jsx>{`
          @keyframes sun-glow {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {weather === 'rainy' && (
        <>
          <div className="absolute inset-0 bg-blue-900/10" />
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-0.5 h-3 bg-blue-400"
              style={{
                left: `${particle.left}%`,
                top: '-20px',
                animation: `rain-fall ${particle.duration}s linear infinite`,
                animationDelay: `${particle.delay}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </>
      )}

      {weather === 'snowy' && (
        <>
          <div className="absolute inset-0 bg-white/5" />
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${particle.left}%`,
                top: '-20px',
                animation: `snow-fall ${particle.duration}s linear infinite`,
                animationDelay: `${particle.delay}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </>
      )}

      <style jsx>{`
        @keyframes rain-fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(100vh + 20px)); }
        }
        @keyframes snow-fall {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(25vh) translateX(10px); }
          50% { transform: translateY(50vh) translateX(-10px); }
          75% { transform: translateY(75vh) translateX(10px); }
          100% { transform: translateY(calc(100vh + 20px)) translateX(0); }
        }
      `}</style>
    </div>
  );
}
