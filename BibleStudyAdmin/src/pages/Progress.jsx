import { useState } from 'react';
import { Flame, CheckCircle2, ChevronDown, ChevronRight, Calendar, TrendingUp, AlertTriangle, Search, Target, X } from 'lucide-react';
import { Avatar, ProgressBar, ReaderSkeletonList, ErrorState } from '@/components/ui';
import { useProgressContext } from '@/context/ProgressContext';
import { isFallingBehind, isOnTrack } from '@/lib/progress';

export default function Progress() {
  const { data, loading, error, reload, chapters, setProgress } = useProgressContext();
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState('all');
  const [search, setSearch] = useState('');
  const [adjusting, setAdjusting] = useState(null);

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  const filtered = data.filter((d) => {
    const matchesSearch =
      d.reader.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.reader.phone || '').includes(search);
    if (!matchesSearch) return false;
    if (view === 'ontrack') return isOnTrack(d.missedDays) && d.reader.status === 'active';
    if (view === 'behind') return isFallingBehind(d.missedDays) && d.reader.status === 'active';
    return true;
  });

  const views = [
    { id: 'all', label: 'All Readers', icon: Calendar },
    { id: 'ontrack', label: 'On Track', icon: TrendingUp },
    { id: 'behind', label: 'Falling Behind', icon: AlertTriangle },
  ];

  return (
    <div className="page stack fade-in">
      <div>
        <h2 className="page-title serif">Reading Progress</h2>
        <p className="page-sub">Track who's keeping up and who's falling behind</p>
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

      {/* View toggle */}
      <div className="toggle-group">
        {views.map((v) => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={view === v.id ? 'toggle-btn active' : 'toggle-btn'}
            >
              <Icon className="icon-14" />
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Progress list */}
      {loading ? (
        <ReaderSkeletonList count={5} />
      ) : filtered.length === 0 ? (
        <div className="empty-block">
          <div className="empty-circle empty-circle-soft">
            <TrendingUp className="icon-32 empty-glyph" />
          </div>
          <p className="empty-title-muted">
            {search.trim()
              ? 'No readers match your search'
              : 'No readers to show'}
          </p>
        </div>
      ) : (
        <div className="list-tight">
          {filtered.map((d) => {
            const isExpanded = expanded === d.reader.id;
            const isBehind = isFallingBehind(d.missedDays);
            return (
              <div key={d.reader.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : d.reader.id)}
                  className="row row-btn"
                >
                  <Avatar name={d.reader.name} size={40} />

                  <div className="row-main">
                    <div className="row-headline">
                      <p className="row-title truncate">{d.reader.name}</p>
                      {isBehind && d.reader.status === 'active' && (
                        <span className="pill-xs pill-danger">
                          <AlertTriangle className="icon-10" />
                          {d.missedDays}d behind
                        </span>
                      )}
                      {!isBehind && d.reader.status === 'active' && d.completedCount > 0 && (
                        <span className="pill-xs pill-success">
                          <CheckCircle2 className="icon-10" />
                          On track
                        </span>
                      )}
                    </div>
                    <div className="row-progress">
                      <ProgressBar
                        value={d.completedCount}
                        max={d.totalCount}
                        size="sm"
                        showNumbers
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="icon-16 row-chevron" />
                  ) : (
                    <ChevronRight className="icon-16 row-chevron" />
                  )}
                </button>

                {isExpanded && (
                  <div className="progress-details">
                    <div className="grid-3 stats-grid">
                      <div className="stat-tile">
                        <p className="stat-tile-value">{d.completedCount}</p>
                        <p className="stat-tile-label">Days Done</p>
                      </div>
                      <div className="stat-tile">
                        <p className={isBehind ? 'stat-tile-value danger' : 'stat-tile-value'}>{d.missedDays}</p>
                        <p className="stat-tile-label">Days Missed</p>
                      </div>
                      <div className="stat-tile">
                        <p className="stat-tile-value ember streak-value">
                          <Flame className="icon-16" />
                          {d.reader.current_streak}
                        </p>
                        <p className="stat-tile-label">Day Streak</p>
                      </div>
                    </div>
                    <div className="details-meta">
                      <span className="meta-muted">
                        Last read: <span className="meta-strong">
                          {d.lastCompletedDay ? `Day ${d.lastCompletedDay}` : 'Not started'}
                        </span>
                      </span>
                      <span className="meta-muted">
                        Best streak: <span className="meta-strong">{d.reader.longest_streak}d</span>
                      </span>
                    </div>
                    {d.reader.phone && (
                      <div className="details-phone">Phone: {d.reader.phone}</div>
                    )}
                    <button
                      onClick={() => setAdjusting(d)}
                      className="btn-secondary btn-block details-action"
                    >
                      <Target className="icon-16" />
                      Set progress
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Set-progress modal */}
      {adjusting && (
        <SetProgressModal
          reader={adjusting.reader}
          chapters={chapters}
          currentOrderId={adjusting.currentOrderId}
          onClose={() => setAdjusting(null)}
          onSave={setProgress}
        />
      )}
    </div>
  );
}

function SetProgressModal({ reader, chapters, currentOrderId, onClose, onSave }) {
  const [orderId, setOrderId] = useState(() =>
    currentOrderId > 0 ? String(currentOrderId) : String(chapters[0]?.orderId ?? ''),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const selected = chapters.find((c) => String(c.orderId) === String(orderId));

  async function save() {
    if (!orderId) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(reader.id, Number(orderId));
      onClose();
    } catch (err) {
      setError(err.message || 'Could not update progress.');
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay modal-bottom fade-in" onClick={onClose}>
      <div className="modal modal-sheet slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title serif">Set Progress</h3>
          <button onClick={onClose} className="btn-ghost">
            <X className="icon-20" />
          </button>
        </div>

        <p className="page-sub">
          Pick the last chapter {reader.name} read. Today&apos;s reading restarts from here.
        </p>

        <div className="stack">
          <div>
            <label className="field-label">Last chapter read</label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="input"
              disabled={chapters.length === 0}
            >
              {chapters.length === 0 && <option value="">No chapters available</option>}
              {chapters.map((chapter) => (
                <option key={chapter.orderId} value={chapter.orderId}>
                  {chapter.label} · Day {chapter.day}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <p className="page-sub">
              {reader.name} will resume after {selected.label}, starting with today&apos;s reading.
            </p>
          )}

          {error && <p className="form-error">{error}</p>}
        </div>

        <button
          onClick={save}
          disabled={saving || !orderId}
          className="btn-primary btn-block btn-save"
        >
          {saving ? 'Saving...' : 'Save Progress'}
        </button>
      </div>
    </div>
  );
}
