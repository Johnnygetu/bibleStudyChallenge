import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { apiUrl } from '@/context/apiUrl';

// Owns the Posts screen data: notes readers shared in the community feed,
// served by the same GET /posts endpoint the reader app's PostsContext hits.
// Only messages from the past 24 hours stay in the list — older notes are
// dropped client-side after the fetch, so the screen is a daily digest.
export const PostsContext = createContext(null);

const DAY_MS = 24 * 60 * 60 * 1000;

// Timestamps from the server become short relative labels for the feed:
// "now" / "12m" / "5h", then a plain date for anything older (rare here,
// since posts past 24h get filtered out).
function toTimeLabel(value) {
  if (!value) return '';
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h`;
  return new Date(value).toLocaleDateString();
}

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Maps an API row (reader-side contract: { id, readerId, readerName,
  // postContent, createdAt, likesCount, likedByMe }) into the shape the
  // screen renders. Falls back to the array position when the id is missing
  // so a malformed row still renders something sensible.
  const toPost = (row, index) => ({
    id: row?.id ?? `post-${index}`,
    readerId: row?.readerId ?? null,
    name: row?.readerName ?? '',
    createdAt: row?.createdAt ?? null,
    time: toTimeLabel(row?.createdAt),
    content: row?.postContent ?? '',
    likes: Number(row?.likesCount ?? 0),
    likedByMe: Boolean(row?.likedByMe),
  });

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Deliberately no readerId param — the admin isn't a reader, so every
      // row comes back without like context.
      const response = await fetch(`${apiUrl}/posts`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const data = await response.json();
      const list = Array.isArray(data) ? data : data?.data;
      if (!Array.isArray(list)) {
        throw new Error('The server returned an invalid posts response.');
      }

      // Daily digest: keep rows created inside the last 24 hours only.
      const cutoff = Date.now() - DAY_MS;
      setPosts(
        list
          .filter((row) => row?.createdAt && new Date(row.createdAt).getTime() >= cutoff)
          .map(toPost),
      );
      setError(null);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError(
        err instanceof Error
          ? `We could not load the posts. ${err.message}`
          : 'We could not reach the server. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Removes a note through DELETE /admin/posts/{id} — a dedicated admin
  // route, unlike the reader app's own-post-only DELETE /posts/{id}. The
  // server insists on a reason and tells the author over Telegram why the
  // note was taken down. Optimistic: the row vanishes right away and only
  // comes back if the server refuses. Returns { ok, message } so the confirm
  // modal can show the failure inline instead of a page-wide error.
  const deletePost = useCallback(
    async (id, reason) => {
      const target = posts.find((post) => post.id === id);
      if (!target) {
        return { ok: false, message: 'That post is no longer in the feed.' };
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));
      try {
        const response = await fetch(`${apiUrl}/admin/posts/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ reason }),
        });
        if (!response.ok) {
          throw new Error(`The server responded with ${response.status}.`);
        }
        setError(null);
        return { ok: true, message: null };
      } catch (err) {
        console.error('Failed to delete post:', err);
        // Put the row back so the digest still shows what the server owns.
        setPosts((prev) => {
          if (prev.some((post) => post.id === id)) return prev;
          const next = [...prev, target];
          next.sort(
            (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0),
          );
          return next;
        });
        return {
          ok: false,
          message:
            err instanceof Error
              ? `The post could not be deleted. ${err.message}`
              : 'The post could not be deleted. Please try again.',
        };
      }
    },
    [posts],
  );

  const value = { posts, loading, error, reload, deletePost };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePostsContext() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePostsContext must be used within PostsProvider');
  return ctx;
}
