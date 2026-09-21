import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dummyReaders } from '../lib/dummy';

const ReadersContext = createContext();

export function ReadersProvider({ children }) {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const data = [...dummyReaders].sort((a, b) => a.name.localeCompare(b.name));
    setReaders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function deleteReader(id) {
    console.log('Dummy delete reader', id);
    setReaders(prev => prev.filter(r => r.id !== id));
  }

  async function updateStatus(id, status) {
    console.log('Dummy update status', id, status);
    setReaders(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  async function updateReader(id, updates) {
    console.log('Dummy update reader', id, updates);
    setReaders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    // Re-sort just in case name changed
    setReaders(prev => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
  }

  return (
    <ReadersContext.Provider value={{ readers, loading, deleteReader, updateStatus, updateReader }}>
      {children}
    </ReadersContext.Provider>
  );
}

export function useReaders() {
  return useContext(ReadersContext);
}
