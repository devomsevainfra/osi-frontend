import React, { useRef, useState, useEffect } from 'react';
import { useCounterAnimation } from '../../hooks/useCounterAnimation';

/**
 * StatCounter component that animates numeric stats when it scrolls into view.
 * 
 * @param {Object} props
 * @param {number} props.value - The final target number to count to.
 * @param {string} [props.suffix=''] - String suffix (e.g. "+", "%").
 * @param {string} props.label - Metric label (e.g. "Projects Completed").
 * @param {string} [props.description] - Short description below the label.
 */
export function StatCounter({
  value,
  suffix = '',
  label,
  description
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, []);

  const count = useCounterAnimation(value, 1500, inView);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-brand-green mb-2 transition-all">
        {count}
        {suffix}
      </div>
      <div className="font-semibold text-brand-black text-lg mb-2 font-display">
        {label}
      </div>
      {description && (
        <p className="text-brand-gray text-sm leading-relaxed max-w-xs font-body">
          {description}
        </p>
      )}
    </div>
  );
}
