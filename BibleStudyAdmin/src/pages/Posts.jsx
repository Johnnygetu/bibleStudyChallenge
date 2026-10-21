import { useState } from 'react';
import { AlertCircle, ArrowLeft, Heart, MessageSquare, Trash2, X } from 'lucide-react';
import { Avatar, ReaderSkeletonList, ErrorState } from '@/components/ui';
import { usePostsContext } from '@/context/PostsContext';
import './Posts.css';

// Community notes from the past 24 hours, owned by PostsContext (same
// GET /posts endpoint the reader app uses). The admin sees a daily digest:
// reader name, note text, time, and likes — delete/manage actions land here.
export default function Posts({ onNavigate }) {
  const { posts, loading, error, reload } = usePostsContext();
  // Deleting asks for a reason first: the trash button opens the confirm
  // modal, and only the modal's Delete button (with a reason typed) removes
  // the note.
  const [pendingDelete, setPendingDelete] = useState(null);

  return (
    <div className="page stack-lg fade-in">
      {/* Header with a back affordance since Posts isn't in the bottom nav */}
      <div className="page-head">
        <button
          onClick={() => onNavigate?.('dashboard')}
          className="posts-back"
          aria-label="Back to home"
        >
          <ArrowLeft className="icon-20" />
        </button>
        <h1 className="page-title">Posts</h1>
        {/* Spacer keeps the title visually centered against the back button */}
        <span className="posts-back-spacer" />
      </div>

      <p className="posts-window">Last 24 hours</p>

      {loading ? (
        <div aria-hidden="true">
          <ReaderSkeletonList count={3} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : posts.length === 0 ? (
        <div className="empty-block">
          <div className="empty-circle">
            <MessageSquare className="icon-32 empty-glyph" />
          </div>
          <p className="empty-title">No posts in the last 24 hours</p>
          <p className="empty-sub">
            Reader notes shared in the community feed will appear here
          </p>
        </div>
      ) : (
        // Feed list, matching the app's card/row layout
        <div className="card divided">
          {posts.map((post) => {
            const displayName = post.name?.trim() || 'A reader';
            return (
              <div key={post.id} className="row">
                <Avatar name={displayName} size={40} />
                <div className="row-main">
                  <div className="posts-meta">
                    <p className="row-title truncate">{displayName}</p>
                    <span className="posts-time">{post.time}</span>
                  </div>
                  <p className="posts-text">{post.content}</p>
                </div>
                <div className="posts-actions">
                  {/* Like count sits left of the delete button */}
                  <span className="pill posts-likes">
                    <Heart className="icon-12" />
                    {post.likes}
                  </span>
                  {/* Opens the delete-confirm modal; the request only fires
                      once a reason is provided there. */}
                  <button
                    type="button"
                    className="posts-delete"
                    aria-label="Delete post"
                    title="Delete post"
                    onClick={() => setPendingDelete(post)}
                  >
                    <Trash2 className="icon-16" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pendingDelete && (
        <DeleteReasonModal post={pendingDelete} onClose={() => setPendingDelete(null)} />
      )}
    </div>
  );
}

// Asks the admin why the note is coming down. The reason is required — the
// Delete button stays disabled until something is typed — and travels with
// the request to the admin delete route. What the server does with it later
// is still open; for now it just validates it.
function DeleteReasonModal({ post, onClose }) {
  const { deletePost } = usePostsContext();
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const displayName = post.name?.trim() || 'A reader';
  const canSubmit = reason.trim().length > 0 && !saving;

  async function confirm() {
    setSaving(true);
    setError('');
    const result = await deletePost(post.id, reason.trim());
    setSaving(false);
    if (result.ok) {
      onClose();
    } else {
      // The feed row is restored by the context; surface why it failed.
      setError(result.message || 'The post could not be deleted.');
    }
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title serif">Delete post</h3>
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

        <p className="delete-hint">
          You are about to remove <strong>{displayName}</strong>
          &apos;s note. A reason is required.
        </p>

        <label className="field-label" htmlFor="delete-reason">
          Reason for deletion *
        </label>
        <textarea
          id="delete-reason"
          className="input textarea resize-none"
          rows={4}
          maxLength={1000}
          placeholder="Why is this note being removed?"
          autoFocus
          disabled={saving}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button
          type="button"
          className="btn-danger btn-block btn-save"
          onClick={confirm}
          disabled={!canSubmit}
        >
          {saving ? 'Deleting…' : 'Delete'}
        </button>
        {/* Cancel rides under the danger button, like the other modals */}
        <button onClick={onClose} disabled={saving} className="btn-ghost btn-block">
          Cancel
        </button>
      </div>
    </div>
  );
}
