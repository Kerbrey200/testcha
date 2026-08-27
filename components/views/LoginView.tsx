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
  Zap,
  Users,
} from 'lucide-react';

export function LoginView() {
  const { users, loginWithCredentials, loginAs, theme, toggleTheme } = useStroy();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'so' | 'upr' | 'umm_pmu'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!login.trim()) {
      setError('Илтимос, логинингизни киритинг ёки қуйидаги тугмалардан бирини босинг!');
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

  // 1-Click Fast Instant Login Handler
  const handleQuickLogin = (userId: string) => {
    loginAs(userId);
  };

  const filteredUsers = users.filter((u) => {
    if (activeTab === 'so') return u.org === 'СО';
    if (activeTab === 'upr') return u.org === 'РМУ' || u.org === 'СМУ' || u.org === 'СУ';
    if (activeTab === 'umm_pmu') return u.org === 'УММ' || u.org === 'ПМУ';
    return true;
  });

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
            <span className="font-bold uppercase tracking-wider text-[11px]">18 та роль (Тезкор кириш)</span>
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

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 1-Click Fast Login Grid (All Users) */}
          <div className={`lg:col-span-7 rounded-2xl border p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-colors order-2 lg:order-1 ${
            theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#15181E] border-gray-800 text-white'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-500 mb-1.5">
                  <Zap className="h-3 w-3 fill-current" />
                  1-кликда кириш
                </div>
                <h3 className={`text-lg font-black uppercase tracking-tight flex items-center gap-2 ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  <Users className="h-5 w-5 text-orange-500" />
                  Барча фойдаланувчилар
                </h3>
                <p className={`text-xs mt-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                  Исталган профилни босиб, дарҳол 1 та кликда тизимга киринг
                </p>
              </div>

              {/* Filter Tabs */}
              <div className={`flex items-center gap-1 p-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${
                theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#0E1014] border-gray-800'
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-2 py-1 rounded transition ${activeTab === 'all' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:text-orange-500'}`}
                >
                  Ҳаммаси ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('so')}
                  className={`px-2 py-1 rounded transition ${activeTab === 'so' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:text-orange-500'}`}
                >
                  СО (Бош офис)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upr')}
                  className={`px-2 py-1 rounded transition ${activeTab === 'upr' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:text-orange-500'}`}
                >
                  Бошқармалар
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('umm_pmu')}
                  className={`px-2 py-1 rounded transition ${activeTab === 'umm_pmu' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:text-orange-500'}`}
                >
                  УММ / ПМУ
                </button>
              </div>
            </div>

            {/* 1-Click User Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.id)}
                  className={`text-left rounded-xl border p-3 transition flex items-center justify-between group hover:border-orange-500 hover:shadow-md ${
                    theme === 'light'
                      ? 'border-slate-200 bg-slate-50 hover:bg-orange-50/50'
                      : 'border-gray-800 bg-[#0E1014] hover:bg-orange-950/20'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`rounded border px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                        theme === 'light' ? 'bg-white border-slate-300 text-slate-700' : 'bg-gray-800 border-gray-700 text-gray-300'
                      }`}>
                        {u.org}
                      </span>
                      <span className={`font-bold text-xs truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        {u.fullName}
                      </span>
                    </div>
                    <div className="text-[11px] text-orange-500 font-bold font-sans truncate">
                      {u.roleTitleUz}
                    </div>
                    <div className={`text-[10px] font-mono mt-0.5 ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}`}>
                      login: <strong className={theme === 'light' ? 'text-slate-600' : 'text-gray-400'}>{u.login}</strong>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-center h-8 px-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition font-black text-[10px] uppercase tracking-wider">
                    Кириш ⚡
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Standard Login Form */}
          <div className={`lg:col-span-5 rounded-2xl border p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-colors order-1 lg:order-2 ${
            theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#15181E] border-gray-800 text-white'
          }`}>
            <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 rounded border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-500 mb-2">
                <KeyRound className="h-3 w-3" />
                Қўлда кириш
              </div>
              <h2 className={`text-xl font-black uppercase tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                Логин ва Пароль
              </h2>
              <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                Шахсий логин ва махфий паролингиз орқали киринг
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-500 font-bold">
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
                    placeholder="Масалан: admin, prorab_rmu"
                    autoComplete="username"
                    className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none font-mono transition-colors ${
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
                    placeholder="Парол (тест: 123456)"
                    autoComplete="current-password"
                    className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-xs focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none font-mono transition-colors ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        : 'bg-[#0E1014] border-gray-800 text-white placeholder-gray-600'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 transition"
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition shadow-lg shadow-orange-500/25 mt-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Текширилмоқда...' : 'Тизимга Кириш'}</span>
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </button>
            </form>

            <div className={`mt-5 pt-3 border-t text-center text-[10px] font-mono ${
              theme === 'light' ? 'border-slate-100 text-slate-500' : 'border-gray-800 text-gray-500'
            }`}>
              Синов пароли: <span className="text-orange-500 font-bold">123456</span>
            </div>
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
