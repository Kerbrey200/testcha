'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import { exportStocksToExcel } from '@/lib/excel-export';
import {
  Warehouse,
  Search,
  FileSpreadsheet,
  Building,
  User,
  Package,
} from 'lucide-react';

export function StocksView() {
  const { stocks, users, objects } = useStroy();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwnerType, setSelectedOwnerType] = useState('all');

  const filteredStocks = stocks.filter((s) => {
    const matchesSearch =
      s.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedOwnerType === 'all' || s.ownerType === selectedOwnerType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-amber-600" />
            Омборлар ва Моддий қолдиқлар (Stocks)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Марказий таъминот омбори, қурилиш майдонларидаги прораблар омборлари ва экспедиторлардаги қолдиқлар баланси
          </p>
        </div>

        <button
          id="btn-export-all-stocks"
          onClick={() => exportStocksToExcel(stocks)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Омбор қолдиқларини Excel га юклаш
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Материал номи ёки масъул шахс бўйича қидириш..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedOwnerType}
          onChange={(e) => setSelectedOwnerType(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
        >
          <option value="all">Барча омбор турлари</option>
          <option value="admin">Марказий омбор (СО)</option>
          <option value="prorab">Прораблар (Объект омборлари)</option>
          <option value="snab">Таъминотчи / Экспедиторлар</option>
        </select>
      </div>

      {/* Stocks Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500 text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Омбор / Масъул шахс</th>
                <th className="px-4 py-3.5">Омбор тури</th>
                <th className="px-4 py-3.5">Материал номи</th>
                <th className="px-4 py-3.5">Бирлиги</th>
                <th className="px-4 py-3.5 text-right">Мавжуд қолдиқ</th>
                <th className="px-4 py-3.5 text-right">Сўнгги ўзгариш</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Омбор қолдиқлари топилмади
                  </td>
                </tr>
              ) : (
                filteredStocks.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                      {s.ownerType === 'admin' ? (
                        <Warehouse className="h-4 w-4 text-amber-600" />
                      ) : (
                        <User className="h-4 w-4 text-blue-600" />
                      )}
                      <span>{s.ownerName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          s.ownerType === 'admin'
                            ? 'bg-amber-100 text-amber-900'
                            : s.ownerType === 'prorab'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-orange-100 text-orange-900'
                        }`}
                      >
                        {s.ownerType === 'admin' ? 'Марказий омбор' : s.ownerType === 'prorab' ? 'Прораб омбори' : 'Экспедитор'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {s.materialName}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{s.unit}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm font-extrabold text-slate-900">
                        {s.qty.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 font-mono text-[11px]">
                      {s.lastUpdated}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
