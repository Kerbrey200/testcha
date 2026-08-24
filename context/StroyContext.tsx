'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  OrgType,
  ConstructionObject,
  MaterialItem,
  MechanismItem,
  MaterialZayavka,
  ZayavkaStatus,
  TechReport,
  TechReportRow,
  UmmZayavka,
  PmuZayavka,
  PmuIzdeliyeNakladnoy,
  Nakladnoy,
  StockBalance,
  AccountInvoice,
  MaterialSynonymMapping,
  ActivityLog,
  BackupRecord,
} from '@/types/stroy';

import {
  INITIAL_MATERIALS,
  INITIAL_MECHANISMS,
  INITIAL_OBJECTS,
  INITIAL_USERS,
  INITIAL_ZAYAVKAS,
  INITIAL_TECH_REPORTS,
  INITIAL_UMM_ZAYAVKAS,
  INITIAL_PMU_ZAYAVKAS,
  INITIAL_PMU_IZDELIYE_NAKLADNOY,
  INITIAL_NAKLADNOYS,
  INITIAL_STOCKS,
  INITIAL_ACCOUNT_INVOICES,
  INITIAL_SYNONYM_MAPPINGS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_BACKUPS,
} from '@/lib/initial-data';

interface StroyContextType {
  // Current user & authentication
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  isAuthenticated: boolean;
  loginAs: (userId: string) => void;
  loginWithCredentials: (login: string, password: string) => { success: boolean; message?: string };
  failedLoginAttempts: number;
  isLockedOut: boolean;
  logout: () => void;

  // Master Data
  objects: ConstructionObject[];
  materials: MaterialItem[];
  mechanisms: MechanismItem[];
  addObject: (obj: Omit<ConstructionObject, 'id'>) => void;
  addMaterial: (mat: Omit<MaterialItem, 'id'>) => void;
  addMechanism: (mech: Omit<MechanismItem, 'id'>) => void;

  // 1. ZAYAVKA
  zayavkas: MaterialZayavka[];
  filteredZayavkas: MaterialZayavka[];
  createZayavka: (data: { objId: string; urgency: 'normal' | 'urgent' | 'critical'; positions: Array<{ materialId: string; requestedQty: number; notes?: string }> }) => void;
  deleteZayavka: (id: string) => boolean;
  updateZayavkaObject: (id: string, newObjId: string) => boolean; // #34
  approveZayavkaByUpr: (id: string, updatedPositions?: Array<{ id: string; requestedQty: number }>) => boolean;
  approveZayavkaByPtoSo: (id: string, positionsCheck: Array<{ id: string; ptoChecked: boolean; approvedQty: number; ptoNote?: string }>) => boolean;
  approveZayavkaByGlinjSo: (id: string) => boolean;
  finalizeZayavkaBySnabSo: (id: string, contractNo: string, contractDate: string, invoiceFile?: { name: string; size: string; url?: string }) => boolean;
  rejectZayavka: (id: string, reason: string) => boolean;

  // 2. TEXNIK HISOBOT
  techReports: TechReport[];
  filteredTechReports: TechReport[];
  createTechReport: (data: { month: string; objId: string; rows: Array<{ materialId: string; materialName: string; unit: string; normQty: number; factQty: number; note?: string }> }) => void;
  updateTechReportFactByPto: (reportId: string, rows: Array<{ id: string; factQty: number }>) => boolean;
  updateTechReportSpisanieByBuh: (reportId: string, rows: Array<{ id: string; spisanieQty: number }>) => boolean;
  conductTechReportByGlinj: (reportId: string) => boolean; // "Провести"

  // 3. UMM ZAYAVKASI
  ummZayavkas: UmmZayavka[];
  filteredUmmZayavkas: UmmZayavka[];
  createUmmZayavka: (data: { objId: string; targetDate: string; targetWorkDescription: string; requestedForName?: string; requestedMechanisms: Array<{ mechanismType: string; count: number; hours: number; notes?: string }> }) => void;
  signUmmByUpr: (id: string) => boolean;
  assignUmmByGlinjSo: (id: string, assignedMechanisms: Array<{ mechanismId: string; mechanismName: string; plateNumber: string; driverName?: string; startTime?: string; endTime?: string; shiftHours?: number }>) => boolean;
  acceptUmmByDispatcher: (id: string) => boolean;
  rejectUmm: (id: string, reason: string) => boolean;

  // 4. PMU ZAYAVKASI
  pmuZayavkas: PmuZayavka[];
  filteredPmuZayavkas: PmuZayavka[];
  createPmuZayavka: (data: { objId: string; structureName: string; category: PmuZayavka['category']; quantity: number; unit: string; technicalSpecs: string; drawingFile?: PmuZayavka['drawingFile'] }) => void;
  deletePmuZayavka: (id: string) => boolean;
  approvePmuByUpr: (id: string) => boolean;
  approvePmuByPtoSo: (id: string) => boolean;
  approvePmuByGlinjSo: (id: string) => boolean;
  donePmuByDispatcher: (id: string) => boolean;
  rejectPmu: (id: string, reason: string) => boolean;

  // PMU Izdeliye Nakladnoy
  pmuNakladnoys: PmuIzdeliyeNakladnoy[];
  createPmuIzdeliyeNakladnoy: (data: { pmuZayavkaId?: string; structureName: string; quantity: number; unit: string; objId: string; notes?: string }) => void;
  receivePmuIzdeliyeNakladnoy: (id: string) => boolean;

  // 5. YUK XATLARI (NAKLADNOY)
  nakladnoys: Nakladnoy[];
  filteredNakladnoys: Nakladnoy[];
  createNakladnoy: (data: { toOwnerType: 'admin' | 'prorab' | 'expeditor'; toOwnerId: string; toObjId?: string; carrierDriver?: string; carPlateNumber?: string; items: Array<{ materialId: string; qty: number; price?: number }> }) => boolean;
  approveNakladnoy: (id: string) => boolean;
  rejectNakladnoy: (id: string, reason: string) => boolean;

  // 6. OMBORLAR & BALANSLAR
  stocks: StockBalance[];
  filteredStocks: StockBalance[];
  adjustStock: (stockId: string, newQty: number, reason: string) => void;

  // 7. ACCOUNTS & MAPPINGS
  accountInvoices: AccountInvoice[];
  synonymMappings: MaterialSynonymMapping[];
  addAccountInvoice: (invoice: Omit<AccountInvoice, 'id' | 'importedAt' | 'importedBy'>) => void;
  addSynonymMapping: (rawSupplierName: string, canonicalMaterialId: string) => void;

  // 8. AUDIT & BACKUPS
  activityLogs: ActivityLog[];
  backups: BackupRecord[];
  createManualBackup: () => BackupRecord;
  restoreFromBackupJson: (jsonString: string) => boolean;
  resetToDefaults: () => void;

  // Access check helpers
  hasOrgAccess: (org: OrgType) => boolean;
  canApproveZayavka: (zayavka: MaterialZayavka) => boolean;
}

const StroyContext = createContext<StroyContextType | undefined>(undefined);

