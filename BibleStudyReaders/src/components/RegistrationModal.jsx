import { useState } from "react";
import "./RegistrationModal.css";

export function RegistrationModal({ onComplete }) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fullName.trim() && phoneNumber.trim()) {
      localStorage.setItem(
        "bible_challenge_user_details",
        JSON.stringify({ fullName, phoneNumber })
      );
      onComplete();
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
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="field__input"
                placeholder="+1 234 567 8900"
              />
            </div>

            <button type="submit" className="btn-primary registration__submit">
              <span>Start Journey</span>
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
