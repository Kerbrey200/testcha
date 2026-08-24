'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import { AccountInvoice, MaterialSynonymMapping } from '@/types/stroy';
import {
  FileCheck2,
  Building,
  Search,
  Upload,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Check,
} from 'lucide-react';

export function SfsoAccountsView() {
  const {
    currentUser,
    accountInvoices,
    synonymMappings,
    objects,
    materials,
    addSynonymMapping,
    addAccountInvoice,
  } = useStroy();

  const [activeTab, setActiveTab] = useState<'sfso' | 'accounts' | 'mappings'>('sfso');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedObjId, setSelectedObjId] = useState('all');

  // Mapping Form state
  const [rawAlias, setRawAlias] = useState('');
  const [canonMatId, setCanonMatId] = useState(materials[0]?.id || '');

  // Filter accounts
  const filteredAccounts = accountInvoices.filter((a) => {
    const matchesSearch =
      a.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.objName && a.objName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesObj = selectedObjId === 'all' || a.objId === selectedObjId;
    return matchesSearch && matchesObj;
  });

  return (
    <div className="space-y-6 text-white">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-orange-500" />
            СФ-СО & Ҳисоб-фактуралар ва Синонимлар
          </h2>
          <p className="text-xs font-medium text-gray-400 mt-1">
            Объектлар бўйича гуруҳланган ҳисоб-фактуралар реестри, бухгалтерия ҳисоблари ва номланиш синонимлари (Mappings)
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('sfso')}
          className={`border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'sfso' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          1. СФ-СО (Объектлар реестри) ({accountInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'accounts' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          2. Бухгалтерия Ҳисоблари (Accounts) ({accountInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('mappings')}
          className={`border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'mappings' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          3. Материал Синонимлари / Mappings ({synonymMappings.length})
        </button>
      </div>

      {/* 1. SF-SO VIEW */}
      {activeTab === 'sfso' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-800 bg-[#161920] p-4 shadow-sm">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="СФ рақами, контрагент ёки объект бўйича қидириш..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-[#0F1115] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedObjId}
              onChange={(e) => setSelectedObjId(e.target.value)}
              className="rounded-lg border border-gray-800 bg-[#0F1115] px-3 py-2 text-xs font-bold text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="all">Барча объектлар</option>
              {objects.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredAccounts.map((sf) => (
              <div key={sf.id} className="rounded-xl border border-gray-800 bg-[#161920] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-800 pb-3">
                  <div>
                    <span className="rounded border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-orange-400">
                      Ҳисоб-фактура: {sf.invoiceNumber}
                    </span>
                    <h3 className="mt-1 text-sm font-black uppercase tracking-tight text-white">{sf.objName || 'Марказий омбор'}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-300">Контрагент: {sf.supplierName}</span>
                    <div className="text-[11px] text-gray-500">Сана: {sf.invoiceDate} / {sf.org}</div>
                  </div>
                </div>

                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead>
                      <tr className="text-gray-500 text-[10px] font-black uppercase tracking-wider border-b border-gray-800">
                        <th className="py-2">Материал номи</th>
                        <th className="py-2">Бирлиги</th>
                        <th className="py-2 text-right">Миқдори</th>
                        <th className="py-2 text-right">Нархи (сўм)</th>
                        <th className="py-2 text-right">Жами сумма</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {sf.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-2 font-bold text-white">{item.rawMaterialName}</td>
                          <td className="py-2 text-gray-400">{item.unit}</td>
                          <td className="py-2 text-right font-mono font-bold text-white">{item.qty}</td>
                          <td className="py-2 text-right font-mono text-gray-400">{item.price.toLocaleString()} UZS</td>
                          <td className="py-2 text-right font-mono font-bold text-orange-400">{item.total.toLocaleString()} UZS</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ACCOUNTS VIEW */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#161920] p-4 shadow-sm">
            <span className="text-xs font-bold text-gray-400">1C / Excel файллардан импорт қилинган фактуралар</span>

            {(currentUser.role === 'buh_upr' || currentUser.role === 'admin') && (
              <button
                onClick={() => {
                  addAccountInvoice({
                    invoiceNumber: `1C-${Math.floor(Math.random() * 9000 + 1000)}`,
                    invoiceDate: '2026-08-25',
                    supplierName: '«KNAUF GIPS» МЧЖ',
                    totalSum: 9750000,
                    org: 'РМУ',
                    objId: objects[0]?.id,
                    objName: objects[0]?.name,
                    status: 'imported',
                    items: [
                      {
                        rawMaterialName: 'Гипсокартон ГКЛ 12.5мм',
                        unit: 'м2',
                        qty: 250,
                        price: 39000,
                        total: 9750000,
                      },
                    ],
                  });
                  alert('Янги фактура муваффақиятли қўшилди!');
                }}
                className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
              >
                <Upload className="h-3.5 w-3.5" />
                1C Электрон фактураларни импорт қилиш
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0F1115] border-b border-gray-800 font-black uppercase tracking-wider text-[11px] text-gray-400">
                <tr>
                  <th className="p-3">СФ Рақами</th>
                  <th className="p-3">Санаси</th>
                  <th className="p-3">Етказиб берувчи</th>
                  <th className="p-3">Материаллар сони</th>
                  <th className="p-3 text-right">Жами сумма</th>
                  <th className="p-3">Ҳолати</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {accountInvoices.map((acc) => (
                  <tr key={acc.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-mono font-bold text-white">{acc.invoiceNumber}</td>
                    <td className="p-3 text-gray-400">{acc.invoiceDate}</td>
                    <td className="p-3 font-bold text-white">{acc.supplierName}</td>
                    <td className="p-3 text-gray-300">{acc.items.length} та позиция</td>
                    <td className="p-3 text-right font-mono font-bold text-orange-400">{acc.totalSum.toLocaleString()} UZS</td>
                    <td className="p-3">
                      <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                        {acc.status === 'imported' ? 'Импорт қилинган' : 'Текширилган'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MAPPINGS VIEW */}
      {activeTab === 'mappings' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 bg-[#161920] p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              Янги материал синонимини боғлаш (Mapping)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Таъминотчилар ҳисоб-фактурада турлича ёзган материал номларини тизимдаги стандарт материал билан автоматик бирлаштириш.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!rawAlias.trim()) return;
                addSynonymMapping(rawAlias, canonMatId);
                setRawAlias('');
                alert('Янги синоним муваффақиятли сақланди!');
              }}
              className="mt-4 flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Фактурадаги номланиш: масалан «Арматура d=12мм ст3пс»..."
                  value={rawAlias}
                  onChange={(e) => setRawAlias(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-xs font-medium text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <ArrowRight className="hidden sm:block h-4 w-4 text-gray-500" />
              <div className="flex-1 w-full">
                <select
                  value={canonMatId}
                  onChange={(e) => setCanonMatId(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-xs font-bold text-white focus:border-orange-500 focus:outline-none"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.unit})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20 whitespace-nowrap"
              >
                Синонимни қўшиш
              </button>
            </form>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0F1115] border-b border-gray-800 font-black uppercase tracking-wider text-[11px] text-gray-400">
                <tr>
                  <th className="p-3">Фактурадаги ном (Raw supplier text)</th>
                  <th className="p-3">Тизимдаги расмий материал (Canonical Name)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {synonymMappings.map((map) => (
                  <tr key={map.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-mono text-gray-300">{map.rawSupplierName}</td>
                    <td className="p-3 font-bold text-orange-400">{map.canonicalMaterialName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
