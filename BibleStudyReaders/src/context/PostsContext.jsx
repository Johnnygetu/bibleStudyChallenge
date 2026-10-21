import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import { useUserContext } from "@/context/UserContext";
import { DUMMY_POSTS } from "@/lib/dummyPosts";
import { getApiErrorMessage, readJsonResponse } from "@/lib/api";

// Owns the reader-facing community feed for the Community screen. The server
// contract (provisional, aligned with the posts migration) is a list of:
//   { id, readerId, readerName, postContent, createdAt, likesCount, likedByMe }
// mapped here into the shape the screen renders. Until the backend exposes
// GET /posts, every failed fetch falls back to the hardcoded dummy posts so
// the screen keeps working in the meantime — `isFallback` tells the screen.
// Like state is server-owned: the feed passes the signed-in reader's id so
// every row carries likedByMe, and taps reconcile with the like endpoint's
// response — no local persistence, so nothing goes stale between devices.
export const PostsContext = createContext(null);

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

  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(true);
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
      setPosts(DUMMY_POSTS);
      setIsFallback(true);
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
      setIsFallback(false);
    } catch (err) {
      console.error("Failed to load community posts:", err);
      // The community feature is not live yet — keep the screen useful with
      // the dummy feed instead of an empty error page.
      setPosts(DUMMY_POSTS);
      setIsFallback(true);
      setError(getApiErrorMessage(err, apiUrl));
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
  // the feed (or alone, should the screen still be on the fallback samples).
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
        if (isFallback) {
          setPosts([fresh]);
          setIsFallback(false);
        } else {
          setPosts((prev) => [fresh, ...prev]);
        }
        return true;
      } catch (err) {
        setError(getApiErrorMessage(err, apiUrl));
        return false;
      }
    },
    [apiUrl, user, isFallback, toPost],
  );

  const value = {
    posts,
    loading,
    error,
    isFallback,
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
