import { useState } from 'react';
import { Flame, CheckCircle2, ChevronDown, ChevronRight, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Avatar, ProgressBar } from '../components/ui';
import { useProgress } from '../contexts/ProgressContext';
import './Progress.css';

export default function Progress() {
  const { data, loading } = useProgress();
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState('all');

  const filtered = data.filter((d) => {
    if (view === 'ontrack') return d.missedDays <= 2 && d.reader.status === 'active';
    if (view === 'behind') return d.missedDays > 2 && d.reader.status === 'active';
    return true;
  });

  if (loading) {
    return (
      <div className="progress-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h2 className="progress-title">Reading Progress</h2>
        <p className="progress-subtitle">Track who's keeping up and who's falling behind</p>
      </div>

      {/* View toggle */}
      <div className="view-toggle">
        {[
          { id: 'all', label: 'All Readers', icon: Calendar },
          { id: 'ontrack', label: 'On Track', icon: TrendingUp },
          { id: 'behind', label: 'Falling Behind', icon: AlertTriangle },
        ].map((v) => {
          const Icon = v.icon;
          const isActive = view === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`toggle-btn ${isActive ? 'active' : ''}`}
            >
              <Icon className="toggle-icon" />
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Progress list */}
      {filtered.length === 0 ? (
        <div className="progress-empty">
          <div className="empty-icon-wrapper">
            <TrendingUp className="empty-icon-lg" />
          </div>
          <p className="empty-text">No readers to show</p>
        </div>
      ) : (
        <div className="progress-list">
          {filtered.map((d) => {
            const isExpanded = expanded === d.reader.id;
            const isBehind = d.missedDays > 2;
            return (
              <div key={d.reader.id} className="progress-card">
                <button
                  onClick={() => setExpanded(isExpanded ? null : d.reader.id)}
                  className="progress-card-btn"
                >
                  <Avatar name={d.reader.name} size={40} />
                  
                  <div className="progress-info">
                    <div className="progress-info-header">
                      <p className="reader-name">{d.reader.name}</p>
                      {isBehind && d.reader.status === 'active' && (
                        <span className="badge badge-danger">
                          <AlertTriangle className="badge-icon" />
                          {d.missedDays}d behind
                        </span>
                      )}
                      {!isBehind && d.reader.status === 'active' && d.completedCount > 0 && (
                        <span className="badge badge-success">
                          <CheckCircle2 className="badge-icon" />
                          On track
                        </span>
                      )}
                    </div>
                    <div className="progress-bar-wrapper">
                      <ProgressBar 
                        value={d.completedCount} 
                        max={d.totalCount} 
                        size="sm"
                        showNumbers
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="chevron-icon" />
                  ) : (
                    <ChevronRight className="chevron-icon" />
                  )}
                </button>

                {isExpanded && (
                  <div className="progress-details">
                    <div className="stats-grid">
                      <div className="stat-box">
                        <p className="stat-val text-ink-100">{d.completedCount}</p>
                        <p className="stat-label">Days Done</p>
                      </div>
                      <div className="stat-box">
                        <p className={`stat-val ${isBehind ? 'text-danger-600' : 'text-ink-100'}`}>{d.missedDays}</p>
                        <p className="stat-label">Days Missed</p>
                      </div>
                      <div className="stat-box">
                        <p className="stat-val text-ember-600 with-icon">
                          <Flame className="stat-icon-sm" />
                          {d.reader.current_streak}
                        </p>
                        <p className="stat-label">Day Streak</p>
                      </div>
                    </div>
                    <div className="details-footer">
                      <span className="footer-stat">
                        Last read: <span className="font-semibold text-ink-200">
                          {d.lastCompletedDay ? `Day ${d.lastCompletedDay}` : 'Not started'}
                        </span>
                      </span>
                      <span className="footer-stat">
                        Best streak: <span className="font-semibold text-ink-200">{d.reader.longest_streak}d</span>
                      </span>
                    </div>
                    {d.reader.phone && (
                      <div className="footer-phone">Phone: {d.reader.phone}</div>
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
