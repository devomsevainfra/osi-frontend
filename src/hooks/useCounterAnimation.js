import { useState, useEffect } from 'react';

/**
 * Hook to animate a numeric counter from 0 to a target value over a duration.
 * @param {number} targetValue - The final number to count to.
 * @param {number} duration - Animation duration in milliseconds.
 * @param {boolean} inView - Trigger state (starts when true).
 * @returns {number} The current animated counter value.
 */
export function useCounterAnimation(targetValue, duration = 1500, inView = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    let startTimestamp = null;
    const start = 0;
    const end = Number(targetValue);
    
    if (isNaN(end) || start === end) {
      setCount(end || 0);
      return;
    }

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      
      const currentCount = Math.floor(easeProgress * (end - start) + start);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetValue, duration, inView]);

  return count;
}
