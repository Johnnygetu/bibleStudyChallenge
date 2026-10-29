import { useEffect, useRef, useState } from "react";
import { Church, Loader2 } from "lucide-react";
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

  // Which answer is being saved, so its button can show a spinner while the
  // other stays disabled. Null means the reader has not chosen yet.
  const [submitting, setSubmitting] = useState(null);

  // The question is the only thing on screen, so put the keyboard focus on the
  // first answer instead of leaving it on whatever was behind the overlay.
  useEffect(() => {
    yesRef.current?.focus();
  }, []);

  const answer = async (isMember) => {
    if (submitting !== null) {
      return;
    }

    hapticSelection();
    hapticNotification(isMember ? "success" : "warning");
    setSubmitting(isMember);

    // A failed save leaves the modal up, so re-enable the answers for another try.
    const result = await onAnswer(isMember);
    if (result?.status !== "saved") {
      setSubmitting(null);
    }
  };

  const isSaving = submitting !== null;

  return (
    <div className="church-modal">
      <div
        className="church-modal__card card"
        role="dialog"
        aria-modal="true"
        aria-busy={isSaving}
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
              disabled={isSaving}
            >
              {submitting === true ? (
                <Loader2 className="church-modal__spinner" aria-label="Saving" />
              ) : (
                "አዎ ነኝ"
              )}
            </button>
            <button
              type="button"
              className="church-modal__btn church-modal__btn--no"
              onClick={() => answer(false)}
              disabled={isSaving}
            >
              {submitting === false ? (
                <Loader2 className="church-modal__spinner" aria-label="Saving" />
              ) : (
                "አይ አይደለሁም"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
