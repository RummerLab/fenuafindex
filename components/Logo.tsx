// Abstract blacktip dorsal fin: white fin with a black tip fading in
// via a hard gradient stop, over a wordmark set in the display face.
export function FinMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fin-tip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04121e" />
          <stop offset="0.24" stopColor="#04121e" />
          <stop offset="0.3" stopColor="#eaf6f6" />
          <stop offset="1" stopColor="#bfe6e0" />
        </linearGradient>
      </defs>
      <path
        d="M9 40 C10.5 24 17 12.5 26.5 8 C25.5 16 27.5 27 39 40 Z"
        fill="url(#fin-tip)"
      />
      <path
        d="M6 42.5 C13 40.5 21 41.5 24 42.5 C29 41 36 40.8 42 42.5"
        stroke="#2fb3b0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display tracking-tight ${className}`}>
      Fenua&nbsp;FIN<span className="text-shallow">dex</span>
    </span>
  );
}
