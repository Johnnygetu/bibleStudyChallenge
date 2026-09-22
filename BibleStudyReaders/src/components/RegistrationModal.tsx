import { useState } from "react";

interface RegistrationModalProps {
  onComplete: () => void;
}

export function RegistrationModal({ onComplete }: RegistrationModalProps) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="card w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-ink-100 mb-2 font-serif">Welcome!</h2>
          <p className="text-sm text-ink-300 mb-6">Please enter your details to get started with the Bible Study Challenge.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-ink-400 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-ink-900 border border-ink-700 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-medium text-ink-400 mb-1 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-ink-900 border border-ink-700 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all"
                placeholder="+1 234 567 8900"
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full py-3 mt-6 text-sm flex items-center justify-center gap-2"
            >
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
