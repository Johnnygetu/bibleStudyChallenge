import { useState } from "react";
import { Heart, MessageSquare, RefreshCw, Trash2 } from "lucide-react";
import { ApiErrorMessage, Avatar } from "@/components/ui";
import { usePostsContext } from "@/context/PostsContext";
import { useUserContext } from "@/context/UserContext";
import ayatLogo from "@/assets/ayat-logo.png";
import "./CommunityScreen.css";

// The feed is owned by PostsContext: real rows from GET /posts, or a custom
// error message with a retry button when the request fails — there is no
// fallback to dummy data anymore.
// Keep the "Coming soon" placeholder commented out below — it may be needed
// if the community feature is ever disabled again.
const MAX_NOTE_WORDS = 200;

// Caps a draft at the word limit — anything past word 200 is dropped.
function capToWords(value) {
  const words = value.split(/\s+/).filter(Boolean);
  return words.length <= MAX_NOTE_WORDS ? value : words.slice(0, MAX_NOTE_WORDS).join(" ");
}

export function CommunityScreen() {
  const { posts, loading, error, createPost, toggleLike, deletePost, reload } =
    usePostsContext();
  const { user } = useUserContext();
  // Only the signed-in reader may remove their own note.
  const myReaderId = user?.id != null ? Number(user.id) : null;

  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const canShare = draft.trim().length > 0 && !posting;

  const handleShare = async () => {
    if (!canShare) return;
    setPosting(true);
    const shared = await createPost(draft);
    setPosting(false);
    if (shared) {
      setDraft("");
    }
  };

  const isRefreshing = loading;
  // One note per day: the composer hides while the feed loads and once the
  // signed-in reader already has a note dated today. (Dates ride on every
  // row; the calendar day of the server timestamp is the "posted" day.)
  const todayKey = new Date().toISOString().slice(0, 10);
  const hasPostedToday = posts.some(
    (post) => post.readerId === myReaderId && post.createdAt?.startsWith(todayKey),
  );
  const showComposer = !loading && !hasPostedToday;

  return (
    <div className="screen community animate-fade-in">
      {/* Brand Header */}
      <div className="brand">
        <div className="brand__row">
          <div
            className="brand__logo"
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
          <div>
            <h2 className="brand__name">Ayat Mekane Eyesus</h2>
            <p className="brand__tagline">Bible Challenge</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="community__header">
        <h1 className="community__header-title">Community Notes</h1>
      </div>

      {/* Composer: type a note, then share it with the small button below.
          Hidden while the feed loads and for the rest of the day once the
          reader has shared today's note. */}
      {showComposer && (
        <>
          <div className="community-composer">
            <Avatar name={user?.fullName || "You"} size={32} />
            {/* Char backstop just so a giant paste can't lag the input
                before capToWords trims it */}
            <input
              className="community-composer__input"
              type="text"
              placeholder="Share a note…"
              aria-label="Share a note"
              maxLength={200}
              disabled={posting}
              value={draft}
              onChange={(event) => setDraft(capToWords(event.target.value))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleShare();
                }
              }}
            />
          </div>
          <button
            type="button"
            className="community-composer__share"
            disabled={!canShare}
            onClick={handleShare}
          >
            {posting ? "Sharing…" : "Share note"}
          </button>
        </>
      )}

      {error && <ApiErrorMessage message={error} onRetry={reload} />}

      {loading ? (
        <div className="community-empty">
          <p className="community-empty__text">Loading notes…</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="community-empty">
          <MessageSquare className="community-empty__icon" />
          <p className="community-empty__title">No notes today</p>
          <p className="community-empty__text">
            Be the first to share a note with the community!
          </p>
        </div>
      ) : (
        // Feed
        <div className="community-feed">
          {posts.map((post) => {
            // The heart state is server-owned: likedByMe rides on the row.
            const isLiked = post.likedByMe;
            const displayName = post.name?.trim() || "A reader";
            return (
              <article key={post.id} className="community-post">
                <Avatar name={displayName} size={36} />
                <div className="community-post__body">
                  <div className="community-post__meta">
                    <span className="community-post__name">{displayName}</span>
                    <div className="community-post__meta-right">
                      {post.readerId != null && post.readerId === myReaderId && (
                        <button
                          type="button"
                          className="community-post__delete"
                          aria-label="Delete my note"
                          title="Delete my note"
                          onClick={() => deletePost(post.id)}
                        >
                          <Trash2 className="community-post__delete-icon" />
                        </button>
                      )}
                      <span className="community-post__time">{post.time}</span>
                    </div>
                  </div>
                  <p className="community-post__text">{post.text}</p>
                  <button
                    type="button"
                    className={`community-post__like${isLiked ? " community-post__like--liked" : ""}`}
                    aria-pressed={isLiked}
                    aria-label={isLiked ? "Unlike post" : "Like post"}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart
                      className="community-post__like-icon"
                      fill={isLiked ? "currentColor" : "none"}
                    />
                    {post.likes}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Fixed refresh button: refetches the real feed */}
      <button
        type="button"
        className={`community-refresh${isRefreshing ? " community-refresh--spinning" : ""}`}
        aria-label="Refresh community notes"
        onClick={reload}
      >
        <RefreshCw className="community-refresh__icon" />
      </button>

      {/* Keep the "Coming soon" placeholder available in case the feed is
      temporarily disabled again:
      <div className="community-empty">
        <MessageSquare className="community-empty__icon" />
        <p className="community-empty__title">Coming soon</p>
        <p className="community-empty__text">
          Community notes are on their way. Keep reading in the meantime!
        </p>
      </div>
      */}
    </div>
  );
}
