export type Category =
  | 'attendance'
  | 'punctuality'
  | 'neatness'
  | 'conduct'
  | 'washroom'
  | 'food';

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'attendance', label: 'Attendance' },
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'neatness', label: 'Neatness' },
  { key: 'conduct', label: 'Conduct' },
  { key: 'washroom', label: 'Washroom' },
  { key: 'food', label: 'Food' },
];

export type Score = -1 | 0 | 1;

export interface Student {
  id: string;
  name: string;
}

/** Keyed by `${studentId}__${isoDate}__${category}` */
export type DailyScores = Record<string, Score>;

export interface WeeklyExtra {
  spellingStar: number;
  spellingBonus: number;
  starsUsed: number;
}

/** Keyed by `${studentId}__${weekStartIsoDate}` */
export type WeeklyExtras = Record<string, WeeklyExtra>;

export const EMPTY_WEEKLY_EXTRA: WeeklyExtra = {
  spellingStar: 0,
  spellingBonus: 0,
  starsUsed: 0,
};
