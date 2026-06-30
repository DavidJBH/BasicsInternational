import { useState } from 'react';
import logoUrl from '../assets/logo.png';

interface Props {
  onLogin: (username: string, password: string) => boolean;
}

export function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = onLogin(username.trim(), password);
    if (!ok) setError(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img src={logoUrl} alt="BASICS International" className="h-16 w-16 rounded-xl object-cover mb-3" />
          <h1 className="text-xl font-bold text-gray-900">STAR System</h1>
          <p className="text-sm text-gray-500">BASICS International</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(false); }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">Invalid username or password</p>
          )}

          <button
            type="submit"
            className="bg-brand-600 text-white font-semibold rounded-lg py-2.5 text-sm mt-1 hover:bg-brand-700 active:bg-brand-800 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
