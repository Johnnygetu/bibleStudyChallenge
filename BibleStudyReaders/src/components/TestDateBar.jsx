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
 *
 * All of the state and the reload behaviour live in DateOverrideContext.
 */
export function TestDateBar() {
  const {
    overrideDate,
    isBarExpanded,
    openBar,
    closeBar,
    dateInputValue,
    setDateInputValue,
    applyOverride,
    resetOverride,
    stepDay,
  } = useDateOverride();

  if (!isBarExpanded) {
    return (
      <button
        className={`test-bar__pill ${overrideDate ? "test-bar__pill--active" : ""}`}
        onClick={openBar}
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
          onClick={closeBar}
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="test-bar__controls">
        <button
          className="test-bar__step"
          onClick={() => stepDay(-1)}
          title="Previous day"
        >
          ‹
        </button>
        <input
          type="date"
          className="test-bar__input"
          value={dateInputValue}
          onChange={(event) => setDateInputValue(event.target.value)}
        />
        <button
          className="test-bar__step"
          onClick={() => stepDay(1)}
          title="Next day"
        >
          ›
        </button>
      </div>

      <div className="test-bar__actions">
        <button className="test-bar__apply" onClick={applyOverride}>
          Apply
        </button>
        {overrideDate && (
          <button className="test-bar__reset" onClick={resetOverride}>
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
