import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { hapticNotification } from "@/lib/telegram";
import "./RegistrationModal.css";

// The user logic (Telegram hydration, chat id, backend persistence) lives in
// UserContext; this modal only collects the one thing the user must type.
export function RegistrationModal() {
  const { suggestedName, register } = useUserContext();
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prefill with the Telegram name once it arrives — without clobbering
  // anything the user has already typed.
  useEffect(() => {
    setFullName((prev) => prev || suggestedName);
  }, [suggestedName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = fullName.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError("");
    try {
      // Creates the Telegram user in the backend, then closes the modal.
      await register(trimmed);
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

            {error && (
              <p className="registration__error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary registration__submit"
              disabled={submitting}
            >
              <span>{submitting ? "Creating your account…" : "Start Journey"}</span>
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
