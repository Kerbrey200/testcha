'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import {
  HardHat,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Sun,
  Moon,
} from 'lucide-react';

export function LoginView() {
  const { loginWithCredentials, theme, toggleTheme } = useStroy();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!login.trim()) {
      setError('Илтимос, логинингизни киритинг!');
      return;
    }
    if (!password.trim()) {
      setError('Илтимос, махфий паролингизни киритинг!');
      return;
    }

    setIsLoading(true);
    const res = loginWithCredentials(login, password);
    setIsLoading(false);

    if (!res.success) {
      setError(res.message || 'Логин ёки пароль нотўғри!');
    }
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col justify-between selection:bg-orange-500 selection:text-black transition-colors ${
        theme === 'light' ? 'theme-light bg-slate-100 text-slate-900' : 'theme-dark bg-[#0D0F12] text-white'
      }`}
    >
      {/* Top Header Bar */}
      <header className={`border-b px-6 py-4 flex items-center justify-between transition-colors ${
        theme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-black/60 border-gray-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-black font-black shadow-md shadow-orange-500/20">
            <HardHat className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black uppercase tracking-tighter text-orange-500">
                СТРОЙ<span className={theme === 'light' ? 'text-slate-900' : 'text-white'}>МЕНЕДЖЕР</span>
              </h1>
              <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest ${
                theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-gray-900 border-gray-800 text-gray-400'
              }`}>
                VER. 2026.05
              </span>
            </div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>
              Қурилишни бошқариш ва таъминот тизими
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-1.5 text-xs font-mono ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="font-bold uppercase tracking-wider text-[11px]">Ҳимояланган тизим</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            id="btn-login-theme-toggle"
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
              theme === 'light'
                ? 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-200'
                : 'border-gray-800 bg-[#161920] text-gray-300 hover:border-orange-500 hover:text-white'
            }`}
            title={theme === 'dark' ? 'Кун (Light) режимига ўтиш' : 'Тун (Dark) режимига ўтиш'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span className="font-mono text-[11px] font-bold">Кун режими</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-blue-600" />
                <span className="font-mono text-[11px] font-bold">Тун режими</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Centered Login Section */}
      <main className="max-w-md mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center">
        <div className={`rounded-2xl border p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#15181E] border-gray-800 text-white'
        }`}>
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-3 shadow-inner">
              <KeyRound className="h-6 w-6 stroke-[2.2]" />
            </div>
            <h2 className={`text-2xl font-black uppercase tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              Тизимга Кириш
            </h2>
            <p className={`text-xs mt-1.5 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
              Давом этиш учун шахсий логин ва махфий паролингизни киритинг
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-500 font-bold animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label
                htmlFor="input-login"
                className={`block font-black uppercase tracking-wider text-[11px] mb-1.5 ${
                  theme === 'light' ? 'text-slate-700' : 'text-gray-300'
                }`}
              >
                Фойдаланувчи Логини:
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  id="input-login"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Логинингизни киритинг"
                  autoComplete="username"
                  className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none font-mono transition-colors ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-[#0E1014] border-gray-800 text-white placeholder-gray-600'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="input-password"
                className={`block font-black uppercase tracking-wider text-[11px] mb-1.5 ${
                  theme === 'light' ? 'text-slate-700' : 'text-gray-300'
                }`}
              >
                Махфий Пароль:
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Паролни киритинг"
                  autoComplete="current-password"
                  className={`w-full rounded-xl border pl-10 pr-11 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none font-mono transition-colors ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-[#0E1014] border-gray-800 text-white placeholder-gray-600'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? 'Паролни яшириш' : 'Паролни кўрсатиш'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white transition shadow-lg shadow-orange-500/25 mt-3 disabled:opacity-50"
            >
              <span>{isLoading ? 'Текширилмоқда...' : 'Тизимга Кириш'}</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </button>
          </form>

          {/* Security footnote */}
          <div className={`mt-6 pt-4 border-t text-center text-[11px] font-mono ${
            theme === 'light' ? 'border-slate-100 text-slate-500' : 'border-gray-800 text-gray-500'
          }`}>
            <span>Авторизациядан ўтиш барча ҳаракатлар журналга қайд этилади</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-4 px-6 text-center text-[11px] font-mono ${
        theme === 'light' ? 'bg-white border-slate-200 text-slate-500' : 'bg-black/40 border-gray-800 text-gray-500'
      }`}>
        © 2026 «СТРОЙМЕНЕДЖЕР» Қурилиш Корхонасининг Автоматлаштирилган Бошқарув Тизими
      </footer>
    </div>
  );
}
