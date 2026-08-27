'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import {
  ShieldAlert,
  Activity,
  Download,
  Upload,
  RefreshCw,
  Search,
  Users,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
} from 'lucide-react';

export function AuditBackupView() {
  const {
    currentUser,
    users,
    activityLogs,
    backups,
    zayavkas,
    techReports,
    ummZayavkas,
    pmuZayavkas,
    nakladnoys,
    stocks,
    createManualBackup,
    restoreFromBackupJson,
    resetToDefaults,
  } = useStroy();

  const [activeTab, setActiveTab] = useState<'logs' | 'backup' | 'roles'>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('all');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrg === 'all' || log.org === selectedOrg;
    return matchesSearch && matchesOrg;
  });

  const handleExportBackup = () => {
    const backupRecord = createManualBackup();
    const payload = {
      backupRecord,
      zayavkas,
      techReports,
      ummZayavkas,
      pmuZayavkas,
      nakladnoys,
      stocks,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stroy_manager_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const ok = restoreFromBackupJson(json);
        if (ok) {
          alert('Тизим маълумотлари муваффақиятли тикланди!');
        } else {
          alert('Захира файли нотўғри форматда!');
        }
      } catch (err) {
        alert('Захира файли нотўғри форматда!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-orange-500" />
            Аудит, Хавфсизлик ва Захиралаш (Backup)
          </h2>
          <p className="text-xs font-medium text-gray-400 mt-1">
            Тизимдаги барча амаллар журнали, 24-соатлик автоматик захиралаш, маҳаллий IndexedDB синхронизацияси ва 14 та роль назорати
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-download-backup-json"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
          >
            <Download className="h-4 w-4" />
            JSON Захира нусха олиш
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'logs' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Activity className="h-4 w-4" />
          1. Тизим Аудит Журнали ({activityLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'backup' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Server className="h-4 w-4" />
          2. Захира нусха & Базани тиклаш
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'roles' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          3. 14 та Роль ва Вазифалар харитаси
        </button>
      </div>

      {/* TAB 1: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-800 bg-[#161920] p-4 shadow-sm">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Ходим, амал ёки тавсиф бўйича қидириш..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-[#0F1115] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="rounded-lg border border-gray-800 bg-[#0F1115] px-3 py-2 text-xs font-bold text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="all">Барча бошқармалар</option>
              <option value="РМУ">РМУ</option>
              <option value="СМУ">СМУ</option>
              <option value="СУ">СУ</option>
              <option value="ПМУ">ПМУ</option>
              <option value="УММ">УММ</option>
              <option value="СО">СО</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0F1115] border-b border-gray-800 font-black uppercase tracking-wider text-[11px] text-gray-400">
                <tr>
                  <th className="p-3.5">Вақт</th>
                  <th className="p-3.5">Ходим / Бошқарма</th>
                  <th className="p-3.5">Ҳаракат тури</th>
                  <th className="p-3.5">Батафсил тавсиф</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{log.userName}</div>
                      <span className="rounded border border-gray-700 bg-gray-800 px-1.5 py-0.2 text-[10px] font-bold text-gray-300">
                        {log.org}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono rounded border border-gray-700 bg-[#0F1115] px-2 py-0.5 text-[10px] font-bold text-orange-400">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-300 leading-relaxed font-medium">
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-800 bg-[#161920] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-orange-500" />
              1. Тўлиқ Захира олиш (Export JSON)
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Барча заявкалар, техник ҳисоботлар (М-29), омбор қолдиқлари, юк хатлари, УММ ва ПМУ маълумотлари тўлиқ JSON файл сифатида сақланади.
            </p>
            <button
              onClick={handleExportBackup}
              className="rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
            >
              Захира нусхани юклаб олиш (.json)
            </button>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161920] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-emerald-500" />
              2. Захирадан тиклаш (Import JSON)
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Аввал сақланган `.json` захира файлини танлаб, тизим ҳолатини қайта тиклашингиз мумкин.
            </p>
            <label className="inline-block cursor-pointer rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-500 shadow-md">
              <span>Захира файлини танлаш</span>
              <input type="file" accept=".json" onChange={handleBackupUpload} className="hidden" />
            </label>
          </div>

          <div className="md:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-black uppercase tracking-tight text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              3. Тизимни дастлабки 2026-йил ҳолатига қайтариш (Factory Reset)
            </h3>
            <p className="text-xs text-gray-300">
              Барча яратилган тест маълумотларини тозалаб, фақатгина расмий бошланғич база маълумотларини қайта юклайди.
            </p>
            <button
              onClick={() => {
                if (confirm('Ҳақиқатан ҳам тизимни дастлабки ҳолатга қайтармоқчимисиз? Барча янги тест ёзувлари ўчади.')) {
                  resetToDefaults();
                }
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500 shadow-md"
            >
              Дастлабки ҳолатга қайтариш
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ROLES MATRIX */}
      {activeTab === 'roles' && (
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0F1115] border-b border-gray-800 font-black uppercase tracking-wider text-[11px] text-gray-400">
              <tr>
                <th className="p-3.5">Роль коди</th>
                <th className="p-3.5">Лавозим ва Вазифа</th>
                <th className="p-3.5">Бошқармаси</th>
                <th className="p-3.5">Тест логини</th>
                <th className="p-3.5">Асосий ваколатлари</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-mono font-bold text-orange-400">{u.role}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{u.roleTitleUz}</div>
                    <div className="text-[11px] text-gray-400">{u.fullName}</div>
                  </td>
                  <td className="p-3.5 font-bold text-gray-200">{u.org}</td>
                  <td className="p-3.5 font-mono text-gray-400 bg-[#0F1115]">{u.login}</td>
                  <td className="p-3.5 text-gray-300">
                    {u.role === 'prorab' && 'Заявка яратиш (#34 тўғрилаш), М-29 топшириш, УММ/ПМУ заказ бериш, Накладной олиш/жўнатиш'}
                    {u.role === 'glinj_upr' && 'Бошқарма заявкаларини таҳрирлаш/тасдиқлаш, М-29 Провести қилиш, УММ имзолаш'}
                    {u.role === 'nach_upr' && 'Бошқарма бошлиғи: Заявка, М-29, УММ, ПМУ тасдиқлаш, Счёт-фактураларни кўриш'}
                    {u.role === 'pto_upr' && 'М-29 ҳисоботда 1-устун «Фактически»ни текшириш (Заявкаларни кўрмайди)'}
                    {u.role === 'buh_upr' && 'М-29 ҳисоботда 2-устун «Списание»ни киритиш, 1C фактураларни импорт қилиш'}
                    {u.role === 'snab' && 'Бошқарма таъминотчиси / Экспедитор: Материалларни етказиб бериш, юк хатлари'}
                    {u.role === 'snab_so' && 'Таъминот СО: Заявкага шартнома рақами, санаси ва электрон ҳисоб-фактурани бириктириб якунлаш'}
                    {u.role === 'pto_so' && 'Бош ПТО: Заявкаларни позиция-бай (✓/✗) текшириш, миқдорни тўғрилаш'}
                    {u.role === 'glinj_so' && 'Бош муҳандис СО: Заявка ва ПМУ ни якуний тасдиқлаш, УММ га техника ва ҳайдовчи бириктириш'}
                    {u.role === 'buh_so' && 'Бош бухгалтер СО: Компания бўйича молиявий ва счёт-фактура назорати'}
                    {u.role === 'glsklad' && 'Марказий омбор мудири: Кирим/чиқим юк хатлари, қолдиқларни назорат қилиш'}
                    {u.role === 'sklad' && 'Бошқарма омборчиси: Маҳаллий омбор кирим/чиқим назорати'}
                    {u.role === 'dispatcher_umm' && 'УММ Диспетчери: Бириктирилган техникаларни қабул қилиш ва рейсларни назорат қилиш'}
                    {u.role === 'konstruktor' && 'ПМУ Конструктори: Тайёр маҳсулотлар (Изделия) учун юк хатлари чиқариш'}
                    {u.role === 'dispatcher' && 'ПМУ Диспетчери: Конструкциялар заявкасини ишлаб чиқаришга қабул қилиш'}
                    {u.role === 'admin' && 'Барча бошқармалар ва барча ҳужжатлар устидан тўлиқ бошқарув ҳуқуқи'}
                    {u.role === 'ruk' && 'Раҳбарият: Барча бошқармалар кўрсаткичлари ва ҳисоботларини кўриш'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
