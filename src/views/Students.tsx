import { useState } from 'react';
import { Star } from 'lucide-react';
import type { DailyScores, Student, WeeklyExtras } from '../types';
import { balanceAsOf } from '../lib/scoring';
import { weekStart } from '../lib/dates';

const currentWeek = weekStart(new Date());

export function Students({
  students,
  setStudents,
  daily,
  weeklyExtras,
}: {
  students: Student[];
  setStudents: (next: Student[]) => void;
  daily: DailyScores;
  weeklyExtras: WeeklyExtras;
}) {
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  function resetAllData() {
    localStorage.clear();
    window.location.reload();
  }

  function addStudent() {
    const name = newName.trim();
    if (!name) return;
    const openingBalance = newBalance !== '' ? Number(newBalance) : undefined;
    setStudents([...students, { id: crypto.randomUUID(), name, openingBalance }]);
    setNewName('');
    setNewBalance('');
  }

  function removeStudent(id: string) {
    setStudents(students.filter((s) => s.id !== id));
  }

  function startEdit(student: Student) {
    setEditingId(student.id);
    setEditingName(student.name);
  }

  function saveEdit() {
    const name = editingName.trim();
    if (name && editingId) {
      setStudents(students.map((s) => (s.id === editingId ? { ...s, name } : s)));
    }
    setEditingId(null);
  }

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Students</h2>

      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addStudent()}
          placeholder="Student name"
          className="border border-gray-300 rounded-lg px-3 py-2 text-base"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={newBalance}
            onChange={(e) => setNewBalance(e.target.value)}
            placeholder="Opening balance (optional)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base"
          />
          <button
            type="button"
            onClick={addStudent}
            className="px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold active:scale-95 shrink-0"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {students.map((student) => {
          const balance = balanceAsOf(daily, weeklyExtras, student.id, currentWeek) + (student.openingBalance ?? 0);
          return (
            <div
              key={student.id}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5"
            >
              {editingId === student.id ? (
                <input
                  type="text"
                  value={editingName}
                  autoFocus
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  onBlur={saveEdit}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 mr-1"
                />
              ) : (
                <span className="flex-1 text-gray-900" onClick={() => startEdit(student)}>
                  {student.name}
                </span>
              )}
              <span
                className={`text-sm font-semibold tabular-nums px-2 py-0.5 rounded-full ${
                  balance > 0
                    ? 'bg-brand-100 text-brand-700'
                    : balance < 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {balance > 0 ? '+' : ''}{balance} <Star size={12} className="inline-block mb-0.5" />
              </span>
              <button
                type="button"
                onClick={() => removeStudent(student.id)}
                className="text-red-500 text-sm font-medium px-2 py-1 active:scale-95"
              >
                Remove
              </button>
            </div>
          );
        })}
        {students.length === 0 && (
          <p className="text-gray-500 text-center mt-8">No students yet — add one above.</p>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        {confirmReset ? (
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-red-600">This will erase all students and scores. Are you sure?</p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={resetAllData}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold active:scale-95"
              >
                Yes, reset everything
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="w-full py-2 rounded-lg border border-red-300 text-red-500 text-sm font-medium active:scale-95"
          >
            Reset all data
          </button>
        )}
      </div>
    </div>
  );
}
