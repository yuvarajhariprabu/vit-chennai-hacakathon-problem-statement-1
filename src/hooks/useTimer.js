import { useState, useEffect, useRef, useCallback } from 'react';

const DURATION = 60000; // 60 seconds in ms

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const tick = useCallback(() => {
    if (!startTimeRef.current) return;
    const now = performance.now();
    const e = Math.min(now - startTimeRef.current, DURATION);
    setElapsed(e);
    if (e >= DURATION) {
      setIsRunning(false);
      setIsComplete(true);
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = performance.now();
    setIsRunning(true);
    setIsComplete(false);
    setElapsed(0);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const progress = Math.min(elapsed / DURATION, 1);
  const remaining = Math.max(0, Math.ceil((DURATION - elapsed) / 1000));

  return { elapsed, progress, remaining, isRunning, isComplete, start };
}
