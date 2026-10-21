import { Heart, MessageSquare, RefreshCw, Trash2 } from "lucide-react";
import { ApiErrorMessage, Avatar } from "@/components/ui";
import { usePostsContext } from "@/context/PostsContext";
import { useUserContext } from "@/context/UserContext";
import ayatLogo from "@/assets/ayat-logo.png";
import "./CommunityScreen.css";

// The feed is owned by PostsContext: real rows from GET /posts when the
// endpoint answers, or the dummy feed with `isFallback` set until it does.
// Keep the "Coming soon" placeholder commented out below — it may be needed
// if the community feature is ever disabled again.
export function CommunityScreen() {
  const { posts, loading, error, isFallback, likedIds, toggleLike, deletePost, reload } =
    usePostsContext();
  const { user } = useUserContext();
  // Only the signed-in reader may remove their own note.
  const myReaderId = user?.id != null ? Number(user.id) : null;

  const isRefreshing = loading;

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

      {/* Preview banner so nobody mistakes the dummy data for real posts */}
      {isFallback && !loading && (
        <p className="community__preview-note">
          Preview — sample posts until the community feature launches.
        </p>
      )}

      {/* Composer (non-functional placeholder) */}
      <div className="community-composer">
        <Avatar name="Yishak" size={32} />
        <span className="community-composer__input">Share a note…</span>
      </div>

      {error && <ApiErrorMessage message={error} onRetry={reload} />}

      {loading ? (
        <div className="community-empty">
          <p className="community-empty__text">Loading notes…</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="community-empty">
          <MessageSquare className="community-empty__icon" />
          <p className="community-empty__title">No notes yet</p>
          <p className="community-empty__text">
            Be the first to share a note with the community!
          </p>
        </div>
      ) : (
        // Feed
        <div className="community-feed">
          {posts.map((post) => {
            const isLiked = likedIds.has(post.id);
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
                    {post.likes + (isLiked ? 1 : 0)}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Fixed refresh button: real refetch once the API answers, dummy
      shuffle while the feed is the fallback */}
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
