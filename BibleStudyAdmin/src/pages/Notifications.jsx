import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Image as ImageIcon,
  Plus,
  Send,
  Clock,
  Trash2,
  X,
} from 'lucide-react';
import { ErrorState, ReaderSkeletonList } from '@/components/ui';
import { useNotificationsContext } from '@/context/NotificationsContext';
import './Notifications.css';

// Notifications manager: scheduled and sent notifications, owned by
// NotificationsContext (GET /notifications). Rows show the image, content,
// post time, and delivery status.
function formatPostTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function Notifications({ onNavigate }) {
  const { notifications, loading, error, reload, deleteNotification } = useNotificationsContext();
  const [adding, setAdding] = useState(false);
  const [actionError, setActionError] = useState('');

  // Delete is only offered for pending rows. The server enforces this too, so
  // a refused delete restores the row and reports why inline.
  async function removeNotification(id) {
    const result = await deleteNotification(id);
    setActionError(result.ok ? '' : result.message);
  }

  return (
    <div className="page stack-lg fade-in">
      {/* Header with a back affordance since Notifications isn't in the bottom nav */}
      <div className="page-head">
        <button
          onClick={() => onNavigate?.('dashboard')}
          className="posts-back"
          aria-label="Back to home"
        >
          <ArrowLeft className="icon-20" />
        </button>
        <h1 className="page-title">Notifications</h1>
        {/* Spacer keeps the title visually centered against the back button */}
        <span className="posts-back-spacer" />
      </div>

      <p className="posts-window">Scheduled &amp; sent</p>

      {actionError && (
        <div className="form-error">
          <AlertCircle className="icon-16 form-error-icon" />
          {actionError}
        </div>
      )}

      <button
        onClick={() => setAdding(true)}
        className="btn-primary btn-block dashboard-posts-btn"
      >
        <Plus className="icon-20" strokeWidth={2.2} />
        Add Notification
      </button>

      {loading ? (
        <div aria-hidden="true">
          <ReaderSkeletonList count={3} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : notifications.length === 0 ? (
        <div className="empty-block">
          <div className="empty-circle">
            <Bell className="icon-32 empty-glyph" />
          </div>
          <p className="empty-title">No notifications yet</p>
          <p className="empty-sub">
            Scheduled and sent notifications will appear here
          </p>
          <button onClick={() => setAdding(true)} className="btn-primary btn-inline">
            Add Notification
          </button>
        </div>
      ) : (
        <div className="card divided">
          {notifications.map((notification) => (
            <div key={notification.id} className="row notification-row">
              <div className="notification-thumb">
                {notification.imageUrl ? (
                  <img
                    src={notification.imageUrl}
                    alt=""
                    className="notification-thumb-img"
                  />
                ) : (
                  <ImageIcon className="icon-20 notification-thumb-placeholder" />
                )}
              </div>

              <div className="row-main">
                <p className="posts-text">{notification.content}</p>
                <div className="notification-meta">
                  <span className="notification-time">
                    <Clock className="icon-12" />
                    {formatPostTime(notification.postTime)}
                  </span>
                  <span className="notification-path truncate">
                    {notification.imagePath ?? 'No image'}
                  </span>
                </div>
              </div>

              <div className="posts-actions">
                {/* Sent rows show a success pill; pending rows stay neutral. */}
                <span
                  className={`pill ${notification.sent ? 'pill-success' : 'notification-pending'}`}
                >
                  {notification.sent ? (
                    <Send className="icon-12" />
                  ) : (
                    <Bell className="icon-12" />
                  )}
                  {notification.sent ? 'Sent' : 'Pending'}
                </span>

                {/* Only unsent notifications can be deleted; sent ones are history. */}
                {!notification.sent && (
                  <button
                    type="button"
                    className="posts-delete"
                    aria-label="Delete notification"
                    title="Delete notification"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <Trash2 className="icon-16" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {adding && <AddNotificationModal onClose={() => setAdding(false)} />}
    </div>
  );
}

// Create a notification. Content and post time are required — the server
// enforces this too — while the image path may be left blank.
function AddNotificationModal({ onClose }) {
  const { addNotification } = useNotificationsContext();
  const [imageFile, setImageFile] = useState(null);
  const [content, setContent] = useState('');
  const [postTime, setPostTime] = useState('');
  const [postNow, setPostNow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    content.trim().length > 0 && (postNow || postTime.length > 0) && !saving;

  async function save() {
    setSaving(true);
    setError('');
    try {
      await addNotification({ imageFile, content, postTime, postNow });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? `The notification could not be saved. ${err.message}`
          : 'The notification could not be saved. Please try again.',
      );
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title serif">Add Notification</h3>
          <button onClick={onClose} disabled={saving} className="btn-ghost" aria-label="Cancel">
            <X className="icon-20" />
          </button>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle className="icon-16 form-error-icon" />
            {error}
          </div>
        )}

        <div className="stack">
          <div>
            <label className="field-label" htmlFor="notification-image">
              Image
            </label>
            <input
              id="notification-image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              disabled={saving}
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="notification-content">
              Content *
            </label>
            <textarea
              id="notification-content"
              rows={4}
              maxLength={5000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What should readers be notified about?"
              disabled={saving}
              className="input textarea resize-none"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="notification-time">
              Post time *
            </label>
            {postNow ? (
              <p className="notification-postnow-hint">
                This notification will be posted right away.
              </p>
            ) : (
              <input
                id="notification-time"
                type="datetime-local"
                value={postTime}
                onChange={(e) => setPostTime(e.target.value)}
                disabled={saving}
                className="input"
              />
            )}
            <label className="notification-postnow" htmlFor="notification-post-now">
              <input
                id="notification-post-now"
                type="checkbox"
                checked={postNow}
                onChange={(e) => setPostNow(e.target.checked)}
                disabled={saving}
              />
              Post now
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={!canSubmit}
          className="btn-primary btn-block btn-save"
        >
          {saving ? 'Saving...' : 'Add Notification'}
        </button>
      </div>
    </div>
  );
}
