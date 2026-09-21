import { useState } from 'react';
import { Search, Phone, X, Flame, MoreVertical, Trash2, Edit2, Users } from 'lucide-react';
import { Avatar } from '../components/ui';
import { useReaders } from '../contexts/ReadersContext';
import './Readers.css';

export default function Readers() {
  const { readers, loading, deleteReader, updateStatus } = useReaders();
  const [search, setSearch] = useState('');

  const [editing, setEditing] = useState(null);
  const [menuFor, setMenuFor] = useState(null);

  const filtered = readers.filter((r) => {
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.phone || '').includes(search)
    );
  });

  const getStatusClass = (status) => {
    switch(status) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'dropped': return 'status-dropped';
      default: return '';
    }
  };

  const handleDelete = (id) => {
    deleteReader(id);
    setMenuFor(null);
  };

  const handleUpdateStatus = (id, status) => {
    updateStatus(id, status);
    setMenuFor(null);
  };

  return (
    <div className="readers-container">
      {/* Header */}
      <div className="readers-header">
        <h2 className="readers-title">Readers</h2>
        <p className="readers-subtitle">{readers.length} total readers · Readers sign up via the Telegram bot</p>
      </div>

      {/* Search */}
      <div className="search-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="search-input"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="readers-loading">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="readers-empty">
          <div className="empty-icon-wrapper">
            <Users className="empty-icon-lg" />
          </div>
          <p className="empty-title">
            {readers.length === 0 ? 'No readers yet' : 'No readers match your search'}
          </p>
          <p className="empty-subtitle">
            {readers.length === 0 ? 'Readers will appear here once they start the bot' : 'Try a different filter or search term'}
          </p>
        </div>
      ) : (
        <div className="readers-list">
          {filtered.map((reader) => (
            <div
              key={reader.id}
              className="reader-card"
            >
              <Avatar name={reader.name} size={44} />
              
              <div className="reader-info">
                <div className="reader-info-top">
                  <p className="reader-name">{reader.name}</p>
                  <span className={`status-badge ${getStatusClass(reader.status)}`}>
                    {reader.status}
                  </span>
                </div>
                <div className="reader-info-bottom">
                  {reader.phone && (
                    <span className="info-stat">
                      <Phone className="stat-icon" />
                      {reader.phone}
                    </span>
                  )}
                  {reader.current_streak > 0 && (
                    <span className="streak-stat">
                      <Flame className="stat-icon" />
                      {reader.current_streak}d streak
                    </span>
                  )}
                </div>
              </div>
              <div className="reader-actions">
                <button
                  onClick={() => setMenuFor(menuFor === reader.id ? null : reader.id)}
                  className="menu-btn"
                >
                  <MoreVertical className="menu-icon" />
                </button>
                {menuFor === reader.id && (
                  <>
                    <div className="menu-overlay" onClick={() => setMenuFor(null)} />
                    <div className="dropdown-menu">
                      <button
                        onClick={() => { setEditing(reader); setMenuFor(null); }}
                        className="dropdown-item"
                      >
                        <Edit2 className="dropdown-icon" /> Edit
                      </button>
                      {reader.status !== 'active' && (
                        <button onClick={() => handleUpdateStatus(reader.id, 'active')} className="dropdown-item text-success">
                          <span className="dropdown-dot">●</span> Set Active
                        </button>
                      )}
                      {reader.status !== 'paused' && (
                        <button onClick={() => handleUpdateStatus(reader.id, 'paused')} className="dropdown-item text-primary">
                          <span className="dropdown-dot">●</span> Pause
                        </button>
                      )}
                      {reader.status !== 'dropped' && (
                        <button onClick={() => handleUpdateStatus(reader.id, 'dropped')} className="dropdown-item text-muted">
                          <span className="dropdown-dot">●</span> Mark Dropped
                        </button>
                      )}
                      <div className="dropdown-divider" />
                      <button
                        onClick={() => handleDelete(reader.id)}
                        className="dropdown-item text-danger hover-danger"
                      >
                        <Trash2 className="dropdown-icon" /> Delete
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
      {editing && <ReaderForm reader={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ReaderForm({ reader, onClose }) {
  const { updateReader } = useReaders();
  const [name, setName] = useState(reader.name);
  const [phone, setPhone] = useState(reader.phone || '');
  const [telegramId, setTelegramId] = useState(reader.telegram_id || '');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateReader(reader.id, { 
      name: name.trim(), 
      phone: phone.trim() || null, 
      telegram_id: telegramId.trim() || null 
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content bottom-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title font-serif">Edit Reader</h3>
          <button onClick={onClose} className="close-btn">
            <X className="close-icon" />
          </button>
        </div>

        <div className="form-body">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 234 567 8900"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Telegram ID</label>
            <input
              type="text"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="Telegram username or numeric ID"
              className="form-input"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving || !name.trim()}
          className="btn-primary modal-submit"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
