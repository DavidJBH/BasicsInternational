import { CATEGORIES, type Category, type DailyScores, type Score, type WeeklyExtra, type WeeklyExtras, EMPTY_WEEKLY_EXTRA } from '../types';
import { weekStart, weekdayDates, fromIsoDate } from './dates';

function dailyKey(studentId: string, date: string, category: Category): string {
  return `${studentId}__${date}__${category}`;
}

function weeklyKey(studentId: string, weekStartIso: string): string {
  return `${studentId}__${weekStartIso}`;
}

export function getScore(daily: DailyScores, studentId: string, date: string, category: Category): Score {
  return daily[dailyKey(studentId, date, category)] ?? 0;
}

export function setScore(
  daily: DailyScores,
  studentId: string,
  date: string,
  category: Category,
  value: Score,
): DailyScores {
  return { ...daily, [dailyKey(studentId, date, category)]: value };
}

export function dayTotal(daily: DailyScores, studentId: string, date: string): number {
  return CATEGORIES.reduce((sum, c) => sum + getScore(daily, studentId, date, c.key), 0);
}

export function weekTotal(daily: DailyScores, studentId: string, weekStartIso: string): number {
  return weekdayDates(weekStartIso).reduce((sum, date) => sum + dayTotal(daily, studentId, date), 0);
}

export function getWeeklyExtra(weeklyExtras: WeeklyExtras, studentId: string, weekStartIso: string): WeeklyExtra {
  return weeklyExtras[weeklyKey(studentId, weekStartIso)] ?? EMPTY_WEEKLY_EXTRA;
}

export function setWeeklyExtra(
  weeklyExtras: WeeklyExtras,
  studentId: string,
  weekStartIso: string,
  patch: Partial<WeeklyExtra>,
): WeeklyExtras {
  const current = getWeeklyExtra(weeklyExtras, studentId, weekStartIso);
  return { ...weeklyExtras, [weeklyKey(studentId, weekStartIso)]: { ...current, ...patch } };
}

export function totalEarned(weekTotalValue: number, extra: WeeklyExtra): number {
  return weekTotalValue + extra.spellingStar + extra.spellingBonus;
}

function netForWeek(daily: DailyScores, weeklyExtras: WeeklyExtras, studentId: string, weekStartIso: string): number {
  const wt = weekTotal(daily, studentId, weekStartIso);
  const extra = getWeeklyExtra(weeklyExtras, studentId, weekStartIso);
  return totalEarned(wt, extra) - extra.starsUsed;
}

/** All week-start dates (ISO) that have any recorded data for this student. */
function knownWeeksForStudent(daily: DailyScores, weeklyExtras: WeeklyExtras, studentId: string): string[] {
  const weeks = new Set<string>();
  const prefix = `${studentId}__`;
  for (const key of Object.keys(daily)) {
    if (!key.startsWith(prefix)) continue;
    const rest = key.slice(prefix.length);
    const date = rest.split('__')[0];
    weeks.add(weekStart(fromIsoDate(date)));
  }
  for (const key of Object.keys(weeklyExtras)) {
    if (!key.startsWith(prefix)) continue;
    weeks.add(key.slice(prefix.length));
  }
  return Array.from(weeks).sort();
}

/** Running balance for a student as of (and including) `weekStartIso`. */
export function balanceAsOf(
  daily: DailyScores,
  weeklyExtras: WeeklyExtras,
  studentId: string,
  weekStartIso: string,
): number {
  const weeks = knownWeeksForStudent(daily, weeklyExtras, studentId);
  const relevant = new Set(weeks.filter((w) => w <= weekStartIso));
  relevant.add(weekStartIso);
  return Array.from(relevant)
    .sort()
    .reduce((sum, w) => sum + netForWeek(daily, weeklyExtras, studentId, w), 0);
}
