'use client';

import React, { useState } from 'react';
import { StroyProvider, useStroy } from '@/context/StroyContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar, ActiveTab } from '@/components/layout/Sidebar';
import { DashboardView } from '@/components/views/DashboardView';
import { ZayavkaView } from '@/components/views/ZayavkaView';
import { TechReportView } from '@/components/views/TechReportView';
import { UmmView } from '@/components/views/UmmView';
import { PmuView } from '@/components/views/PmuView';
import { NakladnoyView } from '@/components/views/NakladnoyView';
import { SfsoAccountsView } from '@/components/views/SfsoAccountsView';
import { StocksView } from '@/components/views/StocksView';
import { MasterDataView } from '@/components/views/MasterDataView';
import { AuditBackupView } from '@/components/views/AuditBackupView';
import { LoginView } from '@/components/views/LoginView';
import { Menu, X, HardHat } from 'lucide-react';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, isHydrated, theme } = useStroy();

  // Until hydrated, render a consistent skeleton shell
  if (!isHydrated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-[#F1F5F9] text-gray-900' : 'bg-[#0F1115] text-white'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">
            СТРОЙМЕНЕДЖЕР 2026 юкланмоқда...
          </span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the Login and Password authentication screen
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // If PTO_UPR is active and activeTab is 'zayavka', render 'tech_report' (per rule: PTO_UPR doesn't view zayavkas)
  const currentTab: ActiveTab = currentUser.role === 'pto_upr' && activeTab === 'zayavka' ? 'tech_report' : activeTab;

  return (
    <div
      data-theme={theme}
      className={`min-h-screen font-sans flex flex-col selection:bg-orange-500 selection:text-black ${
        theme === 'light' ? 'theme-light bg-[#F1F5F9] text-slate-900' : 'theme-dark bg-[#0F1115] text-white'
      }`}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* Mobile Drawer Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-black px-4 py-2.5 md:hidden">
        <button
          id="btn-toggle-mobile-sidebar"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 rounded border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span className="font-bold uppercase tracking-wider text-[11px]">Меню</span>
        </button>
        <span className="text-xs font-mono font-bold text-orange-500 uppercase">
          {currentUser.roleTitleUz} ({currentUser.org})
        </span>
      </div>

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar activeTab={currentTab} setActiveTab={setActiveTab} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className="relative z-50 w-72 bg-black shadow-2xl border-r border-gray-800">
              <Sidebar
                activeTab={currentTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Center Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
          {currentTab === 'zayavka' && <ZayavkaView />}
          {currentTab === 'tech_report' && <TechReportView />}
          {currentTab === 'umm' && <UmmView />}
          {currentTab === 'pmu' && <PmuView />}
          {currentTab === 'nakladnoy' && <NakladnoyView />}
          {currentTab === 'sfso_accounts' && <SfsoAccountsView />}
          {currentTab === 'stocks' && <StocksView />}
          {currentTab === 'master_data' && <MasterDataView />}
          {currentTab === 'audit_backup' && <AuditBackupView />}
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <StroyProvider>
      <MainAppContent />
    </StroyProvider>
  );
}
