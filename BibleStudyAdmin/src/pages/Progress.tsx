import { useEffect, useState, useCallback } from 'react';
import { Flame, CheckCircle2, ChevronDown, ChevronRight, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { dummyReaders, dummySchedule, dummyProgress } from '@/lib/dummy';
import type { Reader, ReadingProgress, ReadingSchedule } from '@/lib/types';
import { Avatar, ProgressBar } from '@/components/ui';

interface ReaderProgressData {
  reader: Reader;
  completedCount: number;
  totalCount: number;
  lastCompletedDay: number | null;
  missedDays: number;
}

export default function Progress() {
  const [data, setData] = useState<ReaderProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<'all' | 'ontrack' | 'behind'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    
    const allReaders = dummyReaders;
    const allSchedule = dummySchedule;
    const allProgress = dummyProgress;

    const scheduleByDay = new Map(allSchedule.map((s) => [s.id, s.day_number]));
    const progressByReader = new Map<string, ReadingProgress[]>();
    allProgress.forEach((p) => {
      const arr = progressByReader.get(p.reader_id) || [];
      arr.push(p);
      progressByReader.set(p.reader_id, arr);
    });

    const today = new Date();
    const startDate = new Date('2026-09-21');
    const daysElapsed = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const result: ReaderProgressData[] = allReaders.map((reader) => {
      const readerProgress = progressByReader.get(reader.id) || [];
      const completedCount = readerProgress.filter((p) => p.completed).length;
      const completedDayNumbers = readerProgress
        .filter((p) => p.completed)
        .map((p) => scheduleByDay.get(p.schedule_id))
        .filter((d): d is number => d !== undefined)
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

  function getProgressPct(d: ReaderProgressData) {
    const today = new Date();
    const startDate = new Date('2026-09-21');
    const daysElapsed = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const expected = Math.min(daysElapsed, d.totalCount);
    return expected > 0 ? Math.round((d.completedCount / expected) * 100) : 0;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 py-5 space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold font-serif text-ink-100">Reading Progress</h2>
        <p className="text-xs text-ink-400">Track who's keeping up and who's falling behind</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {([
          { id: 'all', label: 'All Readers', icon: Calendar },
          { id: 'ontrack', label: 'On Track', icon: TrendingUp },
          { id: 'behind', label: 'Falling Behind', icon: AlertTriangle },
        ] as const).map((v) => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                view === v.id
                  ? 'bg-primary-400 text-ink-950'
                  : 'bg-ink-850 text-ink-500 border border-ink-700/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Progress list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-ink-850 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-ink-400" />
          </div>
          <p className="text-ink-400 text-sm font-medium">No readers to show</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((d) => {
            const pct = getProgressPct(d);
            const isExpanded = expanded === d.reader.id;
            const isBehind = d.missedDays > 2;
            return (
              <div key={d.reader.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : d.reader.id)}
                  className="w-full p-3.5 flex items-center gap-3"
                >
                  <Avatar name={d.reader.name} size={40} />
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink-100 truncate">{d.reader.name}</p>
                      {isBehind && d.reader.status === 'active' && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-danger-600 bg-danger-500/10 px-1.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {d.missedDays}d behind
                        </span>
                      )}
                      {!isBehind && d.reader.status === 'active' && d.completedCount > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-success-600 bg-success-500/10 px-1.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          On track
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar 
                        value={d.completedCount} 
                        max={d.totalCount} 
                        size="sm"
                        showNumbers
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-ink-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-ink-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-ink-700/30">
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="bg-ink-800 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-bold text-ink-100">{d.completedCount}</p>
                        <p className="text-[10px] text-ink-500 font-medium">Days Done</p>
                      </div>
                      <div className="bg-ink-800 rounded-xl p-2.5 text-center">
                        <p className={`text-lg font-bold ${isBehind ? 'text-danger-600' : 'text-ink-100'}`}>{d.missedDays}</p>
                        <p className="text-[10px] text-ink-500 font-medium">Days Missed</p>
                      </div>
                      <div className="bg-ink-800 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-bold text-ember-600 flex items-center justify-center gap-0.5">
                          <Flame className="w-4 h-4" />
                          {d.reader.current_streak}
                        </p>
                        <p className="text-[10px] text-ink-500 font-medium">Day Streak</p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <span className="text-ink-500">
                        Last read: <span className="font-semibold text-ink-200">
                          {d.lastCompletedDay ? `Day ${d.lastCompletedDay}` : 'Not started'}
                        </span>
                      </span>
                      <span className="text-ink-500">
                        Best streak: <span className="font-semibold text-ink-200">{d.reader.longest_streak}d</span>
                      </span>
                    </div>
                    {d.reader.phone && (
                      <div className="mt-2 text-xs text-ink-400">Phone: {d.reader.phone}</div>
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
