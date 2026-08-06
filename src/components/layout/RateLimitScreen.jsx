import { useEffect, useState } from 'react';
import { Clock3, RefreshCw, ShieldAlert } from 'lucide-react';
import { RATE_LIMIT_EVENT } from '../../lib/rateLimit';

function formatWait(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}m ${String(remainder).padStart(2, '0')}s` : `${remainder}s`;
}

export function RateLimitScreen() {
  const [rateLimit, setRateLimit] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    function handleRateLimit(event) {
      const retryAfterSeconds = event.detail?.retryAfterSeconds || 60;
      setRateLimit({
        message: event.detail?.message,
        retryAt: Date.now() + retryAfterSeconds * 1000,
      });
      setSecondsLeft(retryAfterSeconds);
    }

    window.addEventListener(RATE_LIMIT_EVENT, handleRateLimit);
    return () => window.removeEventListener(RATE_LIMIT_EVENT, handleRateLimit);
  }, []);

  useEffect(() => {
    if (!rateLimit) return undefined;

    const updateCountdown = () => {
      setSecondsLeft(Math.max(0, Math.ceil((rateLimit.retryAt - Date.now()) / 1000)));
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [rateLimit]);

  if (!rateLimit) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10 font-body text-white">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-emerald-700/20 blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <main className="relative w-full max-w-xl text-center" role="alert" aria-live="assertive">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-300/20 bg-amber-400/10 shadow-2xl shadow-amber-950/30">
          <ShieldAlert className="h-10 w-10 text-amber-300" strokeWidth={1.7} />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-amber-300">Error 429</p>
        <h1 className="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Too many requests</h1>
        <p className="mx-auto max-w-md text-base leading-7 text-slate-300">
          {rateLimit.message || 'You have made too many requests in a short period.'}
          {' '}This temporary limit helps us keep the service reliable.
        </p>

        <div className="mx-auto my-8 flex max-w-sm items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4">
          <Clock3 className="h-5 w-5 text-emerald-300" />
          {secondsLeft > 0 ? (
            <p className="text-sm text-slate-300">
              Please try again in <strong className="ml-1 font-semibold text-white">{formatWait(secondsLeft)}</strong>
            </p>
          ) : (
            <p className="text-sm font-medium text-emerald-200">You can try again now</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          disabled={secondsLeft > 0}
          className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          <RefreshCw className="h-4 w-4" />
          {secondsLeft > 0 ? 'Please wait' : 'Try again'}
        </button>
      </main>
    </div>
  );
}
