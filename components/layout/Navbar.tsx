'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import {
  Building2,
  UserCheck,
  Shield,
  Bell,
  HardHat,
  ChevronDown,
  RefreshCw,
  LogOut,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Sun,
  Moon,
} from 'lucide-react';

export function Navbar() {
  const { currentUser, users, loginAs, logout, zayavkas, canApproveZayavka, theme, toggleTheme } = useStroy();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Count pending approvals for current user
  const pendingApprovalsCount = zayavkas.filter((z) => canApproveZayavka(z)).length;

  const orgColors: Record<string, string> = {
    РМУ: 'bg-blue-600 text-white',
    СМУ: 'bg-emerald-600 text-white',
    СУ: 'bg-amber-600 text-white',
    ПМУ: 'bg-purple-600 text-white',
    УММ: 'bg-orange-600 text-white',
    СО: 'bg-slate-800 text-white',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-800 bg-black px-4 sm:px-6 text-white">
      {/* Brand & Org Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded bg-orange-500 text-black font-black shadow-md shadow-orange-500/20">
          <HardHat className="h-6 w-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black uppercase tracking-tighter text-orange-500">
              СТРОЙ<span className="text-white">МЕНЕДЖЕР</span>
            </h1>
            <span className="hidden rounded bg-gray-900 border border-gray-800 px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest text-gray-400 sm:inline-block">
              VER. 2026.05
            </span>
          </div>
          <p className="hidden text-[11px] font-bold uppercase tracking-wider text-gray-500 md:block">
            Қурилишни бошқариш ва таъминот бошқарув тизими
          </p>
        </div>
      </div>

      {/* Center Org Banner */}
      <div className="hidden lg:flex items-center gap-2 rounded border border-gray-800 bg-gray-900/60 px-3 py-1.5 text-xs font-mono">
        <Building2 className="h-3.5 w-3.5 text-orange-500" />
        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Бошқарма:</span>
        <span className={`rounded px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider ${orgColors[currentUser.org] || 'bg-gray-800 text-white'}`}>
          {currentUser.org === 'СО' ? 'СО (БОШ ОФИС)' : currentUser.org}
        </span>
        <span className="text-[10px] text-green-500 font-bold tracking-widest ml-1">● SYNCED</span>
      </div>

      {/* Right Controls: Notifications, Theme Switcher, Role Switcher Demo, User profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle (Kun / Tun) */}
        <button
          id="btn-toggle-theme"
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 rounded border border-gray-800 bg-gray-900 px-2.5 py-1.5 text-xs font-bold text-gray-300 transition hover:border-orange-500 hover:text-white"
          title={theme === 'dark' ? 'Кун (Light) режимига ўтиш' : 'Тун (Dark) режимига ўтиш'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline font-mono text-[11px] font-bold">Кун</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-blue-400" />
              <span className="hidden sm:inline font-mono text-[11px] font-bold">Тун</span>
            </>
          )}
        </button>

        {/* Pending approvals badge */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotif(!showNotif)}
            className="relative flex h-9 w-9 items-center justify-center rounded border border-gray-800 bg-gray-900 text-gray-300 transition hover:bg-gray-800 hover:text-white"
            title="Билдиришномалар ва кутилаётган тасдиқлар"
          >
            <Bell className="h-4 w-4" />
            {pendingApprovalsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-black animate-pulse">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 rounded border border-gray-800 bg-[#12151B] p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-gray-300">Тасдиқ кутилаётганлар</span>
                <span className="rounded bg-orange-500/20 border border-orange-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-orange-400">
                  {pendingApprovalsCount} ТА
                </span>
              </div>
              <div className="mt-2 max-h-64 space-y-2 overflow-y-auto text-xs font-mono">
                {pendingApprovalsCount === 0 ? (
                  <div className="py-4 text-center text-gray-500 font-sans">
                    <CheckCircle2 className="mx-auto h-6 w-6 text-green-500 mb-1" />
                    Тасдиқ кутилаётган ҳужжатлар йўқ
                  </div>
                ) : (
                  zayavkas
                    .filter((z) => canApproveZayavka(z))
                    .map((z) => (
                      <div key={z.id} className="rounded border border-gray-800 bg-black/60 p-2.5 text-gray-300 hover:border-orange-500/50 transition">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-orange-500">{z.number}</span>
                          <span className="text-[10px] text-gray-500">{z.createdAt}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-400 line-clamp-1 font-sans">{z.objName}</p>
                        <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-gray-400">
                          <span>{z.positions.length} ТА ПОЗИЦИЯ</span>
                          <span className="uppercase text-orange-400 border border-orange-500/40 px-1 py-0.5 rounded">{z.status}</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Role Switcher (Essential for testing all 14 roles) */}
        <div className="relative">
          <button
            id="btn-role-switcher-dropdown"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 rounded border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-300 transition hover:border-orange-500 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <span className="hidden sm:inline font-bold uppercase text-[10px] tracking-wider text-gray-400">Роль:</span>
            <span className="font-black text-orange-500 font-mono">{currentUser.role}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-96 max-h-[75vh] overflow-y-auto rounded border border-gray-800 bg-[#12151B] p-2.5 shadow-2xl z-50">
              <div className="px-2 py-1.5 border-b border-gray-800 mb-2">
                <p className="text-xs font-black uppercase tracking-wider text-white">Ролни алмаштириш (14 та роль)</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">
                  Танланган роль бўйича ҳуқуқлар автоматик мослашади
                </p>
              </div>

              <div className="space-y-1">
                {users.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      id={`btn-select-user-${u.login}`}
                      onClick={() => {
                        loginAs(u.id);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between rounded p-2 text-left text-xs transition ${
                        isSelected ? 'bg-orange-500 text-black font-black' : 'hover:bg-gray-800/80 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                            isSelected ? 'bg-black text-orange-400' : 'bg-gray-800 text-gray-300'
                          }`}
                        >
                          {u.org}
                        </span>
                        <div>
                          <div className="font-bold leading-tight">{u.fullName}</div>
                          <div className={`text-[10px] font-sans ${isSelected ? 'text-black/80 font-semibold' : 'text-gray-500'}`}>
                            {u.roleTitleUz}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider ${
                          isSelected ? 'bg-black/30 text-black border border-black/40' : 'border border-gray-700 bg-black/40 text-gray-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Current User Badge & Logout Button */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2.5 rounded border border-gray-800 bg-gray-900/60 p-1.5 pr-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-xs font-black font-mono text-orange-400 border border-gray-700">
              {currentUser.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left leading-none">
              <p className="text-xs font-bold text-white line-clamp-1">{currentUser.fullName.split(' ')[0]}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mt-0.5">{currentUser.roleTitleUz}</p>
            </div>
          </div>

          <button
            id="btn-navbar-logout"
            onClick={logout}
            className="flex items-center gap-1.5 rounded border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition"
            title="Тизимдан чиқиш ва логин ойнасига қайтиш"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline font-bold uppercase tracking-wider text-[10px]">Чиқиш</span>
          </button>
        </div>
      </div>
    </header>
  );
}
