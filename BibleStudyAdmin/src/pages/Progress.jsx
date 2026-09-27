import { useEffect, useState, useCallback } from 'react';
import { Flame, CheckCircle2, ChevronDown, ChevronRight, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { dummyReaders, dummySchedule, dummyProgress } from '@/lib/dummy';
import { Avatar, ProgressBar } from '@/components/ui';

export default function Progress() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    const allReaders = dummyReaders;
    const allSchedule = dummySchedule;
    const allProgress = dummyProgress;

    const scheduleByDay = new Map(allSchedule.map((s) => [s.id, s.day_number]));
    const progressByReader = new Map();
    allProgress.forEach((p) => {
      const arr = progressByReader.get(p.reader_id) || [];
      arr.push(p);
      progressByReader.set(p.reader_id, arr);
    });

    const today = new Date();
    const startDate = new Date('2026-09-21');
    const daysElapsed = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const result = allReaders.map((reader) => {
      const readerProgress = progressByReader.get(reader.id) || [];
      const completedCount = readerProgress.filter((p) => p.completed).length;
      const completedDayNumbers = readerProgress
        .filter((p) => p.completed)
        .map((p) => scheduleByDay.get(p.schedule_id))
        .filter((d) => d !== undefined)
        .sort((a, b) => a - b);
      const lastCompletedDay = completedDayNumbers.length > 0 ? completedDayNumbers[completedDayNumbers.length - 1] : null;
      const expectedCount = Math.min(daysElapsed, allSchedule.length);
      const missedDays = Math.max(0, expectedCount - completedCount);

      return {
        reader,
        completedCount,
        totalCount: allSchedule.length,
        lastCompletedDay,
        missedDays,
      };
    });

    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = data.filter((d) => {
    if (view === 'ontrack') return d.missedDays <= 2 && d.reader.status === 'active';
    if (view === 'behind') return d.missedDays > 2 && d.reader.status === 'active';
    return true;
  });

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  }

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
      {filtered.length === 0 ? (
        <div className="empty-block">
          <div className="empty-circle empty-circle-soft">
            <TrendingUp className="icon-32 empty-glyph" />
          </div>
          <p className="empty-title-muted">No readers to show</p>
        </div>
      ) : (
        <div className="list-tight">
          {filtered.map((d) => {
            const isExpanded = expanded === d.reader.id;
            const isBehind = d.missedDays > 2;
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
