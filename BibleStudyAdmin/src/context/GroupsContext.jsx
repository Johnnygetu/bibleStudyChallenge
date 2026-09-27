import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Owns everything about the groups list: the fetch, its loading/error
// states, and the create/delete mutations the Groups page performs.
export const GroupsContext = createContext(null);

export function GroupsProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/groups`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const rows = await response.json();
      setGroups(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error('Failed to load groups:', err);
      setError('We could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Create a group. Throws so the form can show why it failed.
  const addGroup = useCallback(async ({ name }) => {
    const response = await fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || `The server responded with ${response.status}.`);
    }
    await reload();
  }, [reload]);

  // Create `count` groups and randomly distribute all readers across them.
  const assignMembers = useCallback(async ({ count }) => {
    const response = await fetch(`${API_URL}/groups/assign-random`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ count }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || `The server responded with ${response.status}.`);
    }
    await reload();
  }, [reload]);

  const deleteGroup = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_URL}/groups/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      await reload();
    } catch (err) {
      console.error('Failed to delete group:', err);
    }
  }, [reload]);

  // Detail view: which group is open, its members, and the load states.
  const [selectedId, setSelectedId] = useState(null);
  const [groupDetail, setGroupDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const openGroup = useCallback(async (id) => {
    setSelectedId(id);
    setGroupDetail(null);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const response = await fetch(`${API_URL}/groups/${id}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      setGroupDetail(await response.json());
    } catch (err) {
      console.error('Failed to load group:', err);
      setDetailError('We could not reach the server. Check your connection and try again.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // Move a reader from the open group to another group, then refresh
  // both the list counts and the open detail view.
  const swapMember = useCallback(async ({ groupId, readerId, targetGroupId }) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ reader_id: readerId, target_group_id: targetGroupId }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || `The server responded with ${response.status}.`);
    }
    await reload();
    await openGroup(groupId);
  }, [reload, openGroup]);

  const closeGroup = useCallback(() => {
    setSelectedId(null);
    setGroupDetail(null);
    setDetailError(null);
  }, []);

  const value = {
    groups,
    loading,
    error,
    reload,
    addGroup,
    assignMembers,
    swapMember,
    deleteGroup,
    selectedId,
    groupDetail,
    detailLoading,
    detailError,
    openGroup,
    closeGroup,
  };

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>;
}

export function useGroupsContext() {
  const ctx = useContext(GroupsContext);
  if (!ctx) throw new Error('useGroupsContext must be used within GroupsProvider');
  return ctx;
}
