'use client';

import React from 'react';
import { useStroy } from '@/context/StroyContext';
import { ActiveTab } from '@/components/layout/Sidebar';
import {
  ShoppingCart,
  FileSpreadsheet,
  Truck,
  Boxes,
  FileText,
  Warehouse,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Layers,
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export function DashboardView({ setActiveTab }: DashboardViewProps) {
  const {
    currentUser,
    zayavkas,
    filteredZayavkas,
    techReports,
    filteredTechReports,
    ummZayavkas,
    pmuZayavkas,
    nakladnoys,
    stocks,
    activityLogs,
    canApproveZayavka,
  } = useStroy();

  // Statistics
  const totalZayavkas = filteredZayavkas.length;
  const inWorkZayavkas = filteredZayavkas.filter((z) => ['glinj_upr', 'pto_so', 'glinj_so', 'snab_so'].includes(z.status)).length;
  const completedZayavkas = filteredZayavkas.filter((z) => z.status === 'completed').length;
  const rejectedZayavkas = filteredZayavkas.filter((z) => z.status === 'rejected').length;

  const pendingMyAction = filteredZayavkas.filter((z) => canApproveZayavka(z));

  // Org activity breakdown
  const orgCounts = ['РМУ', 'СМУ', 'СУ', 'ПМУ', 'УММ'].map((org) => ({
    org,
    count: zayavkas.filter((z) => z.org === org).length,
    inWork: zayavkas.filter((z) => z.org === org && z.status !== 'completed' && z.status !== 'rejected').length,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded border border-gray-800 bg-black p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-mono font-black uppercase text-orange-400 border border-orange-500/30">
                {currentUser.org} — {currentUser.roleTitleUz}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">«СТРОЙМЕНЕДЖЕР» 2026</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
              Хуш келибсиз, <span className="text-orange-500">{currentUser.fullName}</span>
            </h2>
            <p className="mt-1 text-xs text-gray-400 max-w-2xl font-sans">
              2026-йилги янгиланган регламент: моддий заявкалар, М-29 техник ҳисоботлар, УММ ва ПМУ оқимлари ягона бошқарувда.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser.role === 'prorab' && (
              <button
                id="btn-dash-create-zayavka"
                onClick={() => setActiveTab('zayavka')}
                className="flex items-center gap-2 rounded bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-orange-400 shadow-md shadow-orange-500/10"
              >
                <ShoppingCart className="h-4 w-4" />
                Янги заявка яратиш
              </button>
            )}
            <button
              id="btn-dash-view-stocks"
              onClick={() => setActiveTab('stocks')}
              className="flex items-center gap-2 rounded border border-gray-800 bg-gray-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-200 transition hover:bg-gray-800 hover:text-white"
            >
              <Warehouse className="h-4 w-4 text-orange-500" />
              Омбор қолдиқлари
            </button>
          </div>
        </div>
      </div>

      {/* Action Required Banner if user has pending tasks */}
      {pendingMyAction.length > 0 && (
        <div className="rounded border border-orange-500/40 bg-orange-500/10 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-orange-500 text-black font-black">
                <AlertCircle className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wide text-orange-400">
                  Тасдиғингизни кутаётган {pendingMyAction.length} та ҳужжат мавжуд
                </h4>
                <p className="text-xs text-gray-300">
                  Қурилиш тўхтаб қолмаслиги учун моддий заявкаларни ўз вақтида кўриб чиқинг ва тасдиқланг.
                </p>
              </div>
            </div>
            <button
              id="btn-dash-review-pending"
              onClick={() => setActiveTab('zayavka')}
              className="rounded bg-orange-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-orange-400"
            >
              Кўриб чиқиш
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => setActiveTab('zayavka')}
          className="cursor-pointer rounded border border-gray-800 bg-black p-5 shadow-xs transition hover:border-orange-500/60 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Жами заявкалар</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-900 text-orange-400 border border-gray-800">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">{totalZayavkas}</span>
            <span className="text-[10px] font-mono font-bold uppercase text-gray-500">дона</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-2 text-[10px] font-mono">
            <span className="text-orange-400 font-bold uppercase">{inWorkZayavkas} КЎРИЛМОҚДА</span>
            <span className="text-green-400 font-bold uppercase">{completedZayavkas} ЯКУНЛАНГАН</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('tech_report')}
          className="cursor-pointer rounded border border-gray-800 bg-black p-5 shadow-xs transition hover:border-orange-500/60 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Техник ҳисобот (М-29)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-900 text-green-400 border border-gray-800">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">{filteredTechReports.length}</span>
            <span className="text-[10px] font-mono font-bold uppercase text-gray-500">ойлик</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-2 text-[10px] font-mono">
            <span className="text-gray-400">ТАЙЁР: {filteredTechReports.filter((t) => t.status === 'listed').length}</span>
            <span className="text-orange-400 font-bold uppercase">ЖАРАЁНДА</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('umm')}
          className="cursor-pointer rounded border border-gray-800 bg-black p-5 shadow-xs transition hover:border-orange-500/60 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">УММ техникаси</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-900 text-orange-400 border border-gray-800">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">{ummZayavkas.length}</span>
            <span className="text-[10px] font-mono font-bold uppercase text-gray-500">заказ</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-2 text-[10px] font-mono">
            <span className="text-green-400 font-bold uppercase">{ummZayavkas.filter((u) => u.status === 'accepted').length} АЖРАТИЛГАН</span>
            <span className="text-gray-500 uppercase">ДИСПЕТЧЕР</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('pmu')}
          className="cursor-pointer rounded border border-gray-800 bg-black p-5 shadow-xs transition hover:border-orange-500/60 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">ПМУ Конструкциялар</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-900 text-purple-400 border border-gray-800">
              <Boxes className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">{pmuZayavkas.length}</span>
            <span className="text-[10px] font-mono font-bold uppercase text-gray-500">буюртма</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-2 text-[10px] font-mono">
            <span className="text-purple-400 font-bold uppercase">ЧИЗМА БИЛАН</span>
            <span className="text-green-400 font-bold uppercase">{pmuZayavkas.filter((p) => p.status === 'done').length} ТАЙЁР</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Workflow Status Pipeline & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: 2026 Process Pipeline Map */}
        <div className="lg:col-span-2 rounded border border-gray-800 bg-black p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-white">
                2026-йилги янгиланган ҳужжатлар айланиш схемаси
              </h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Ортиқча босқичлар олиб ташланган — қатъий ва соддалаштирилган регламент
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {/* Zayavka Flow Diagram */}
            <div className="rounded border border-gray-800 bg-gray-900/40 p-4">
              <span className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5 font-mono">
                <ShoppingCart className="h-3.5 w-3.5" />
                1. МОДДИЙ ЗАЯВКАЛАР ОҚИМИ (ZAYAVKA MTR):
              </span>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="rounded border border-gray-800 bg-black p-2.5 text-center">
                  <div className="font-black text-white">1. ПРОРАБ</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Яратади (#34 тўғрилаш)</div>
                </div>
                <div className="rounded border border-gray-800 bg-black p-2.5 text-center">
                  <div className="font-black text-white">2. ГЛ.ИНЖ / НАЧ</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Таҳрир + Тасдиқ</div>
                </div>
                <div className="rounded border border-gray-800 bg-black p-2.5 text-center">
                  <div className="font-black text-orange-400">3. БОШ ПТО (СО)</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Позиция-бай ✓/✗</div>
                </div>
                <div className="rounded border border-gray-800 bg-black p-2.5 text-center">
                  <div className="font-black text-green-400">4. ГЛ.ИНЖ СО ➔ СНАБ</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Шартнома + Счёт-фактура</div>
                </div>
              </div>
            </div>

            {/* Tech Report Flow */}
            <div className="rounded border border-gray-800 bg-gray-900/40 p-4">
              <span className="text-xs font-black uppercase tracking-wider text-green-400 flex items-center gap-1.5 font-mono">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                2. ОЙЛИК ТЕХНИК ҲИСОБОТ (М-29 СПИСАНИЕ):
              </span>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="rounded border border-gray-800 bg-black p-2.5 text-center">
                  <div className="font-black text-white">ПРОРАБ</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Excel / Топширади</div>
                </div>
                <div className="rounded border border-gray-800 bg-black p-2.5 text-center">
                  <div className="font-black text-white">ПТО УПР</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Фактически текширади</div>
                </div>
                <div className="rounded border border-gray-800 bg-black p-2.5 text-center">
                  <div className="font-black text-white">БУХГАЛТЕР УПР</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Списание киритади</div>
                </div>
                <div className="rounded border border-green-500/40 bg-green-500/10 p-2.5 text-center">
                  <div className="font-black text-green-400">ГЛ.ИНЖ УПР</div>
                  <div className="text-[10px] text-green-300 mt-0.5">Провести қилади</div>
                </div>
              </div>
            </div>

            {/* Organizations Distribution */}
            <div className="pt-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Бошқармалар бўйича фаоллик тақсимоти:</h4>
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                {orgCounts.map((item) => (
                  <div key={item.org} className="rounded border border-gray-800 bg-black p-2">
                    <div className="font-black text-white">{item.org}</div>
                    <div className="text-sm font-black text-orange-400 mt-0.5">{item.count} ТА</div>
                    <div className="text-[10px] text-gray-500 uppercase">{item.inWork} ЖАРАЁНДА</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Activity Stream */}
        <div className="rounded border border-gray-800 bg-black p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />
              Аудит ҳаракатлари
            </h3>
            <button
              onClick={() => setActiveTab('audit_backup')}
              className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 hover:underline"
            >
              Батафсил ➔
            </button>
          </div>

          <div className="mt-4 space-y-3 font-mono">
            {activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="rounded border border-gray-800 bg-gray-900/40 p-3 text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-300">
                  <span className="text-white">{log.userName}</span>
                  <span className="text-[10px] text-gray-500">{log.timestamp.slice(11, 16)}</span>
                </div>
                <p className="mt-1 text-gray-400 leading-relaxed text-[11px] font-sans">{log.description}</p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500">
                  <span className="font-black uppercase text-orange-400">{log.org}</span>
                  <span className="font-mono uppercase">{log.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
