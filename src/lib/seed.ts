import type { Student, DailyScores, WeeklyExtras, Score } from '../types';
import { toIsoDate, fromIsoDate, weekStart, weekdayDates, addWeeks } from './dates';

const SEED_KEY = 'star.seeded';
const SEED_VERSION = 'v1';

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  // xorshift32
  return function () {
    h ^= h << 13;
    h ^= h >> 17;
    h ^= h << 5;
    return (h >>> 0) / 0xffffffff;
  };
}

const CLASS4_NAMES = [
  'Nii Ankrah', 'Akweley Quaye', 'Tawiah Sowah', 'Adzoa Kotey', 'Nartey Laryea',
  'Dedei Tagoe', 'Okoe Martey', 'Korkor Nortey', 'Tetteh Lamptey', 'Ayorkor Narh',
  'Boye Amartey', 'Adoley Aryee', 'Ofoe Nettey', 'Mansa Afotey', 'Naa Djanie',
];

const CLASS5_NAMES = [
  'Kojo Asante', 'Abena Mensah', 'Kofi Boateng', 'Ama Owusu', 'Kweku Amponsah',
  'Akosua Frimpong', 'Yaw Osei', 'Adwoa Amoah', 'Kwame Appiah', 'Efua Darko',
  'Fiifi Antwi', 'Afia Acheampong', 'Kobby Yeboah', 'Maame Serwaa', 'Nana Agyei',
];

const CLASS6_NAMES = [
  'Elikem Tetteh', 'Sena Agbenyega', 'Kafui Kuma', 'Delali Denu', 'Yayra Amediku',
  'Selorm Adzika', 'Xoese Agbemava', 'Dzifa Dordunoo', 'Akpe Ativor', 'Kekeli Agorsor',
  'Togbe Agama', 'Seyram Nyavor', 'Esinam Bediako', 'Kwami Abla', 'Afua Amegashie',
];

export const SEED_STUDENTS: Student[] = [
  ...CLASS4_NAMES.map((name, i) => ({ id: `c4-${i + 1}`, name, classYear: 4 as const })),
  ...CLASS5_NAMES.map((name, i) => ({ id: `c5-${i + 1}`, name, classYear: 5 as const })),
  ...CLASS6_NAMES.map((name, i) => ({ id: `c6-${i + 1}`, name, classYear: 6 as const })),
];

// Students at index 2, 7, 12 in each class are "chronic" (70% attendance)
const CHRONIC_INDICES = new Set([2, 7, 12]);

function isChronic(studentId: string): boolean {
  const idx = parseInt(studentId.split('-')[1], 10) - 1;
  return CHRONIC_INDICES.has(idx);
}

function allWeekdaysBetween(startIso: string, endIso: string): string[] {
  const dates: string[] = [];
  let current = fromIsoDate(startIso);
  const end = fromIsoDate(endIso);
  while (current <= end) {
    const day = current.getDay();
    if (day >= 1 && day <= 5) dates.push(toIsoDate(current));
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }
  return dates;
}

function allWeekStartsBetween(startIso: string, endIso: string): string[] {
  const seen = new Set<string>();
  for (const date of allWeekdaysBetween(startIso, endIso)) {
    seen.add(weekStart(fromIsoDate(date)));
  }
  return [...seen].sort();
}

export function seedDemoData(): void {
  if (localStorage.getItem(SEED_KEY) === SEED_VERSION) return;

  const START = '2026-04-01';
  const END = '2026-06-30';

  const daily: DailyScores = {};
  const weeklyExtras: WeeklyExtras = {};

  const allDates = allWeekdaysBetween(START, END);
  const allWeeks = allWeekStartsBetween(START, END);

  for (const student of SEED_STUDENTS) {
    const attendanceRate = isChronic(student.id) ? 0.7 : 0.9;

    for (const date of allDates) {
      const rng = seededRandom(`${student.id}|${date}`);
      const present = rng() < attendanceRate;
      const attendance: Score = present ? 1 : 0;
      daily[`${student.id}__${date}__attendance`] = attendance;

      if (present) {
        // earn categories
        for (const cat of ['punctuality', 'neatness', 'conduct'] as const) {
          const r = rng();
          let score: Score = 0;
          if (r < 0.1) score = -1;
          else if (r > 0.8) score = 1;
          daily[`${student.id}__${date}__${cat}`] = score;
        }
        // spend categories
        for (const cat of ['washroom', 'food'] as const) {
          daily[`${student.id}__${date}__${cat}`] = rng() < 0.12 ? -1 : 0;
        }
      } else {
        for (const cat of ['punctuality', 'neatness', 'conduct', 'washroom', 'food']) {
          daily[`${student.id}__${date}__${cat}`] = 0;
        }
      }
    }

    for (const weekIso of allWeeks) {
      const rng = seededRandom(`${student.id}|week|${weekIso}`);
      const spellingStar = Math.floor(rng() * 4);
      const spellingBonus = rng() < 0.3 ? Math.floor(rng() * 2) + 1 : 0;
      const starsUsed = Math.floor(rng() * 4);
      weeklyExtras[`${student.id}__${weekIso}`] = { spellingStar, spellingBonus, starsUsed };
    }
  }

  localStorage.setItem('star.students', JSON.stringify(SEED_STUDENTS));
  localStorage.setItem('star.daily', JSON.stringify(daily));
  localStorage.setItem('star.weeklyExtras', JSON.stringify(weeklyExtras));
  localStorage.setItem(SEED_KEY, SEED_VERSION);
}
