export type Category =
  | 'attendance'
  | 'punctuality'
  | 'neatness'
  | 'conduct'
  | 'washroom'
  | 'food';

export type CategoryMode = 'attendance' | 'earn' | 'spend';

export const CATEGORIES: { key: Category; label: string; mode: CategoryMode }[] = [
  { key: 'attendance', label: 'Attendance', mode: 'attendance' },
  { key: 'punctuality', label: 'Punctuality', mode: 'earn' },
  { key: 'neatness', label: 'Neatness', mode: 'earn' },
  { key: 'conduct', label: 'Conduct', mode: 'earn' },
  { key: 'washroom', label: 'Washroom', mode: 'spend' },
  { key: 'food', label: 'Food', mode: 'spend' },
];

export type Score = -1 | 0 | 1;

export const SCORE_OPTIONS: Record<CategoryMode, { value: Score; label: string }[]> = {
  attendance: [
    { value: 0, label: 'Absent' },
    { value: 1, label: 'Present' },
  ],
  earn: [
    { value: -1, label: '−1' },
    { value: 0, label: '0' },
    { value: 1, label: '+1' },
  ],
  spend: [
    { value: 0, label: 'No' },
    { value: -1, label: 'Spent' },
  ],
};

export interface Student {
  id: string;
  name: string;
  openingBalance?: number;
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
