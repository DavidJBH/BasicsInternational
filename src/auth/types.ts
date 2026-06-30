export type ClassYear = 4 | 5 | 6;

export interface Session {
  username: string;
  role: 'teacher' | 'principal';
  classYear: ClassYear | null;
}

export const CREDENTIALS: Record<string, { password: string; session: Session }> = {
  teacher4: { password: 'basics123', session: { username: 'teacher4', role: 'teacher', classYear: 4 } },
  teacher5: { password: 'basics123', session: { username: 'teacher5', role: 'teacher', classYear: 5 } },
  teacher6: { password: 'basics123', session: { username: 'teacher6', role: 'teacher', classYear: 6 } },
  principal: { password: 'basics123', session: { username: 'principal', role: 'principal', classYear: null } },
};

export const SESSION_KEY = 'star.session';
