import { useState, useEffect, useRef, useCallback } from 'react';
import logo from '../../assets/logo.png';

const STORAGE_KEY = 'omseva-splash-seen';
const DISPLAY_MS = 2400;
const FADE_MS = 600;

/**
 * Full-screen intro splash shown once per browser session.
 * @param {Object} props
 * @param {() => void} [props.onComplete] - Called when splash is fully dismissed
 */
export function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(() =>
    sessionStorage.getItem(STORAGE_KEY) ? 'done' : 'enter'
  );
  const timersRef = useRef([]);
  const finishRef = useRef(null);

  const finish = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    sessionStorage.setItem(STORAGE_KEY, '1');
    setPhase('done');
    document.body.style.overflow = '';
    onComplete?.();
  }, [onComplete]);

  // Keep a ref to finish so timers can call the latest version
  finishRef.current = finish;

  /** Allow tapping/clicking to skip early */
  const dismiss = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase('exit');
    const doneTimer = setTimeout(() => finishRef.current?.(), FADE_MS);
    timersRef.current = [doneTimer];
  }, []);

  useEffect(() => {
    // Already shown this session — skip immediately
    if (sessionStorage.getItem(STORAGE_KEY)) {
      finishRef.current?.();
      return;
    }

    let cancelled = false;
    document.body.style.overflow = 'hidden';

    const exitTimer = setTimeout(() => {
      if (!cancelled) setPhase('exit');
    }, DISPLAY_MS);

    const doneTimer = setTimeout(() => {
      if (!cancelled) finishRef.current?.();
    }, DISPLAY_MS + FADE_MS);

    timersRef.current = [exitTimer, doneTimer];

    return () => {
      cancelled = true;
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      role="dialog"
      aria-label="Loading Om Seva"
      aria-modal="true"
      onClick={dismiss}
      onKeyDown={(e) => e.key === 'Escape' && dismiss()}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white cursor-pointer select-none ${
        phase === 'exit' ? 'splash-exit' : ''
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,480px)] h-[min(90vw,480px)] rounded-full bg-brand-green/8 blur-3xl splash-glow" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center splash-content">
        <img
          src={logo}
          alt="Om Seva"
          className="h-28 sm:h-36 w-auto object-contain mb-8 splash-logo"
        />

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-black tracking-tight mb-2 splash-text">
          Om Seva Design & Build
        </h1>
        <p className="font-body text-sm sm:text-base text-brand-gray mb-8 splash-text splash-text-delay">
          Building India&apos;s Infrastructure, One Project at a Time
        </p>

        <div className="w-48 sm:w-56 h-1 bg-brand-border/60 rounded-full overflow-hidden">
          <div className="h-full bg-brand-green rounded-full splash-progress" />
        </div>

        <p className="font-body text-[10px] text-brand-gray/70 mt-6 uppercase tracking-widest splash-text splash-text-delay-2">
          Tap to skip
        </p>
      </div>
    </div>
  );
}
