import React from "react";
import "./ui.css";

export function ProgressBar({ value, max, label, showNumbers, size = "md" }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const heightClass = size === "sm" ? "h-sm" : size === "lg" ? "h-lg" : "h-md";

  return (
    <div className="progress-container">
      {(label || showNumbers) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showNumbers && (
            <span className="progress-numbers">
              {value}<span className="progress-numbers-max"> / {max}</span>
            </span>
          )}
        </div>
      )}
      <div className={`progress-track ${heightClass}`}>
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
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="progress-ring-track"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="progress-ring-fill"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {children && (
        <div className="progress-ring-content">{children}</div>
      )}
    </div>
  );
}

export function Avatar({ src, name, size = 40, ring }) {
  const initials = (name || "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const ringClass = ring ? "avatar-ring" : "";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar-img ${ringClass}`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`avatar-fallback ${ringClass}`}
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
    <div className="error-state-container">
      <div className="error-state-icon-wrapper">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-state-icon">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}
