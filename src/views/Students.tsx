import { useState } from 'react';
import type { Student } from '../types';

export function Students({
  students,
  setStudents,
}: {
  students: Student[];
  setStudents: (next: Student[]) => void;
}) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  function addStudent() {
    const name = newName.trim();
    if (!name) return;
    setStudents([...students, { id: crypto.randomUUID(), name }]);
    setNewName('');
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

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addStudent()}
          placeholder="Add student name"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base"
        />
        <button
          type="button"
          onClick={addStudent}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold active:scale-95"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2"
          >
            {editingId === student.id ? (
              <input
                type="text"
                value={editingName}
                autoFocus
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                onBlur={saveEdit}
                className="flex-1 border border-gray-300 rounded px-2 py-1 mr-2"
              />
            ) : (
              <span className="text-gray-900" onClick={() => startEdit(student)}>
                {student.name}
              </span>
            )}
            <button
              type="button"
              onClick={() => removeStudent(student.id)}
              className="text-red-500 text-sm font-medium px-2 py-1 active:scale-95"
            >
              Remove
            </button>
          </div>
        ))}
        {students.length === 0 && (
          <p className="text-gray-500 text-center mt-8">No students yet — add one above.</p>
        )}
      </div>
    </div>
  );
}
