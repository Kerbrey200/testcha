'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import { MaterialZayavka, ZayavkaStatus, MaterialItem } from '@/types/stroy';
import { exportZayavkaToExcel } from '@/lib/excel-export';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit3,
  Paperclip,
  Check,
  X,
  FileText,
  AlertTriangle,
  Building,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

export function ZayavkaView() {
  const {
    currentUser,
    filteredZayavkas,
    objects,
    materials,
    createZayavka,
    deleteZayavka,
    updateZayavkaObject,
    approveZayavkaByUpr,
    approveZayavkaByPtoSo,
    approveZayavkaByGlinjSo,
    finalizeZayavkaBySnabSo,
    rejectZayavka,
    canApproveZayavka,
  } = useStroy();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showObjectChangeModal, setShowObjectChangeModal] = useState<MaterialZayavka | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<MaterialZayavka | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<MaterialZayavka | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<MaterialZayavka | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Create Form State
  const [newObjId, setNewObjId] = useState(objects[0]?.id || '');
  const [newUrgency, setNewUrgency] = useState<'normal' | 'urgent' | 'critical'>('normal');
  const [formPositions, setFormPositions] = useState<Array<{ materialId: string; requestedQty: number; notes: string }>>([
    { materialId: materials[0]?.id || '', requestedQty: 10, notes: '' },
  ]);

  // Review modal state (for editing positions by Glinj/Nach upr, or PTO_SO checklist)
  const [editPositions, setEditPositions] = useState<Array<{ id: string; requestedQty: number; approvedQty: number; ptoChecked: boolean; ptoNote: string }>>([]);
  const [contractNo, setContractNo] = useState('');
  const [contractDate, setContractDate] = useState(new Date().toISOString().slice(0, 10));
  const [invoiceFileName, setInvoiceFileName] = useState('');

  // Handle open review modal
  const handleOpenReview = (z: MaterialZayavka) => {
    setShowReviewModal(z);
    setEditPositions(
      z.positions.map((p) => ({
        id: p.id,
        requestedQty: p.requestedQty,
        approvedQty: p.approvedQty ?? p.requestedQty,
        ptoChecked: p.ptoChecked ?? true,
        ptoNote: p.ptoNote || '',
      }))
    );
    const defaultContract = z.contractNo || `ДОГ-450/${z.org}`;
    const defaultDate = z.contractDate || '2026-08-25';
    setContractNo(defaultContract);
    setContractDate(defaultDate);
    setInvoiceFileName(z.invoiceFile?.name || 'Schet_Faktura_MTR.pdf');
  };

  // Add position row in create form
  const handleAddPositionRow = () => {
    setFormPositions((prev) => [...prev, { materialId: materials[0]?.id || '', requestedQty: 1, notes: '' }]);
  };

  const handleRemovePositionRow = (index: number) => {
    setFormPositions((prev) => prev.filter((_, i) => i !== index));
  };

  // Filtered List
  const displayZayavkas = filteredZayavkas.filter((z) => {
    const matchesSearch =
      z.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.objName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || z.status === selectedStatus;
    const matchesOrg = selectedOrg === 'all' || z.org === selectedOrg;
    return matchesSearch && matchesStatus && matchesOrg;
  });

  const getStatusBadge = (status: ZayavkaStatus) => {
    switch (status) {
      case 'glinj_upr':
        return (
          <span className="rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono font-black uppercase text-blue-400">
            1. Бошқарма тасдиғи
          </span>
        );
      case 'pto_so':
        return (
          <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-mono font-black uppercase text-purple-400">
            2. Бош ПТО СО кўриги
          </span>
        );
      case 'glinj_so':
        return (
          <span className="rounded border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-mono font-black uppercase text-orange-400">
            3. Бош муҳандис СО тасдиғи
          </span>
        );
      case 'snab_so':
        return (
          <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-black uppercase text-amber-400">
            4. Таъминот СО (Шартнома)
          </span>
        );
      case 'completed':
        return (
          <span className="rounded border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-mono font-black uppercase text-green-400">
            Якунланди (Таъминланди)
          </span>
        );
      case 'rejected':
        return (
          <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-mono font-black uppercase text-red-400">
            Рад этилган
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-orange-500" />
            Моддий заявкалар (Zayavka MTR)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            2026-йилги янгиланган оқим: Прораб ➔ Бошқарма раҳбарияти ➔ Бош ПТО ➔ Бош муҳандис СО ➔ Таъминот СО
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'prorab' && (
            <button
              id="btn-create-zayavka-modal"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-orange-400 shadow-md shadow-orange-500/10"
            >
              <Plus className="h-4 w-4" />
              Янги заявка бериш
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-gray-800 bg-black p-4 shadow-xs">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            id="input-search-zayavkas"
            type="text"
            placeholder="Рақам, объект ёки прораб бўйича қидириш..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-gray-800 bg-gray-900/60 pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-orange-500 focus:bg-gray-900 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            id="select-filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-bold uppercase text-gray-200 focus:border-orange-500 focus:outline-none"
          >
            <option value="all">Барча ҳолатлар</option>
            <option value="glinj_upr">1. Бошқарма тасдиғи</option>
            <option value="pto_so">2. Бош ПТО СО</option>
            <option value="glinj_so">3. Бош муҳандис СО</option>
            <option value="snab_so">4. Таъминот СО</option>
            <option value="completed">Якунланганлар</option>
            <option value="rejected">Рад этилганлар</option>
          </select>

          {currentUser.org === 'СО' && (
            <select
              id="select-filter-org"
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="rounded border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-bold uppercase text-gray-200 focus:border-orange-500 focus:outline-none"
            >
              <option value="all">Барча бошқармалар</option>
              <option value="РМУ">РМУ</option>
              <option value="СМУ">СМУ</option>
              <option value="СУ">СУ</option>
              <option value="ПМУ">ПМУ</option>
              <option value="УММ">УММ</option>
            </select>
          )}
        </div>
      </div>

      {/* Zayavkas List Table */}
      <div className="overflow-hidden rounded border border-gray-800 bg-black shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-gray-900/60 font-black uppercase tracking-wider text-gray-400 text-[10px] font-mono">
              <tr>
                <th className="px-4 py-3.5">№ Ҳужжат</th>
                <th className="px-4 py-3.5">Объект / Бошқарма</th>
                <th className="px-4 py-3.5">Муаллиф (Прораб)</th>
                <th className="px-4 py-3.5">Позициялар</th>
                <th className="px-4 py-3.5">Ҳолати (Босқич)</th>
                <th className="px-4 py-3.5 text-right">Амаллар</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono">
              {displayZayavkas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Ҳеч қандай заявка топилмади
                  </td>
                </tr>
              ) : (
                displayZayavkas.map((z) => {
                  const canAct = canApproveZayavka(z);
                  const canProrabDelete =
                    (currentUser.role === 'admin' || currentUser.id === z.authorId) &&
                    (z.status === 'glinj_upr' || z.status === 'rejected');
                  const canProrabChangeObj =
                    (currentUser.role === 'admin' || currentUser.id === z.authorId) && z.status === 'glinj_upr';

                  return (
                    <tr key={z.id} className={`hover:bg-gray-900/50 transition ${canAct ? 'bg-orange-500/5 border-l-2 border-orange-500' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-white">
                        <div className="font-mono text-orange-400 font-bold">{z.number}</div>
                        <div className="text-[10px] text-gray-500">{z.createdAt}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white line-clamp-1 font-sans">{z.objName}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="rounded bg-gray-900 border border-gray-800 px-1.5 py-0.2 text-[10px] font-bold text-gray-300">
                            {z.org}
                          </span>
                          {z.urgency === 'urgent' && (
                            <span className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.2 text-[10px] font-black text-red-400 uppercase">
                              Шошилинч
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-200 font-sans">
                        {z.authorName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-white">{z.positions.length} та материал</span>
                        <div className="text-[10px] text-gray-400 line-clamp-1 font-sans">
                          {z.positions.map((p) => p.materialName).join(', ')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(z.status)}
                        {z.rejectionReason && (
                          <div className="mt-1 text-[11px] text-red-400 font-medium font-sans">
                            Сабаб: {z.rejectionReason}
                          </div>
                        )}
                        {z.contractNo && (
                          <div className="mt-1 text-[10px] text-green-400 font-mono">
                            {z.contractNo} ({z.contractDate})
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve/Review Button */}
                          {canAct && (
                            <button
                              id={`btn-act-zayavka-${z.id}`}
                              onClick={() => handleOpenReview(z)}
                              className="flex items-center gap-1 rounded bg-orange-500 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-orange-400 shadow-xs"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Кўриб чиқиш
                            </button>
                          )}

                          {/* Rule #34: Change object */}
                          {canProrabChangeObj && (
                            <button
                              id={`btn-fix-obj-${z.id}`}
                              onClick={() => setShowObjectChangeModal(z)}
                              className="rounded border border-gray-800 bg-gray-900 p-1.5 text-gray-300 transition hover:bg-gray-800 hover:text-white"
                              title="Объектни тўғрилаш (#34)"
                            >
                              <Building className="h-3.5 w-3.5 text-orange-400" />
                            </button>
                          )}

                          {/* Excel Export */}
                          <button
                            id={`btn-export-excel-${z.id}`}
                            onClick={() => exportZayavkaToExcel(z)}
                            className="rounded border border-gray-800 bg-gray-900 p-1.5 text-gray-300 transition hover:bg-gray-800 hover:text-green-400"
                            title="Excel юклаб олиш"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                          </button>

                          {/* Print Modal */}
                          <button
                            id={`btn-print-${z.id}`}
                            onClick={() => setShowPrintModal(z)}
                            className="rounded border border-gray-800 bg-gray-900 p-1.5 text-gray-300 transition hover:bg-gray-800 hover:text-white"
                            title="Чоп этиш (А4)"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete if allowed */}
                          {canProrabDelete && (
                            <button
                              id={`btn-delete-${z.id}`}
                              onClick={() => {
                                if (confirm('Ҳақиқатан ҳам ушбу заявкани ўчирмоқчимисиз?')) {
                                  deleteZayavka(z.id);
                                }
                              }}
                              className="rounded border border-red-500/40 bg-red-500/10 p-1.5 text-red-400 transition hover:bg-red-500/20"
                              title="Заявкани ўчириш"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
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
      {/* 1. CREATE ZAYAVKA MODAL (Prorab) */}
      {/* ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded border border-gray-800 bg-black p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-500" />
                Янги материал заявкаси яратиш
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createZayavka({
                  objId: newObjId,
                  urgency: newUrgency,
                  positions: formPositions.map((p) => ({
                    materialId: p.materialId,
                    requestedQty: Number(p.requestedQty) || 1,
                    notes: p.notes,
                  })),
                });
                setShowCreateModal(false);
              }}
              className="mt-4 space-y-4 font-sans"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1">Қурилиш объекти:</label>
                  <select
                    id="create-zayavka-obj"
                    value={newObjId}
                    onChange={(e) => setNewObjId(e.target.value)}
                    className="w-full rounded border border-gray-800 bg-gray-900 p-2.5 text-xs text-white focus:border-orange-500 focus:outline-none font-bold"
                    required
                  >
                    {objects.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.org})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1">Шошилинчлик даражаси:</label>
                  <select
                    id="create-zayavka-urgency"
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full rounded border border-gray-800 bg-gray-900 p-2.5 text-xs text-white focus:border-orange-500 focus:outline-none font-bold"
                  >
                    <option value="normal">Одатий (Режали)</option>
                    <option value="urgent">Шошилинч</option>
                    <option value="critical">Ўта муҳим / Авариявий</option>
                  </select>
                </div>
              </div>

              {/* Positions rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Материал позициялари:</label>
                  <button
                    type="button"
                    onClick={handleAddPositionRow}
                    className="flex items-center gap-1 text-xs font-black uppercase text-orange-400 hover:text-orange-300"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Қатор қўшиш
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formPositions.map((pos, idx) => {
                    const selectedMat = materials.find((m) => m.id === pos.materialId);
                    return (
                      <div key={idx} className="flex items-center gap-2 rounded border border-gray-800 bg-gray-900/60 p-2.5">
                        <div className="flex-1">
                          <select
                            value={pos.materialId}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormPositions((prev) =>
                                prev.map((p, i) => (i === idx ? { ...p, materialId: val } : p))
                              );
                            }}
                            className="w-full rounded border border-gray-800 bg-black p-2 text-xs text-white focus:border-orange-500 focus:outline-none font-bold"
                          >
                            {materials.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-28">
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={pos.requestedQty}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setFormPositions((prev) =>
                                  prev.map((p, i) => (i === idx ? { ...p, requestedQty: val } : p))
                                );
                              }}
                              className="w-full rounded-l border border-gray-800 bg-black p-2 text-xs font-mono font-bold text-white focus:border-orange-500 focus:outline-none"
                              placeholder="Миқдор"
                              required
                            />
                            <span className="rounded-r border border-l-0 border-gray-800 bg-gray-800 px-2 py-2 text-[10px] font-mono font-bold text-gray-300">
                              {selectedMat?.unit || 'тн'}
                            </span>
                          </div>
                        </div>

                        {formPositions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePositionRow(idx)}
                            className="p-1.5 text-gray-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded border border-gray-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:bg-gray-900"
                >
                  Бекор қилиш
                </button>
                <button
                  type="submit"
                  id="btn-submit-create-zayavka"
                  className="rounded bg-orange-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-orange-400 shadow-md shadow-orange-500/10"
                >
                  Заявкани юбориш
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. RULE #34: FIX WRONG OBJECT MODAL */}
      {/* ======================================================== */}
      {showObjectChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded border border-gray-800 bg-black p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Building className="h-4 w-4 text-orange-500" />
                Объектни тўғрилаш (#34-қоида)
              </h3>
              <button onClick={() => setShowObjectChangeModal(null)}>
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400 font-sans">
              Тасдиқланмаган (Бошқарма тасдиғи босқичидаги) заявкада нотўғри танланган объектни қайта танлаш:
            </p>

            <div className="mt-4">
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1">Янги тўғри объект:</label>
              <select
                id="select-change-obj"
                defaultValue={showObjectChangeModal.objId}
                onChange={(e) => {
                  const val = e.target.value;
                  updateZayavkaObject(showObjectChangeModal.id, val);
                  setShowObjectChangeModal(null);
                }}
                className="w-full rounded border border-gray-800 bg-gray-900 p-2.5 text-xs font-bold text-white focus:border-orange-500"
              >
                {objects.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.org})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. REVIEW & APPROVE MODAL (Dynamic for each Role) */}
      {/* ======================================================== */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded border border-gray-800 bg-black p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-orange-400">{showReviewModal.org} — Заявкани кўриб чиқиш</span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white mt-1">
                  {showReviewModal.number}: {showReviewModal.objName}
                </h3>
              </div>
              <button onClick={() => setShowReviewModal(null)}>
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded border border-gray-800 bg-gray-900/60 p-3 font-mono">
                <div>
                  <span className="text-gray-500 uppercase text-[10px]">Муаллиф:</span>
                  <p className="font-bold text-white font-sans">{showReviewModal.authorName}</p>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[10px]">Сана:</span>
                  <p className="font-bold text-white">{showReviewModal.createdAt}</p>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[10px]">Босқич:</span>
                  <p className="font-bold text-orange-400">{showReviewModal.status}</p>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[10px]">Шошилинчлик:</span>
                  <p className="font-bold text-white">{showReviewModal.urgency}</p>
                </div>
              </div>

              {/* Positions Review Table */}
              <div>
                <h4 className="font-black uppercase tracking-wider text-gray-300 mb-2">Материал позицияларини текшириш ва тасдиқлаш:</h4>
                <div className="overflow-x-auto rounded border border-gray-800 bg-gray-900/40 font-mono">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-900 font-black uppercase text-gray-400 text-[10px]">
                      <tr>
                        {currentUser.role === 'pto_so' && <th className="p-2.5 text-center">✓ / ✗</th>}
                        <th className="p-2.5">Материал номи</th>
                        <th className="p-2.5">Бирлиги</th>
                        <th className="p-2.5">Сўралган миқдор</th>
                        {(currentUser.role === 'glinj_upr' || currentUser.role === 'nach_upr' || currentUser.role === 'pto_so') && (
                          <th className="p-2.5">Тасдиқланаётган миқдор</th>
                        )}
                        {currentUser.role === 'pto_so' && <th className="p-2.5">ПТО изоҳи</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {editPositions.map((pos, idx) => {
                        const originalPos = showReviewModal.positions.find((p) => p.id === pos.id);
                        return (
                          <tr key={pos.id} className="hover:bg-gray-900/60">
                            {currentUser.role === 'pto_so' && (
                              <td className="p-2.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={pos.ptoChecked}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setEditPositions((prev) =>
                                      prev.map((p, i) => (i === idx ? { ...p, ptoChecked: checked } : p))
                                    );
                                  }}
                                  className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-orange-500 focus:ring-orange-500"
                                />
                              </td>
                            )}
                            <td className="p-2.5 font-bold text-white font-sans">
                              {originalPos?.materialName}
                            </td>
                            <td className="p-2.5 text-gray-400">{originalPos?.unit}</td>
                            <td className="p-2.5 font-bold text-gray-300">{pos.requestedQty}</td>

                            {(currentUser.role === 'glinj_upr' || currentUser.role === 'nach_upr') && (
                              <td className="p-2.5">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={pos.requestedQty}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setEditPositions((prev) =>
                                      prev.map((p, i) => (i === idx ? { ...p, requestedQty: val, approvedQty: val } : p))
                                    );
                                  }}
                                  className="w-24 rounded border border-gray-800 bg-black p-1 text-xs font-mono font-bold text-white"
                                />
                              </td>
                            )}

                            {currentUser.role === 'pto_so' && (
                              <>
                                <td className="p-2.5">
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={pos.approvedQty}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      setEditPositions((prev) =>
                                        prev.map((p, i) => (i === idx ? { ...p, approvedQty: val } : p))
                                      );
                                    }}
                                    className="w-24 rounded border border-purple-500/50 bg-black p-1 text-xs font-mono font-bold text-purple-300"
                                  />
                                </td>
                                <td className="p-2.5">
                                  <input
                                    type="text"
                                    placeholder="ПТО изоҳи..."
                                    value={pos.ptoNote}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setEditPositions((prev) =>
                                        prev.map((p, i) => (i === idx ? { ...p, ptoNote: val } : p))
                                      );
                                    }}
                                    className="w-full rounded border border-gray-800 bg-black p-1 text-xs text-white"
                                  />
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Snab_SO extra fields: Contract No, Date, Invoice File */}
              {(currentUser.role === 'snab_so' || currentUser.role === 'admin') && showReviewModal.status === 'snab_so' && (
                <div className="rounded border border-orange-500/40 bg-orange-500/10 p-4 space-y-3 font-sans">
                  <h4 className="font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5 text-xs">
                    <Paperclip className="h-4 w-4" />
                    Таъминот якуний босқичи: Шартнома ва ҳисоб-фактурани бириктириш
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-black uppercase text-[10px] text-gray-300 mb-1">Шартнома рақами:</label>
                      <input
                        type="text"
                        value={contractNo}
                        onChange={(e) => setContractNo(e.target.value)}
                        className="w-full rounded border border-gray-800 bg-black p-2 text-xs font-bold text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-black uppercase text-[10px] text-gray-300 mb-1">Шартнома санаси:</label>
                      <input
                        type="date"
                        value={contractDate}
                        onChange={(e) => setContractDate(e.target.value)}
                        className="w-full rounded border border-gray-800 bg-black p-2 text-xs text-white font-mono"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-black uppercase text-[10px] text-gray-300 mb-1">Ҳисоб-фактура электрон файли (PDF / Сканер):</label>
                      <div className="flex items-center gap-2 font-mono">
                        <input
                          type="text"
                          value={invoiceFileName}
                          onChange={(e) => setInvoiceFileName(e.target.value)}
                          className="flex-1 rounded border border-gray-800 bg-black p-2 text-xs text-white"
                          placeholder="Fayl_nomi.pdf"
                        />
                        <span className="rounded bg-orange-500/20 border border-orange-500/40 px-3 py-2 text-[10px] font-black uppercase text-orange-400">
                          1.4 MB (Бириктирилди)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(showReviewModal);
                    setShowReviewModal(null);
                  }}
                  className="flex items-center gap-1 rounded border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-red-400 hover:bg-red-500/20"
                >
                  <XCircle className="h-4 w-4" />
                  Рад этиш
                </button>

                <div className="flex items-center gap-2 font-sans">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(null)}
                    className="rounded border border-gray-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-gray-900 hover:text-white"
                  >
                    Ёпиш
                  </button>

                  {/* Stage 1: Glinj/Nach upr approve */}
                  {(currentUser.role === 'glinj_upr' || currentUser.role === 'nach_upr' || currentUser.role === 'admin') &&
                    showReviewModal.status === 'glinj_upr' && (
                      <button
                        type="button"
                        id="btn-confirm-approve-upr"
                        onClick={() => {
                          approveZayavkaByUpr(
                            showReviewModal.id,
                            editPositions.map((p) => ({ id: p.id, requestedQty: p.requestedQty }))
                          );
                          setShowReviewModal(null);
                        }}
                        className="rounded bg-blue-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-blue-500 shadow-md"
                      >
                        Тасдиқлаш ➔ Бош ПТО (СО) га юбориш
                      </button>
                    )}

                  {/* Stage 2: PTO_SO approve */}
                  {(currentUser.role === 'pto_so' || currentUser.role === 'admin') && showReviewModal.status === 'pto_so' && (
                    <button
                      type="button"
                      id="btn-confirm-approve-ptoso"
                      onClick={() => {
                        approveZayavkaByPtoSo(showReviewModal.id, editPositions);
                        setShowReviewModal(null);
                      }}
                      className="rounded bg-purple-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-purple-500 shadow-md"
                    >
                      Позицияларни тасдиқлаш ➔ Бош инж. СО га юбориш
                    </button>
                  )}

                  {/* Stage 3: Glinj_SO approve */}
                  {(currentUser.role === 'glinj_so' || currentUser.role === 'admin') && showReviewModal.status === 'glinj_so' && (
                    <button
                      type="button"
                      id="btn-confirm-approve-glinjso"
                      onClick={() => {
                        approveZayavkaByGlinjSo(showReviewModal.id);
                        setShowReviewModal(null);
                      }}
                      className="rounded bg-orange-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-orange-400 shadow-md"
                    >
                      Бош инж. СО якуний тасдиғи ➔ Таъминот СО га
                    </button>
                  )}

                  {/* Stage 4: Snab_SO finalize */}
                  {(currentUser.role === 'snab_so' || currentUser.role === 'admin') && showReviewModal.status === 'snab_so' && (
                    <button
                      type="button"
                      id="btn-confirm-finalize-snabso"
                      onClick={() => {
                        finalizeZayavkaBySnabSo(showReviewModal.id, contractNo, contractDate, {
                          name: invoiceFileName,
                          size: '1.4 MB',
                        });
                        setShowReviewModal(null);
                      }}
                      className="rounded bg-green-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-green-400 shadow-md"
                    >
                      Шартномани бириктириш ва Якунлаш
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. REJECTION MODAL */}
      {/* ======================================================== */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded border border-gray-800 bg-black p-6 shadow-2xl font-sans">
            <h3 className="text-sm font-black uppercase tracking-tight text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Заявкани рад этиш ({showRejectModal.number})
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              Илтимос, рад этиш сабабини аниқ кўрсатинг (прораб қайта кўриб чиқиши учун):
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Масалан: Лойиҳа ҳажмидан ортиқча ёзилган ёки омборда етарлича қолдиқ мавжуд..."
              className="mt-3 w-full rounded border border-gray-800 bg-gray-900 p-2.5 text-xs text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
              rows={3}
              required
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(null)}
                className="rounded border border-gray-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-gray-900 hover:text-white"
              >
                Бекор қилиш
              </button>
              <button
                type="button"
                id="btn-submit-rejection"
                onClick={() => {
                  if (!rejectionReason.trim()) return alert('Илтимос сабабни ёзинг');
                  rejectZayavka(showRejectModal.id, rejectionReason);
                  setShowRejectModal(null);
                  setRejectionReason('');
                }}
                className="rounded bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500 shadow-sm"
              >
                Рад этишни тасдиқлаш
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. A4 OFFICIAL PRINT VIEW MODAL */}
      {/* ======================================================== */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl rounded border border-gray-800 bg-black p-8 shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 print:hidden">
              <span className="text-xs font-mono font-bold uppercase text-gray-400">Чоп этиш шакли (А4 стандарти)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded bg-orange-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-black hover:bg-orange-400"
                >
                  <Printer className="h-4 w-4" />
                  Принтерга чиқариш
                </button>
                <button onClick={() => setShowPrintModal(null)} className="rounded border border-gray-800 p-2 text-gray-400 hover:text-white hover:bg-gray-900">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Official Sheet Layout - Clean paper view */}
            <div className="mt-6 border border-slate-300 p-8 font-serif text-slate-900 bg-white shadow-xs rounded">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h1 className="text-lg font-bold uppercase tracking-wider">
                  «{showPrintModal.org}» БОШҚАРМАСИНИНГ МОДДИЙ-ТЕХНИКА ТАЪМИНОТИ ЗАЯВКАСИ
                </h1>
                <p className="text-sm font-semibold mt-1 font-mono">Ҳужжат рақами: {showPrintModal.number} / Сана: {showPrintModal.createdAt}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="font-bold">Қурилиш объекти:</span> {showPrintModal.objName}
                </div>
                <div>
                  <span className="font-bold">Масъул Прораб:</span> {showPrintModal.authorName}
                </div>
                <div>
                  <span className="font-bold">Шартнома №:</span> {showPrintModal.contractNo || 'Шартнома расмийлаштирилмоқда'}
                </div>
                <div>
                  <span className="font-bold">Ҳолати:</span> {showPrintModal.status}
                </div>
              </div>

              {/* Table */}
              <table className="mt-6 w-full border-collapse border border-slate-400 text-xs">
                <thead>
                  <tr className="bg-slate-100 font-mono">
                    <th className="border border-slate-400 p-2 text-center w-10">№</th>
                    <th className="border border-slate-400 p-2 text-left">Материал ва буюмлар номи</th>
                    <th className="border border-slate-400 p-2 text-center w-16">Ўлчов бирлиги</th>
                    <th className="border border-slate-400 p-2 text-right w-24">Сўралган миқдор</th>
                    <th className="border border-slate-400 p-2 text-right w-24">Тасдиқланган миқдор</th>
                    <th className="border border-slate-400 p-2 text-left">ПТО хулосаси</th>
                  </tr>
                </thead>
                <tbody>
                  {showPrintModal.positions.map((pos, idx) => (
                    <tr key={pos.id}>
                      <td className="border border-slate-400 p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-400 p-2 font-medium">{pos.materialName}</td>
                      <td className="border border-slate-400 p-2 text-center">{pos.unit}</td>
                      <td className="border border-slate-400 p-2 text-right font-mono">{pos.requestedQty}</td>
                      <td className="border border-slate-400 p-2 text-right font-mono font-bold">
                        {pos.approvedQty ?? pos.requestedQty}
                      </td>
                      <td className="border border-slate-400 p-2 text-[11px]">{pos.ptoNote || (pos.ptoChecked ? 'Тасдиқланди' : '—')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signature Blocks */}
              <div className="mt-10 grid grid-cols-2 gap-8 text-xs border-t border-slate-300 pt-6">
                <div>
                  <p className="font-bold">1. Топширди (Майдон бошлиғи / Прораб):</p>
                  <p className="mt-2 text-slate-700 italic">{showPrintModal.authorName}</p>
                  <div className="mt-4 border-b border-slate-400 w-48"></div>
                </div>
                <div>
                  <p className="font-bold">2. Бошқарма Бош муҳандиси / Нач.упр:</p>
                  <p className="mt-2 text-slate-700 italic">
                    {showPrintModal.signatures.glinj_upr ? `${showPrintModal.signatures.glinj_upr.name} (${showPrintModal.signatures.glinj_upr.date})` : '______________________'}
                  </p>
                  <div className="mt-4 border-b border-slate-400 w-48"></div>
                </div>
                <div>
                  <p className="font-bold">3. Бош ПТО бошлиғи (СО):</p>
                  <p className="mt-2 text-slate-700 italic">
                    {showPrintModal.signatures.pto_so ? `${showPrintModal.signatures.pto_so.name} (${showPrintModal.signatures.pto_so.date})` : '______________________'}
                  </p>
                  <div className="mt-4 border-b border-slate-400 w-48"></div>
                </div>
                <div>
                  <p className="font-bold">4. Компания Бош муҳандиси (СО):</p>
                  <p className="mt-2 text-slate-700 italic">
                    {showPrintModal.signatures.glinj_so ? `${showPrintModal.signatures.glinj_so.name} (${showPrintModal.signatures.glinj_so.date})` : '______________________'}
                  </p>
                  <div className="mt-4 border-b border-slate-400 w-48"></div>
                </div>
              </div>

              <div className="mt-6 text-center text-[10px] text-slate-500 font-sans">
                «СтройМенеджер» электрон тизими орқали шакллантирилди. Мўҳр ўрни (М.Ў.)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
