import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { apiUrl } from '@/context/apiUrl';

// The admin UI was built around the Reader shape of the old dummy data.
// Map the server's readers rows onto it so the pages stay unchanged.
function toReader(row) {
  return {
    id: String(row.id),
    name: row.name,
    phone: row.phone_number,
    telegram_id: row.chat_id != null ? String(row.chat_id) : null,
    // Tri-state from the server: true/false is the reader's answer, null means
    // they have not been asked yet.
    is_church_member: row.is_church_member ?? null,
    // The reader's group, or null when they have not been assigned one yet.
    group: row.groups?.[0] ? { id: row.groups[0].id, name: row.groups[0].name } : null,
    status: 'active',
    current_streak: 0,
    longest_streak: 0,
    last_read_date: null,
    created_at: row.created_at,
  };
}

// Where a bulk membership check keeps the readers it could not resolve, so the
// next run resumes from them instead of starting over.
const CHURCH_CHECK_QUEUE_KEY = 'church_membership_check_pending';

function loadChurchCheckQueue() {
  try {
    const raw = localStorage.getItem(CHURCH_CHECK_QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function storeChurchCheckQueue(ids) {
  try {
    if (ids.length === 0) {
      localStorage.removeItem(CHURCH_CHECK_QUEUE_KEY);
    } else {
      localStorage.setItem(CHURCH_CHECK_QUEUE_KEY, JSON.stringify(ids));
    }
  } catch {
    // Storage unavailable — the run still works, it just cannot resume.
  }
}

// Owns everything about the reader list: the fetch, its loading/error states,
// and the mutations the admin menus perform (delete persists to the API).
export const UsersContext = createContext(null);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Readers a previous bulk check could not resolve, kept in localStorage so a
  // later click picks up where that run stopped.
  const [churchCheckQueue, setChurchCheckQueue] = useState(loadChurchCheckQueue);

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
      // The readers tab lists names A–Z; sensitivity 'base' keeps the order
      // alphabetically sensible regardless of letter case.
      mapped.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
      );
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

  // Asks the server to look the reader up in the main youth group. The server
  // only ever sets the flag to true, so a reader who is not a member comes back
  // unchanged; the local row is updated from whatever the server now reports.
  // Returns "member" / "not-member" / "error" so the caller can report the
  // outcome.
  const checkChurchMembership = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/readers/${id}/check-church-membership`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const reader = await response.json().catch(() => null);

      if (reader) {
        patchUser(id, { is_church_member: reader.is_church_member ?? null });
      }

      return { status: reader?.is_church_member === true ? 'member' : 'not-member' };
    } catch (err) {
      console.error('Failed to check church membership:', err);
      return { status: 'error' };
    }
  };

  const updateChurchCheckQueue = (ids) => {
    storeChurchCheckQueue(ids);
    setChurchCheckQueue(ids);
  };

  // Checks the readers whose church answer is still unknown. The API checks one
  // reader at a time, so this loops and calls it for each — sequentially, to
  // keep the server load gentle. Readers a run could not resolve are kept in
  // localStorage, and the next click resumes from them ("continue where it
  // failed") rather than restarting the whole list. Returns a small summary for
  // the caller to report.
  const checkChurchMembershipAllMembers = async (onProgress) => {
    const resumed = churchCheckQueue.length > 0;
    const queue = resumed
      ? churchCheckQueue
      : users.filter((user) => user.is_church_member == null).map((user) => user.id);

    const total = queue.length;
    const failed = [];

    // Report the start too, so a caller can show "0 of N" before the first call.
    onProgress?.(0, total);

    let members = 0;

    for (let i = 0; i < queue.length; i++) {
      const outcome = await checkChurchMembership(queue[i]);

      if (outcome.status === 'member') members++;
      if (outcome.status === 'error') failed.push(queue[i]);

      // Saved after every reader, so a run cut short by a failure resumes at
      // the next one instead of from the top.
      updateChurchCheckQueue(failed);

      onProgress?.(i + 1, total);
    }

    return { checked: total, members, failed: failed.length, resumed };
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

  const value = {
    users,
    loading,
    error,
    reload,
    patchUser,
    removeUser,
    checkChurchMembership,
    checkChurchMembershipAllMembers,
    churchCheckQueue,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsersContext() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsersContext must be used within UsersProvider');
  return ctx;
}
