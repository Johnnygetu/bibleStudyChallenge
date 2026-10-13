// The dashboard's "On Track" / "Falling Behind" cards and the Progress page's
// filter tabs must agree, so the split lives here instead of a magic number
// being repeated in each place. A reader stays on track until they fall more
// than this many days behind the plan's schedule.
export const ON_TRACK_MAX_MISSED_DAYS = 2;

export function isOnTrack(daysMissed) {
  return daysMissed <= ON_TRACK_MAX_MISSED_DAYS;
}

export function isFallingBehind(daysMissed) {
  return daysMissed > ON_TRACK_MAX_MISSED_DAYS;
}
