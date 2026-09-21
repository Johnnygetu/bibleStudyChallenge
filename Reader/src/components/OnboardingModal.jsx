import { useState } from "react";
import "./OnboardingModal.css";
import ayatLogo from "../assets/ayat-logo.png";

export function OnboardingModal({ onSubmit }) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      setError("Please fill out both fields.");
      return;
    }
    
    // Optional: basic phone number validation
    if (phoneNumber.replace(/[^0-9+]/g, "").length < 9) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await onSubmit({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim()
      });
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <div 
            className="onboarding-logo"
            style={{ 
              WebkitMaskImage: `url(${ayatLogo})`, 
              WebkitMaskSize: 'contain', 
              WebkitMaskRepeat: 'no-repeat', 
              WebkitMaskPosition: 'center',
              maskImage: `url(${ayatLogo})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center'
            }} 
          />
          <h2 className="onboarding-title">Welcome to Bible Challenge</h2>
          <p className="onboarding-subtitle">Please tell us a bit about yourself to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
              placeholder="e.g. John Doe"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="form-input"
              placeholder="e.g. +251 911 234 567"
              autoComplete="tel"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary onboarding-submit"
          >
            {loading ? "Saving..." : "Start Challenge"}
          </button>
        </form>
      </div>
    </div>
  );
}
