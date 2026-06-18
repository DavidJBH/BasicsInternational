const DAY_MS = 24 * 60 * 60 * 1000;

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Monday of the week containing `date`, as an ISO date string. */
export function weekStart(date: Date): string {
  const day = date.getDay(); // 0=Sun..6=Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date.getTime() + diffToMonday * DAY_MS);
  return toIsoDate(monday);
}

export const WEEKDAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

/** The 5 weekday ISO dates (Mon-Fri) for the week starting at `weekStartIso`. */
export function weekdayDates(weekStartIso: string): string[] {
  const monday = fromIsoDate(weekStartIso);
  return WEEKDAY_LABELS.map((_, i) => toIsoDate(new Date(monday.getTime() + i * DAY_MS)));
}

export function addWeeks(weekStartIso: string, count: number): string {
  const monday = fromIsoDate(weekStartIso);
  return toIsoDate(new Date(monday.getTime() + count * 7 * DAY_MS));
}

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

export function formatShort(iso: string): string {
  const date = fromIsoDate(iso);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatDayLabel(iso: string): string {
  const date = fromIsoDate(iso);
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}
