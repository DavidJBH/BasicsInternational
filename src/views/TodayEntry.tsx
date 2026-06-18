import { CATEGORIES, type DailyScores, type Student } from '../types';
import { ScoreToggle } from '../components/ScoreToggle';
import { getScore, setScore, dayTotal } from '../lib/scoring';
import { formatDayLabel } from '../lib/dates';

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

      {students.length === 0 && (
        <p className="text-gray-500 text-center mt-12">
          No students yet — add some in the Students tab.
        </p>
      )}

      <div className="space-y-3">
        {students.map((student) => (
          <div key={student.id} className="border border-gray-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{student.name}</h3>
              <span className="text-sm text-gray-500">
                Day total: <span className="font-medium text-gray-700">{dayTotal(daily, student.id, date)}</span>
              </span>
            </div>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-gray-600">{cat.label}</span>
                  <ScoreToggle
                    value={getScore(daily, student.id, date, cat.key)}
                    onChange={(value) => setDaily(setScore(daily, student.id, date, cat.key, value))}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
