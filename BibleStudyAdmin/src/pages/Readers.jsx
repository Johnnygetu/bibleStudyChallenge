import { useEffect, useState } from 'react';
import { Search, Phone, X, Flame, MoreVertical, Trash2, Edit2, Users, UserCheck } from 'lucide-react';
import { Avatar, ErrorState, ReaderSkeletonList } from '@/components/ui';
import { useUsersContext } from '@/context/UsersContext';

// The server's church column is a tri-state: true/false is the reader's own
// answer, null means they have not answered yet.
function ChurchMarker({ isChurchMember }) {
  let label = 'Unknown';
  let className = 'badge badge-unknown';

  if (isChurchMember === true) {
    label = 'Church member';
    className = 'badge badge-member';
  } else if (isChurchMember === false) {
    label = 'Not church member';
    className = 'badge badge-not-member';
  }

  return <span className={className}>{label}</span>;
}

export default function Readers() {
  const { users, loading, error, reload, patchUser, removeUser, checkChurchMembership } =
    useUsersContext();
  const [search, setSearch] = useState('');

  const [editing, setEditing] = useState(null);
  const [menuFor, setMenuFor] = useState(null);
  // { type, text } shown as a toast after a membership check.
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const filtered = users.filter((r) => {
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.phone || '').includes(search)
    );
  });

  const statusColors = {
    active: 'badge badge-active',
    paused: 'badge badge-paused',
    dropped: 'badge badge-dropped',
  };

  function deleteReader(id) {
    removeUser(id);
    setMenuFor(null);
  }

  async function handleCheckMembership(reader) {
    setMenuFor(null);
    const outcome = await checkChurchMembership(reader.id);

    if (outcome.status === 'member') {
      setToast({ type: 'success', text: `${reader.name} is a church member.` });
    } else if (outcome.status === 'not-member') {
      setToast({ type: 'muted', text: `${reader.name} is not a church member.` });
    } else {
      setToast({ type: 'error', text: 'Could not check membership. Please try again.' });
    }
  }

  function updateStatus(id, status) {
    // Local-only until the readers table tracks status.
    console.log('Set reader status', id, status);
    patchUser(id, { status });
    setMenuFor(null);
  }

  return (
    <div className="page stack fade-in">
      {/* Header */}
      <div>
        <h2 className="page-title serif">Readers</h2>
        <p className="page-sub">
          {loading ? (
            <span className="sk-line sk-sub" />
          ) : (
            `${users.length} total readers · Readers sign up via the Telegram bot`
          )}
        </p>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <Search className="search-icon icon-16" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="input input-search"
        />
      </div>

      {/* List */}
      {loading ? (
        <ReaderSkeletonList />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <div className="empty-block">
          <div className="empty-circle">
            <Users className="icon-32 empty-glyph" />
          </div>
          <p className="empty-title">
            {users.length === 0 ? 'No readers yet' : 'No readers match your search'}
          </p>
          <p className="empty-sub">
            {users.length === 0 ? 'Readers will appear here once they start the bot' : 'Try a different filter or search term'}
          </p>
        </div>
      ) : (
        <div className="list-tight">
          {filtered.map((reader) => (
            <div
              key={reader.id}
              className="card row reader-card"
            >
              <Avatar name={reader.name} size={44} />

              <div className="row-main">
                <div className="row-headline">
                  <p className="row-title truncate">{reader.name}</p>
                  <span className={statusColors[reader.status]}>
                    {reader.status}
                  </span>
                </div>
                <div className="row-meta">
                  <ChurchMarker isChurchMember={reader.is_church_member} />
                  {reader.phone && (
                    <span className="meta-item">
                      <Phone className="icon-12" />
                      {reader.phone}
                    </span>
                  )}
                  {reader.current_streak > 0 && (
                    <span className="meta-item meta-streak">
                      <Flame className="icon-12" />
                      {reader.current_streak}d streak
                    </span>
                  )}
                </div>
              </div>
              <div className="reader-menu-wrap">
                <button
                  onClick={() => setMenuFor(menuFor === reader.id ? null : reader.id)}
                  className="btn-ghost"
                >
                  <MoreVertical className="icon-16" />
                </button>
                {menuFor === reader.id && (
                  <>
                    <div className="menu-overlay" onClick={() => setMenuFor(null)} />
                    <div className="menu">
                      <button
                        onClick={() => { setEditing(reader); setMenuFor(null); }}
                        className="menu-item"
                      >
                        <Edit2 className="icon-14" /> Edit
                      </button>
                      {/* Only an unanswered reader can be checked; once the
                          column is true or false there is nothing left to set. */}
                      {reader.is_church_member == null && (
                        <button
                          onClick={() => handleCheckMembership(reader)}
                          className="menu-item menu-item-primary"
                        >
                          <UserCheck className="icon-14" /> Check member
                        </button>
                      )}
                      {reader.status !== 'active' && (
                        <button onClick={() => updateStatus(reader.id, 'active')} className="menu-item menu-item-success">
                          <span className="menu-dot">●</span> Set Active
                        </button>
                      )}
                      {reader.status !== 'paused' && (
                        <button onClick={() => updateStatus(reader.id, 'paused')} className="menu-item menu-item-primary">
                          <span className="menu-dot">●</span> Pause
                        </button>
                      )}
                      {reader.status !== 'dropped' && (
                        <button onClick={() => updateStatus(reader.id, 'dropped')} className="menu-item menu-item-muted">
                          <span className="menu-dot">●</span> Mark Dropped
                        </button>
                      )}
                      <div className="menu-divider" />
                      <button
                        onClick={() => deleteReader(reader.id)}
                        className="menu-item menu-item-danger"
                      >
                        <Trash2 className="icon-14" /> Delete
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
      {editing && (
        <ReaderForm
          reader={editing}
          onClose={() => setEditing(null)}
          onSaved={(patch) => patchUser(editing.id, patch)}
        />
      )}

      {/* Result of the last membership check */}
      {toast && (
        <div className={`toast toast--${toast.type}`} role="status">
          <span className="toast-text">{toast.text}</span>
          <button onClick={() => setToast(null)} className="btn-ghost" aria-label="Dismiss">
            <X className="icon-16" />
          </button>
        </div>
      )}
    </div>
  );
}

function ReaderForm({ reader, onClose, onSaved }) {
  const [name, setName] = useState(reader.name);
  const [phone, setPhone] = useState(reader.phone || '');
  const [telegramId, setTelegramId] = useState(reader.telegram_id || '');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    console.log('Update reader locally', reader.id, { name: name.trim(), phone: phone.trim() || null, telegram_id: telegramId.trim() || null });
    setSaving(false);
    onSaved({
      name: name.trim(),
      phone: phone.trim() || null,
      telegram_id: telegramId.trim() || null,
    });
    onClose();
  }

  return (
    <div className="modal-overlay modal-bottom fade-in" onClick={onClose}>
      <div
        className="modal modal-sheet slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h3 className="modal-title serif">Edit Reader</h3>
          <button onClick={onClose} className="btn-ghost">
            <X className="icon-20" />
          </button>
        </div>

        <div className="stack">
          <div>
            <label className="field-label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="input"
            />
          </div>
          <div>
            <label className="field-label">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 234 567 8900"
              className="input"
            />
          </div>
          <div>
            <label className="field-label">Telegram ID</label>
            <input
              type="text"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="Telegram username or numeric ID"
              className="input"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving || !name.trim()}
          className="btn-primary btn-block btn-save"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
