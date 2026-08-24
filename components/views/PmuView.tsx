'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import { PmuZayavka, PmuStatus, PmuIzdeliyeNakladnoy } from '@/types/stroy';
import {
  Boxes,
  Plus,
  Search,
  FileText,
  Paperclip,
  CheckCircle2,
  Clock,
  Check,
  X,
  Send,
  Download,
  AlertTriangle,
} from 'lucide-react';

export function PmuView() {
  const {
    currentUser,
    pmuZayavkas,
    filteredPmuZayavkas,
    pmuNakladnoys,
    objects,
    createPmuZayavka,
    approvePmuByUpr,
    approvePmuByPtoSo,
    approvePmuByGlinjSo,
    donePmuByDispatcher,
    rejectPmu,
    createPmuIzdeliyeNakladnoy,
    receivePmuIzdeliyeNakladnoy,
  } = useStroy();

  const [activeSubTab, setActiveSubTab] = useState<'zayavkas' | 'transfers'>('zayavkas');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showCreateZayavkaModal, setShowCreateZayavkaModal] = useState(false);
  const [showCreateTransferModal, setShowCreateTransferModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState<PmuZayavka | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Create Zayavka State
  const [newObjId, setNewObjId] = useState(objects[0]?.id || '');
  const [newConstructName, setNewConstructName] = useState('Металлическая ферма ФМ-18 (L=18m)');
  const [newCategory, setNewCategory] = useState<PmuZayavka['category']>('metal_ferma');
  const [newQty, setNewQty] = useState(12);
  const [newUnit, setNewUnit] = useState('дона');
  const [newSpecs, setNewSpecs] = useState('ГОСТ 23118-2012 бўйича');
  const [newDrawingName, setNewDrawingName] = useState('Chizma_FM18_KM_v2.pdf');

  // Create Transfer State (Konstruktor PMU)
  const [transObjId, setTransObjId] = useState(objects[0]?.id || '');
  const [transProductName, setTransProductName] = useState('Стеновая сэндвич-панель СП-150');
  const [transQty, setTransQty] = useState(40);
  const [transUnit, setTransUnit] = useState('м2');
  const [transNotes, setTransNotes] = useState('ПМУ цехида тайёрланди');

  const displayZayavkas = filteredPmuZayavkas.filter((z) => {
    return (
      z.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.structureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.objName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-white">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
            <Boxes className="h-6 w-6 text-purple-400" />
            ПМУ Конструкциялар ва Изделиялар Заявкалари
          </h2>
          <p className="text-xs font-medium text-gray-400 mt-1">
            ПМУ (Промышленно-механическое управление) цехида ишлаб чиқариладиган металлоконструкциялар ва тайёр маҳсулотлар оқими
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'prorab' && (
            <button
              id="btn-create-pmu-zayavka"
              onClick={() => setShowCreateZayavkaModal(true)}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
            >
              <Plus className="h-4 w-4" />
              Конструкцияга заявка бериш
            </button>
          )}

          {(currentUser.role === 'konstruktor' || currentUser.role === 'admin' || currentUser.org === 'ПМУ') && (
            <button
              id="btn-create-pmu-transfer"
              onClick={() => setShowCreateTransferModal(true)}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-purple-500 shadow-md shadow-purple-600/20"
            >
              <Send className="h-4 w-4" />
              Тайёр маҳсулотни юбориш (Накладной)
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveSubTab('zayavkas')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeSubTab === 'zayavkas' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          1. Ишлаб чиқариш заявкалари ({displayZayavkas.length})
        </button>
        <button
          onClick={() => setActiveSubTab('transfers')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeSubTab === 'transfers' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Boxes className="h-4 w-4" />
          2. Тайёр маҳсулотни топшириш юк хатлари ({pmuNakladnoys.length})
        </button>
      </div>

      {/* SUB-TAB 1: ZAYAVKAS */}
      {activeSubTab === 'zayavkas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#161920] p-4 shadow-sm">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Заявка рақами, конструкция ёки объект бўйича..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-[#0F1115] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="border-b border-gray-800 bg-[#0F1115] font-black uppercase tracking-wider text-gray-400 text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">№ Заявка</th>
                  <th className="px-4 py-3.5">Объект / Муаллиф</th>
                  <th className="px-4 py-3.5">Буюртма қилинган конструкция</th>
                  <th className="px-4 py-3.5">Чизма (Чертеж)</th>
                  <th className="px-4 py-3.5">Босқич ва Ҳолати</th>
                  <th className="px-4 py-3.5 text-right">Тасдиқлаш</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {displayZayavkas.map((z) => {
                  const canUpr = (currentUser.role === 'nach_upr' || currentUser.role === 'glinj_upr' || currentUser.role === 'admin') && z.status === 'upr';
                  const canPtoSo = (currentUser.role === 'pto_so' || currentUser.role === 'admin') && z.status === 'pto_so';
                  const canGlinjSo = (currentUser.role === 'glinj_so' || currentUser.role === 'admin') && z.status === 'glinj_so';
                  const canDispatcher = (currentUser.role === 'dispatcher_umm' || currentUser.role === 'admin' || currentUser.org === 'ПМУ') && z.status === 'pmu';

                  return (
                    <tr key={z.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-4 py-3 font-bold text-white font-mono">
                        {z.number}
                        <div className="text-[10px] text-gray-500 font-sans">{z.createdAt}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{z.objName}</div>
                        <div className="text-[10px] text-gray-400">
                          {z.authorName} ({z.org})
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-purple-400">{z.structureName}</div>
                        <div className="font-mono text-purple-300 font-bold">
                          {z.quantity} {z.unit}
                        </div>
                        <div className="text-[10px] text-gray-400">{z.technicalSpecs}</div>
                      </td>
                      <td className="px-4 py-3">
                        {z.drawingFile ? (
                          <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-[#0F1115] px-2.5 py-1 text-purple-300">
                            <Paperclip className="h-3.5 w-3.5 text-purple-400" />
                            <span className="font-mono text-[11px] truncate max-w-[120px]">{z.drawingFile.name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">Чизма бириктирилмаган</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {z.status === 'upr' && (
                          <span className="rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-400">
                            1. Бошқарма раҳбари (Гл.инж / Нач.упр)
                          </span>
                        )}
                        {z.status === 'pto_so' && (
                          <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-400">
                            2. Бош ПТО (СО)
                          </span>
                        )}
                        {z.status === 'glinj_so' && (
                          <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-400">
                            3. Бош муҳандис (СО)
                          </span>
                        )}
                        {z.status === 'pmu' && (
                          <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-400">
                            4. ПМУ заводи / Цех қабули
                          </span>
                        )}
                        {z.status === 'done' && (
                          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                            Ишлаб чиқаришга қабул қилинди
                          </span>
                        )}
                        {z.status === 'rejected' && (
                          <div>
                            <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-400">
                              Рад этилган
                            </span>
                            {z.rejectionReason && (
                              <p className="mt-1 text-[10px] text-red-400 italic font-medium">
                                Сабаб: {z.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canUpr && (
                            <button
                              onClick={() => approvePmuByUpr(z.id)}
                              className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white hover:bg-blue-500 shadow-sm"
                            >
                              Тасдиқлаш (Упр)
                            </button>
                          )}
                          {canPtoSo && (
                            <button
                              onClick={() => approvePmuByPtoSo(z.id)}
                              className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white hover:bg-indigo-500 shadow-sm"
                            >
                              ПТО СО тасдиқлаш
                            </button>
                          )}
                          {canGlinjSo && (
                            <button
                              onClick={() => approvePmuByGlinjSo(z.id)}
                              className="rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white hover:bg-purple-500 shadow-sm"
                            >
                              Гл.инж СО тасдиқлаш
                            </button>
                          )}
                          {canDispatcher && (
                            <button
                              onClick={() => donePmuByDispatcher(z.id)}
                              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-500 shadow-sm"
                            >
                              Ишлаб чиқаришга олиш
                            </button>
                          )}

                          {z.status !== 'done' && z.status !== 'rejected' && (
                            <button
                              onClick={() => {
                                setShowRejectModal(z);
                                setRejectionReason('');
                              }}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 p-1 text-red-400 hover:bg-red-500/20"
                              title="Рад этиш"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PMU NAKLADNOYS */}
      {activeSubTab === 'transfers' && (
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="border-b border-gray-800 bg-[#0F1115] font-black uppercase tracking-wider text-gray-400 text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">№ Юк хати</th>
                  <th className="px-4 py-3.5">Тайёр маҳсулот (Изделие)</th>
                  <th className="px-4 py-3.5">Юборилган объект</th>
                  <th className="px-4 py-3.5">Қабул қилувчи Прораб</th>
                  <th className="px-4 py-3.5">Ҳолати</th>
                  <th className="px-4 py-3.5 text-right">Амаллар</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {pmuNakladnoys.map((t) => {
                  const isRecipient = currentUser.id === t.prorabId || currentUser.role === 'admin';
                  const canAccept = isRecipient && t.status === 'sent';

                  return (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-4 py-3 font-bold text-white font-mono">
                        {t.number}
                        <div className="text-[10px] text-gray-500 font-sans">{t.sentDate}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{t.structureName}</div>
                        <div className="text-purple-400 font-bold font-mono">
                          {t.quantity} {t.unit}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-white">{t.objName}</td>
                      <td className="px-4 py-3 font-medium text-gray-300">{t.prorabName}</td>
                      <td className="px-4 py-3">
                        {t.status === 'sent' ? (
                          <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-amber-400">
                            Йўлда / Қабул кутилмоқда
                          </span>
                        ) : (
                          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-emerald-400">
                            Қабул қилинди (Омборга кирим бўлди)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {canAccept && (
                          <button
                            id={`btn-accept-pmu-transfer-${t.id}`}
                            onClick={() => receivePmuIzdeliyeNakladnoy(t.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-500 shadow-md"
                          >
                            Маҳсулотни қабул қилиш
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE ZAYAVKA MODAL */}
      {showCreateZayavkaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Boxes className="h-5 w-5 text-purple-400" />
              ПМУ конструкциясига янги заявка (Чизма билан)
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createPmuZayavka({
                  objId: newObjId,
                  structureName: newConstructName,
                  category: newCategory,
                  quantity: Number(newQty) || 1,
                  unit: newUnit,
                  technicalSpecs: newSpecs,
                  drawingFile: {
                    name: newDrawingName,
                    size: '2.8 MB',
                    type: 'application/pdf',
                    uploadedAt: new Date().toISOString().slice(0, 10),
                  },
                });
                setShowCreateZayavkaModal(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Қурилиш объекти:</label>
                <select
                  value={newObjId}
                  onChange={(e) => setNewObjId(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white font-bold focus:border-orange-500 focus:outline-none"
                >
                  {objects.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.org})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Конструкция категорияси:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white font-bold focus:border-orange-500 focus:outline-none"
                >
                  <option value="metal_ferma">Металл ферма (КМ/КМД)</option>
                  <option value="kolonna">Металл ёки темир-бетон колонна</option>
                  <option value="balka">Балка ва ригеллар</option>
                  <option value="armokarkas">Арматура каркаслари</option>
                  <option value="opora">Опора ва устунлар</option>
                  <option value="other">Бошқа металлоконструкция</option>
                </select>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Конструкция / Маҳсулот номи:</label>
                <input
                  type="text"
                  value={newConstructName}
                  onChange={(e) => setNewConstructName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white font-bold focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Миқдори:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newQty}
                    onChange={(e) => setNewQty(parseFloat(e.target.value) || 1)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white font-bold focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Ўлчов бирлиги:</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white font-bold focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Техник параметрлар ва талаблар:</label>
                <input
                  type="text"
                  value={newSpecs}
                  onChange={(e) => setNewSpecs(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white placeholder-gray-500 focus:border-orange-500"
                  placeholder="ГОСТ 23118-2012 бўйича"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Чизма файли номи (PDF / DWG):</label>
                <input
                  type="text"
                  value={newDrawingName}
                  onChange={(e) => setNewDrawingName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 font-mono text-white placeholder-gray-500 focus:border-orange-500"
                  placeholder="Chizma_KM_12.pdf"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateZayavkaModal(false)}
                  className="rounded-lg border border-gray-800 px-4 py-2 font-bold text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  Бекор қилиш
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 px-5 py-2 font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  Заявкани юбориш
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TRANSFER MODAL (Konstruktor PMU) */}
      {showCreateTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight text-purple-400 flex items-center gap-2">
              <Send className="h-5 w-5 text-purple-400" />
              Тайёр конструкцияни (Изделия) объектга юбориш
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createPmuIzdeliyeNakladnoy({
                  objId: transObjId,
                  structureName: transProductName,
                  quantity: Number(transQty) || 1,
                  unit: transUnit,
                  notes: transNotes,
                });
                setShowCreateTransferModal(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Манзил қурилиш объекти:</label>
                <select
                  value={transObjId}
                  onChange={(e) => setTransObjId(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white font-bold focus:border-purple-400 focus:outline-none"
                >
                  {objects.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.org})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Тайёр конструкция / Маҳсулот:</label>
                <input
                  type="text"
                  value={transProductName}
                  onChange={(e) => setTransProductName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white font-bold focus:border-purple-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Миқдори:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={transQty}
                    onChange={(e) => setTransQty(parseFloat(e.target.value) || 1)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white font-bold focus:border-purple-400"
                    required
                  />
                </div>
                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Бирлиги:</label>
                  <input
                    type="text"
                    value={transUnit}
                    onChange={(e) => setTransUnit(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white font-bold focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Изоҳ ва тавсиф:</label>
                <input
                  type="text"
                  value={transNotes}
                  onChange={(e) => setTransNotes(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white placeholder-gray-500 focus:border-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateTransferModal(false)}
                  className="rounded-lg border border-gray-800 px-4 py-2 font-bold text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  Бекор қилиш
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2 font-black uppercase tracking-wider text-white hover:bg-purple-500 shadow-md shadow-purple-600/20"
                >
                  Юк хатини чиқариш ва Жўнатиш
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black uppercase tracking-tight text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              ПМУ заявкасини рад этиш
            </h3>
            <p className="text-xs text-gray-300">
              Заявка № <span className="font-bold text-white">{showRejectModal.number}</span> ({showRejectModal.structureName}) рад этилмоқда. Рад этиш сабабини кўрсатинг:
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Чизмада ўлчамлар ноаниқ / Цех қуввати банд..."
              className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-xs text-white placeholder-gray-500 focus:border-red-400 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(null)}
                className="rounded-lg border border-gray-800 px-3 py-1.5 text-xs font-bold text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                Бекор қилиш
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectPmu(showRejectModal.id, rejectionReason || 'Сабаб кўрсатилмади');
                  setShowRejectModal(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500 shadow-md"
              >
                Рад этишни тасдиқлаш
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
