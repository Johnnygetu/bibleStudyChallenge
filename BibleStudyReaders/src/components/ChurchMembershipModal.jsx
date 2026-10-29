import { useEffect, useRef } from "react";
import { Church } from "lucide-react";
import { hapticNotification, hapticSelection } from "@/lib/telegram";
import "./ChurchMembershipModal.css";

// Asks the reader, until they have answered, whether they belong to Ayat
// Mekane Yesus church. There is no way out except answering: no close button,
// no backdrop click handler and no Escape handler. Both answers pass through
// onAnswer(true | false); the stored is_church_member flag flips once the
// answer reaches the server, which is what stops the question coming back.
//
// The question is the whole screen, so it carries the design itself: the mark
// is the one bold element, the question is set in the app's serif face and
// nothing sits above it. Kept to one calm moment rather than a form.
export function ChurchMembershipModal({ onAnswer }) {
  const yesRef = useRef(null);

  // The question is the only thing on screen, so put the keyboard focus on the
  // first answer instead of leaving it on whatever was behind the overlay.
  useEffect(() => {
    yesRef.current?.focus();
  }, []);

  const answer = (isMember) => {
    hapticSelection();
    hapticNotification(isMember ? "success" : "warning");
    onAnswer(isMember);
  };

  return (
    <div className="church-modal">
      <div
        className="church-modal__card card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="church-modal-question"
      >
        <div className="church-modal__body">
          <div className="church-modal__mark">
            <Church className="church-modal__mark-glyph" aria-hidden="true" />
          </div>

          <p id="church-modal-question" className="church-modal__question">
            የአያት መካነየሱስ ቤተክርስቲያን አባል ኖት?
          </p>

          <div className="church-modal__actions">
            <button
              ref={yesRef}
              type="button"
              className="church-modal__btn church-modal__btn--yes btn-primary"
              onClick={() => answer(true)}
            >
              አዎ ነኝ
            </button>
            <button
              type="button"
              className="church-modal__btn church-modal__btn--no"
              onClick={() => answer(false)}
            >
              አይ አይደለሁም
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
