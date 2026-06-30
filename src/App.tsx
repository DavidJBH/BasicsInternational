import { useState } from 'react';
import { Sun, CalendarDays, Users, LogOut, type LucideIcon } from 'lucide-react';
import logoUrl from './assets/logo.png';
import type { DailyScores, Student, WeeklyExtras } from './types';
import { useLocalStorageState } from './lib/storage';
import { toIsoDate, weekStart } from './lib/dates';
import { seedDemoData, SEED_STUDENTS } from './lib/seed';
import { useSession } from './auth/useSession';
import type { ClassYear } from './auth/types';
import { LoginPage } from './views/LoginPage';
import { TodayEntry } from './views/TodayEntry';
import { WeekSummary } from './views/WeekSummary';
import { Students } from './views/Students';

// Run before useState initializers so seed data is in localStorage on first read
seedDemoData();

type Tab = 'today' | 'week' | 'students';

const TABS: { key: Tab; label: string; Icon: LucideIcon }[] = [
  { key: 'today', label: 'Today', Icon: Sun },
  { key: 'week', label: 'Week', Icon: CalendarDays },
  { key: 'students', label: 'Students', Icon: Users },
];

const CLASS_YEARS: ClassYear[] = [4, 5, 6];

function App() {
  const { session, login, logout } = useSession();

  const [tab, setTab] = useState<Tab>('today');
  const [students, setStudents] = useLocalStorageState<Student[]>('star.students', SEED_STUDENTS);
  const [daily, setDaily] = useLocalStorageState<DailyScores>('star.daily', {});
  const [weeklyExtras, setWeeklyExtras] = useLocalStorageState<WeeklyExtras>('star.weeklyExtras', {});
  const [selectedClass, setSelectedClass] = useState<ClassYear>(4);

  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [weekStartIso, setWeekStartIso] = useState(() => weekStart(new Date()));

  if (!session) {
    return <LoginPage onLogin={login} />;
  }

  const activeClassYear: ClassYear = session.role === 'principal' ? selectedClass : (session.classYear as ClassYear);
  const visibleStudents = students.filter(s => s.classYear === activeClassYear);

  function setVisibleStudents(next: Student[]) {
    setStudents([
      ...students.filter(s => s.classYear !== activeClassYear),
      ...next,
    ]);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 px-5 bg-white sticky top-0 z-20" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-3 py-3">
          <img src={logoUrl} alt="BASICS International" className="h-10 w-10 rounded-lg object-cover shrink-0" />
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">STAR System</h1>
            <p className="text-xs text-gray-500">BASICS International</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block">{session.username}</span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors no-print"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>

        {session.role === 'principal' && (
          <div className="flex gap-1 pb-2 no-print">
            {CLASS_YEARS.map(yr => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedClass(yr)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedClass === yr
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Class {yr}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {tab === 'today' && (
          <TodayEntry students={visibleStudents} daily={daily} setDaily={setDaily} date={date} setDate={setDate} />
        )}
        {tab === 'week' && (
          <WeekSummary
            students={visibleStudents}
            daily={daily}
            weeklyExtras={weeklyExtras}
            setWeeklyExtras={setWeeklyExtras}
            weekStartIso={weekStartIso}
            setWeekStartIso={setWeekStartIso}
            classYear={activeClassYear}
          />
        )}
        {tab === 'students' && (
          <Students
            students={visibleStudents}
            setStudents={setVisibleStudents}
            daily={daily}
            weeklyExtras={weeklyExtras}
            classYear={activeClassYear}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-30 no-print" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
