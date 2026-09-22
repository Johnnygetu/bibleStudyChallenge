Created At: 2026-09-18T21:22:56+03:00
Completed At: 2026-09-18T21:22:56+03:00
File Path: `file:///home/johnny/My%20files/projects/BibleStudyReaders/src/components/TodayScreen.tsx`
Total Lines: 371
Total Bytes: 14178
Showing lines 1 to 371
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import { useCallback, useEffect, useState } from "react";
2: import { Flame, BookOpen, Check, Calendar, ChevronRight, Sunrise } from "lucide-react";
3: import { useApp } from "@/lib/context";
4: import {
5:   fetchReadingPlanForDay,
6:   fetchReadingPlanForWeek,
7:   fetchReadingProgress,
8:   markChapterComplete,
9:   unmarkChapter,
10:   updateStreak,
11:   getChapterLabels,
12:   calculateStreak,
13: } from "@/lib/api";
14: import type { ReadingPlanDay, ReadingProgressEntry } from "@/lib/supabase";
15: import { hapticImpact, hapticNotification } from "@/lib/telegram";
16: import { ProgressBar, Skeleton, ErrorState } from "@/components/ui";
17: 
18: interface DayGroup {
19:   planDay: ReadingPlanDay;
20:   chapterLabels: string[];
21: }
22: 
23: export function TodayScreen() {
24:   const { profile, refreshProfile, challengeStartDate } = useApp();
25:   const [todayGroups, setTodayGroups] = useState<DayGroup[]>([]);
26:   const [weekDays, setWeekDays] = useState<ReadingPlanDay[]>([]);
27:   const [progress, setProgress] = useState<ReadingProgressEntry[]>([]);
28:   const [loading, setLoading] = useState(true);
29:   const [error, setError] = useState<string | null>(null);
30:   const [celebrating, setCelebrating] = useState(false);
31: 
32:   const today = new Date();
33:   const daysSinceStart = Math.floor((today.getTime() - challengeStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
34:   const currentDay = Math.max(1, Math.min(182, daysSinceStart));
35:   const currentWeek = Math.ceil(currentDay / 7);
36: 
37:   const completedLabels = new Set(progress.map((p) => p.chapter_label));
38:   const allTodayChapters = todayGroups.flatMap((g) => g.chapterLabels);
39:   const todayCompletedCount = allTodayChapters.filter((ch) => completedLabels.has(ch)).length;
40:   const todayTotal = allTodayChapters.length;
41:   const allDone = todayTotal > 0 && todayCompletedCount === todayTotal;
42: 
43:   const load = useCallback(async () => {
44:     setLoading(true);
45:     setError(null);
46:     try {
47:       const [dayPlan, weekPlan] = await Promise.all([
48:         fetchReadingPlanForDay(currentDay),
49:         fetchReadingPlanForWeek(currentWeek),
50:       ]);
51: 
52:       const groups: DayGroup[] = dayPlan.map((pd) => ({
53:         planDay: pd,
54:         chapterLabels: getChapterLabels(pd.book, pd.chapters),
55:       }));
56:       setTodayGroups(groups);
57:       setWeekDays(weekPlan);
58: 
59:       const allDayIds = [...new Set([...dayPlan.map((d) => d.id), ...weekPlan.map((d) => d.id)])];
60:       const prog = await fetchReadingProgress(profile.id, allDayIds);
61:       setProgress(prog);
62:     } catch (err) {
63:       setError(err instanceof Error ? err.message : "Failed to load reading plan");
64:     } finally {
65:       setLoading(false);
66:     }
67:   }, [currentDay, currentWeek, profile.id]);
68: 
69:   useEffect(() => {
70:     load();
71:   }, [load]);
72: 
73:   // Check for streak update when all chapters are done
74:   useEffect(() => {
75:     if (allDone && !celebrating) {
76:       const todayStr = today.toISOString().split("T")[0];
77:       if (profile.last_read_date !== todayStr) {
78:         const { newStreak, newLongestStreak, shouldUpdate } = calculateStreak(
79:           profile.current_streak,
80:           profile.last_read_date,
81:           today
82:         );
83:         if (shouldUpdate) {
84:           updateStreak(profile.id, newStreak, newLongestStreak, todayStr)
85:             .then(() => {
86:               refreshProfile();
87:               setCelebrating(true);
88:               hapticNotification("success");
89:               setTimeout(() => setCelebrating(false), 3000);
90:             })
91:             .catch(() => {});
92:         }
93:       }
94:     }
95:   }, [allDone, celebrating, profile, today, refreshProfile]);
96: 
97:   const handleToggleChapter = async (planDayId: string, chapterLabel: string) => {
98:     const isCompleted = completedLabels.has(chapterLabel);
99:     hapticImpact("light");
100: 
101:     if (isCompleted) {
102:       setProgress((prev) => prev.filter((p) => p.chapter_label !== chapterLabel));
103:       try {
104:         await unmarkChapter(profile.id, planDayId, chapterLabel);
105:       } catch {
106:         setProgress((prev) => [...prev, { id: "temp", profile_id: profile.id, plan_day_id: planDayId, chapter_label: chapterLabel, completed_at: new Date().toISOString() }]);
107:       }
108:     } else {
109:       setProgress((prev) => [...prev, { id: "temp", profile_id: profile.id, plan_day_id: planDayId, chapter_label: chapterLabel, completed_at: new Date().toISOString() }]);
110:       try {
111:         await markChapterComplete(profile.id, planDayId, chapterLabel);
112:       } catch {
113:         setProgress((prev) => prev.filter((p) => p.chapter_label !== chapterLabel));
114:       }
115:     }
116:   };
117: 
118:   if (loading) {
119:     return (
120:       <div className="px-5 pt-6 pb-24 space-y-4">
121:         <Skeleton className="h-28 w-full" />
122:         <Skeleton className="h-6 w-32" />
123:         <Skeleton className="h-20 w-full" />
124:         <Skeleton className="h-20 w-full" />
125:         <Skeleton className="h-32 w-full" />
126:       </div>
127:     );
128:   }
129: 
130:   if (error) {
131:     return <ErrorState message={error} onRetry={load} />;
132:   }
133: 
134:   if (todayGroups.length === 0) {
135:     return (
136:       <div className="px-5 pt-16 pb-24 text-center">
137:         <Calendar className="w-12 h-12 text-gold-400/40 mx-auto mb-4" />
138:         <h2 className="text-lg font-serif text-ink-100 mb-2">No Reading Today</h2>
139:         <p className="text-sm text-ink-400">Enjoy a rest day or catch up on missed readings.</p>
140:       </div>
141:     );
142:   }
143: 
144:   const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";
145:   const todayDateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
146: 
147:   return (
148:     <div className="px-5 pt-6 pb-24 space-y-5 animate-fade-in">
149:       {/* Header */}
150:       <div className="flex items-start justify-between">
151:         <div>
152:           <p className="text-xs text-ink-400 mb-1">{todayDateStr}</p>
153:           <h1 className="text-2xl font-serif font-semibold text-ink-100">
154:             {greeting}, {profile.first_name}
155:           </h1>
156:         </div>
157:         <div className="flex items-center gap-1.5 bg-ink-850 border border-gold-500/20 rounded-full px-3 py-1.5">
158:           <Flame className="w-4 h-4 text-gold-400" fill="currentColor" />
159:           <span className="text-sm font-semibold text-gold-300 tabular-nums">{profile.current_streak}</span>
160:         </div>
161:       </div>
162: 
163:       {/* Celebration banner */}
164:       {celebrating && (
165:         <div className="card-gold p-4 flex items-center gap-3 animate-scale-in">
166:           <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0">
167:             <Check className="w-5 h-5 text-gold-400" strokeWidth={3} />
168:           </div>
169:           <div>
170:             <p className="text-sm font-semibold text-gold-200">Today's reading complete!</p>
171:             <p className="text-xs text-ink-400">Your streak is now {profile.current_streak + 1} days. Keep it going!</p>
172:           </div>
173:         </div>
174:       )}
175: 
176:       {/* Today's progress card */}
177:       <div className="card-gold p-5">
178:         <div className="flex items-center gap-2 mb-3">
179:           <Sunrise className="w-4 h-4 text-gold-400" />
180:           <h2 className="text-sm font-medium text-gold-200">Today's Reading</h2>
181:           <span className="ml-auto text-xs text-ink-400">Day {currentDay} of 182</span>
182:         </div>
183:         <ProgressBar value={todayCompletedCount} max={todayTotal} showNumbers size="lg" />
184:         {allDone && !celebratingCheck(profile, today) && (
185:           <p className="text-xs text-success-500 mt-3 flex items-center gap-1.5">
186:             <Check className="w-3.5 h-3.5" /> All caught up for today. See you tomorrow!
187:           </p>
188:         )}
189:       </div>
190: 
191:       {/* Chapter cards */}
192:       <div className="space-y-3">
193:         {todayGroups.map((group) => (
194:           <ChapterGroup
195:             key={group.planDay.id}
196:             book={group.planDay.book}
197:             chapters={group.planDay.chapters}
198:             chapterLabels={group.chapterLabels}
199:             completedLabels={completedLabels}
200:             onToggle={(ch) => handleToggleChapter(group.planDay.id, ch)}
201:           />
202:         ))}
203:       </div>
204: 
205:       {/* Week Overview */}
206:       <WeekOverview
207:         weekDays={weekDays}
208:         progress={progress}
209:         currentDay={currentDay}
210:         currentWeek={currentWeek}
211:       />
212: 
213:       {/* Overall progress */}
214:       <div className="card p-5">
215:         <div className="flex items-center gap-2 mb-3">
216:           <BookOpen className="w-4 h-4 text-gold-400" />
217:           <h2 className="text-sm font-medium text-ink-200">Challenge Progress</h2>
218:         </div>
219:         <ProgressBar value={currentDay} max={182} showNumbers size="md" />
220:         <div className="flex items-center justify-between mt-3 text-xs text-ink-400">
221:           <span>Week {currentWeek} of 26</span>
222:           <span>{Math.round((currentDay / 182) * 100)}% complete</span>
223:         </div>
224:       </div>
225:     </div>
226:   );
227: }
228: 
229: function celebratingCheck(profile: { last_read_date: string | null }, today: Date) {
230:   return profile.last_read_date === today.toISOString().split("T")[0];
231: }
232: 
233: interface ChapterGroupProps {
234:   book: string;
235:   chapters: string;
236:   chapterLabels: string[];
237:   completedLabels: Set<string>;
238:   onToggle: (chapterLabel: string) => void;
239: }
240: 
241: function ChapterGroup({ book, chapters, chapterLabels, completedLabels, onToggle }: ChapterGroupProps) {
242:   return (
243:     <div className="card p-4 animate-slide-up">
244:       <div className="flex items-center justify-between mb-3">
245:         <div>
246:           <h3 className="text-base font-serif font-semibold text-ink-100">{book}</h3>
247:           <p className="text-xs text-ink-400">Chapters {chapters}</p>
248:         </div>
249:         <BookOpen className="w-5 h-5 text-ink-600" />
250:       </div>
251:       <div className="space-y-2">
252:         {chapterLabels.map((label) => {
253:           const done = completedLabels.has(label);
254:           const chapterNum = label.split(" ").pop();
255:           return (
256:             <button
257:               key={label}
258:               onClick={() => onToggle(label)}
259:               className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] ${
260:                 done
261:                   ? "bg-gold-400/10 border border-gold-400/30"
262:                   : "bg-ink-800 border border-ink-700/30"
263:               }`}
264:             >
265:               <div
266:                 className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
267:                   done ? "bg-gold-400" : "bg-ink-600"
268:                 }`}
269:               >
270:                 {done && <Check className="w-3.5 h-3.5 text-ink-950 animate-check-pop" strokeWidth={3} />}
271:               </div>
272:               <span className={`text-sm font-medium ${done ? "text-gold-200" : "text-ink-300"}`}>
273:                 {book} {chapterNum}
274:               </span>
275:               <ChevronRight className={`w-4 h-4 ml-auto ${done ? "text-gold-400/40" : "text-ink-600"}`} />
276:             </button>
277:           );
278:         })}
279:       </div>
280:     </div>
281:   );
282: }
283: 
284: interface WeekOverviewProps {
285:   weekDays: ReadingPlanDay[];
286:   progress: ReadingProgressEntry[];
287:   currentDay: number;
288:   currentWeek: number;
289: }
290: 
291: function WeekOverview({ weekDays, progress, currentDay, currentWeek }: WeekOverviewProps) {
292:   const progressByDay = new Map<string, Set<string>>();
293:   for (const p of progress) {
294:     if (!progressByDay.has(p.plan_day_id)) {
295:       progressByDay.set(p.plan_day_id, new Set());
296:     }
297:     progressByDay.get(p.plan_day_id)!.add(p.chapter_label);
298:   }
299: 
300:   const daysInWeek = [...new Set(weekDays.map((d) => d.day_number))].sort((a, b) => a - b);
301: 
302:   return (
303:     <div className="card p-4">
304:       <div className="flex items-center gap-2 mb-3">
305:         <Calendar className="w-4 h-4 text-gold-400" />
306:         <h2 className="text-sm font-medium text-ink-200">Week {currentWeek} Overview</h2>
307:       </div>
308:       <div className="space-y-2">
309:         {daysInWeek.map((dayNum) => {
310:           const dayEntries = weekDays.filter((d) => d.day_number === dayNum);
311:           const allLabels = dayEntries.flatMap((d) => getChapterLabels(d.book, d.chapters));
312:           const completedCount = dayEntries.reduce((acc, d) => {
313:             const prog = progressByDay.get(d.id);
314:             if (!prog) return acc;
315:             const labels = getChapterLabels(d.book, d.chapters);
316:             return acc + labels.filter((l) => prog.has(l)).length;
317:           }, 0);
318:           const total = allLabels.length;
319:           const isComplete = completedCount === total && total > 0;
320:           const isToday = dayNum === currentDay;
321:           const isPast = dayNum < currentDay;
322:           const bookNames = dayEntries.map((d) => d.book).join(", ");
323: 
324:           return (
325:             <div
326:               key={dayNum}
327:               className={`flex items-center gap-3 p-2.5 rounded-lg ${
328:                 isToday ? "bg-gold-400/5 border border-gold-400/20" : ""
329:               }`}
330:             >
331:               <div
332:                 className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${
333:                   isComplete
334:                     ? "bg-gold-400/20"
335:                     : isToday
336:                     ? "bg-ink-700"
337:                     : "bg-ink-800"
338:                 }`}
339:               >
340:                 {isComplete ? (
341:                   <Check className="w-4 h-4 text-gold-400" strokeWidth={3} />
342:                 ) : (
343:                   <span className={`text-xs font-semibold ${isToday ? "text-gold-400" : "text-ink-400"}`}>
344:                     {dayNum}
345:                   </span>
346:                 )}
347:               </div>
348:               <div className="flex-1 min-w-0">
349:                 <p className={`text-xs font-medium truncate ${isToday ? "text-gold-200" : "text-ink-300"}`}>
350:                   {bookNames}
351:                 </p>
352:                 <div className="flex items-center gap-2 mt-0.5">
353:                   <div className="flex-1">
354:                     <ProgressBar value={completedCount} max={total} size="sm" />
355:                   </div>
356:                   <span className="text-[10px] text-ink-500 tabular-nums">
357:                     {completedCount}/{total}
358:                   </span>
359:                 </div>
360:               </div>
361:               {isPast && !isComplete && (
362:                 <span className="text-[10px] text-ember-500 font-medium">behind</span>
363:               )}
364:             </div>
365:           );
366:         })}
367:       </div>
368:     </div>
369:   );
370: }
371: 
The above content shows the entire, complete file contents of the requested file.
