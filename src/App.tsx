import { useState } from 'react';
import { Sun, CalendarDays, Users, type LucideIcon } from 'lucide-react';
import type { DailyScores, Student, WeeklyExtras } from './types';
import { useLocalStorageState } from './lib/storage';
import { toIsoDate, weekStart } from './lib/dates';
import { TodayEntry } from './views/TodayEntry';
import { WeekSummary } from './views/WeekSummary';
import { Students } from './views/Students';

const SEED_NAMES = [
  'Kwame Mensah', 'Abena Asante', 'Kofi Boateng', 'Akua Owusu', 'Yaw Osei',
  'Adjoa Frimpong', 'Kwabena Antwi', 'Akosua Nyarko', 'Kojo Darko', 'Adwoa Amponsah',
  'Kwesi Acheampong', 'Ama Amoah', 'Kweku Tetteh', 'Abena Asare', 'Kofi Appiah',
];

const SEED_STUDENTS: Student[] = SEED_NAMES.map((name, i) => ({
  id: `student-${i + 1}`,
  name,
}));

type Tab = 'today' | 'week' | 'students';

const TABS: { key: Tab; label: string; Icon: LucideIcon }[] = [
  { key: 'today', label: 'Today', Icon: Sun },
  { key: 'week', label: 'Week', Icon: CalendarDays },
  { key: 'students', label: 'Students', Icon: Users },
];

function App() {
  const [tab, setTab] = useState<Tab>('today');
  const [students, setStudents] = useLocalStorageState<Student[]>('star.students', SEED_STUDENTS);
  const [daily, setDaily] = useLocalStorageState<DailyScores>('star.daily', {});
  const [weeklyExtras, setWeeklyExtras] = useLocalStorageState<WeeklyExtras>('star.weeklyExtras', {});

  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [weekStartIso, setWeekStartIso] = useState(() => weekStart(new Date()));

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 px-4 py-3 bg-white sticky top-0 z-20 flex items-center gap-3">
        <img src="/logo.jpeg" alt="BASICS International" className="h-10 w-10 rounded-lg object-cover shrink-0" />
        <div>
          <h1 className="text-base font-bold text-gray-900">STAR System</h1>
          <p className="text-xs text-gray-500">BASICS International</p>
        </div>
      </header>

      <main className="flex-1">
        {tab === 'today' && (
          <TodayEntry students={students} daily={daily} setDaily={setDaily} date={date} setDate={setDate} />
        )}
        {tab === 'week' && (
          <WeekSummary
            students={students}
            daily={daily}
            weeklyExtras={weeklyExtras}
            setWeeklyExtras={setWeeklyExtras}
            weekStartIso={weekStartIso}
            setWeekStartIso={setWeekStartIso}
          />
        )}
        {tab === 'students' && (
          <Students
            students={students}
            setStudents={setStudents}
            daily={daily}
            weeklyExtras={weeklyExtras}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-30">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium ${
              tab === t.key ? 'text-brand-600' : 'text-gray-400'
            }`}
          >
            <t.Icon size={20} />
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
