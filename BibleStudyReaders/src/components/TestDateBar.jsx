import { useState } from "react";
import { CalendarDays, X, RotateCcw } from "lucide-react";
import { useDateOverride } from "@/context/DateOverrideContext";
import "./TestDateBar.css";

/**
 * A compact, visually distinctive test bar that sits above the bottom nav.
 * It lets devs/admins override the "processing date" the backend uses, so
 * the entire system behaves as though it's a different calendar day.
 *
 * When collapsed (default), it shows a tiny pill. Tap to expand the date
 * picker. When an override is active, the bar stays highlighted with the
 * chosen date visible.
 */
export function TestDateBar() {
  const { overrideDate, setOverrideDate } = useDateOverride();
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(
    overrideDate || new Date().toISOString().slice(0, 10)
  );

  const handleApply = () => {
    setOverrideDate(inputValue);
    setExpanded(false);
    // Force a reload so TodayScreen re-fetches with the new date
    window.location.reload();
  };

  const handleReset = () => {
    setOverrideDate(null);
    setInputValue(new Date().toISOString().slice(0, 10));
    setExpanded(false);
    window.location.reload();
  };

  const handleStepDay = (delta) => {
    const d = new Date(inputValue);
    d.setDate(d.getDate() + delta);
    const next = d.toISOString().slice(0, 10);
    setInputValue(next);
    setOverrideDate(next);
    window.location.reload();
  };

  if (!expanded) {
    return (
      <button
        className={`test-bar__pill ${overrideDate ? "test-bar__pill--active" : ""}`}
        onClick={() => setExpanded(true)}
        title="Open date override"
      >
        <CalendarDays className="test-bar__pill-icon" />
        <span className="test-bar__pill-text">
          {overrideDate ? overrideDate : "Test"}
        </span>
      </button>
    );
  }

  return (
    <div className="test-bar">
      <div className="test-bar__header">
        <div className="test-bar__title-row">
          <CalendarDays className="test-bar__title-icon" />
          <span className="test-bar__title">Processing Date Override</span>
        </div>
        <button
          className="test-bar__close"
          onClick={() => setExpanded(false)}
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="test-bar__controls">
        <button
          className="test-bar__step"
          onClick={() => handleStepDay(-1)}
          title="Previous day"
        >
          ‹
        </button>
        <input
          type="date"
          className="test-bar__input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="test-bar__step"
          onClick={() => handleStepDay(1)}
          title="Next day"
        >
          ›
        </button>
      </div>

      <div className="test-bar__actions">
        <button className="test-bar__apply" onClick={handleApply}>
          Apply
        </button>
        {overrideDate && (
          <button className="test-bar__reset" onClick={handleReset}>
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>

      {overrideDate && (
        <p className="test-bar__status">
          ⚡ Backend thinks it's <strong>{overrideDate}</strong>
        </p>
      )}
    </div>
  );
}
