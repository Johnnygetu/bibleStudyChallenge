import { useUserContext } from "@/context/UserContext";
import "./RegistrationModal.css";

// The user logic (Telegram hydration, chat id, validation, backend
// persistence) lives in UserContext; this modal only renders the form.
export function RegistrationModal() {
  const {
    registrationForm,
    setRegistrationField,
    submitRegistration,
    registrationError,
    isRegistering,
    telegramWaiting,
    telegramFailed,
    retryTelegram,
  } = useUserContext();

  return (
    <div className="registration">
      <div className="registration__card card">
        {/* Decorative background element */}
        <div className="registration__blob registration__blob--tr"></div>
        <div className="registration__blob registration__blob--bl"></div>

        <div className="registration__body">
          <h2 className="registration__title">Welcome!</h2>
          <p className="registration__subtitle">Please enter your details to get started with the Bible Study Challenge.</p>

          <form onSubmit={submitRegistration} className="registration__form">
            <div className="field">
              <label htmlFor="fullName" className="field__label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={registrationForm.fullName}
                onChange={(event) => setRegistrationField("fullName", event.target.value)}
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
                value={registrationForm.phone}
                onChange={(event) => setRegistrationField("phone", event.target.value)}
                className="field__input"
                placeholder="0912345678"
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

            {registrationError && (
              <p className="registration__error" role="alert">
                {registrationError}
              </p>
            )}

            <button type="submit" className="btn-primary registration__submit" disabled={isRegistering}>
              <span>
                {isRegistering ? "Creating your account…" : telegramWaiting ? "Connecting to Telegram…" : "Start Journey"}
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
