'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import { Nakladnoy } from '@/types/stroy';
import { exportNakladnoyToExcel } from '@/lib/excel-export';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  ArrowRight,
  Warehouse,
  Check,
  X,
  Trash2,
  Truck,
} from 'lucide-react';

export function NakladnoyView() {
  const {
    currentUser,
    filteredNakladnoys,
    stocks,
    materials,
    objects,
    users,
    createNakladnoy,
    approveNakladnoy,
    rejectNakladnoy,
  } = useStroy();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState<Nakladnoy | null>(null);

  // Create Form State
  const [toOwnerType, setToOwnerType] = useState<'admin' | 'prorab' | 'expeditor'>('prorab');
  const [toOwnerId, setToOwnerId] = useState(users.find((u) => u.role === 'prorab' && u.id !== currentUser.id)?.id || users[0].id);
  const [toObjId, setToObjId] = useState(objects[0]?.id || '');
  const [carrierDriver, setCarrierDriver] = useState('');
  const [carPlateNumber, setCarPlateNumber] = useState('');
  const [formItems, setFormItems] = useState<Array<{ materialId: string; qty: number; price?: number }>>([
    { materialId: materials[0]?.id || '', qty: 5, price: materials[0]?.standardPrice || 0 },
  ]);

  // Filtered display
  const displayNakladnoys = filteredNakladnoys.filter((n) => {
    const matchesSearch =
      n.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.fromOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.toOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.toObjName && n.toObjName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-500" />
            Юк хатлари (Накладнойлар — М-11 шакли)
          </h2>
          <p className="text-xs font-medium text-gray-400 mt-1">
            Марказий омбор, прораблар ва экспедиторлар ўртасидаги моддий бойликларни ички кўчириш ва балансни ўзгартириш
          </p>
        </div>

        <button
          id="btn-create-nakladnoy-modal"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
        >
          <Plus className="h-4 w-4" />
          Янги юк хати ёзиш
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#161920] p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Юк хати рақами ёки томонлар бўйича қидириш..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-[#0F1115] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-[#0F1115] font-black uppercase tracking-wider text-gray-400 text-[11px]">
              <tr>
                <th className="px-4 py-3.5">№ Ҳужжат</th>
                <th className="px-4 py-3.5">Жўнатувчи (Қаердан)</th>
                <th className="px-4 py-3.5">Қабул қилувчи (Қаерга)</th>
                <th className="px-4 py-3.5">Материаллар ҳажми</th>
                <th className="px-4 py-3.5">Ҳолати</th>
                <th className="px-4 py-3.5 text-right">Амаллар</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {displayNakladnoys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Ҳеч қандай юк хати топилмади
                  </td>
                </tr>
              ) : (
                displayNakladnoys.map((n) => {
                  const isRecipient =
                    currentUser.id === n.toOwnerId ||
                    (n.toOwnerType === 'admin' && (currentUser.role === 'admin' || currentUser.role === 'glsklad'));
                  const canAccept = isRecipient && n.status === 'sent';

                  return (
                    <tr key={n.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-4 py-3 font-bold text-white font-mono">
                        {n.number}
                        <div className="text-[10px] text-gray-500 font-sans">{n.createdAt}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{n.fromOwnerName}</div>
                        <div className="text-[10px] text-gray-400">
                          {n.fromOwnerType === 'admin' ? 'Марказий омбор' : 'Объект / Прораб'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{n.toOwnerName}</div>
                        <div className="text-[10px] text-gray-400">{n.toObjName || 'Объект омбори'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-200">{n.items.length} та позиция:</span>
                        <div className="text-[10px] text-gray-400">
                          {n.items.map((p) => `${p.materialName}: ${p.qty} ${p.unit}`).join(', ')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {n.status === 'sent' ? (
                          <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-amber-400">
                            Юборилган (Қабул кутилмоқда)
                          </span>
                        ) : n.status === 'approved' ? (
                          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-emerald-400">
                            Қабул қилинди (Баланс янгиланди)
                          </span>
                        ) : (
                          <span className="rounded border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-red-400">
                            Бекор қилинган
                          </span>
                        )}
                        {n.approvedAt && (
                          <div className="text-[10px] text-gray-500 mt-0.5">Сана: {n.approvedAt}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canAccept && (
                            <button
                              id={`btn-accept-nakladnoy-${n.id}`}
                              onClick={() => approveNakladnoy(n.id)}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-500 shadow-sm"
                            >
                              Қабул қилиш
                            </button>
                          )}

                          <button
                            id={`btn-export-nak-excel-${n.id}`}
                            onClick={() => exportNakladnoyToExcel(n)}
                            className="rounded-lg border border-gray-800 bg-[#0F1115] p-1.5 text-gray-400 hover:text-emerald-400"
                            title="Excel юклаб олиш"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                          </button>

                          <button
                            id={`btn-print-nak-${n.id}`}
                            onClick={() => setShowPrintModal(n)}
                            className="rounded-lg border border-gray-800 bg-[#0F1115] p-1.5 text-gray-400 hover:text-white"
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

      {/* CREATE NAKLADNOY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Ички кўчириш юк хатини ёзиш (М-11)
              </h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createNakladnoy({
                  toOwnerType,
                  toOwnerId,
                  toObjId,
                  carrierDriver,
                  carPlateNumber,
                  items: formItems.map((p) => ({
                    materialId: p.materialId,
                    qty: Number(p.qty) || 1,
                    price: p.price || 0,
                  })),
                });
                setShowCreateModal(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Қабул қилувчи ходим:</label>
                  <select
                    value={toOwnerId}
                    onChange={(e) => {
                      setToOwnerId(e.target.value);
                      const u = users.find((usr) => usr.id === e.target.value);
                      if (u?.role === 'admin' || u?.role === 'glsklad') setToOwnerType('admin');
                      else if (u?.role === 'snab_so') setToOwnerType('expeditor');
                      else setToOwnerType('prorab');
                    }}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white font-bold focus:border-orange-500 focus:outline-none"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.roleTitleUz} - {u.org})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Манзил қурилиш объекти:</label>
                  <select
                    value={toObjId}
                    onChange={(e) => setToObjId(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white font-bold focus:border-orange-500 focus:outline-none"
                  >
                    {objects.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.org})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Ташувчи ҳайдовчи (Ф.И.Ш):</label>
                  <input
                    type="text"
                    placeholder="Масалан: Тоҳиров Ж."
                    value={carrierDriver}
                    onChange={(e) => setCarrierDriver(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Автомашина давлат рақами:</label>
                  <input
                    type="text"
                    placeholder="01 777 ABC"
                    value={carPlateNumber}
                    onChange={(e) => setCarPlateNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white font-mono placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Items selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black uppercase tracking-wider text-gray-400">Юборилаётган материаллар:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormItems((prev) => [
                        ...prev,
                        { materialId: materials[0]?.id || '', qty: 1, price: materials[0]?.standardPrice || 0 },
                      ])
                    }
                    className="flex items-center gap-1 font-black uppercase tracking-wider text-orange-500 hover:text-orange-400 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Қатор қўшиш
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {formItems.map((pos, idx) => {
                    const mat = materials.find((m) => m.id === pos.materialId);
                    return (
                      <div key={idx} className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0F1115] p-2.5">
                        <div className="flex-1">
                          <select
                            value={pos.materialId}
                            onChange={(e) => {
                              const val = e.target.value;
                              const mItem = materials.find((m) => m.id === val);
                              setFormItems((prev) =>
                                prev.map((p, i) =>
                                  i === idx ? { ...p, materialId: val, price: mItem?.standardPrice || 0 } : p
                                )
                              );
                            }}
                            className="w-full rounded-lg border border-gray-800 bg-[#161920] p-1.5 font-medium text-white focus:border-orange-500 focus:outline-none"
                          >
                            {materials.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-28">
                          <input
                            type="number"
                            step="0.1"
                            value={pos.qty}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setFormItems((prev) =>
                                prev.map((p, i) => (i === idx ? { ...p, qty: val } : p))
                              );
                            }}
                            className="w-full rounded-lg border border-gray-800 bg-[#161920] p-1.5 font-bold text-white focus:border-orange-500 focus:outline-none"
                            placeholder="Миқдор"
                            required
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setFormItems((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1 text-gray-500 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-gray-800 px-4 py-2 font-bold text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  Бекор қилиш
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 px-5 py-2 font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  Юк хатини чиқариш ва Жўнатиш
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-2xl my-6 text-black">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
              <span className="text-xs font-bold text-slate-500">Юк хати — М-11 Накладной</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-gray-800"
                >
                  <Printer className="h-4 w-4" />
                  Принтерга чиқариш
                </button>
                <button onClick={() => setShowPrintModal(null)} className="rounded-lg border p-2 text-slate-400 hover:text-slate-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 border border-slate-300 p-8 font-serif text-slate-900 bg-white">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h1 className="text-base font-bold uppercase">
                  ТИПОВАЯ МЕЖОТРАСЛЕВАЯ ФОРМА № М-11 (НАКЛАДНАЯ НА ВНУТРЕННЕЕ ПЕРЕМЕЩЕНИЕ МАТЕРИАЛОВ)
                </h1>
                <p className="text-xs font-semibold mt-1">
                  Ҳужжат №: {showPrintModal.number} / Сана: {showPrintModal.createdAt}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div><span className="font-bold">Жўнатувчи (Отпустил):</span> {showPrintModal.fromOwnerName}</div>
                <div><span className="font-bold">Қабул қилувчи (Получил):</span> {showPrintModal.toOwnerName} ({showPrintModal.toObjName || 'Объект'})</div>
                <div><span className="font-bold">Ҳолати:</span> {showPrintModal.status === 'approved' ? 'Қабул қилинган' : 'Юборилган'}</div>
                <div><span className="font-bold">Ташувчи / Машина:</span> {showPrintModal.carrierDriver || '—'} / {showPrintModal.carPlateNumber || '—'}</div>
              </div>

              <table className="mt-6 w-full border-collapse border border-slate-400 text-xs">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-400 p-2 text-center w-8">№</th>
                    <th className="border border-slate-400 p-2 text-left">Материал ва буюмлар номи</th>
                    <th className="border border-slate-400 p-2 text-center w-16">Бирлиги</th>
                    <th className="border border-slate-400 p-2 text-right w-28">Юборилган миқдор</th>
                  </tr>
                </thead>
                <tbody>
                  {showPrintModal.items.map((p, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-400 p-2 font-medium">{p.materialName}</td>
                      <td className="border border-slate-400 p-2 text-center">{p.unit}</td>
                      <td className="border border-slate-400 p-2 text-right font-mono font-bold">{p.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 grid grid-cols-2 gap-6 text-xs border-t border-slate-300 pt-6">
                <div>
                  <p className="font-bold">Топширди (Отпустил):</p>
                  <p className="mt-1 italic">{showPrintModal.fromOwnerName}</p>
                  <div className="mt-4 border-b border-slate-400 w-48"></div>
                </div>
                <div>
                  <p className="font-bold">Қабул қилди (Получил):</p>
                  <p className="mt-1 italic">{showPrintModal.toOwnerName}</p>
                  <div className="mt-4 border-b border-slate-400 w-48"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
