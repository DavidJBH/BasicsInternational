import { useState } from 'react';
import { type Session, SESSION_KEY, CREDENTIALS } from './types';

export function useSession() {
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  });

  function login(username: string, password: string): boolean {
    const entry = CREDENTIALS[username];
    if (!entry || entry.password !== password) return false;
    localStorage.setItem(SESSION_KEY, JSON.stringify(entry.session));
    setSession(entry.session);
    return true;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  return { session, login, logout };
}
