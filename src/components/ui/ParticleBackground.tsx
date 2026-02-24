export function ParticleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#7C3AED', '#06B6D4', '#22D3EE'][i % 3],
            opacity: Math.random() * 0.4 + 0.1,
            animationDuration: `${Math.random() * 15 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`line-${i}`}
          className="absolute animate-pulse-slow"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: `${80 + Math.random() * 120}px`,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? 'rgba(124,58,237,0.15)' : 'rgba(6,182,212,0.15)'}, transparent)`,
            transform: `rotate(${Math.random() * 60 - 30}deg)`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}
