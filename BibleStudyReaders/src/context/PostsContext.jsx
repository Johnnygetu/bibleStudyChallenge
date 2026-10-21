import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import { DUMMY_POSTS } from "@/lib/dummyPosts";
import { getApiErrorMessage, readJsonResponse } from "@/lib/api";

// Owns the reader-facing community feed for the Community screen. The server
// contract (provisional, aligned with the posts migration) is a list of:
//   { id, readerName, postContent, createdAt, likesCount }
// mapped here into the shape the screen renders. Until the backend exposes
// GET /posts, every failed fetch falls back to the hardcoded dummy posts so
// the screen keeps working in the meantime — `isFallback` tells the screen.
// The refresh feedback and like state live here too, so they survive tab
// switches just like the fetch does.
export const PostsContext = createContext(null);

// Reaction state is front-end-only for now; a real like endpoint replaces it.
const LIKED_KEY = "bible_challenge_liked_posts";

function loadLikedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveLikedIds(ids) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]));
}

export function PostsProvider({ children }) {
  const { apiUrl } = useGeneralContext();

  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(true);
  const [error, setError] = useState(null);
  const [likedIds, setLikedIds] = useState(loadLikedIds);

  const toTimeLabel = (value) => {
    if (!value) return "";
    const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h`;
    const days = Math.floor(minutes / (60 * 24));
    if (days < 7) return `${days}d`;
    return new Date(value).toLocaleDateString();
  };

  const toPost = (row, index) => {
    // Falls back to the array position once the shape is unknown/missing, so
    // a malformed row still renders something sensible.
    const id = row?.id ?? `fallback-${index}`;
    return {
      id,
      name: row?.readerName ?? "",
      time: toTimeLabel(row?.createdAt),
      text: row?.postContent ?? "",
      likes: Number(row?.likesCount ?? 0),
    };
  };

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
      const res = await fetch(`${apiUrl}/posts`, {
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
  }, [apiUrl]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Dummy refresh: shuffles the feed with the same 600ms feedback the screen
  // originally had. Swallows itself entirely once reload() hits the real API.
  const dummyReload = useCallback(async () => {
    setLoading(true);
    setPosts((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
  }, []);

  const toggleLike = useCallback((id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveLikedIds(next);
      return next;
    });
  }, []);

  const value = {
    posts,
    loading,
    error,
    isFallback,
    // Hits the real endpoint once it exists; shuffles the dummy feed meanwhile.
    reload,
    likedIds,
    toggleLike,
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePostsContext() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePostsContext must be used inside PostsProvider");
  return ctx;
}
