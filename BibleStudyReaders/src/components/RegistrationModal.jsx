import { AlertTriangle } from "lucide-react";
import "./RegistrationModal.css";

// Registration is closed: anyone who is not registered yet sees this notice
// instead of the sign-up form. The modal is deliberately not dismissible — it
// has no close button, no backdrop click handler and no Escape handler — so
// the only way in is an account created before registration closed. The old
// sign-up logic is still in UserContext (register/submitRegistration) in case
// registration reopens.
export function RegistrationModal() {
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
        </div>
      </div>
    </div>
  );
}
