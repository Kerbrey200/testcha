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
  Building2,
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export function LoginView() {
  const { users, loginWithCredentials, loginAs } = useStroy();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'so' | 'upr' | 'umm_pmu'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!login.trim()) {
      setError('Илтимос, логинингизни киритинг!');
      return;
    }
    if (!password) {
      setError('Илтимос, махфий калит / паролни киритинг!');
      return;
    }

    const res = loginWithCredentials(login, password);
    if (!res.success) {
      setError(res.message || 'Логин ёки пароль нотўғри!');
    }
  };

  const handleQuickSelect = (userLogin: string) => {
    setLogin(userLogin);
    setPassword(userLogin === 'admin' ? 'admin123' : '123456');
    setError(null);
  };

  const handleInstantLogin = (userId: string) => {
    loginAs(userId);
  };

  const filteredUsers = users.filter((u) => {
    if (activeCategory === 'so') return u.org === 'СО';
    if (activeCategory === 'upr') return u.org === 'РМУ' || u.org === 'СМУ' || u.org === 'СУ';
    if (activeCategory === 'umm_pmu') return u.org === 'УММ' || u.org === 'ПМУ';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex flex-col justify-between selection:bg-orange-500 selection:text-black">
      {/* Top Bar */}
      <div className="border-b border-gray-800 bg-black/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-orange-500 text-black font-black shadow-md shadow-orange-500/20">
            <HardHat className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black uppercase tracking-tighter text-orange-500">
                СТРОЙ<span className="text-white">МЕНЕДЖЕР</span>
              </h1>
              <span className="rounded bg-gray-900 border border-gray-800 px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest text-gray-400">
                VER. 2026.05
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Қурилишни бошқариш ва таъминот бошқарув тизими
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="font-bold uppercase tracking-wider text-[11px]">Ҳимояланган тизим (14 та роль)</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Login Form */}
          <div className="lg:col-span-5 rounded-2xl border border-gray-800 bg-[#161920] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-orange-400 mb-3">
                <KeyRound className="h-3 w-3" />
                Хизматга кириш
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Тизимга Кириш
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Шахсий логин ва махфий калитингиз орқали ўз иш фаолиятингизга киринг
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400 font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1.5">
                  Фойдаланувчи Логини:
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input
                    id="input-login"
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Масалан: prorab_rmu ёки admin"
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1.5">
                  Махфий Пароль:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Паролни киритинг (Синов: 123456)"
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] pl-9 pr-10 py-2.5 text-xs text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-800 bg-[#0F1115] text-orange-500 focus:ring-0"
                  />
                  <span className="font-bold text-[11px]">Мени эслаб қол</span>
                </label>
                <span className="text-[11px] text-gray-500 font-mono">Пароль: 123456</span>
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 mt-2"
              >
                <span>Тизимга Кириш</span>
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-800 text-[11px] text-gray-500 flex items-center justify-between">
              <span>Синов пароли: <strong className="text-orange-400 font-mono">123456</strong></span>
              <span>Администратор: <strong className="text-orange-400 font-mono">admin123</strong></span>
            </div>
          </div>

          {/* Right Column: Fast Role Selection Grid (Essential for 14 Roles Testing) */}
          <div className="lg:col-span-7 rounded-2xl border border-gray-800 bg-[#161920] p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  Тезкор Синов учун 14 та Роль Профили
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Исталган ролни 1 та босиш билан тўлдириб синаб кўришингиз мумкин
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#0F1115] p-1 rounded-lg border border-gray-800 text-[10px] font-black uppercase tracking-wider">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-2.5 py-1 rounded transition ${activeCategory === 'all' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  Барчаси ({users.length})
                </button>
                <button
                  onClick={() => setActiveCategory('so')}
                  className={`px-2.5 py-1 rounded transition ${activeCategory === 'so' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  СО (Бош офис)
                </button>
                <button
                  onClick={() => setActiveCategory('upr')}
                  className={`px-2.5 py-1 rounded transition ${activeCategory === 'upr' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  РМУ/СМУ/СУ
                </button>
                <button
                  onClick={() => setActiveCategory('umm_pmu')}
                  className={`px-2.5 py-1 rounded transition ${activeCategory === 'umm_pmu' ? 'bg-orange-500 text-white font-black' : 'text-gray-400 hover:text-white'}`}
                >
                  УММ/ПМУ
                </button>
              </div>
            </div>

            {/* Role List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredUsers.map((u) => {
                const isSelected = login === u.login;
                return (
                  <div
                    key={u.id}
                    className={`rounded-xl border p-3 transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-800 bg-[#0F1115] hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-gray-800 border border-gray-700 px-1.5 py-0.2 text-[9px] font-mono font-bold text-gray-300">
                            {u.org}
                          </span>
                          <span className="font-bold text-xs text-white truncate">{u.fullName}</span>
                        </div>
                        <p className="text-[11px] text-orange-400 font-bold mt-0.5 font-sans">
                          {u.roleTitleUz}
                        </p>
                      </div>
                      <span className="shrink-0 rounded border border-gray-700 bg-gray-800/80 px-2 py-0.5 text-[9px] font-mono font-bold text-gray-300 uppercase">
                        {u.role}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-gray-400">
                        Логин: <strong className="text-white">{u.login}</strong>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickSelect(u.login)}
                          className="rounded border border-gray-700 bg-gray-800 px-2 py-1 font-bold text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          Тўлдириш
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInstantLogin(u.id)}
                          className="rounded bg-orange-500 px-2.5 py-1 font-black uppercase text-white hover:bg-orange-600 shadow-xs"
                        >
                          Кириш →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Security Note */}
            <div className="mt-4 pt-3 border-t border-gray-800 flex items-center gap-2 text-[11px] text-gray-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                Барча 14 та роль (Прораб, Бош муҳандис, ПТО, Таъминот, Диспетчер, Омбор ва ҳ.к.) ўз ваколат доирасида ишлайди.
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-black/40 py-3 px-6 text-center text-[11px] text-gray-500 font-mono">
        © 2026 «СТРОЙМЕНЕДЖЕР» Қурилиш Корхонасининг Автоматлаштирилган Бошқарув Тизими
      </div>
    </div>
  );
}
