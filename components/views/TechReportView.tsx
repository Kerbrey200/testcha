'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import { TechReport, TechReportRow } from '@/types/stroy';
import { exportTechReportToExcel, parseTechReportExcel } from '@/lib/excel-export';
import {
  FileSpreadsheet,
  Plus,
  UploadCloud,
  Printer,
  CheckCircle2,
  Clock,
  Edit3,
  Search,
  Check,
  X,
  FileCheck,
  AlertCircle,
  FileDown,
  Trash2,
} from 'lucide-react';

export function TechReportView() {
  const {
    currentUser,
    filteredTechReports,
    objects,
    materials,
    createTechReport,
    updateTechReportFactByPto,
    updateTechReportSpisanieByBuh,
    conductTechReportByGlinj,
  } = useStroy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<TechReport | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<TechReport | null>(null);

  // Create Form State
  const [newMonth, setNewMonth] = useState('2026-08');
  const [newObjId, setNewObjId] = useState(objects[0]?.id || '');
  const [formRows, setFormRows] = useState<Array<{ materialId: string; materialName: string; unit: string; normQty: number; factQty: number; note: string }>>([
    { materialId: materials[0]?.id || '', materialName: materials[0]?.name || '', unit: materials[0]?.unit || 'тн', normQty: 20, factQty: 19.5, note: '' },
    { materialId: materials[1]?.id || '', materialName: materials[1]?.name || '', unit: materials[1]?.unit || 'тн', normQty: 30, factQty: 30, note: '' },
  ]);

  // Review Form rows
  const [reviewRows, setReviewRows] = useState<TechReportRow[]>([]);

  const handleOpenReview = (report: TechReport) => {
    setShowReviewModal(report);
    setReviewRows(report.rows.map((r) => ({ ...r })));
  };

  // Excel file upload parser for M-29
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseTechReportExcel(file);
      if (parsed.length > 0) {
        setFormRows(
          parsed.map((p) => {
            const matchMat = materials.find((m) => m.name.toLowerCase().includes(p.materialName.toLowerCase()));
            return {
              materialId: matchMat?.id || materials[0]?.id || '',
              materialName: p.materialName,
              unit: p.unit,
              normQty: p.normQty,
              factQty: p.factQty,
              note: p.note || '',
            };
          })
        );
        alert(`Excel файлидан ${parsed.length} та қатор муваффақиятли импорт қилинди!`);
      }
    } catch (err) {
      alert('Excel файлини ўқишда хатолик бўлди. Илтимос, стандарт шаблонни текширинг.');
    }
  };

  // Filter list
  const displayReports = filteredTechReports.filter((r) => {
    const matchesSearch = r.number.toLowerCase().includes(searchTerm.toLowerCase()) || r.objName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === 'all' || r.month === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  const getStatusBadge = (status: TechReport['status']) => {
    switch (status) {
      case 'new':
      case 'pto':
        return (
          <span className="rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-400">
            1. ПТО упр. текшируви
          </span>
        );
      case 'buh':
        return (
          <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-400">
            2. Бухгалтер упр. списаниеси
          </span>
        );
      case 'listed':
        return (
          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
            3. Провести қилинган (Расмий)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-orange-500" />
            Ойлик техник ҳисоботлар (М-29 списание)
          </h2>
          <p className="text-xs font-medium text-gray-400 mt-1">
            Оқим: Прораб топширади ➔ ПТО упр. «Фактически» текширади ➔ Бухгалтер «Списание» киритади ➔ Бош муҳандис «Провести» қилади
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'prorab' && (
            <button
              id="btn-create-tech-report-modal"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600 shadow-md shadow-orange-500/20"
            >
              <Plus className="h-4 w-4" />
              Ҳисобот топшириш
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-800 bg-[#161920] p-4 shadow-sm">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Ҳисобот рақами ёки объект номи бўйича қидириш..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-[#0F1115] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-gray-800 bg-[#0F1115] px-3 py-2 text-xs font-bold text-gray-300 focus:border-orange-500 focus:outline-none"
        >
          <option value="all">Барча даврлар</option>
          <option value="2026-08">Август 2026</option>
          <option value="2026-07">Июль 2026</option>
          <option value="2026-06">Июнь 2026</option>
        </select>
      </div>

      {/* Table of Reports */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-[#0F1115] font-black uppercase tracking-wider text-gray-400 text-[11px]">
              <tr>
                <th className="px-4 py-3.5">№ Ҳисобот</th>
                <th className="px-4 py-3.5">Даври</th>
                <th className="px-4 py-3.5">Объект / Бошқарма</th>
                <th className="px-4 py-3.5">Масъул Прораб</th>
                <th className="px-4 py-3.5">Ҳолати ва имзолар</th>
                <th className="px-4 py-3.5 text-right">Амаллар</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {displayReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Ҳеч қандай техник ҳисобот топилмади
                  </td>
                </tr>
              ) : (
                displayReports.map((r) => {
                  const canPtoReview = currentUser.role === 'pto_upr' && r.status === 'pto';
                  const canBuhReview = currentUser.role === 'buh_upr' && r.status === 'buh';
                  const canGlinjConduct = (currentUser.role === 'glinj_upr' || currentUser.role === 'nach_upr') && r.status === 'buh';
                  const canAct = canPtoReview || canBuhReview || canGlinjConduct || currentUser.role === 'admin';

                  return (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-4 py-3 font-bold text-white font-mono">
                        {r.number}
                        <div className="text-[10px] text-gray-500 font-sans">{r.createdAt}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-orange-400">
                        {r.monthName}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white line-clamp-1">{r.objName}</div>
                        <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-black uppercase text-gray-300">
                          {r.org}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-300">
                        {r.authorName}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(r.status)}
                        <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-gray-400">
                          {r.signatures.pto_upr && <span className="text-blue-400 font-bold">✓ ПТО</span>}
                          {r.signatures.buh_upr && <span className="text-purple-400 font-bold">✓ Бухг.</span>}
                          {r.signatures.glinj_upr && <span className="text-emerald-400 font-bold">✓ Гл.инж (Провести)</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canAct && (
                            <button
                              id={`btn-act-tech-report-${r.id}`}
                              onClick={() => handleOpenReview(r)}
                              className="flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600 shadow-sm"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              {currentUser.role === 'pto_upr' ? 'ПТО текшируви' : currentUser.role === 'buh_upr' ? 'Списание киритиш' : 'Провести қилиш'}
                            </button>
                          )}

                          <button
                            id={`btn-export-tech-excel-${r.id}`}
                            onClick={() => exportTechReportToExcel(r)}
                            className="rounded-lg border border-gray-800 bg-[#0F1115] p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-emerald-400"
                            title="Excel юклаб олиш"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                          </button>

                          <button
                            id={`btn-print-tech-report-${r.id}`}
                            onClick={() => setShowPrintModal(r)}
                            className="rounded-lg border border-gray-800 bg-[#0F1115] p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                            title="Чоп этиш (А4)"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CREATE MODAL (Prorab M-29 submission + Excel Upload) */}
      {/* ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-orange-500" />
                Ойлик техник ҳисобот топшириш (М-29)
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createTechReport({
                  month: newMonth,
                  objId: newObjId,
                  rows: formRows,
                });
                setShowCreateModal(false);
              }}
              className="mt-4 space-y-4"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1">Ҳисобот ойи:</label>
                  <input
                    type="month"
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1">Қурилиш объекти:</label>
                  <select
                    value={newObjId}
                    onChange={(e) => setNewObjId(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                  >
                    {objects.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.org})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Excel Import Option */}
              <div className="rounded-xl border border-dashed border-gray-700 bg-[#0F1115] p-4 text-center">
                <UploadCloud className="mx-auto h-6 w-6 text-orange-500 mb-1" />
                <span className="text-xs font-black uppercase tracking-wider text-white">Excel файлдан автоматик юклаш (М-29)</span>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Тайёр М-29 файлини танласангиз, позициялар ва миқдорлар автоматик тўлдирилади.
                </p>
                <label className="mt-2 inline-block cursor-pointer rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600">
                  <span>Excel файлини танлаш (.xlsx)</span>
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="hidden" />
                </label>
              </div>

              {/* Rows Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400">Материаллар ҳажми (Норматив ва Фактик):</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormRows((prev) => [
                        ...prev,
                        { materialId: materials[0]?.id || '', materialName: materials[0]?.name || '', unit: materials[0]?.unit || 'тн', normQty: 10, factQty: 10, note: '' },
                      ])
                    }
                    className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-orange-500 hover:text-orange-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Қатор қўшиш
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formRows.map((r, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-xs">
                      <div className="flex-1">
                        <select
                          value={r.materialId}
                          onChange={(e) => {
                            const mat = materials.find((m) => m.id === e.target.value);
                            setFormRows((prev) =>
                              prev.map((row, i) =>
                                i === idx ? { ...row, materialId: e.target.value, materialName: mat?.name || '', unit: mat?.unit || 'тн' } : row
                              )
                            );
                          }}
                          className="w-full rounded-lg border border-gray-800 bg-[#161920] p-1.5 text-xs font-medium text-white focus:border-orange-500"
                        >
                          {materials.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-24">
                        <label className="text-[10px] text-gray-400 block font-bold">Норматив:</label>
                        <input
                          type="number"
                          step="0.1"
                          value={r.normQty}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setFormRows((prev) => prev.map((row, i) => (i === idx ? { ...row, normQty: val } : row)));
                          }}
                          className="w-full rounded border border-gray-800 bg-[#161920] p-1 text-xs font-bold text-white focus:border-orange-500"
                        />
                      </div>

                      <div className="w-24">
                        <label className="text-[10px] text-orange-400 font-black uppercase block">Фактически:</label>
                        <input
                          type="number"
                          step="0.1"
                          value={r.factQty}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setFormRows((prev) => prev.map((row, i) => (i === idx ? { ...row, factQty: val } : row)));
                          }}
                          className="w-full rounded border border-orange-500/50 bg-[#161920] p-1 text-xs font-bold text-orange-300 focus:border-orange-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormRows((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-gray-500 hover:text-red-400 mt-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-gray-800 px-4 py-2.5 text-xs font-bold text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  Бекор қилиш
                </button>
                <button
                  type="submit"
                  id="btn-submit-tech-report"
                  className="rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  Ҳисоботни ПТО га юбориш
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REVIEW & CONDUCT MODAL (PTO -> BUH -> GLINJ) */}
      {/* ======================================================== */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-500">М-29 Шакл — Ҳисоботни кўриб чиқиш</span>
                <h3 className="text-base font-black uppercase tracking-tight text-white">{showReviewModal.number}: {showReviewModal.objName}</h3>
              </div>
              <button onClick={() => setShowReviewModal(null)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 3-Column Table Logic */}
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-800 text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0F1115] font-black uppercase tracking-wider text-gray-400 text-[11px] border-b border-gray-800">
                  <tr>
                    <th className="p-2.5">Материал номи</th>
                    <th className="p-2.5">Бирлиги</th>
                    <th className="p-2.5">Норматив</th>
                    <th className="p-2.5 bg-blue-500/10 text-blue-400">1-устун: Фактически (ПРОРАБ/ПТО)</th>
                    <th className="p-2.5 bg-purple-500/10 text-purple-400">2-устун: Списание (БУХГАЛТЕР)</th>
                    <th className="p-2.5 bg-emerald-500/10 text-emerald-400">3-устун: Иқтисод(-) / Ортиқча(+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {reviewRows.map((row, idx) => {
                    const diff = Number((row.spisanieQty - row.factQty).toFixed(3));
                    return (
                      <tr key={row.id} className="hover:bg-white/[0.02]">
                        <td className="p-2.5 font-bold text-white">{row.materialName}</td>
                        <td className="p-2.5 text-gray-400">{row.unit}</td>
                        <td className="p-2.5 font-mono text-gray-300">{row.normQty}</td>

                        {/* PTO upr adjusts col 1 */}
                        <td className="p-2.5 bg-blue-500/5">
                          {currentUser.role === 'pto_upr' || currentUser.role === 'admin' ? (
                            <input
                              type="number"
                              step="0.1"
                              value={row.factQty}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setReviewRows((prev) => prev.map((r, i) => (i === idx ? { ...r, factQty: val } : r)));
                              }}
                              className="w-24 rounded border border-blue-500/40 bg-[#0F1115] p-1 font-bold text-blue-400 focus:border-blue-400"
                            />
                          ) : (
                            <span className="font-bold text-blue-400 font-mono">{row.factQty}</span>
                          )}
                        </td>

                        {/* Buh upr inputs col 2 */}
                        <td className="p-2.5 bg-purple-500/5">
                          {currentUser.role === 'buh_upr' || currentUser.role === 'admin' ? (
                            <input
                              type="number"
                              step="0.1"
                              value={row.spisanieQty || row.factQty}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setReviewRows((prev) =>
                                  prev.map((r, i) => (i === idx ? { ...r, spisanieQty: val, differenceQty: Number((val - r.factQty).toFixed(3)) } : r))
                                );
                              }}
                              className="w-24 rounded border border-purple-500/40 bg-[#0F1115] p-1 font-bold text-purple-400 focus:border-purple-400"
                            />
                          ) : (
                            <span className="font-bold text-purple-400 font-mono">{row.spisanieQty}</span>
                          )}
                        </td>

                        {/* Auto calculated col 3: spisanie - fact */}
                        <td className="p-2.5 bg-emerald-500/5 font-mono font-bold">
                          <span className={diff > 0 ? 'text-red-400' : diff < 0 ? 'text-emerald-400' : 'text-gray-400'}>
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4">
              <button
                type="button"
                onClick={() => setShowReviewModal(null)}
                className="rounded-lg border border-gray-800 px-4 py-2.5 text-xs font-bold text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                Ёпиш
              </button>

              <div className="flex items-center gap-2">
                {/* PTO Step */}
                {(currentUser.role === 'pto_upr' || currentUser.role === 'admin') && showReviewModal.status === 'pto' && (
                  <button
                    id="btn-confirm-tech-pto"
                    onClick={() => {
                      updateTechReportFactByPto(showReviewModal.id, reviewRows);
                      setShowReviewModal(null);
                    }}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-blue-500 shadow-md"
                  >
                    «Фактически»ни тасдиқлаш ➔ Бухгалтерияга
                  </button>
                )}

                {/* Buhgalter Step */}
                {(currentUser.role === 'buh_upr' || currentUser.role === 'admin') && showReviewModal.status === 'buh' && (
                  <button
                    id="btn-confirm-tech-buh"
                    onClick={() => {
                      updateTechReportSpisanieByBuh(showReviewModal.id, reviewRows);
                      setShowReviewModal(null);
                    }}
                    className="rounded-lg bg-purple-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-purple-500 shadow-md"
                  >
                    «Списание»ни сақлаш ➔ Бош муҳандисга
                  </button>
                )}

                {/* Glinj Conduct Step */}
                {(currentUser.role === 'glinj_upr' || currentUser.role === 'nach_upr' || currentUser.role === 'admin') && (
                  <button
                    id="btn-confirm-tech-conduct"
                    onClick={() => {
                      conductTechReportByGlinj(showReviewModal.id);
                      setShowReviewModal(null);
                    }}
                    className="rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                  >
                    «Провести» (Расмийлаштириш)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* A4 PRINT VIEW */}
      {/* ======================================================== */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl rounded-2xl border border-gray-800 bg-[#161920] p-8 shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 print:hidden">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">М-29 Шакли — Чоп этиш</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600"
                >
                  <Printer className="h-4 w-4" />
                  Принтерга чиқариш
                </button>
                <button onClick={() => setShowPrintModal(null)} className="rounded-lg border border-gray-800 p-2 text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 border border-slate-300 p-8 font-serif text-slate-900 bg-white rounded-lg">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h1 className="text-base font-bold uppercase">
                  ТИПОВОЙ ОТЧЕТ ПО ФОРМЕ М-29 (МАТЕРИАЛЛАРНИНГ ОЙЛИК САРФИ ВА СПИСАНИЕСИ)
                </h1>
                <p className="text-xs font-semibold mt-1">
                  Ҳисобот рақами: {showPrintModal.number} / Даври: {showPrintModal.monthName}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div><span className="font-bold">Объект:</span> {showPrintModal.objName}</div>
                <div><span className="font-bold">Бошқарма:</span> {showPrintModal.org}</div>
                <div><span className="font-bold">Майдон бошлиғи (Прораб):</span> {showPrintModal.authorName}</div>
                <div><span className="font-bold">Ҳолати:</span> {showPrintModal.status === 'listed' ? 'Проведено (Расмийлаштирилган)' : showPrintModal.status}</div>
              </div>

              <table className="mt-6 w-full border-collapse border border-slate-400 text-xs">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-400 p-2 text-center w-8">№</th>
                    <th className="border border-slate-400 p-2 text-left">Материал номи</th>
                    <th className="border border-slate-400 p-2 text-center w-14">Бирлиги</th>
                    <th className="border border-slate-400 p-2 text-right">Норма</th>
                    <th className="border border-slate-400 p-2 text-right">1. Фактически</th>
                    <th className="border border-slate-400 p-2 text-right">2. Списание</th>
                    <th className="border border-slate-400 p-2 text-right">3. Иқтисод / Ортиқча</th>
                  </tr>
                </thead>
                <tbody>
                  {showPrintModal.rows.map((r, idx) => (
                    <tr key={r.id}>
                      <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-400 p-2 font-medium">{r.materialName}</td>
                      <td className="border border-slate-400 p-2 text-center">{r.unit}</td>
                      <td className="border border-slate-400 p-2 text-right font-mono">{r.normQty}</td>
                      <td className="border border-slate-400 p-2 text-right font-mono">{r.factQty}</td>
                      <td className="border border-slate-400 p-2 text-right font-mono font-bold">{r.spisanieQty}</td>
                      <td className="border border-slate-400 p-2 text-right font-mono">{r.differenceQty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 4 Official Signatures */}
              <div className="mt-8 grid grid-cols-2 gap-6 text-xs border-t border-slate-300 pt-6">
                <div>
                  <p className="font-bold">1. Прораб (топширди):</p>
                  <p className="mt-1 text-slate-700 italic">{showPrintModal.signatures.prorab ? `${showPrintModal.signatures.prorab.name} (${showPrintModal.signatures.prorab.date})` : '—'}</p>
                </div>
                <div>
                  <p className="font-bold">2. ПТО бошқарма (текширди):</p>
                  <p className="mt-1 text-slate-700 italic">{showPrintModal.signatures.pto_upr ? `${showPrintModal.signatures.pto_upr.name} (${showPrintModal.signatures.pto_upr.date})` : '—'}</p>
                </div>
                <div>
                  <p className="font-bold">3. Бухгалтер бошқарма (ҳисоблади):</p>
                  <p className="mt-1 text-slate-700 italic">{showPrintModal.signatures.buh_upr ? `${showPrintModal.signatures.buh_upr.name} (${showPrintModal.signatures.buh_upr.date})` : '—'}</p>
                </div>
                <div>
                  <p className="font-bold">4. Бош муҳандис (Провести қилди):</p>
                  <p className="mt-1 text-slate-700 italic">{showPrintModal.signatures.glinj_upr ? `${showPrintModal.signatures.glinj_upr.name} (${showPrintModal.signatures.glinj_upr.date})` : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
