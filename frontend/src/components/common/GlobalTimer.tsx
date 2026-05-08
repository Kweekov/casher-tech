'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'globalTimerState';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const readInitialTimerState = (): { seconds: number; isRunning: boolean } => {
  if (typeof window === 'undefined') {
    return { seconds: 0, isRunning: false };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { seconds: 0, isRunning: false };
  }

  try {
    const parsed = JSON.parse(raw) as {
      seconds: number;
      isRunning: boolean;
      updatedAt: number;
    };

    const safeSeconds = Number.isFinite(parsed.seconds) ? Math.max(0, Math.floor(parsed.seconds)) : 0;
    const safeIsRunning = Boolean(parsed.isRunning);
    const safeUpdatedAt = Number.isFinite(parsed.updatedAt) ? parsed.updatedAt : Date.now();

    if (safeIsRunning) {
      const elapsed = Math.max(0, Math.floor((Date.now() - safeUpdatedAt) / 1000));
      return { seconds: safeSeconds + elapsed, isRunning: true };
    }

    return { seconds: safeSeconds, isRunning: false };
  } catch {
    return { seconds: 0, isRunning: false };
  }
};

export function GlobalTimer() {
  const [timerState, setTimerState] = useState<{ seconds: number; isRunning: boolean }>({
    seconds: 0,
    isRunning: false,
  });
  const { seconds, isRunning } = timerState;

  useEffect(() => {
    const restored = readInitialTimerState();
    const timeoutId = window.setTimeout(() => {
      setTimerState(restored);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimerState((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        seconds,
        isRunning,
        updatedAt: Date.now(),
      })
    );
  }, [seconds, isRunning]);

  const handleStart = () => {
    setTimerState({ seconds: 0, isRunning: true });
  };

  const handleStop = () => {
    setTimerState((prev) => ({ ...prev, isRunning: false }));
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <p className="font-mono text-sm font-semibold text-gray-900">{formatTime(seconds)}</p>
        {isRunning ? (
          <button
            type="button"
            onClick={handleStop}
            className="rounded bg-gray-900 px-2 py-1 text-xs text-white hover:bg-black"
          >
            Стоп
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStart}
            className="rounded bg-gray-900 px-2 py-1 text-xs text-white hover:bg-black"
          >
            Старт
          </button>
        )}
      </div>
    </div>
  );
}
