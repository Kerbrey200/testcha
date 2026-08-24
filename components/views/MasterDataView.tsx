'use client';

import React, { useState } from 'react';
import { useStroy } from '@/context/StroyContext';
import {
  FolderKanban,
  Building,
  Truck,
  Package,
  Plus,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';
import { OrgType } from '@/types/stroy';

export function MasterDataView() {
  const { objects, mechanisms, materials, users, addObject, addMechanism, addMaterial } = useStroy();
  const [activeTab, setActiveTab] = useState<'objects' | 'mechanisms' | 'materials'>('objects');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showObjModal, setShowObjModal] = useState(false);
  const [showMechModal, setShowMechModal] = useState(false);
  const [showMatModal, setShowMatModal] = useState(false);

  // New Object State
  const [newObjName, setNewObjName] = useState('');
  const [newObjCode, setNewObjCode] = useState('');
  const [newObjOrg, setNewObjOrg] = useState<OrgType>('РМУ');
  const [newObjAddress, setNewObjAddress] = useState('');
  const [newObjProrabId, setNewObjProrabId] = useState(users.find((u) => u.role === 'prorab')?.id || users[0]?.id || '');

  // New Mechanism State
  const [newMechName, setNewMechName] = useState('');
  const [newMechCode, setNewMechCode] = useState('');
  const [newMechType, setNewMechType] = useState('Автокран');
  const [newMechPlate, setNewMechPlate] = useState('01 123 ABC');
  const [newMechOrg, setNewMechOrg] = useState<OrgType>('УММ');

  // New Material State
  const [newMatName, setNewMatName] = useState('');
  const [newMatCode, setNewMatCode] = useState('');
  const [newMatCat, setNewMatCat] = useState<'metal' | 'cement' | 'concrete' | 'brick' | 'pipes' | 'insulation' | 'paint' | 'timber' | 'electrical' | 'other'>('metal');
  const [newMatUnit, setNewMatUnit] = useState('тн');
  const [newMatPrice, setNewMatPrice] = useState(8500000);

  return (
    <div className="space-y-6 text-white">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-orange-500" />
            Тизим Маълумотномалари (Справочники)
          </h2>
          <p className="text-xs font-medium text-gray-400 mt-1">
            Қурилиш объектлари, автотранспорт ва техникалар парки ҳамда расмий материаллар классификатори
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'objects' && (
            <button
              onClick={() => setShowObjModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
            >
              <Plus className="h-4 w-4" />
              Янги объект қўшиш
            </button>
          )}
          {activeTab === 'mechanisms' && (
            <button
              onClick={() => setShowMechModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
            >
              <Plus className="h-4 w-4" />
              Янги техника қўшиш
            </button>
          )}
          {activeTab === 'materials' && (
            <button
              onClick={() => setShowMatModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
            >
              <Plus className="h-4 w-4" />
              Янги материал қўшиш
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('objects')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'objects' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Building className="h-4 w-4" />
          1. Қурилиш объектлари ({objects.length})
        </button>
        <button
          onClick={() => setActiveTab('mechanisms')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'mechanisms' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Truck className="h-4 w-4" />
          2. УММ Техникалар парки ({mechanisms.length})
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'materials' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Package className="h-4 w-4" />
          3. Материаллар каталоги ({materials.length})
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-800 bg-[#161920] p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Номланиш ёки код бўйича қидириш..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-[#0F1115] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 1. OBJECTS TABLE */}
      {activeTab === 'objects' && (
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0F1115] border-b border-gray-800 font-black uppercase tracking-wider text-[11px] text-gray-400">
              <tr>
                <th className="p-3.5">Объект коди</th>
                <th className="p-3.5">Объект номи</th>
                <th className="p-3.5">Бошқарма (ОРГ)</th>
                <th className="p-3.5">Манзили</th>
                <th className="p-3.5">Ҳолати</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {objects.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-mono font-bold text-orange-400">{o.code}</td>
                  <td className="p-3.5 font-bold text-white">{o.name}</td>
                  <td className="p-3.5">
                    <span className="rounded border border-gray-700 bg-gray-800 px-2 py-0.5 font-bold text-gray-300">{o.org}</span>
                  </td>
                  <td className="p-3.5 text-gray-400">{o.address}</td>
                  <td className="p-3.5">
                    <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      {o.status === 'active' ? 'Фаол қурилиш' : 'Якунланган'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. MECHANISMS TABLE */}
      {activeTab === 'mechanisms' && (
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0F1115] border-b border-gray-800 font-black uppercase tracking-wider text-[11px] text-gray-400">
              <tr>
                <th className="p-3.5">Код</th>
                <th className="p-3.5">Техника номи</th>
                <th className="p-3.5">Тури</th>
                <th className="p-3.5">Давлат рақами</th>
                <th className="p-3.5">Бошқарма</th>
                <th className="p-3.5">Ҳолати</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {mechanisms.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-mono text-gray-500">{m.code}</td>
                  <td className="p-3.5 font-bold text-white">{m.name}</td>
                  <td className="p-3.5 font-medium text-gray-400">{m.type}</td>
                  <td className="p-3.5 font-mono font-bold text-orange-400">{m.plateNumber}</td>
                  <td className="p-3.5 font-medium text-gray-300">{m.org}</td>
                  <td className="p-3.5">
                    <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      {m.status === 'available' ? 'Соз ҳолатда / Бўш' : m.status === 'in_use' ? 'Ишда' : 'Таъмирда'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. MATERIALS TABLE */}
      {activeTab === 'materials' && (
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161920] shadow-sm">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0F1115] border-b border-gray-800 font-black uppercase tracking-wider text-[11px] text-gray-400">
              <tr>
                <th className="p-3.5">Код</th>
                <th className="p-3.5">Материал номи</th>
                <th className="p-3.5">Категория</th>
                <th className="p-3.5">Ўлчов бирлиги</th>
                <th className="p-3.5 text-right">Стандарт нархи (сўм)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-mono text-gray-500">{m.code}</td>
                  <td className="p-3.5 font-bold text-white">{m.name}</td>
                  <td className="p-3.5 text-gray-400">{m.category}</td>
                  <td className="p-3.5 font-bold text-orange-400">{m.unit}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">
                    {m.standardPrice ? `${m.standardPrice.toLocaleString()} UZS` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE OBJECT MODAL */}
      {showObjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-white">Янги Қурилиш объектини рўйхатга олиш</h3>
              <button onClick={() => setShowObjModal(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addObject({
                  name: newObjName,
                  code: newObjCode || `OBJ-${Math.floor(Math.random() * 900 + 100)}`,
                  org: newObjOrg,
                  address: newObjAddress,
                  prorabId: newObjProrabId,
                  status: 'active',
                  startDate: new Date().toISOString().slice(0, 10),
                });
                setShowObjModal(false);
                setNewObjName('');
                setNewObjAddress('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Объект номи:</label>
                <input
                  type="text"
                  value={newObjName}
                  onChange={(e) => setNewObjName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  placeholder="Масалан: Тошкент Сити Лот 4"
                  required
                />
              </div>
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Бошқарма:</label>
                <select
                  value={newObjOrg}
                  onChange={(e) => setNewObjOrg(e.target.value as OrgType)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white font-bold focus:border-orange-500 focus:outline-none"
                >
                  <option value="РМУ">РМУ</option>
                  <option value="СМУ">СМУ</option>
                  <option value="СУ">СУ</option>
                  <option value="ПМУ">ПМУ</option>
                  <option value="УММ">УММ</option>
                </select>
              </div>
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Манзил:</label>
                <input
                  type="text"
                  value={newObjAddress}
                  onChange={(e) => setNewObjAddress(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  placeholder="Тошкент ш., Шайхонтоҳур т."
                  required
                />
              </div>
              <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-gray-800">
                <button type="button" onClick={() => setShowObjModal(false)} className="rounded-lg border border-gray-800 px-4 py-2 font-bold text-gray-400 hover:bg-gray-800 hover:text-white">
                  Бекор қилиш
                </button>
                <button type="submit" className="rounded-lg bg-orange-500 px-5 py-2 font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20">
                  Сақлаш
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MECHANISM MODAL */}
      {showMechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-white">УММ Техника паркига янги техника қўшиш</h3>
              <button onClick={() => setShowMechModal(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMechanism({
                  code: newMechCode || `MECH-${Math.floor(Math.random() * 900 + 100)}`,
                  name: newMechName,
                  type: newMechType,
                  plateNumber: newMechPlate,
                  org: newMechOrg,
                  status: 'available',
                });
                setShowMechModal(false);
                setNewMechName('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Техника модели ва номи:</label>
                <input
                  type="text"
                  value={newMechName}
                  onChange={(e) => setNewMechName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 font-bold text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  placeholder="КамАЗ Самосвал 20т"
                  required
                />
              </div>
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Техника тури:</label>
                <input
                  type="text"
                  value={newMechType}
                  onChange={(e) => setNewMechType(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Давлат рақами:</label>
                <input
                  type="text"
                  value={newMechPlate}
                  onChange={(e) => setNewMechPlate(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 font-mono text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-gray-800">
                <button type="button" onClick={() => setShowMechModal(false)} className="rounded-lg border border-gray-800 px-4 py-2 font-bold text-gray-400 hover:bg-gray-800 hover:text-white">
                  Бекор қилиш
                </button>
                <button type="submit" className="rounded-lg bg-orange-500 px-5 py-2 font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20">
                  Сақлаш
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MATERIAL MODAL */}
      {showMatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#161920] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-white">Расмий материал каталогига қўшиш</h3>
              <button onClick={() => setShowMatModal(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMaterial({
                  code: newMatCode || `MAT-${Math.floor(Math.random() * 9000 + 1000)}`,
                  name: newMatName,
                  category: newMatCat,
                  unit: newMatUnit,
                  standardPrice: Number(newMatPrice) || 0,
                });
                setShowMatModal(false);
                setNewMatName('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Материал расмий номи:</label>
                <input
                  type="text"
                  value={newMatName}
                  onChange={(e) => setNewMatName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 font-bold text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Категория:</label>
                <select
                  value={newMatCat}
                  onChange={(e) => setNewMatCat(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 font-medium text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="metal">Металл ва Арматура</option>
                  <option value="cement">Цемент</option>
                  <option value="concrete">Бетон</option>
                  <option value="brick">Ғишт</option>
                  <option value="pipes">Қувурлар</option>
                  <option value="insulation">Изоляция</option>
                  <option value="paint">Бўёқ</option>
                  <option value="timber">Ёғоч</option>
                  <option value="electrical">Электр</option>
                  <option value="other">Бошқа</option>
                </select>
              </div>
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Ўлчов бирлиги:</label>
                <input
                  type="text"
                  value={newMatUnit}
                  onChange={(e) => setNewMatUnit(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-black uppercase tracking-wider text-gray-400 mb-1">Стандарт нархи (сўм):</label>
                <input
                  type="number"
                  value={newMatPrice}
                  onChange={(e) => setNewMatPrice(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-800 bg-[#0F1115] p-2 font-mono text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-gray-800">
                <button type="button" onClick={() => setShowMatModal(false)} className="rounded-lg border border-gray-800 px-4 py-2 font-bold text-gray-400 hover:bg-gray-800 hover:text-white">
                  Бекор қилиш
                </button>
                <button type="submit" className="rounded-lg bg-orange-500 px-5 py-2 font-black uppercase tracking-wider text-white hover:bg-orange-600 shadow-md shadow-orange-500/20">
                  Сақлаш
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
