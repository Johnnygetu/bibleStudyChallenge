import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { apiUrl } from '@/context/AppProviders';

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
// and the mutations the admin menus perform (delete persists to the API).
export const UsersContext = createContext(null);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/readers`, {
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

  // Local patch for status changes until the readers table tracks status.
  const patchUser = (id, patch) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  // Delete on the server, then refresh the list from the API.
  const removeUser = useCallback(async (id) => {
    try {
      const response = await fetch(`${apiUrl}/readers/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      await reload();
    } catch (err) {
      console.error('Failed to delete reader:', err);
    }
  }, [reload]);

  const value = { users, loading, error, reload, patchUser, removeUser };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsersContext() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsersContext must be used within UsersProvider');
  return ctx;
}