export function StroyProvider({ children }: { children: React.ReactNode }) {
  // Helper for lazy storage initialization
  const getInitial = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  // 1. Current user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sm_current_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          const found = INITIAL_USERS.find((u) => u.id === parsed.id);
          if (found) return found;
        }
      } catch {}
    }
    return INITIAL_USERS[1];
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('sm_is_authenticated');
      if (auth !== null) return auth === 'true';
    }
    return true; // Default logged in for initial preview, user can logout or test login
  });
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);

  // 2. Master Data
  const [objects, setObjects] = useState<ConstructionObject[]>(() => getInitial('sm_objects', INITIAL_OBJECTS));
  const [materials, setMaterials] = useState<MaterialItem[]>(() => getInitial('sm_materials', INITIAL_MATERIALS));
  const [mechanisms, setMechanisms] = useState<MechanismItem[]>(() => getInitial('sm_mechanisms', INITIAL_MECHANISMS));

  // 3. Workflows Data
  const [zayavkas, setZayavkas] = useState<MaterialZayavka[]>(() => getInitial('sm_zayavkas', INITIAL_ZAYAVKAS));
  const [techReports, setTechReports] = useState<TechReport[]>(() => getInitial('sm_tech_reports', INITIAL_TECH_REPORTS));
  const [ummZayavkas, setUmmZayavkas] = useState<UmmZayavka[]>(() => getInitial('sm_umm', INITIAL_UMM_ZAYAVKAS));
  const [pmuZayavkas, setPmuZayavkas] = useState<PmuZayavka[]>(() => getInitial('sm_pmu', INITIAL_PMU_ZAYAVKAS));
  const [pmuNakladnoys, setPmuNakladnoys] = useState<PmuIzdeliyeNakladnoy[]>(() => getInitial('sm_pmu_nak', INITIAL_PMU_IZDELIYE_NAKLADNOY));
  const [nakladnoys, setNakladnoys] = useState<Nakladnoy[]>(() => getInitial('sm_nakladnoys', INITIAL_NAKLADNOYS));
  const [stocks, setStocks] = useState<StockBalance[]>(() => getInitial('sm_stocks', INITIAL_STOCKS));
  const [accountInvoices, setAccountInvoices] = useState<AccountInvoice[]>(() => getInitial('sm_accounts', INITIAL_ACCOUNT_INVOICES));
  const [synonymMappings, setSynonymMappings] = useState<MaterialSynonymMapping[]>(() => getInitial('sm_mappings', INITIAL_SYNONYM_MAPPINGS));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getInitial('sm_activity_logs', INITIAL_ACTIVITY_LOGS));
  const [backups, setBackups] = useState<BackupRecord[]>(() => getInitial('sm_backups', INITIAL_BACKUPS));

  // Save changes to localStorage
  const saveState = (key: string, val: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      // ignore
    }
  };

  // Log activity helper
  const logActivity = (
    action: string,
    entityType: ActivityLog['entityType'],
    description: string,
    entityId?: string,
    details?: Record<string, any>
  ) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      org: currentUser.org,
      action,
      entityType,
      entityId,
      description,
      details,
    };
    setActivityLogs((prev) => {
      const updated = [newLog, ...prev];
      saveState('sm_activity_logs', updated);
      return updated;
    });
  };

  // Access check: Boshqarma xodimi FAQAT o'z boshqarmasini ko'radi. SO va Admin hamma boshqarmalarni ko'radi.
  const hasOrgAccess = (org: OrgType): boolean => {
    if (currentUser.role === 'admin' || currentUser.org === 'СО') return true;
    return currentUser.org === org;
  };

  // Filtered views based on current user's role and organization
  const filteredZayavkas = useMemo(() => {
    // PTO_UPR does NOT see material zayavkas at all (PTO SO sees them)
    if (currentUser.role === 'pto_upr') return [];
    if (currentUser.role === 'admin' || currentUser.org === 'СО') return zayavkas;
    return zayavkas.filter((z) => z.org === currentUser.org);
  }, [zayavkas, currentUser]);

  const filteredTechReports = useMemo(() => {
    if (currentUser.role === 'admin' || currentUser.org === 'СО') return techReports;
    return techReports.filter((tr) => tr.org === currentUser.org);
  }, [techReports, currentUser]);

  const filteredUmmZayavkas = useMemo(() => {
    if (currentUser.role === 'admin' || currentUser.org === 'СО' || currentUser.org === 'УММ') return ummZayavkas;
    return ummZayavkas.filter((u) => u.org === currentUser.org);
  }, [ummZayavkas, currentUser]);

  const filteredPmuZayavkas = useMemo(() => {
    if (currentUser.role === 'admin' || currentUser.org === 'СО' || currentUser.org === 'ПМУ') return pmuZayavkas;
    return pmuZayavkas.filter((p) => p.org === currentUser.org);
  }, [pmuZayavkas, currentUser]);

  const filteredNakladnoys = useMemo(() => {
    if (currentUser.role === 'admin' || currentUser.org === 'СО') return nakladnoys;
    return nakladnoys.filter(
      (n) => n.fromOwnerId === currentUser.id || n.toOwnerId === currentUser.id || (n.toObjId && objects.find((o) => o.id === n.toObjId)?.org === currentUser.org)
    );
  }, [nakladnoys, currentUser, objects]);

  const filteredStocks = useMemo(() => {
    if (currentUser.role === 'admin' || currentUser.org === 'СО' || currentUser.role === 'ruk') return stocks;
    if (currentUser.role === 'prorab') return stocks.filter((s) => s.ownerId === currentUser.id);
    if (currentUser.role === 'snab') return stocks.filter((s) => s.ownerId === currentUser.id || s.org === currentUser.org);
    return stocks.filter((s) => s.org === currentUser.org || s.ownerType === 'admin');
  }, [stocks, currentUser]);

  // Login handlers
  const loginAs = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      saveState('sm_current_user', user);
      saveState('sm_is_authenticated', true);
      logActivity('auth.login', 'auth', `${user.fullName} (${user.roleTitleUz}) тизимга кирди (Роль танлаш орқали)`);
    }
  };

  const loginWithCredentials = (login: string, password: string): { success: boolean; message?: string } => {
    const normalizedLogin = login.trim().toLowerCase();
    const user = users.find((u) => u.login.toLowerCase() === normalizedLogin);

    if (!user) {
      setFailedLoginAttempts((prev) => prev + 1);
      return { success: false, message: 'Бундай логинли фойдаланувчи топилмади!' };
    }

    // Default universal password for prototype is 123456 or specific matching password
    if (password !== '123456' && password !== 'admin123' && password !== 'prorab123' && password !== 'so123') {
      const attempts = failedLoginAttempts + 1;
      setFailedLoginAttempts(attempts);
      if (attempts >= 5) {
        setIsLockedOut(true);
        return { success: false, message: '5 марта нотўғри пароль киритилди. Тизим 30 дақиқага блокланди!' };
      }
      return { success: false, message: 'Пароль нотўғри! (Синов пароли: 123456 ёки admin123)' };
    }

    // Success
    setFailedLoginAttempts(0);
    setIsLockedOut(false);
    setCurrentUser(user);
    setIsAuthenticated(true);
    saveState('sm_current_user', user);
    saveState('sm_is_authenticated', true);
    logActivity('auth.login', 'auth', `${user.fullName} (${user.roleTitleUz}) логин ва пароль орқали тизимга муваффақиятли кирди`);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    saveState('sm_is_authenticated', false);
    logActivity('auth.logout', 'auth', `${currentUser.fullName} тизимдан чиқди`);
  };

  // Master Data Adders
  const addObject = (objData: Omit<ConstructionObject, 'id'>) => {
    const newObj: ConstructionObject = {
      ...objData,
      id: `obj-${Date.now()}`,
    };
    setObjects((prev) => [...prev, newObj]);
    logActivity('object.create', 'system', `Янги қурилиш объекти қўшилди: ${newObj.name}`, newObj.id);
  };

  const addMaterial = (matData: Omit<MaterialItem, 'id'>) => {
    const newMat: MaterialItem = {
      ...matData,
      id: `mat-${Date.now()}`,
    };
    setMaterials((prev) => [...prev, newMat]);
    logActivity('material.create', 'system', `Янги материал маълумотномага қўшилди: ${newMat.name}`, newMat.id);
  };

  const addMechanism = (mechData: Omit<MechanismItem, 'id'>) => {
    const newMech: MechanismItem = {
      ...mechData,
      id: `mech-${Date.now()}`,
    };
    setMechanisms((prev) => [...prev, newMech]);
    logActivity('mechanism.create', 'system', `Янги УММ техникаси қўшилди: ${newMech.name}`, newMech.id);
  };

  // ==========================================
  // 1. MATERIAL ZAYAVKASI WORKFLOW
  // Statuses: glinj_upr -> pto_so -> glinj_so -> snab_so -> completed | rejected
  // ==========================================
  const createZayavka = (data: {
    objId: string;
    urgency: 'normal' | 'urgent' | 'critical';
    positions: Array<{ materialId: string; requestedQty: number; notes?: string }>;
  }) => {
    const targetObj = objects.find((o) => o.id === data.objId);
    const zayavkaNum = `ЗМ-${String(zayavkas.length + 1).padStart(3, '0')}/26`;

    const positions = data.positions.map((p, idx) => {
      const mat = materials.find((m) => m.id === p.materialId);
      return {
        id: `pos-${Date.now()}-${idx}`,
        materialId: p.materialId,
        materialName: mat?.name || 'Номаълум материал',
        unit: mat?.unit || 'дона',
        requestedQty: p.requestedQty,
        approvedQty: p.requestedQty,
        ptoChecked: false,
        notes: p.notes,
      };
    });

    const newZayavka: MaterialZayavka = {
      id: `zy-${Date.now()}`,
      number: zayavkaNum,
      objId: data.objId,
      objName: targetObj?.name || 'Объект',
      org: targetObj?.org || currentUser.org,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'glinj_upr', // As per 2026 spec: created directly in glinj_upr stage
      urgency: data.urgency,
      positions,
      signatures: {},
      history: [
        {
          action: 'create',
          performedBy: currentUser.fullName,
          role: currentUser.roleTitleUz,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          comment: 'Прораб томонидан янги моддий заявка яратилди',
        },
      ],
    };

    setZayavkas((prev) => {
      const updated = [newZayavka, ...prev];
      saveState('sm_zayavkas', updated);
      return updated;
    });

    logActivity('zayavka.create', 'zayavka', `Янги моддий заявка яратилди: ${newZayavka.number} (${newZayavka.objName})`, newZayavka.id);
  };

  // Rule: Prorab can early-delete request in 'glinj_upr' or 'rejected'
  const deleteZayavka = (id: string): boolean => {
    const item = zayavkas.find((z) => z.id === id);
    if (!item) return false;
    const canDelete = currentUser.role === 'admin' || (currentUser.id === item.authorId && (item.status === 'glinj_upr' || item.status === 'rejected'));
    if (!canDelete) return false;

    setZayavkas((prev) => {
      const updated = prev.filter((z) => z.id !== id);
      saveState('sm_zayavkas', updated);
      return updated;
    });

    logActivity('zayavka.delete', 'zayavka', `Заявка ўчирилди: ${item.number}`, item.id);
    return true;
  };

  // Rule #34: Prorab can fix/change wrong object while in 'glinj_upr' stage
  const updateZayavkaObject = (id: string, newObjId: string): boolean => {
    const item = zayavkas.find((z) => z.id === id);
    if (!item) return false;
    const canFix = currentUser.role === 'admin' || (currentUser.id === item.authorId && item.status === 'glinj_upr');
    if (!canFix) return false;

    const newObj = objects.find((o) => o.id === newObjId);
    if (!newObj) return false;

    setZayavkas((prev) => {
      const updated = prev.map((z) => {
        if (z.id === id) {
          return {
            ...z,
            objId: newObj.id,
            objName: newObj.name,
            org: newObj.org,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            history: [
              ...(z.history || []),
              {
                action: 'change_obj',
                performedBy: currentUser.fullName,
                role: currentUser.roleTitleUz,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                comment: `#34-қоида бўйича объект тўғриланди: ${newObj.name}`,
              },
            ],
          };
        }
        return z;
      });
      saveState('sm_zayavkas', updated);
      return updated;
    });

    logActivity('zayavka.change_obj', 'zayavka', `Заявка объекти тўғриланди (#34): ${item.number} -> ${newObj.name}`, item.id);
    return true;
  };

  // Stage 1 Approval: Glinj_upr or Nach_upr (shared stage: either one suffices)
  const approveZayavkaByUpr = (id: string, updatedPositions?: Array<{ id: string; requestedQty: number }>): boolean => {
    const item = zayavkas.find((z) => z.id === id);
    if (!item || item.status !== 'glinj_upr') return false;
    if (currentUser.role !== 'glinj_upr' && currentUser.role !== 'nach_upr' && currentUser.role !== 'admin') return false;
    if (currentUser.role !== 'admin' && currentUser.org !== item.org) return false;

    setZayavkas((prev) => {
      const updated = prev.map((z) => {
        if (z.id === id) {
          const newPos = z.positions.map((pos) => {
            const up = updatedPositions?.find((p) => p.id === pos.id);
            return up ? { ...pos, requestedQty: up.requestedQty, approvedQty: up.requestedQty } : pos;
          });

          return {
            ...z,
            status: 'pto_so' as ZayavkaStatus,
            positions: newPos,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            signatures: {
              ...z.signatures,
              glinj_upr: {
                name: currentUser.fullName,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                role: currentUser.role,
              },
            },
            history: [
              ...(z.history || []),
              {
                action: 'approve_upr',
                performedBy: currentUser.fullName,
                role: currentUser.roleTitleUz,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                comment: 'Бошқарма раҳбарияти томонидан тасдиқланди → Бош ПТО (СО) га юборилди',
              },
            ],
          };
        }
        return z;
      });
      saveState('sm_zayavkas', updated);
      return updated;
    });

    logActivity('zayavka.approve_upr', 'zayavka', `Заявка бошқарма томонидан тасдиқланди: ${item.number}`, item.id);
    return true;
  };

  // Stage 2 Approval: PTO_SO (checks positions ✓/✗, adjusts quantity, adds note)
  const approveZayavkaByPtoSo = (
    id: string,
    positionsCheck: Array<{ id: string; ptoChecked: boolean; approvedQty: number; ptoNote?: string }>
  ): boolean => {
    const item = zayavkas.find((z) => z.id === id);
    if (!item || item.status !== 'pto_so') return false;
    if (currentUser.role !== 'pto_so' && currentUser.role !== 'admin') return false;

    setZayavkas((prev) => {
      const updated = prev.map((z) => {
        if (z.id === id) {
          const checkedPositions = z.positions.map((pos) => {
            const check = positionsCheck.find((c) => c.id === pos.id);
            if (check) {
              return {
                ...pos,
                ptoChecked: check.ptoChecked,
                approvedQty: check.approvedQty,
                ptoNote: check.ptoNote,
              };
            }
            return pos;
          });

          return {
            ...z,
            status: 'glinj_so' as ZayavkaStatus,
            positions: checkedPositions,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            signatures: {
              ...z.signatures,
              pto_so: {
                name: currentUser.fullName,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                note: 'Бош ПТО томонидан позициялар бўйича тасдиқланди',
              },
            },
            history: [
              ...(z.history || []),
              {
                action: 'approve_pto_so',
                performedBy: currentUser.fullName,
                role: currentUser.roleTitleUz,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                comment: 'Бош ПТО СО текширди ва тасдиқлади → Бош муҳандис СО га ўтди',
              },
            ],
          };
        }
        return z;
      });
      saveState('sm_zayavkas', updated);
      return updated;
    });

    logActivity('zayavka.approve_pto_so', 'zayavka', `Заявка Бош ПТО томонидан тасдиқланди: ${item.number}`, item.id);
    return true;
  };

  // Stage 3 Approval: GLINJ_SO (final technical approval -> passes to Snab_SO)
  const approveZayavkaByGlinjSo = (id: string): boolean => {
    const item = zayavkas.find((z) => z.id === id);
    if (!item || item.status !== 'glinj_so') return false;
    if (currentUser.role !== 'glinj_so' && currentUser.role !== 'admin') return false;

    setZayavkas((prev) => {
      const updated = prev.map((z) => {
        if (z.id === id) {
          return {
            ...z,
            status: 'snab_so' as ZayavkaStatus,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            signatures: {
              ...z.signatures,
              glinj_so: {
                name: currentUser.fullName,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            },
            history: [
              ...(z.history || []),
              {
                action: 'approve_glinj_so',
                performedBy: currentUser.fullName,
                role: currentUser.roleTitleUz,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                comment: 'Компания Бош муҳандиси тасдиқлади → Таъминот СО (Снабжение) га юборилди',
              },
            ],
          };
        }
        return z;
      });
      saveState('sm_zayavkas', updated);
      return updated;
    });

    logActivity('zayavka.approve_glinj_so', 'zayavka', `Заявка СО Бош муҳандиси томонидан тасдиқланди: ${item.number}`, item.id);
    return true;
  };

  // Stage 4 (Final Execution): SNAB_SO attaches Contract No/Date + Invoice File
  const finalizeZayavkaBySnabSo = (
    id: string,
    contractNo: string,
    contractDate: string,
    invoiceFile?: { name: string; size: string; url?: string }
  ): boolean => {
    const item = zayavkas.find((z) => z.id === id);
    if (!item || item.status !== 'snab_so') return false;
    if (currentUser.role !== 'snab_so' && currentUser.role !== 'admin') return false;

    setZayavkas((prev) => {
      const updated = prev.map((z) => {
        if (z.id === id) {
          return {
            ...z,
            status: 'completed' as ZayavkaStatus,
            contractNo,
            contractDate,
            invoiceFile: invoiceFile
              ? {
                  ...invoiceFile,
                  uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                }
              : undefined,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            signatures: {
              ...z.signatures,
              snab_so: {
                name: currentUser.fullName,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                contractNo,
                contractDate,
                invoiceFileName: invoiceFile?.name,
              },
            },
            history: [
              ...(z.history || []),
              {
                action: 'finalize_snab_so',
                performedBy: currentUser.fullName,
                role: currentUser.roleTitleUz,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                comment: `Шартнома ва ҳисоб-фактура бириктирилди (${contractNo}). Заявка муваффақиятли якунланди.`,
              },
            ],
          };
        }
        return z;
      });
      saveState('sm_zayavkas', updated);
      return updated;
    });

    logActivity('zayavka.finalize_snab_so', 'zayavka', `Заявкага шартнома (${contractNo}) ва ҳисоб-фактура бириктирилди: ${item.number}`, item.id);
    return true;
  };

  // Rejection at any stage
  const rejectZayavka = (id: string, reason: string): boolean => {
    const item = zayavkas.find((z) => z.id === id);
    if (!item) return false;

    setZayavkas((prev) => {
      const updated = prev.map((z) => {
        if (z.id === id) {
          return {
            ...z,
            status: 'rejected' as ZayavkaStatus,
            rejectionReason: reason,
            rejectedBy: currentUser.fullName,
            rejectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            history: [
              ...(z.history || []),
              {
                action: 'reject',
                performedBy: currentUser.fullName,
                role: currentUser.roleTitleUz,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                comment: `Рад этилди: ${reason}`,
              },
            ],
          };
        }
        return z;
      });
      saveState('sm_zayavkas', updated);
      return updated;
    });

    logActivity('zayavka.reject', 'zayavka', `Заявка рад этилди (${item.number}): ${reason}`, item.id);
    return true;
  };

  const canApproveZayavka = (z: MaterialZayavka): boolean => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'ruk' || currentUser.role === 'snab' || currentUser.role === 'pto_upr') return false; // View-only

    if (z.status === 'glinj_upr') {
      return (currentUser.role === 'glinj_upr' || currentUser.role === 'nach_upr') && currentUser.org === z.org;
    }
    if (z.status === 'pto_so') {
      return currentUser.role === 'pto_so';
    }
    if (z.status === 'glinj_so') {
      return currentUser.role === 'glinj_so';
    }
    if (z.status === 'snab_so') {
      return currentUser.role === 'snab_so';
    }
    return false;
  };

  // ==========================================
  // 2. TEXNIK HISOBOT WORKFLOW (M-29)
  // Statuses: new (Prorab) -> pto (PTO upr fact check) -> buh (Buh upr spisanie) -> listed (Glinj upr "Провести")
  // ==========================================
  const createTechReport = (data: {
    month: string;
    objId: string;
    rows: Array<{ materialId: string; materialName: string; unit: string; normQty: number; factQty: number; note?: string }>;
  }) => {
    const targetObj = objects.find((o) => o.id === data.objId);
    const repNum = `TH-${data.month.slice(5, 7)}/26-${targetObj?.code.replace('OBJ-', '') || '101'}`;

    const reportRows: TechReportRow[] = data.rows.map((r, idx) => ({
      id: `tr-r-${Date.now()}-${idx}`,
      materialId: r.materialId,
      materialName: r.materialName,
      unit: r.unit,
      normQty: r.normQty,
      factQty: r.factQty,
      spisanieQty: 0,
      differenceQty: 0,
      note: r.note,
    }));

    const newReport: TechReport = {
      id: `tr-${Date.now()}`,
      number: repNum,
      month: data.month,
      monthName: `${data.month} даври`,
      objId: data.objId,
      objName: targetObj?.name || 'Объект',
      org: targetObj?.org || currentUser.org,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pto', // Sent to PTO_UPR
      rows: reportRows,
      signatures: {
        prorab: {
          name: currentUser.fullName,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        },
      },
    };

    setTechReports((prev) => {
      const updated = [newReport, ...prev];
      saveState('sm_tech_reports', updated);
      return updated;
    });

    logActivity('tech_report.create', 'tech_report', `Янги ойлик техник ҳисобот топширилди: ${newReport.number}`, newReport.id);
  };

  // Step 1: PTO_UPR verifies col 1 "Фактически"
  const updateTechReportFactByPto = (reportId: string, rows: Array<{ id: string; factQty: number }>): boolean => {
    const report = techReports.find((tr) => tr.id === reportId);
    if (!report || report.status !== 'pto') return false;
    if (currentUser.role !== 'pto_upr' && currentUser.role !== 'admin') return false;
    if (currentUser.role !== 'admin' && currentUser.org !== report.org) return false;

    setTechReports((prev) => {
      const updated = prev.map((tr) => {
        if (tr.id === reportId) {
          const updatedRows = tr.rows.map((row) => {
            const match = rows.find((r) => r.id === row.id);
            return match ? { ...row, factQty: match.factQty } : row;
          });
          return {
            ...tr,
            status: 'buh' as TechReport['status'],
            rows: updatedRows,
            signatures: {
              ...tr.signatures,
              pto_upr: {
                name: currentUser.fullName,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            },
          };
        }
        return tr;
      });
      saveState('sm_tech_reports', updated);
      return updated;
    });

    logActivity('tech_report.check_pto', 'tech_report', `Техник ҳисобот 1-устуни (Фактически) ПТО томонидан текширилди: ${report.number}`, report.id);
    return true;
  };

  // Step 2: BUH_UPR enters col 2 "Списание", auto calcs col 3 "Экономия/Перерасход" = spisanieQty - factQty
  const updateTechReportSpisanieByBuh = (reportId: string, rows: Array<{ id: string; spisanieQty: number }>): boolean => {
    const report = techReports.find((tr) => tr.id === reportId);
    if (!report || report.status !== 'buh') return false;
    if (currentUser.role !== 'buh_upr' && currentUser.role !== 'admin') return false;
    if (currentUser.role !== 'admin' && currentUser.org !== report.org) return false;

    setTechReports((prev) => {
      const updated = prev.map((tr) => {
        if (tr.id === reportId) {
          const updatedRows = tr.rows.map((row) => {
            const match = rows.find((r) => r.id === row.id);
            const spisanie = match ? match.spisanieQty : row.spisanieQty;
            const diff = Number((spisanie - row.factQty).toFixed(3));
            return {
              ...row,
              spisanieQty: spisanie,
              differenceQty: diff,
            };
          });
          return {
            ...tr,
            status: 'buh' as TechReport['status'], // Wait for Glinj_upr to conduct
            rows: updatedRows,
            signatures: {
              ...tr.signatures,
              buh_upr: {
                name: currentUser.fullName,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            },
          };
        }
        return tr;
      });
      saveState('sm_tech_reports', updated);
      return updated;
    });

    logActivity('tech_report.spisanie_buh', 'tech_report', `Техник ҳисобот 2-устуни (Списание) бухгалтер томонидан киритилди: ${report.number}`, report.id);
    return true;
  };

  // Step 3: GLINJ_UPR "Провести" (Conduct/Formalize report)
  const conductTechReportByGlinj = (reportId: string): boolean => {
    const report = techReports.find((tr) => tr.id === reportId);
    if (!report) return false;
    if (currentUser.role !== 'glinj_upr' && currentUser.role !== 'nach_upr' && currentUser.role !== 'admin') return false;
    if (currentUser.role !== 'admin' && currentUser.org !== report.org) return false;

    setTechReports((prev) => {
      const updated = prev.map((tr) => {
        if (tr.id === reportId) {
          return {
            ...tr,
            status: 'listed' as TechReport['status'],
            signatures: {
              ...tr.signatures,
              glinj_upr: {
                name: currentUser.fullName,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            },
          };
        }
        return tr;
      });
      saveState('sm_tech_reports', updated);
      return updated;
    });

    logActivity('tech_report.conduct_glinj', 'tech_report', `Техник ҳисобот Бош муҳандис томонидан ўтказилди (Провести): ${report.number}`, report.id);
    return true;
  };

  // ==========================================
  // 3. UMM ZAYAVKASI WORKFLOW (Machinery)
  // Statuses: new -> glinj_so -> umm -> accepted | rejected
  // ==========================================
  const createUmmZayavka = (data: {
    objId: string;
    targetDate: string;
    targetWorkDescription: string;
    requestedForName?: string;
    requestedMechanisms: Array<{ mechanismType: string; count: number; hours: number; notes?: string }>;
  }) => {
    const targetObj = objects.find((o) => o.id === data.objId);
    const newUmm: UmmZayavka = {
      id: `umm-${Date.now()}`,
      number: `УММ-${String(ummZayavkas.length + 1).padStart(3, '0')}/26`,
      objId: data.objId,
      objName: targetObj?.name || 'Объект',
      org: targetObj?.org || currentUser.org,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      requestedForName: data.requestedForName,
      targetDate: data.targetDate,
      targetWorkDescription: data.targetWorkDescription,
      requestedMechanisms: data.requestedMechanisms,
      status: 'new',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      signatures: {},
    };

    setUmmZayavkas((prev) => {
      const updated = [newUmm, ...prev];
      saveState('sm_umm', updated);
      return updated;
    });

    logActivity('umm.create', 'umm', `Янги УММ техника заявкаси яратилди: ${newUmm.number}`, newUmm.id);
  };

  const signUmmByUpr = (id: string): boolean => {
    const item = ummZayavkas.find((u) => u.id === id);
    if (!item || item.status !== 'new') return false;
    if (currentUser.role !== 'glinj_upr' && currentUser.role !== 'nach_upr' && currentUser.role !== 'admin') return false;

    setUmmZayavkas((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            status: 'glinj_so' as UmmZayavka['status'],
            signatures: {
              ...u.signatures,
              upr_head: {
                name: currentUser.fullName,
                role: currentUser.role,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            },
          };
        }
        return u;
      });
      saveState('sm_umm', updated);
      return updated;
    });

    logActivity('umm.sign_upr', 'umm', `УММ заявкаси бошқарма томонидан имзоланди: ${item.number}`, item.id);
    return true;
  };

  const assignUmmByGlinjSo = (
    id: string,
    assignedMechanisms: Array<{ mechanismId: string; mechanismName: string; plateNumber: string; driverName?: string; startTime?: string; endTime?: string; shiftHours?: number }>
  ): boolean => {
    const item = ummZayavkas.find((u) => u.id === id);
    if (!item || (item.status !== 'glinj_so' && item.status !== 'new')) return false;
    if (currentUser.role !== 'glinj_so' && currentUser.role !== 'admin') return false;

    setUmmZayavkas((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            status: 'umm' as UmmZayavka['status'],
            assignedMechanisms,
            signatures: {
              ...u.signatures,
              glinj_so: {
                name: currentUser.fullName,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            },
          };
        }
        return u;
      });
      saveState('sm_umm', updated);
      return updated;
    });

    logActivity('umm.assign_glinj_so', 'umm', `УММ заявкасига техника ва вақт тақсимланди: ${item.number}`, item.id);
    return true;
  };

  const acceptUmmByDispatcher = (id: string): boolean => {
    const item = ummZayavkas.find((u) => u.id === id);
    if (!item || item.status !== 'umm') return false;
    if (currentUser.role !== 'dispatcher_umm' && currentUser.role !== 'admin') return false;

    setUmmZayavkas((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            status: 'accepted' as UmmZayavka['status'],
            signatures: {
              ...u.signatures,
              dispatcher_umm: {
                name: currentUser.fullName,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            },
          };
        }
        return u;
      });
      saveState('sm_umm', updated);
      return updated;
    });

    logActivity('umm.accept_disp', 'umm', `УММ Диспетчери техника заявкасини қабул қилди: ${item.number}`, item.id);
    return true;
  };

  const rejectUmm = (id: string, reason: string): boolean => {
    setUmmZayavkas((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, status: 'rejected' as UmmZayavka['status'], rejectionReason: reason } : u));
      saveState('sm_umm', updated);
      return updated;
    });
    logActivity('umm.reject', 'umm', `УММ заявкаси рад этилди: ${reason}`, id);
    return true;
  };

  // ==========================================
  // 4. PMU ZAYAVKASI WORKFLOW (Structures)
  // Statuses: upr -> pto_so -> glinj_so -> pmu -> done | rejected
  // ==========================================
  const createPmuZayavka = (data: {
    objId: string;
    structureName: string;
    category: PmuZayavka['category'];
    quantity: number;
    unit: string;
    technicalSpecs: string;
    drawingFile?: PmuZayavka['drawingFile'];
  }) => {
    const targetObj = objects.find((o) => o.id === data.objId);
    const newPmu: PmuZayavka = {
      id: `pmu-${Date.now()}`,
      number: `ПМУ-${String(pmuZayavkas.length + 1).padStart(3, '0')}/26`,
      objId: data.objId,
      objName: targetObj?.name || 'Объект',
      org: targetObj?.org || currentUser.org,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      structureName: data.structureName,
      category: data.category,
      quantity: data.quantity,
      unit: data.unit,
      technicalSpecs: data.technicalSpecs,
      drawingFile: data.drawingFile,
      status: 'upr',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      signatures: {},
    };

    setPmuZayavkas((prev) => {
      const updated = [newPmu, ...prev];
      saveState('sm_pmu', updated);
      return updated;
    });

    logActivity('pmu.create', 'pmu', `Янги ПМУ конструкция заявкаси яратилди: ${newPmu.structureName} (${newPmu.number})`, newPmu.id);
  };

  const deletePmuZayavka = (id: string): boolean => {
    const item = pmuZayavkas.find((p) => p.id === id);
    if (!item) return false;
    if (currentUser.role !== 'admin' && (item.status !== 'upr' && item.status !== 'rejected')) return false;

    setPmuZayavkas((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveState('sm_pmu', updated);
      return updated;
    });
    logActivity('pmu.delete', 'pmu', `ПМУ заявкаси ўчирилди: ${item.number}`, item.id);
    return true;
  };

  const approvePmuByUpr = (id: string): boolean => {
    const item = pmuZayavkas.find((p) => p.id === id);
    if (!item || item.status !== 'upr') return false;
    if (currentUser.role !== 'glinj_upr' && currentUser.role !== 'nach_upr' && currentUser.role !== 'admin') return false;

    setPmuZayavkas((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'pto_so' as PmuZayavka['status'],
              signatures: { ...p.signatures, upr_head: { name: currentUser.fullName, role: currentUser.role, date: new Date().toISOString().replace('T', ' ').slice(0, 16) } },
            }
          : p
      );
      saveState('sm_pmu', updated);
      return updated;
    });
    logActivity('pmu.approve_upr', 'pmu', `ПМУ заявкаси бошқарма томонидан тасдиқланди: ${item.number}`, item.id);
    return true;
  };

  const approvePmuByPtoSo = (id: string): boolean => {
    const item = pmuZayavkas.find((p) => p.id === id);
    if (!item || item.status !== 'pto_so') return false;
    if (currentUser.role !== 'pto_so' && currentUser.role !== 'admin') return false;

    setPmuZayavkas((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'glinj_so' as PmuZayavka['status'],
              signatures: { ...p.signatures, pto_so: { name: currentUser.fullName, date: new Date().toISOString().replace('T', ' ').slice(0, 16) } },
            }
          : p
      );
      saveState('sm_pmu', updated);
      return updated;
    });
    logActivity('pmu.approve_pto_so', 'pmu', `ПМУ заявкаси Бош ПТО томонидан тасдиқланди: ${item.number}`, item.id);
    return true;
  };

  const approvePmuByGlinjSo = (id: string): boolean => {
    const item = pmuZayavkas.find((p) => p.id === id);
    if (!item || item.status !== 'glinj_so') return false;
    if (currentUser.role !== 'glinj_so' && currentUser.role !== 'admin') return false;

    setPmuZayavkas((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'pmu' as PmuZayavka['status'],
              signatures: { ...p.signatures, glinj_so: { name: currentUser.fullName, date: new Date().toISOString().replace('T', ' ').slice(0, 16) } },
            }
          : p
      );
      saveState('sm_pmu', updated);
      return updated;
    });
    logActivity('pmu.approve_glinj_so', 'pmu', `ПМУ заявкаси Бош муҳандис СО томонидан тасдиқланди → ПМУ Диспетчерига ўтди: ${item.number}`, item.id);
    return true;
  };

  const donePmuByDispatcher = (id: string): boolean => {
    const item = pmuZayavkas.find((p) => p.id === id);
    if (!item || item.status !== 'pmu') return false;
    if (currentUser.role !== 'dispatcher' && currentUser.role !== 'admin') return false;

    setPmuZayavkas((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'done' as PmuZayavka['status'],
              signatures: { ...p.signatures, dispatcher: { name: currentUser.fullName, date: new Date().toISOString().replace('T', ' ').slice(0, 16) } },
            }
          : p
      );
      saveState('sm_pmu', updated);
      return updated;
    });
    logActivity('pmu.done_disp', 'pmu', `ПМУ Диспетчери конструкция ишлаб чиқаришни қабул қилди: ${item.number}`, item.id);
    return true;
  };

  const rejectPmu = (id: string, reason: string): boolean => {
    setPmuZayavkas((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, status: 'rejected' as PmuZayavka['status'], rejectionReason: reason } : p));
      saveState('sm_pmu', updated);
      return updated;
    });
    logActivity('pmu.reject', 'pmu', `ПМУ заявкаси рад этилди: ${reason}`, id);
    return true;
  };

  // PMU Izdeliye Nakladnoy
  const createPmuIzdeliyeNakladnoy = (data: {
    pmuZayavkaId?: string;
    structureName: string;
    quantity: number;
    unit: string;
    objId: string;
    notes?: string;
  }) => {
    const targetObj = objects.find((o) => o.id === data.objId);
    const targetProrab = users.find((u) => u.id === targetObj?.prorabId) || users.find((u) => u.role === 'prorab' && u.org === targetObj?.org);

    const newNak: PmuIzdeliyeNakladnoy = {
      id: `pmu-nak-${Date.now()}`,
      number: `ИН-${String(pmuNakladnoys.length + 1).padStart(2, '0')}/ПМУ-26`,
      pmuZayavkaId: data.pmuZayavkaId,
      structureName: data.structureName,
      quantity: data.quantity,
      unit: data.unit,
      objId: data.objId,
      objName: targetObj?.name || 'Объект',
      prorabId: targetProrab?.id || 'usr-prorab-rmu',
      prorabName: targetProrab?.fullName || 'Прораб',
      konstruktorId: currentUser.id,
      konstruktorName: currentUser.fullName,
      status: 'sent',
      sentDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: data.notes,
    };

    setPmuNakladnoys((prev) => [newNak, ...prev]);
    logActivity('pmu_nakladnoy.create', 'pmu', `ПМУ Конструктор тайёр маҳсулот юк хатини (${newNak.number}) тузиб Прорабга жўнатди`, newNak.id);
  };

  const receivePmuIzdeliyeNakladnoy = (id: string): boolean => {
    const item = pmuNakladnoys.find((n) => n.id === id);
    if (!item || item.status !== 'sent') return false;

    setPmuNakladnoys((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'received', receivedDate: new Date().toISOString().replace('T', ' ').slice(0, 16) } : n))
    );
    logActivity('pmu_nakladnoy.receive', 'pmu', `Прораб тайёр маҳсулот юк хатини қабул қилди: ${item.number}`, item.id);
    return true;
  };

  // ==========================================
  // 5. YUK XATLARI (NAKLADNOY) & OMBORLAR
  // Statuses: sent -> approved | rejected
  // ==========================================
  const createNakladnoy = (data: {
    toOwnerType: 'admin' | 'prorab' | 'expeditor';
    toOwnerId: string;
    toObjId?: string;
    carrierDriver?: string;
    carPlateNumber?: string;
    items: Array<{ materialId: string; qty: number; price?: number }>;
  }): boolean => {
    // Check sender role and ownerType
    let fromType: 'admin' | 'prorab' | 'expeditor' = 'admin';
    if (currentUser.role === 'prorab') fromType = 'prorab';
    else if (currentUser.role === 'snab') fromType = 'expeditor';

    // Verify sender has sufficient stock
    for (const item of data.items) {
      const stock = stocks.find((s) => s.ownerId === currentUser.id && s.materialId === item.materialId);
      if (!stock || stock.qty < item.qty) {
        // If admin warehouse manager creating
        if (currentUser.role === 'admin' || currentUser.role === 'glsklad' || currentUser.role === 'sklad') {
          const adminStock = stocks.find((s) => s.ownerType === 'admin' && s.materialId === item.materialId);
          if (!adminStock || adminStock.qty < item.qty) return false;
        } else {
          return false;
        }
      }
    }

    const toUser = users.find((u) => u.id === data.toOwnerId);
    const toObj = data.toObjId ? objects.find((o) => o.id === data.toObjId) : undefined;

    const nakItems = data.items.map((it) => {
      const mat = materials.find((m) => m.id === it.materialId);
      return {
        materialId: it.materialId,
        materialName: mat?.name || 'Материал',
        unit: mat?.unit || 'дона',
        qty: it.qty,
        price: it.price || mat?.standardPrice || 0,
      };
    });

    const newNak: Nakladnoy = {
      id: `nak-${Date.now()}`,
      number: `Н-${String(nakladnoys.length + 101)}/26`,
      fromOwnerType: fromType,
      fromOwnerId: currentUser.id,
      fromOwnerName: currentUser.fullName,
      toOwnerType: data.toOwnerType,
      toOwnerId: data.toOwnerId,
      toOwnerName: toUser?.fullName || 'Қабул қилувчи',
      toObjId: data.toObjId,
      toObjName: toObj?.name,
      items: nakItems,
      status: 'sent',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      carrierDriver: data.carrierDriver,
      carPlateNumber: data.carPlateNumber,
    };

    setNakladnoys((prev) => {
      const updated = [newNak, ...prev];
      saveState('sm_nakladnoys', updated);
      return updated;
    });

    logActivity('nakladnoy.create', 'nakladnoy', `Янги юк хати тузилди ва юборилди: ${newNak.number}`, newNak.id);
    return true;
  };

  // Rule: ONLY recipient can approve -> triggers automatic stock exchange (sender -qty, recipient +qty)
  const approveNakladnoy = (id: string): boolean => {
    const nak = nakladnoys.find((n) => n.id === id);
    if (!nak || nak.status !== 'sent') return false;

    // Recipient or admin check
    const isRecipient = currentUser.id === nak.toOwnerId || (currentUser.role === 'admin') || (nak.toOwnerType === 'admin' && (currentUser.role === 'glsklad' || currentUser.role === 'sklad'));
    if (!isRecipient) return false;

    // Update stocks
    setStocks((prev) => {
      const updated = [...prev];

      for (const item of nak.items) {
        // Decrease sender stock
        const senderStockIdx = updated.findIndex((s) => (s.ownerId === nak.fromOwnerId || (nak.fromOwnerType === 'admin' && s.ownerType === 'admin')) && s.materialId === item.materialId);
        if (senderStockIdx !== -1) {
          updated[senderStockIdx] = {
            ...updated[senderStockIdx],
            qty: Math.max(0, Number((updated[senderStockIdx].qty - item.qty).toFixed(3))),
            lastUpdated: new Date().toISOString().slice(0, 10),
          };
        }

        // Increase recipient stock
        const recipientStockIdx = updated.findIndex((s) => s.ownerId === nak.toOwnerId && s.materialId === item.materialId);
        if (recipientStockIdx !== -1) {
          updated[recipientStockIdx] = {
            ...updated[recipientStockIdx],
            qty: Number((updated[recipientStockIdx].qty + item.qty).toFixed(3)),
            lastUpdated: new Date().toISOString().slice(0, 10),
          };
        } else {
          // Create new stock entry for recipient
          const mat = materials.find((m) => m.id === item.materialId);
          updated.push({
            id: `stk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            ownerType: nak.toOwnerType,
            ownerId: nak.toOwnerId,
            ownerName: nak.toOwnerName,
            org: currentUser.org,
            objId: nak.toObjId,
            materialId: item.materialId,
            materialName: item.materialName,
            unit: item.unit,
            category: mat?.category || 'other',
            qty: item.qty,
            lastUpdated: new Date().toISOString().slice(0, 10),
          });
        }
      }

      saveState('sm_stocks', updated);
      return updated;
    });

    // Update nakladnoy status to approved
    setNakladnoys((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, status: 'approved' as Nakladnoy['status'], approvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : n));
      saveState('sm_nakladnoys', updated);
      return updated;
    });

    logActivity('nakladnoy.approve', 'nakladnoy', `Юк хати қабул қилинди ва омборлар баланси янгиланди: ${nak.number}`, nak.id);
    return true;
  };

  const rejectNakladnoy = (id: string, reason: string): boolean => {
    const nak = nakladnoys.find((n) => n.id === id);
    if (!nak || nak.status !== 'sent') return false;

    setNakladnoys((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, status: 'rejected' as Nakladnoy['status'], rejectionReason: reason, rejectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : n));
      saveState('sm_nakladnoys', updated);
      return updated;
    });

    logActivity('nakladnoy.reject', 'nakladnoy', `Юк хати рад этилди: ${nak.number} (${reason})`, nak.id);
    return true;
  };

  const adjustStock = (stockId: string, newQty: number, reason: string) => {
    setStocks((prev) => {
      const updated = prev.map((s) => (s.id === stockId ? { ...s, qty: newQty, lastUpdated: new Date().toISOString().slice(0, 10) } : s));
      saveState('sm_stocks', updated);
      return updated;
    });
    logActivity('stock.adjust', 'stock', `Омбор қолдиғи ўзгартирилди: ${newQty} (${reason})`, stockId);
  };

  // ==========================================
  // 6. ACCOUNTS & SYNONYM MAPPINGS
  // ==========================================
  const addAccountInvoice = (invoiceData: Omit<AccountInvoice, 'id' | 'importedAt' | 'importedBy'>) => {
    const newInv: AccountInvoice = {
      ...invoiceData,
      id: `acc-inv-${Date.now()}`,
      importedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      importedBy: currentUser.fullName,
    };
    setAccountInvoices((prev) => [newInv, ...prev]);
    logActivity('account.import', 'account', `Ҳисоб-фактура импорт қилинди: ${newInv.invoiceNumber} (${newInv.supplierName})`, newInv.id);
  };

  const addSynonymMapping = (rawSupplierName: string, canonicalMaterialId: string) => {
    const mat = materials.find((m) => m.id === canonicalMaterialId);
    const newMap: MaterialSynonymMapping = {
      id: `syn-${Date.now()}`,
      rawSupplierName,
      canonicalMaterialId,
      canonicalMaterialName: mat?.name || '',
      org: currentUser.org,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setSynonymMappings((prev) => [newMap, ...prev]);
    logActivity('synonym.add', 'system', `Материал синоними қўшилди: "${rawSupplierName}" -> "${mat?.name}"`, newMap.id);
  };

  // ==========================================
  // 7. BACKUP & SYSTEM RESTORE
  // ==========================================
  const createManualBackup = (): BackupRecord => {
    const backup: BackupRecord = {
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'manual',
      fileName: `manual-backup-${new Date().toISOString().slice(0, 10)}.json`,
      sizeBytes: JSON.stringify({ zayavkas, techReports, ummZayavkas, pmuZayavkas, nakladnoys, stocks }).length,
      recordCounts: {
        zayavkas: zayavkas.length,
        techReports: techReports.length,
        umm: ummZayavkas.length,
        pmu: pmuZayavkas.length,
        nakladnoy: nakladnoys.length,
        stocks: stocks.length,
        activities: activityLogs.length,
      },
    };

    setBackups((prev) => [backup, ...prev]);
    logActivity('backup.manual', 'backup', `Қўлда тизим тўлиқ захира нусхаси яратилди (${backup.fileName})`, backup.id);
    return backup;
  };

  const restoreFromBackupJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.zayavkas) setZayavkas(data.zayavkas);
      if (data.techReports) setTechReports(data.techReports);
      if (data.ummZayavkas) setUmmZayavkas(data.ummZayavkas);
      if (data.pmuZayavkas) setPmuZayavkas(data.pmuZayavkas);
      if (data.nakladnoys) setNakladnoys(data.nakladnoys);
      if (data.stocks) setStocks(data.stocks);
      logActivity('backup.restore', 'backup', 'Тизим маълумотлари захира файлидан қайта тикланди');
      return true;
    } catch (e) {
      console.error('Backup restore failed', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setZayavkas(INITIAL_ZAYAVKAS);
    setTechReports(INITIAL_TECH_REPORTS);
    setUmmZayavkas(INITIAL_UMM_ZAYAVKAS);
    setPmuZayavkas(INITIAL_PMU_ZAYAVKAS);
    setNakladnoys(INITIAL_NAKLADNOYS);
    setStocks(INITIAL_STOCKS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.clear();
    logActivity('system.reset', 'system', 'Тизим бошланғич ҳолатига қайтарилди');
  };

  return (
    <StroyContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        isAuthenticated,
        loginAs,
        loginWithCredentials,
        failedLoginAttempts,
        isLockedOut,
        logout,
        objects,
        materials,
        mechanisms,
        addObject,
        addMaterial,
        addMechanism,
        zayavkas,
        filteredZayavkas,
        createZayavka,
        deleteZayavka,
        updateZayavkaObject,
        approveZayavkaByUpr,
        approveZayavkaByPtoSo,
        approveZayavkaByGlinjSo,
        finalizeZayavkaBySnabSo,
        rejectZayavka,
        techReports,
        filteredTechReports,
        createTechReport,
        updateTechReportFactByPto,
        updateTechReportSpisanieByBuh,
        conductTechReportByGlinj,
        ummZayavkas,
        filteredUmmZayavkas,
        createUmmZayavka,
        signUmmByUpr,
        assignUmmByGlinjSo,
        acceptUmmByDispatcher,
        rejectUmm,
        pmuZayavkas,
        filteredPmuZayavkas,
        createPmuZayavka,
        deletePmuZayavka,
        approvePmuByUpr,
        approvePmuByPtoSo,
        approvePmuByGlinjSo,
        donePmuByDispatcher,
        rejectPmu,
        pmuNakladnoys,
        createPmuIzdeliyeNakladnoy,
        receivePmuIzdeliyeNakladnoy,
        nakladnoys,
        filteredNakladnoys,
        createNakladnoy,
        approveNakladnoy,
        rejectNakladnoy,
        stocks,
        filteredStocks,
        adjustStock,
        accountInvoices,
        synonymMappings,
        addAccountInvoice,
        addSynonymMapping,
        activityLogs,
        backups,
        createManualBackup,
        restoreFromBackupJson,
        resetToDefaults,
        hasOrgAccess,
        canApproveZayavka,
      }}
    >
      {children}
    </StroyContext.Provider>
  );
}

export function useStroy() {
  const context = useContext(StroyContext);
  if (!context) {
    throw new Error('useStroy must be used within a StroyProvider');
  }
  return context;
}
