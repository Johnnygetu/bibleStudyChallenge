import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import { useUserContext } from "@/context/UserContext";
import { getApiErrorMessage, readJsonResponse } from "@/lib/api";

// Owns the reader-facing community feed for the Community screen. The server
// contract (provisional, aligned with the posts migration) is a list of:
//   { id, readerId, readerName, postContent, createdAt, likesCount, likedByMe }
// mapped here into the shape the screen renders. A failed fetch leaves the
// feed empty and surfaces a custom error message — no dummy data anywhere.
// Like state is server-owned: the feed passes the signed-in reader's id so
// every row carries likedByMe, and taps reconcile with the like endpoint's
// response — no local persistence, so nothing goes stale between devices.
export const PostsContext = createContext(null);

// Custom, reader-friendly wording for community feed failures. Network
// drops, auth walls, missing endpoints and server hiccups each get their
// own message instead of one generic string.
function getCommunityErrorMessage(err, apiUrl) {
  if (!apiUrl) {
    return "Community notes aren't available right now — the app couldn't reach the server. Please try again later.";
  }
  if (err instanceof TypeError) {
    return "We couldn't load community notes. Check your internet connection and try again.";
  }
  switch (err?.status) {
    case 401:
    case 403:
      return "You need to be signed in to see community notes. Please sign in and try again.";
    case 404:
      return "Community notes aren't available yet. Please check back soon.";
    case 429:
      return "Community notes are being refreshed too quickly. Please wait a moment and try again.";
    default:
      if (err?.status >= 500) {
        return "The community notes service hit a snag on our side. Please try again in a little while.";
      }
      return getApiErrorMessage(err, apiUrl);
  }
}

// Timestamps from the server become short relative labels for the feed:
// "now" / "12m" / "5h" / "2d", then a plain date for anything older.
function toTimeLabel(value) {
  if (!value) return "";
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h`;
  const days = Math.floor(minutes / (60 * 24));
  if (days < 7) return `${days}d`;
  return new Date(value).toLocaleDateString();
}

export function PostsProvider({ children }) {
  const { apiUrl } = useGeneralContext();
  const { user } = useUserContext();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The like state used to persist in localStorage; the server owns it now,
  // so any leftover copy from before this change gets dropped.
  useEffect(() => {
    localStorage.removeItem("bible_challenge_liked_posts");
  }, []);

  // Maps an API row into the shape the screen renders. Relative time labels
  // ("12m", "3d") are computed per map — no state involved.
  const toPost = useCallback((row, index) => {
    // Falls back to the array position once the shape is unknown/missing, so
    // a malformed row still renders something sensible.
    const id = row?.id ?? `fallback-${index}`;
    return {
      id,
      readerId: row?.readerId ?? null,
      name: row?.readerName ?? "",
      createdAt: row?.createdAt ?? null,
      time: toTimeLabel(row?.createdAt),
      text: row?.postContent ?? "",
      likes: Number(row?.likesCount ?? 0),
      likedByMe: Boolean(row?.likedByMe),
    };
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!apiUrl) {
      setPosts([]);
      setError(getCommunityErrorMessage(null, apiUrl));
      setLoading(false);
      return;
    }

    try {
      // Passing the signed-in reader's id lets the server flag each post with
      // likedByMe, so hearts always reflect the post_likes table.
      const params = user?.id != null ? `?readerId=${Number(user.id)}` : "";
      const res = await fetch(`${apiUrl}/posts${params}`, {
        headers: { Accept: "application/json" },
      });
      const data = await readJsonResponse(res, "Community posts");
      const list = Array.isArray(data) ? data : data?.data;
      if (!Array.isArray(list)) {
        throw new Error("The server returned an invalid community posts response.");
      }

      setPosts(list.map(toPost));
      setError(null);
    } catch (err) {
      console.error("Failed to load community posts:", err);
      // No fallback feed: the list stays empty and the custom error message
      // (with a retry button on the screen) tells the reader what happened.
      setPosts([]);
      setError(getCommunityErrorMessage(err, apiUrl));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, user]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Stale dummy shuffle removed: refresh always hits the real endpoint now.

  // Likes a post: flips the heart right away, then syncs with the server —
  // POST /posts/{id}/like adds or removes the reader's like row and returns
  // { liked, likesCount }, which replaces the optimistic state. likedByMe
  // lives on the post itself, so a reload always restores the server truth.
  const applyLikeState = useCallback((id, liked, likes) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              likedByMe: liked ?? post.likedByMe,
              likes: Math.max(0, likes ?? post.likes + (liked ? 1 : -1)),
            }
          : post,
      ),
    );
  }, []);

  const toggleLike = useCallback(
    async (id) => {
      const readerId = user?.id != null ? Number(user.id) : null;
      if (readerId == null) return;

      const post = posts.find((row) => row.id === id);
      if (!post) return;
      const wasLiked = post.likedByMe;

      // Optimistic flip + count bump for instant feedback (and fallback mode).
      applyLikeState(id, !wasLiked);

      if (!apiUrl) return;
      try {
        const res = await fetch(`${apiUrl}/posts/${id}/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ readerId }),
        });
        const { liked, likesCount } = await readJsonResponse(res, "Like");
        // Server truth wins.
        applyLikeState(id, Boolean(liked), Number(likesCount));
      } catch {
        applyLikeState(id, wasLiked);
      }
    },
    [apiUrl, user, posts, applyLikeState],
  );

  // Removes the reader's own note from the server and the feed. Optimistic:
  // the row vanishes right away and only returns if the server refuses.
  const deletePost = useCallback(async (id) => {
    const readerId = user?.id;
    if (!apiUrl || readerId == null) return;
    setPosts((prev) => prev.filter((post) => post.id !== id));
    try {
      const res = await fetch(`${apiUrl}/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ readerId: Number(readerId) }),
      });
      if (!res.ok) {
        await reload();
      }
    } catch {
      await reload();
    }
  }, [apiUrl, user, reload]);

  // Posts a new note through POST /posts. Returns true on success so the
  // composer knows it can clear the draft; the 201 row lands at the top of
  // the feed.
  const createPost = useCallback(
    async (postContent) => {
      const readerId = user?.id != null ? Number(user.id) : null;
      const content = (postContent ?? "").trim();
      if (!apiUrl || readerId == null || !content) return false;

      try {
        const res = await fetch(`${apiUrl}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ readerId, postContent: content }),
        });
        const row = await readJsonResponse(res, "Community note");
        const fresh = toPost(row);
        setError(null);
        setPosts((prev) => [fresh, ...prev]);
        return true;
      } catch (err) {
        setError(getCommunityErrorMessage(err, apiUrl));
        return false;
      }
    },
    [apiUrl, user, toPost],
  );

  const value = {
    posts,
    loading,
    error,
    reload,
    createPost,
    toggleLike,
    deletePost,
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePostsContext() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePostsContext must be used inside PostsProvider");
  return ctx;
}
