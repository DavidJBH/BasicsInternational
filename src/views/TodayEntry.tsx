import { CATEGORIES, SCORE_OPTIONS, type DailyScores, type Student } from '../types';
import { ScoreToggle } from '../components/ScoreToggle';
import { getScore, setScore, dayTotal } from '../lib/scoring';
import { formatDayLabel } from '../lib/dates';

const earnCats = CATEGORIES.filter((c) => c.mode === 'earn');
const spendCats = CATEGORIES.filter((c) => c.mode === 'spend');

function AttendanceSummary({
  students,
  daily,
  date,
}: {
  students: Student[];
  daily: DailyScores;
  date: string;
}) {
  if (students.length === 0) return null;

  const total = students.length;
  const present = students.filter((s) => getScore(daily, s.id, date, 'attendance') === 1).length;
  const absent = total - present;

  const size = 88;
  const strokeWidth = 13;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const presentDash = (present / total) * circumference;

  return (
    <div className="border border-gray-200 rounded-xl p-3 shadow-sm mb-4 flex items-center gap-4">
      {/* Donut chart */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Absent background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#fca5a5"
            strokeWidth={strokeWidth}
          />
          {/* Present foreground arc */}
          {present > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="#22c55e"
              strokeWidth={strokeWidth}
              strokeDasharray={`${presentDash} ${circumference}`}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold leading-none text-green-700">{present}</span>
          <span className="text-[10px] text-gray-400 leading-tight">of {total}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-700 mb-2">Daily Attendance</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
            <span className="text-sm text-gray-600 flex-1">Present</span>
            <span className="text-sm font-semibold text-gray-900">{present}/{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
            <span className="text-sm text-gray-600 flex-1">Absent</span>
            <span className="text-sm font-semibold text-gray-900">{absent}/{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TodayEntry({
  students,
  daily,
  setDaily,
  date,
  setDate,
}: {
  students: Student[];
  daily: DailyScores;
  setDaily: (next: DailyScores) => void;
  date: string;
  setDate: (date: string) => void;
}) {
  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <label className="block mb-1 text-sm font-medium text-gray-600">Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-1 text-base"
      />
      <p className="text-sm text-gray-500 mb-4">{formatDayLabel(date)}</p>

      <AttendanceSummary students={students} daily={daily} date={date} />

      {students.length === 0 && (
        <p className="text-gray-500 text-center mt-12">
          No students yet — add some in the Students tab.
        </p>
      )}

      <div className="space-y-3">
        {students.map((student) => {
          const isPresent = getScore(daily, student.id, date, 'attendance') === 1;
          return (
            <div key={student.id} className="border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <span className="text-sm text-gray-500">
                  Day total:{' '}
                  <span className="font-medium text-gray-700">{dayTotal(daily, student.id, date)}</span>
                </span>
              </div>

              {/* Attendance — full-width, always active */}
              <ScoreToggle
                value={getScore(daily, student.id, date, 'attendance')}
                onChange={(value) => setDaily(setScore(daily, student.id, date, 'attendance', value))}
                options={SCORE_OPTIONS.attendance}
                className="w-full"
              />

              {/* Points section — locked when absent */}
              <div className={`mt-3 ${!isPresent ? 'opacity-30 pointer-events-none' : ''}`}>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Points</p>
                <div className="space-y-2">
                  {earnCats.map((cat) => (
                    <div key={cat.key} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-sm text-gray-600">{cat.label}</span>
                      <ScoreToggle
                        value={getScore(daily, student.id, date, cat.key)}
                        onChange={(value) => setDaily(setScore(daily, student.id, date, cat.key, value))}
                        options={SCORE_OPTIONS.earn}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Spending section — locked when absent */}
              <div className={`mt-3 ${!isPresent ? 'opacity-30 pointer-events-none' : ''}`}>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Spending</p>
                <div className="space-y-2">
                  {spendCats.map((cat) => (
                    <div key={cat.key} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-sm text-gray-600">{cat.label}</span>
                      <ScoreToggle
                        value={getScore(daily, student.id, date, cat.key)}
                        onChange={(value) => setDaily(setScore(daily, student.id, date, cat.key, value))}
                        options={SCORE_OPTIONS.spend}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
