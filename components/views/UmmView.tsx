'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import { UmmZayavka, UmmStatus } from '@/types/stroy';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Check,
  X,
  AlertTriangle,
  UserCheck,
  Calendar,
  Layers,
} from 'lucide-react';

export function UmmView() {
  const {
    currentUser,
    ummZayavkas,
    filteredUmmZayavkas,
    objects,
    mechanisms,
    createUmmZayavka,
    signUmmByUpr,
    assignUmmByGlinjSo,
    acceptUmmByDispatcher,
    rejectUmm,
  } = useStroy();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<UmmZayavka | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<UmmZayavka | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Create Form State
  const [newObjId, setNewObjId] = useState(objects[0]?.id || '');
  const [newTargetDate, setNewTargetDate] = useState(new Date().toISOString().slice(0, 10));
  const [newWorkDescription, setNewWorkDescription] = useState('Темир-бетон конструкцияларини монтаж қилиш');
  const [newMechanisms, setNewMechanisms] = useState<Array<{ mechanismType: string; count: number; hours: number; notes?: string }>>([
    { mechanismType: 'Автокран 25 тн', count: 1, hours: 8, notes: 'Кунлик смена' },
  ]);

  // Assign modal state (Glinj_so)
  const [selectedMechId, setSelectedMechId] = useState(mechanisms[0]?.id || '');
  const [assignedDriver, setAssignedDriver] = useState('');
  const [assignedStartTime, setAssignedStartTime] = useState('08:00');
  const [assignedEndTime, setAssignedEndTime] = useState('17:00');

  const displayZayavkas = filteredUmmZayavkas.filter((z) => {
    return (
      z.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.objName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.targetWorkDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-white">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
            <Truck className="h-6 w-6 text-orange-500" />
            УММ Техника ва Автотранспорт Заявкалари
          </h2>
          <p className="text-xs font-medium text-gray-400 mt-1">
            УММ (Управление механизации и автотранспорта) дан автокран, самосвал ва бошқа махсус техникаларни жалб қилиш оқими
          </p>
        </div>

        {currentUser.role === 'prorab' && (
          <button
            id="btn-create-umm-zayavka"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
          >
            <Plus className="h-4 w-4" />
            Техникага янги заявка
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#161920] p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Заявка рақами, техника ёки объект бўйича қидириш..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-[#0F1115] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* UMM Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-[#0F1115] font-black uppercase tracking-wider text-gray-400 text-[11px]">
              <tr>
                <th className="px-4 py-3.5">№ Ҳужжат</th>
                <th className="px-4 py-3.5">Объект / Муаллиф</th>
                <th className="px-4 py-3.5">Талаб этилган техника</th>
                <th className="px-4 py-3.5">Чиқиш санаси & Мақсади</th>
                <th className="px-4 py-3.5">Бириктирилган техника (УММ)</th>
                <th className="px-4 py-3.5">Ҳолати</th>
                <th className="px-4 py-3.5 text-right">Амаллар</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {displayZayavkas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Ҳеч қандай УММ заявкаси топилмади
                  </td>
                </tr>
              ) : (
                displayZayavkas.map((z) => {
                  const canSignUpr =
                    (currentUser.role === 'nach_upr' || currentUser.role === 'glinj_upr' || currentUser.role === 'admin') &&
                    z.status === 'new';
                  const canAssignGlinjSo =
                    (currentUser.role === 'glinj_so' || currentUser.role === 'admin') && z.status === 'glinj_so';
                  const canAcceptDispatcher =
                    (currentUser.role === 'dispatcher_umm' || currentUser.role === 'admin' || currentUser.org === 'УММ') &&
                    z.status === 'umm';

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
                        {z.requestedMechanisms.map((m, idx) => (
                          <div key={idx} className="font-medium text-gray-300">
                            <span className="font-bold text-orange-400">{m.mechanismType}</span>: {m.count} та ({m.hours} соат)
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 font-bold text-white">
                          <Calendar className="h-3.5 w-3.5 text-orange-500" />
                          {z.targetDate}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate max-w-xs">{z.targetWorkDescription}</div>
                      </td>
                      <td className="px-4 py-3">
                        {z.assignedMechanisms && z.assignedMechanisms.length > 0 ? (
                          <div className="space-y-1">
                            {z.assignedMechanisms.map((am, idx) => (
                              <div key={idx} className="rounded-lg bg-[#0F1115] border border-orange-500/30 px-2 py-1 text-[11px]">
                                <div className="font-bold text-orange-400">{am.mechanismName} ({am.plateNumber})</div>
                                <div className="text-[10px] text-gray-400">
                                  Машинист: {am.driverName || 'Бириктирилган'} / {am.startTime}-{am.endTime}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">Бириктирилмаган</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {z.status === 'new' && (
                          <span className="rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-400">
                            1. Бошқарма имзоси (Упр)
                          </span>
                        )}
                        {z.status === 'glinj_so' && (
                          <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-400">
                            2. Бош муҳандис СО (Техника танлаш)
                          </span>
                        )}
                        {z.status === 'umm' && (
                          <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-400">
                            3. Диспетчер УММ (Қабул қилиш)
                          </span>
                        )}
                        {z.status === 'accepted' && (
                          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                            Қабул қилинди / Йўлга чиқди
                          </span>
                        )}
                        {z.status === 'rejected' && (
                          <div>
                            <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-400">
                              Рад этилган
                            </span>
                            {z.rejectionReason && (
                              <div className="text-[10px] text-red-400 mt-1 font-medium italic">
                                Сабаб: {z.rejectionReason}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canSignUpr && (
                            <button
                              id={`btn-sign-umm-upr-${z.id}`}
                              onClick={() => signUmmByUpr(z.id)}
                              className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white hover:bg-blue-500 shadow-sm"
                            >
                              Имзолаш (Упр)
                            </button>
                          )}

                          {canAssignGlinjSo && (
                            <button
                              id={`btn-assign-umm-glinj-${z.id}`}
                              onClick={() => setShowAssignModal(z)}
                              className="rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white hover:bg-purple-500 shadow-sm"
                            >
                              Техника бириктириш
                            </button>
                          )}

                          {canAcceptDispatcher && (
                            <button
                              id={`btn-accept-umm-disp-${z.id}`}
                              onClick={() => acceptUmmByDispatcher(z.id)}
                              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-500 shadow-sm"
                            >
                              Диспетчер қабули
                            </button>
                          )}

                          {z.status !== 'accepted' && z.status !== 'rejected' && (
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE UMM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-500" />
              УММ Техника ва автотранспортга янги заявка
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createUmmZayavka({
                  objId: newObjId,
                  targetDate: newTargetDate,
                  targetWorkDescription: newWorkDescription,
                  requestedMechanisms: newMechanisms,
                });
                setShowCreateModal(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Манзил қурилиш объекти:</label>
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
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Талаб этилган чиқиш санаси:</label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white font-bold focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Бўладиган иш мақсади ва тавсифи:</label>
                <textarea
                  rows={2}
                  value={newWorkDescription}
                  onChange={(e) => setNewWorkDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              {/* Mechanisms row */}
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Талаб этилаётган техникалар:</label>
                {newMechanisms.map((mech, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0F1115] p-2.5">
                    <input
                      type="text"
                      value={mech.mechanismType}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewMechanisms((prev) => prev.map((m, i) => (i === idx ? { ...m, mechanismType: val } : m)));
                      }}
                      className="flex-1 rounded-lg border border-gray-800 bg-[#161920] p-1.5 font-medium text-white placeholder-gray-500 focus:border-orange-500"
                      placeholder="Техника тури: Автокран 25 тн"
                      required
                    />
                    <input
                      type="number"
                      value={mech.count}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setNewMechanisms((prev) => prev.map((m, i) => (i === idx ? { ...m, count: val } : m)));
                      }}
                      className="w-16 rounded-lg border border-gray-800 bg-[#161920] p-1.5 font-bold text-center text-white focus:border-orange-500"
                      placeholder="Сони"
                      min={1}
                      required
                    />
                    <input
                      type="number"
                      value={mech.hours}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 8;
                        setNewMechanisms((prev) => prev.map((m, i) => (i === idx ? { ...m, hours: val } : m)));
                      }}
                      className="w-20 rounded-lg border border-gray-800 bg-[#161920] p-1.5 font-bold text-center text-white focus:border-orange-500"
                      placeholder="Соат"
                      min={1}
                      required
                    />
                  </div>
                ))}
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
                  Заявкани юбориш
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN MODAL (Glinj SO) */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black uppercase tracking-tight text-purple-400 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-purple-400" />
              Техника ва ҳайдовчини бириктириш (Бош муҳандис СО)
            </h3>

            <div className="rounded-lg bg-[#0F1115] border border-purple-500/30 p-3 text-xs text-purple-300">
              <span className="font-bold">Заявка №:</span> {showAssignModal.number} ({showAssignModal.objName})
              <div className="mt-1">
                <span className="font-bold">Талаб этилган:</span>{' '}
                {showAssignModal.requestedMechanisms.map((m) => `${m.mechanismType} (${m.count} та)`).join(', ')}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const mech = mechanisms.find((m) => m.id === selectedMechId);
                assignUmmByGlinjSo(showAssignModal.id, [
                  {
                    mechanismId: selectedMechId,
                    mechanismName: mech?.name || 'Техника',
                    plateNumber: mech?.plateNumber || '01 777 ABC',
                    driverName: assignedDriver || 'Ҳайдовчи бириктирилди',
                    startTime: assignedStartTime,
                    endTime: assignedEndTime,
                    shiftHours: 8,
                  },
                ]);
                setShowAssignModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">УММ паркидан мавжуд техникани танланг:</label>
                <select
                  value={selectedMechId}
                  onChange={(e) => {
                    setSelectedMechId(e.target.value);
                  }}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 font-bold text-white focus:border-purple-400 focus:outline-none"
                >
                  {mechanisms.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.plateNumber}) — {m.status === 'available' ? 'Бўш' : 'Ишда'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Машинист / Ҳайдовчи Ф.И.Ш:</label>
                <input
                  type="text"
                  placeholder="Масалан: Тоҳиров Ж."
                  value={assignedDriver}
                  onChange={(e) => setAssignedDriver(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2.5 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Иш бошланиш вақти:</label>
                  <input
                    type="time"
                    value={assignedStartTime}
                    onChange={(e) => setAssignedStartTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white font-bold focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Иш тугаш вақти:</label>
                  <input
                    type="time"
                    value={assignedEndTime}
                    onChange={(e) => setAssignedEndTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white font-bold focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(null)}
                  className="rounded-lg border border-gray-800 px-4 py-2 font-bold text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  Бекор қилиш
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2 font-black uppercase tracking-wider text-white hover:bg-purple-500 shadow-md"
                >
                  Бириктириш ва Диспетчерга жўнатиш
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
              УММ Заявкасини рад этиш
            </h3>
            <p className="text-xs text-gray-300">
              Заявка № <span className="font-bold text-white">{showRejectModal.number}</span> ни рад этиш сабабини кўрсатинг:
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Техника банд / Техника таъмирда..."
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
                  rejectUmm(showRejectModal.id, rejectionReason || 'Сабаб кўрсатилмади');
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
