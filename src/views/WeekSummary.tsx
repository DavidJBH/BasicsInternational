import type { DailyScores, Student, WeeklyExtras } from '../types';
import { addWeeks, formatShort, weekdayDates, WEEKDAY_LABELS } from '../lib/dates';
import { dayTotal, weekTotal, getWeeklyExtra, setWeeklyExtra, totalEarned, balanceAsOf } from '../lib/scoring';

export function WeekSummary({
  students,
  daily,
  weeklyExtras,
  setWeeklyExtras,
  weekStartIso,
  setWeekStartIso,
}: {
  students: Student[];
  daily: DailyScores;
  weeklyExtras: WeeklyExtras;
  setWeeklyExtras: (next: WeeklyExtras) => void;
  weekStartIso: string;
  setWeekStartIso: (week: string) => void;
}) {
  const days = weekdayDates(weekStartIso);

  return (
    <div className="px-2 pt-4 pb-24">
      <div className="flex items-center justify-between max-w-lg mx-auto px-2 mb-3">
        <button
          type="button"
          onClick={() => setWeekStartIso(addWeeks(weekStartIso, -1))}
          className="h-10 w-10 rounded-lg bg-gray-100 text-gray-700 font-bold active:scale-95"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-semibold text-gray-900">Week of {formatShort(weekStartIso)}</p>
          <p className="text-xs text-gray-500">
            {formatShort(days[0])} – {formatShort(days[4])}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setWeekStartIso(addWeeks(weekStartIso, 1))}
          className="h-10 w-10 rounded-lg bg-gray-100 text-gray-700 font-bold active:scale-95"
        >
          ›
        </button>
      </div>

      {students.length === 0 && (
        <p className="text-gray-500 text-center mt-12">
          No students yet. Add some in the Students tab.
        </p>
      )}

      {students.length > 0 && (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="border-collapse text-sm min-w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="sticky left-0 bg-gray-50 z-10 px-3 py-2 text-left font-medium border-b border-gray-200">
                  Name
                </th>
                {WEEKDAY_LABELS.map((label) => (
                  <th key={label} className="px-3 py-2 font-medium border-b border-gray-200 whitespace-nowrap">
                    {label.slice(0, 3)}
                  </th>
                ))}
                <th className="px-3 py-2 font-medium border-b border-gray-200 whitespace-nowrap">Week Total</th>
                <th className="px-3 py-2 font-medium border-b border-gray-200 whitespace-nowrap">Spelling Star</th>
                <th className="px-3 py-2 font-medium border-b border-gray-200 whitespace-nowrap">Spelling Bonus</th>
                <th className="px-3 py-2 font-medium border-b border-gray-200 whitespace-nowrap">Total Earned</th>
                <th className="px-3 py-2 font-medium border-b border-gray-200 whitespace-nowrap">Stars Used</th>
                <th className="px-3 py-2 font-medium border-b border-gray-200 whitespace-nowrap">Balance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const extra = getWeeklyExtra(weeklyExtras, student.id, weekStartIso);
                const wt = weekTotal(daily, student.id, weekStartIso);
                const earned = totalEarned(wt, extra);
                const balance = balanceAsOf(daily, weeklyExtras, student.id, weekStartIso) + (student.openingBalance ?? 0);

                return (
                  <tr key={student.id} className="border-b border-gray-100">
                    <td className="sticky left-0 bg-white z-10 px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                      {student.name}
                    </td>
                    {days.map((date) => (
                      <td key={date} className="px-3 py-2 text-center text-gray-700">
                        {dayTotal(daily, student.id, date)}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center font-semibold text-gray-900">{wt}</td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={extra.spellingStar}
                        onChange={(e) =>
                          setWeeklyExtras(
                            setWeeklyExtra(weeklyExtras, student.id, weekStartIso, {
                              spellingStar: Number(e.target.value),
                            }),
                          )
                        }
                        className="w-16 border border-gray-200 rounded px-1.5 py-1 text-center"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={extra.spellingBonus}
                        onChange={(e) =>
                          setWeeklyExtras(
                            setWeeklyExtra(weeklyExtras, student.id, weekStartIso, {
                              spellingBonus: Number(e.target.value),
                            }),
                          )
                        }
                        className="w-16 border border-gray-200 rounded px-1.5 py-1 text-center"
                      />
                    </td>
                    <td className="px-3 py-2 text-center font-semibold text-gray-900">{earned}</td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={extra.starsUsed}
                        onChange={(e) =>
                          setWeeklyExtras(
                            setWeeklyExtra(weeklyExtras, student.id, weekStartIso, {
                              starsUsed: Number(e.target.value),
                            }),
                          )
                        }
                        className="w-16 border border-gray-200 rounded px-1.5 py-1 text-center"
                      />
                    </td>
                    <td className="px-3 py-2 text-center font-bold text-brand-700">{balance}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3 text-center max-w-lg mx-auto">
        Scroll sideways to see all columns. Balance carries forward automatically week to week.
      </p>
    </div>
  );
}
