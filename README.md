# BasicsInternational — STAR System

A mobile-first frontend for BASICS International (Chorkor, Accra) staff to record student STAR
behavior scores, replacing the paper tracking sheet.

Each weekday, staff score every student **+1 / 0 / -1** across 6 categories: Attendance,
Punctuality, Neatness, Conduct, Washroom, Food. Scores tally into a weekly total, combined with
spelling test/bonus stars, minus stars redeemed, to produce a running balance carried forward
week to week for the semester.

This is currently a **frontend-only prototype**: data is stored in the browser's `localStorage`
(no backend/auth/sync yet).

## Stack

Vite + React + TypeScript + Tailwind CSS.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # eslint
```

## Structure

- `src/types.ts` — data model (students, categories, scores, weekly extras)
- `src/lib/dates.ts` — week/date helpers (Monday-anchored weeks, matching the paper sheet)
- `src/lib/scoring.ts` — score lookups and weekly total / balance calculations
- `src/lib/storage.ts` — `localStorage`-backed state hook
- `src/components/ScoreToggle.tsx` — the −1/0/+1 tap control
- `src/views/TodayEntry.tsx` — daily score entry (default view)
- `src/views/WeekSummary.tsx` — weekly grid with totals, spelling stars, balance
- `src/views/Students.tsx` — roster management
