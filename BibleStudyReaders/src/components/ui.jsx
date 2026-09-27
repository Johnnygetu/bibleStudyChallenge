import "./ui.css";

export function ProgressBar({ value, max, label, showNumbers, size = "md" }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="progress">
      {(label || showNumbers) && (
        <div className="progress-head">
          {label && <span className="progress-label">{label}</span>}
          {showNumbers && (
            <span className="progress-numbers">
              {value}<span className="progress-max"> / {max}</span>
            </span>
          )}
        </div>
      )}
      <div className={`progress-track progress-track--${size}`}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({ value, max, size = 80, stroke = 6, children }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const offset = circumference * (1 - pct);

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring__svg">
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
          className="progress-ring__value"
        />
      </svg>
      {children && <div className="progress-ring__center">{children}</div>}
    </div>
  );
}

export function Avatar({ src, name, size = 40, ring }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const classes = ring ? "avatar avatar--ring" : "avatar";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={classes}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`${classes} avatar--initials`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} />;
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-state__glyph">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary error-state__retry">
          Try Again
        </button>
      )}
    </div>
  );
}
