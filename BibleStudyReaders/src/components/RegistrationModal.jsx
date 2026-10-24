import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useUserContext } from "@/context/UserContext";
import { hapticNotification } from "@/lib/telegram";
import "./RegistrationModal.css";

// Registration is closed: anyone without an account on this device sees this
// notice instead of the sign-up form. The modal is deliberately not
// dismissible — it has no close button, no backdrop click handler and no
// Escape handler. A reader whose device lost its account grants one way back
// in: the "Fetch account" button, which looks the account up by their
// Telegram chat id (UserContext's restoreByChat) and activates it here. The
// old sign-up logic is still in UserContext (register/submitRegistration) in
// case registration reopens.
export function RegistrationModal() {
  const { restoreByChat } = useUserContext();
  const [isFetching, setIsFetching] = useState(false);
  // The last fetch outcome the modal must show: "not-found" (the chat id
  // belongs to no account on the server) or "error" (the lookup itself
  // failed — message comes straight from restoreByChat).
  const [fetchResult, setFetchResult] = useState(null);

  const handleFetchAccount = async () => {
    if (isFetching) return;
    setIsFetching(true);
    setFetchResult(null);

    const outcome = await restoreByChat();
    if (outcome.status === "restored") {
      // The account is live again and App unmounts this modal immediately —
      // skip the state updates that would land after that.
      hapticNotification("success");
      return;
    }

    hapticNotification("error");
    setFetchResult({
      type: outcome.status === "not-found" ? "not-found" : "error",
      text:
        outcome.status === "not-found"
          ? "No account found for this Telegram account."
          : outcome.message,
    });
    setIsFetching(false);
  };

  return (
    <div className="registration">
      <div className="registration__card card">
        {/* Decorative background element */}
        <div className="registration__blob registration__blob--tr"></div>
        <div className="registration__blob registration__blob--bl"></div>

        <div className="registration__body">
          <h2 className="registration__title">Registration is closed</h2>
          <p className="registration__subtitle">
            The Bible Study Challenge is no longer accepting new registrations.
          </p>

          <div className="registration__warning" role="alert">
            <AlertTriangle className="registration__warning-icon" />
            <div>
              <p className="registration__warning-title">New sign-ups are closed</p>
              <p className="registration__warning-text">
                If you already have an account, open the app from the Telegram
                link you used before. If you believe this is a mistake, please
                contact the challenge administrator.
              </p>
            </div>
          </div>

          <div className="registration__restore">
            <button
              type="button"
              className="registration__fetch btn-primary"
              onClick={handleFetchAccount}
              disabled={isFetching}
            >
              {isFetching ? "Fetching account…" : "Fetch account"}
            </button>
            {fetchResult && (
              <p
                className={`registration__result registration__result--${fetchResult.type}`}
                role={fetchResult.type === "error" ? "alert" : "status"}
              >
                {fetchResult.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
