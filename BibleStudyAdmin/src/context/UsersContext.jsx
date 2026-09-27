import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Same convention as the readers app: the API base URL can be overridden per
// environment, and falls back to the local Laravel server.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// The admin UI was built around the Reader shape of the old dummy data.
// Map the server's readers rows onto it so the pages stay unchanged.
function toReader(row) {
  return {
    id: String(row.id),
    name: row.name,
    phone: row.phone_number,
    telegram_id: row.chat_id != null ? String(row.chat_id) : null,
    status: 'active',
    current_streak: 0,
    longest_streak: 0,
    last_read_date: null,
    created_at: row.created_at,
  };
}

// Owns everything about the reader list: the fetch, its loading/error states,
// and the local-only mutations the admin menus perform.
export const UsersContext = createContext(null);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/readers`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const rows = await response.json();
      const mapped = (Array.isArray(rows) ? rows : []).map(toReader);
      mapped.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      setUsers(mapped);
    } catch (err) {
      console.error('Failed to load readers:', err);
      setError('We could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Local-only mutations until the admin gets write endpoints wired up.
  const patchUser = (id, patch) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const value = { users, loading, error, reload, patchUser, removeUser };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsersContext() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsersContext must be used within UsersProvider');
  return ctx;
}
