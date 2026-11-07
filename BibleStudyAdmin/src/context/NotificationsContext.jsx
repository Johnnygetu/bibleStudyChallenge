import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { apiUrl } from '@/context/apiUrl';

// Owns the Notifications screen data: scheduled and sent notifications from
// GET /notifications. Rows are already snake_case from the server, so the
// context just normalizes types for rendering.
export const NotificationsContext = createContext(null);

// Uploaded images live on the backend's public disk, served from `/storage`.
// Derive the app root from the API URL (which ends in `/api`) so the admin
// can render the file even though the API and storage sit on one origin.
const storageBase = apiUrl.replace(/\/api\/?$/, '');

function toImageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${storageBase}/storage/${path.replace(/^\/+/, '')}`;
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Maps an API row into the shape the screen renders. Falls back to the
  // array position when the id is missing so a malformed row still renders.
  const toNotification = (row, index) => ({
    id: row?.id ?? `notification-${index}`,
    imagePath: row?.notification_image_path ?? null,
    imageUrl: toImageUrl(row?.notification_image_path),
    content: row?.notification_content ?? '',
    postTime: row?.post_time ?? null,
    sent: Boolean(row?.notification_sent),
  });

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/notifications`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const data = await response.json();
      const list = Array.isArray(data) ? data : data?.data;
      if (!Array.isArray(list)) {
        throw new Error('The server returned an invalid notifications response.');
      }

      setNotifications(list.map(toNotification));
      setError(null);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError(
        err instanceof Error
          ? `We could not load the notifications. ${err.message}`
          : 'We could not reach the server. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Create a notification. The image is a File, so the request goes out as
  // multipart FormData with the file under `notification_image`. `postTime`
  // is a local datetime-local string, which the server's date rule accepts
  // as-is; it is omitted when `postNow` asks for immediate posting. Throws so
  // the form can show why it failed.
  const addNotification = useCallback(
    async ({ imageFile, content, postTime, postNow }) => {
      const body = new FormData();
      body.append('notification_content', content.trim());
      body.append('post_now', postNow ? '1' : '0');
      if (!postNow && postTime) {
        body.append('post_time', postTime);
      }
      if (imageFile) {
        body.append('notification_image', imageFile);
      }

      const response = await fetch(`${apiUrl}/notifications`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body,
      });
      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.message || `The server responded with ${response.status}.`);
      }
      await reload();
    },
    [reload],
  );

  // Remove an unsent notification through DELETE /notifications/{id}. The
  // server refuses once a notification is sent, so this is only offered for
  // pending rows. Optimistic: the row vanishes right away and only comes back
  // if the server refuses. Returns { ok, message } so the row can show a
  // failure inline instead of a page-wide error.
  const deleteNotification = useCallback(
    async (id) => {
      const target = notifications.find((notification) => notification.id === id);
      if (!target) {
        return { ok: false, message: 'That notification is no longer listed.' };
      }

      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      try {
        const response = await fetch(`${apiUrl}/notifications/${id}`, {
          method: 'DELETE',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          const json = await response.json().catch(() => null);
          throw new Error(json?.message || `The server responded with ${response.status}.`);
        }
        setError(null);
        return { ok: true, message: null };
      } catch (err) {
        console.error('Failed to delete notification:', err);
        // Put the row back so the list still reflects what the server owns.
        setNotifications((prev) => {
          if (prev.some((notification) => notification.id === id)) return prev;
          const next = [...prev, target];
          next.sort((a, b) => new Date(b.postTime ?? 0) - new Date(a.postTime ?? 0));
          return next;
        });
        return {
          ok: false,
          message:
            err instanceof Error
              ? `The notification could not be deleted. ${err.message}`
              : 'The notification could not be deleted. Please try again.',
        };
      }
    },
    [notifications],
  );

  const value = { notifications, loading, error, reload, addNotification, deleteNotification };

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used within NotificationsProvider');
  return ctx;
}
