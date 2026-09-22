import { useEffect, useState, useCallback } from 'react';
import { Search, Phone, X, Flame, MoreVertical, Trash2, Edit2, Users } from 'lucide-react';
import { dummyReaders } from '@/lib/dummy';
import type { Reader, ReaderStatus } from '@/lib/types';
import { Avatar } from '@/components/ui';

export default function Readers() {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [editing, setEditing] = useState<Reader | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);

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

  const filtered = readers.filter((r) => {
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.phone || '').includes(search)
    );
  });

  const statusColors: Record<ReaderStatus, string> = {
    active: 'bg-success-500/10 text-success-600 border-success-500/20',
    paused: 'bg-primary-400/10 text-primary-600 border-primary-400/20',
    dropped: 'bg-ink-700/50 text-ink-400 border-ink-600',
  };

  async function deleteReader(id: string) {
    console.log('Dummy delete reader', id);
    setReaders(prev => prev.filter(r => r.id !== id));
    setMenuFor(null);
  }

  async function updateStatus(id: string, status: ReaderStatus) {
    console.log('Dummy update status', id, status);
    setReaders(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setMenuFor(null);
  }

  return (
    <div className="px-5 py-5 space-y-4 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-ink-100">Readers</h2>
        <p className="text-xs text-ink-400">{readers.length} total readers · Readers sign up via the Telegram bot</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full bg-ink-850 border border-ink-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-ink-800 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-ink-400" />
          </div>
          <p className="text-ink-300 text-sm font-medium">
            {readers.length === 0 ? 'No readers yet' : 'No readers match your search'}
          </p>
          <p className="text-ink-400 text-xs mt-1">
            {readers.length === 0 ? 'Readers will appear here once they start the bot' : 'Try a different filter or search term'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((reader) => (
            <div
              key={reader.id}
              className="card p-3.5 flex items-center gap-3 relative"
            >
              <Avatar name={reader.name} size={44} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink-100 truncate">{reader.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${statusColors[reader.status]}`}>
                    {reader.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {reader.phone && (
                    <span className="flex items-center gap-1 text-xs text-ink-400">
                      <Phone className="w-3 h-3" />
                      {reader.phone}
                    </span>
                  )}
                  {reader.current_streak > 0 && (
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-ember-600">
                      <Flame className="w-3 h-3" />
                      {reader.current_streak}d streak
                    </span>
                  )}
                </div>
              </div>
              <div className="relative shrink-0">
                <button
                  onClick={() => setMenuFor(menuFor === reader.id ? null : reader.id)}
                  className="p-2 rounded-lg hover:bg-ink-800 text-ink-400"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {menuFor === reader.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                    <div className="absolute right-0 top-full mt-1 z-20 bg-ink-850 rounded-xl border border-ink-700/50 shadow-xl py-1 min-w-[160px]">
                      <button
                        onClick={() => { setEditing(reader); setMenuFor(null); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-200 hover:bg-ink-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      {reader.status !== 'active' && (
                        <button onClick={() => updateStatus(reader.id, 'active')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-success-600 hover:bg-ink-800">
                          <span className="w-3.5 h-3.5 text-center text-xs">●</span> Set Active
                        </button>
                      )}
                      {reader.status !== 'paused' && (
                        <button onClick={() => updateStatus(reader.id, 'paused')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-500 hover:bg-ink-800">
                          <span className="w-3.5 h-3.5 text-center text-xs">●</span> Pause
                        </button>
                      )}
                      {reader.status !== 'dropped' && (
                        <button onClick={() => updateStatus(reader.id, 'dropped')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-400 hover:bg-ink-800">
                          <span className="w-3.5 h-3.5 text-center text-xs">●</span> Mark Dropped
                        </button>
                      )}
                      <div className="border-t border-ink-700/50 my-1" />
                      <button
                        onClick={() => deleteReader(reader.id)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && <ReaderForm reader={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function ReaderForm({ reader, onClose, onSaved }: { reader: Reader; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(reader.name);
  const [phone, setPhone] = useState(reader.phone || '');
  const [telegramId, setTelegramId] = useState(reader.telegram_id || '');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    console.log('Dummy update reader', reader.id, { name: name.trim(), phone: phone.trim() || null, telegram_id: telegramId.trim() || null });
    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-50/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-ink-900 w-full max-w-md rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto border-t border-ink-700/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-ink-100 font-serif">Edit Reader</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-ink-800 text-ink-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-400 mb-1.5 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-ink-850 border border-ink-700/50 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-400 mb-1.5 block">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 234 567 8900"
              className="w-full bg-ink-850 border border-ink-700/50 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-400 mb-1.5 block">Telegram ID</label>
            <input
              type="text"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="Telegram username or numeric ID"
              className="w-full bg-ink-850 border border-ink-700/50 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving || !name.trim()}
          className="w-full mt-6 btn-primary py-3.5 text-sm"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
