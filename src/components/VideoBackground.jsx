import { useEffect, useRef } from 'react';

export default function VideoBackground({ src = '/background.mp4', poster = '/poster.jpg' }) {
  const ref = useRef();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // try to play if autoplay policies allow; ignore errors
    v.muted = true;
    v.playsInline = true;
    v.play().catch(() => {});
  }, []);

  return (
    <div className="absolute inset-0 -z-30 pointer-events-none">
      <video
        ref={ref}
        src={src}
        poster={poster}
        loop
        muted
        autoPlay
        playsInline
        className="w-full h-full object-cover opacity-10 mix-blend-overlay"
      />
      <style jsx>{`
        .mix-blend-overlay { mix-blend-mode: screen; }
        @media (prefers-reduced-motion: reduce) { video { display: none; } }
      `}</style>
    </div>
  );
}
