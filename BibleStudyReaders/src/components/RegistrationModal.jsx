import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { hapticNotification } from "@/lib/telegram";
import "./RegistrationModal.css";

// Digits, an optional leading +, and the usual separators people type.
const PHONE_INPUT_PATTERN = /^\+?[\d\s\-()]{6,20}$/;

// Store a single canonical form so the unique phone_number constraint means
// what it should: "+1 (234) 567-8901" and "+12345678901" are the same person.
function normalizePhone(value) {
  return value.replace(/[\s\-()]/g, "");
}

// The user logic (Telegram hydration, chat id, backend persistence) lives in
// UserContext; this modal only collects the details the user must type.
export function RegistrationModal() {
  const { suggestedName, register, telegramStatus, retryTelegram } = useUserContext();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // The register button stays blocked until the bot hands us a chat id.
  const telegramReady = telegramStatus === "ready";
  const telegramWaiting = telegramStatus === "loading";
  const telegramFailed = telegramStatus === "failed";

  // Prefill with the Telegram name once it arrives — without clobbering
  // anything the user has already typed.
  useEffect(() => {
    setFullName((prev) => prev || suggestedName);
  }, [suggestedName]);

  // Surface the "Telegram never loaded" failure once, loudly.
  useEffect(() => {
    if (telegramFailed) hapticNotification("error");
  }, [telegramFailed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = fullName.trim();
    const trimmedPhone = phone.trim();
    // Enter in the input can still submit the form — re-check the gate here.
    if (!trimmed || !trimmedPhone || submitting || !telegramReady) return;

    if (!PHONE_INPUT_PATTERN.test(trimmedPhone)) {
      setError("Enter a valid phone number, e.g. +1 234 567 8901.");
      hapticNotification("error");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      // Creates the Telegram user in the backend, then closes the modal.
      await register(trimmed, normalizePhone(trimmedPhone));
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      hapticNotification("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration">
      <div className="registration__card card">
        {/* Decorative background element */}
        <div className="registration__blob registration__blob--tr"></div>
        <div className="registration__blob registration__blob--bl"></div>

        <div className="registration__body">
          <h2 className="registration__title">Welcome!</h2>
          <p className="registration__subtitle">Please enter your details to get started with the Bible Study Challenge.</p>

          <form onSubmit={handleSubmit} className="registration__form">
            <div className="field">
              <label htmlFor="fullName" className="field__label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="field__input"
                placeholder="John Doe"
              />
            </div>

            <div className="field">
              <label htmlFor="phoneNumber" className="field__label">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                maxLength={20}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="field__input"
                placeholder="+1 234 567 8901"
              />
            </div>

            {telegramFailed && (
              <div className="registration__error registration__error--block" role="alert">
                <p>
                  Telegram did not load, so we can’t get your chat id. Open this
                  app inside Telegram, then try again.
                </p>
                <button type="button" className="registration__retry" onClick={retryTelegram}>
                  Retry
                </button>
              </div>
            )}

            {error && (
              <p className="registration__error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary registration__submit"
              disabled={submitting || !telegramReady}
            >
              <span>
                {submitting
                  ? "Creating your account…"
                  : telegramWaiting
                    ? "Waiting for Telegram…"
                    : telegramFailed
                      ? "Telegram required"
                      : "Start Journey"}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
