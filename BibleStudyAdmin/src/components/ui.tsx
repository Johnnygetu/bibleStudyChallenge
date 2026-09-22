interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showNumbers?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({ value, max, label, showNumbers, size = "md" }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const height = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className="w-full">
      {(label || showNumbers) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-ink-400 font-medium">{label}</span>}
          {showNumbers && (
            <span className="text-xs text-ink-300 font-medium tabular-nums">
              {value}<span className="text-ink-500"> / {max}</span>
            </span>
          )}
        </div>
      )}
      <div className={`progress-track ${height}`}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}

export function ProgressRing({ value, max, size = 80, stroke = 6, children }: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#022942"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  ring?: boolean;
}

export function Avatar({ src, name, size = 40, ring }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const ringClass = ring ? "ring-2 ring-primary-400/60 ring-offset-2 ring-offset-ink-950" : "";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${ringClass}`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-ink-700 flex items-center justify-center text-primary-400 font-semibold ${ringClass}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`bg-transparent border border-primary-400/50 rounded-xl animate-pulse ${className}`} />;
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-danger-500/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger-500">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-ink-300 text-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary px-5 py-2 text-sm">
          Try Again
        </button>
      )}
    </div>
  );
}
