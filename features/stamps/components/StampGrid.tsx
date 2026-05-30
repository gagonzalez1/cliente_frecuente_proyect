'use client';

/**
 * StampGrid — Grilla visual de sellos (5 por defecto)
 */
export default function StampGrid({ 
  currentStamps, 
  totalRequired 
}: { 
  currentStamps: number; 
  totalRequired: number; 
}) {
  return (
    <div className="stamp-grid">
      {Array.from({ length: totalRequired }).map((_, i) => (
        <div
          key={i}
          className={`stamp-slot ${i < currentStamps ? 'filled' : 'empty'}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {i < currentStamps ? '☕' : ''}
        </div>
      ))}
    </div>
  );
}
