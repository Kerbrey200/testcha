'use client';

import React from 'react';
import { useStroy } from '@/context/StroyContext';
import {
  LayoutDashboard,
  ShoppingCart,
  FileSpreadsheet,
  Truck,
  Boxes,
  FileText,
  FileCheck2,
  Warehouse,
  FolderKanban,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'zayavka'
  | 'tech_report'
  | 'umm'
  | 'pmu'
  | 'nakladnoy'
  | 'sfso_accounts'
  | 'stocks'
  | 'master_data'
  | 'audit_backup';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { currentUser, zayavkas, techReports, ummZayavkas, pmuZayavkas, nakladnoys, canApproveZayavka } = useStroy();

  // Badge counts
  const pendingZayavkaCount = zayavkas.filter((z) => canApproveZayavka(z)).length;
  const pendingTechCount = techReports.filter((tr) => {
    if (currentUser.role === 'pto_upr') return tr.status === 'pto' && tr.org === currentUser.org;
    if (currentUser.role === 'buh_upr') return tr.status === 'buh' && tr.org === currentUser.org;
    if (currentUser.role === 'glinj_upr') return tr.status === 'buh' && tr.org === currentUser.org;
    return false;
  }).length;

  const pendingUmmCount = ummZayavkas.filter((u) => {
    if ((currentUser.role === 'glinj_upr' || currentUser.role === 'nach_upr') && u.status === 'new') return true;
    if (currentUser.role === 'glinj_so' && (u.status === 'glinj_so' || u.status === 'new')) return true;
    if (currentUser.role === 'dispatcher_umm' && u.status === 'umm') return true;
    return false;
  }).length;

  const pendingPmuCount = pmuZayavkas.filter((p) => {
    if ((currentUser.role === 'glinj_upr' || currentUser.role === 'nach_upr') && p.status === 'upr') return true;
    if (currentUser.role === 'pto_so' && p.status === 'pto_so') return true;
    if (currentUser.role === 'glinj_so' && p.status === 'glinj_so') return true;
    if (currentUser.role === 'dispatcher' && p.status === 'pmu') return true;
    return false;
  }).length;

  const pendingNakCount = nakladnoys.filter(
    (n) => n.status === 'sent' && (n.toOwnerId === currentUser.id || (n.toOwnerType === 'admin' && (currentUser.role === 'admin' || currentUser.role === 'glsklad')))
  ).length;

  // Determine tab visibility by role
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      labelUz: 'Бошқарув панели',
      labelRu: 'Главная панель',
      icon: LayoutDashboard,
      show: true,
    },
    {
      id: 'zayavka' as ActiveTab,
      labelUz: 'Материал заявкаси',
      labelRu: 'Заявка на материалы',
      icon: ShoppingCart,
      badge: pendingZayavkaCount > 0 ? pendingZayavkaCount : undefined,
      // Rule: PTO_UPR does NOT see material zayavkas (they only go to PTO_SO)
      show: currentUser.role !== 'pto_upr',
    },
    {
      id: 'tech_report' as ActiveTab,
      labelUz: 'Техник ҳисобот (М-29)',
      labelRu: 'Технический отчет (М-29)',
      icon: FileSpreadsheet,
      badge: pendingTechCount > 0 ? pendingTechCount : undefined,
      show: true,
    },
    {
      id: 'umm' as ActiveTab,
      labelUz: 'УММ заявкаси (Техника)',
      labelRu: 'Заявка УММ (Механизмы)',
      icon: Truck,
      badge: pendingUmmCount > 0 ? pendingUmmCount : undefined,
      show: currentUser.role !== 'pto_upr' && currentUser.role !== 'buh_upr' && currentUser.role !== 'snab',
    },
    {
      id: 'pmu' as ActiveTab,
      labelUz: 'ПМУ заявкаси & Изделия',
      labelRu: 'Заявка ПМУ (Конструкции)',
      icon: Boxes,
      badge: pendingPmuCount > 0 ? pendingPmuCount : undefined,
      show: currentUser.role !== 'pto_upr' && currentUser.role !== 'buh_upr' && currentUser.role !== 'snab' && currentUser.role !== 'dispatcher_umm',
    },
    {
      id: 'nakladnoy' as ActiveTab,
      labelUz: 'Юк хатлари (Накладной)',
      labelRu: 'Накладные перемещения',
      icon: FileText,
      badge: pendingNakCount > 0 ? pendingNakCount : undefined,
      show: true,
    },
    {
      id: 'sfso_accounts' as ActiveTab,
      labelUz: 'СФ-СО & Ҳисоблар',
      labelRu: 'Счета-фактуры и СФ-СО',
      icon: FileCheck2,
      show: ['admin', 'pto_so', 'nach_upr', 'ruk', 'buh_upr', 'pto_upr', 'snab', 'snab_so', 'buh_so'].includes(currentUser.role),
    },
    {
      id: 'stocks' as ActiveTab,
      labelUz: 'Омборлар & Қолдиқлар',
      labelRu: 'Склады и остатки',
      icon: Warehouse,
      show: true,
    },
    {
      id: 'master_data' as ActiveTab,
      labelUz: 'Маълумотномалар',
      labelRu: 'Справочники объектов',
      icon: FolderKanban,
      show: ['admin', 'glinj_so', 'glinj_upr', 'nach_upr', 'glsklad', 'ruk'].includes(currentUser.role),
    },
    {
      id: 'audit_backup' as ActiveTab,
      labelUz: 'Аудит & Захира нусха',
      labelRu: 'Аудит и резервирование',
      icon: ShieldAlert,
      show: true,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-gray-800 bg-black min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 text-white">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
          Асосий модуллар
        </div>

        {menuItems
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex w-full items-center justify-between rounded px-3 py-2.5 text-xs transition-all ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-500 font-black border-l-2 border-orange-500 shadow-sm'
                    : 'text-gray-400 hover:bg-gray-900/80 hover:text-white font-bold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span className="text-left tracking-tight">{item.labelUz}</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  {item.badge !== undefined && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded px-1.5 text-[10px] font-black ${
                        isActive ? 'bg-orange-500 text-black' : 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-orange-500" />}
                </div>
              </button>
            );
          })}
      </div>

      {/* Footer info in sidebar */}
      <div className="mt-8 rounded border border-gray-800 bg-gray-900/40 p-3 text-xs font-mono text-gray-400">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-300">
          <span>Синхронизация</span>
          <span className="flex items-center gap-1 text-green-500 font-bold">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
            ОНЛАЙН
          </span>
        </div>
        <p className="mt-1.5 text-[10px] text-gray-500 leading-tight font-sans">
          Маълумотлар маҳаллий кеш ва тизимда тўлиқ сақланмоқда.
        </p>
      </div>
    </aside>
  );
}
