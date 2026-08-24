export type OrgType = 'РМУ' | 'СМУ' | 'СУ' | 'ПМУ' | 'УММ' | 'СО';

export type UserRole =
  | 'admin'
  | 'prorab'
  | 'glinj_upr'
  | 'nach_upr'
  | 'pto_upr'
  | 'buh_upr'
  | 'snab'
  | 'snab_so'
  | 'pto_so'
  | 'glinj_so'
  | 'buh_so'
  | 'glsklad'
  | 'sklad'
  | 'ruk'
  | 'dispatcher'
  | 'konstruktor'
  | 'dispatcher_umm';

export interface User {
  id: string;
  login: string;
  fullName: string;
  role: UserRole;
  roleTitleUz: string;
  roleTitleRu: string;
  org: OrgType;
  objId?: string;
  phone?: string;
  avatarUrl?: string;
  passwordHash?: string;
}

export interface ConstructionObject {
  id: string;
  code: string;
  name: string;
  org: OrgType;
  address: string;
  prorabId: string;
  status: 'active' | 'completed' | 'planned';
  startDate: string;
  endDate?: string;
}

export interface MaterialItem {
  id: string;
  code: string;
  name: string;
  unit: string;
  category: 'metal' | 'cement' | 'concrete' | 'brick' | 'pipes' | 'insulation' | 'paint' | 'timber' | 'electrical' | 'other';
  standardPrice?: number;
}

export interface MechanismItem {
  id: string;
  code: string;
  name: string;
  type: string;
  plateNumber: string;
  org: OrgType;
  status: 'available' | 'in_use' | 'maintenance';
}

// 1. ZAYAVKA (Materiallar buyurtmasi)
export type ZayavkaStatus = 'glinj_upr' | 'pto_so' | 'glinj_so' | 'snab_so' | 'completed' | 'rejected';

export interface ZayavkaPosition {
  id: string;
  materialId: string;
  materialName: string;
  unit: string;
  requestedQty: number;
  approvedQty?: number;
  ptoChecked?: boolean;
  ptoNote?: string;
  notes?: string;
}

export interface MaterialZayavka {
  id: string;
  number: string;
  objId: string;
  objName: string;
  org: OrgType;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  status: ZayavkaStatus;
  urgency: 'normal' | 'urgent' | 'critical';
  positions: ZayavkaPosition[];
  rejectionReason?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  // Approval signatures
  signatures: {
    glinj_upr?: { name: string; date: string; role: string };
    pto_so?: { name: string; date: string; note?: string };
    glinj_so?: { name: string; date: string };
    snab_so?: { name: string; date: string; contractNo?: string; contractDate?: string; invoiceFileName?: string; invoiceFileUrl?: string };
  };
  contractNo?: string;
  contractDate?: string;
  invoiceFile?: {
    name: string;
    size: string;
    url?: string;
    uploadedAt?: string;
  };
  history?: Array<{
    action: string;
    performedBy: string;
    role: string;
    timestamp: string;
    comment?: string;
  }>;
}

// 2. TEXNIK HISOBOT (M-29 oylik hisobot)
export type TechReportStatus = 'new' | 'pto' | 'buh' | 'listed';

export interface TechReportRow {
  id: string;
  materialId: string;
  materialName: string;
  unit: string;
  normQty: number; // Reja / Normativ
  factQty: number; // 1-ustun: «Фактически» (Prorab kirgizadi, PTO tekshiradi)
  spisanieQty: number; // 2-ustun: «Списание» (Buhgalter kirgizadi)
  differenceQty: number; // 3-ustun: «Экономия/Перерасход» = spisanieQty - factQty
  note?: string;
}

export interface TechReport {
  id: string;
  number: string;
  month: string; // e.g. "2026-08"
  monthName: string; // e.g. "Avgust 2026"
  objId: string;
  objName: string;
  org: OrgType;
  authorId: string;
  authorName: string;
  createdAt: string;
  status: TechReportStatus;
  rows: TechReportRow[];
  signatures: {
    prorab?: { name: string; date: string };
    pto_upr?: { name: string; date: string };
    buh_upr?: { name: string; date: string };
    glinj_upr?: { name: string; date: string };
  };
  totalNorm?: number;
  totalFact?: number;
  totalSpisanie?: number;
}

// 3. UMM ZAYAVKASI (Texnika va mexanizmlar)
export type UmmStatus = 'new' | 'glinj_so' | 'umm' | 'accepted' | 'rejected';

export interface UmmZayavka {
  id: string;
  number: string;
  objId: string;
  objName: string;
  org: OrgType;
  authorId: string;
  authorName: string;
  requestedForName?: string; // boshqa xodim nomidan ham bo'lishi mumkin
  targetDate: string; // Chiqish sanasi
  targetWorkDescription: string; // Bajariladigan ish maqsadi
  requestedMechanisms: Array<{
    mechanismType: string;
    count: number;
    hours: number;
    notes?: string;
  }>;
  assignedMechanisms?: Array<{
    mechanismId: string;
    mechanismName: string;
    plateNumber: string;
    driverName?: string;
    startTime?: string;
    endTime?: string;
    shiftHours?: number;
  }>;
  status: UmmStatus;
  createdAt: string;
  signatures: {
    upr_head?: { name: string; role: string; date: string };
    glinj_so?: { name: string; date: string };
    dispatcher_umm?: { name: string; date: string };
  };
  rejectionReason?: string;
}

// 4. PMU ZAYAVKASI (Konstruksiya buyurtmasi)
export type PmuStatus = 'upr' | 'pto_so' | 'glinj_so' | 'pmu' | 'done' | 'rejected';

export interface PmuZayavka {
  id: string;
  number: string;
  objId: string;
  objName: string;
  org: OrgType;
  authorId: string;
  authorName: string;
  structureName: string;
  category: 'metal_ferma' | 'kolonna' | 'balka' | 'armokarkas' | 'opora' | 'other';
  quantity: number;
  unit: string;
  technicalSpecs: string;
  drawingFile?: {
    name: string;
    size: string;
    type: string;
    base64OrUrl?: string;
    uploadedAt: string;
  };
  status: PmuStatus;
  createdAt: string;
  signatures: {
    upr_head?: { name: string; role: string; date: string };
    pto_so?: { name: string; date: string };
    glinj_so?: { name: string; date: string };
    dispatcher?: { name: string; date: string };
  };
  rejectionReason?: string;
}

// PMU Izdeliye Nakladnoysi
export interface PmuIzdeliyeNakladnoy {
  id: string;
  number: string;
  pmuZayavkaId?: string;
  structureName: string;
  quantity: number;
  unit: string;
  objId: string;
  objName: string;
  prorabId: string;
  prorabName: string;
  konstruktorId: string;
  konstruktorName: string;
  status: 'sent' | 'received' | 'rejected';
  sentDate: string;
  receivedDate?: string;
  notes?: string;
}

export type PmuProductTransfer = PmuIzdeliyeNakladnoy;

// 5. YUK XATLARI (Nakladnoy / Omborlararo ko'chirish)
export type OwnerType = 'admin' | 'prorab' | 'expeditor';

export interface NakladnoyPosition {
  materialId: string;
  materialName: string;
  unit: string;
  qty: number;
  price?: number;
}

export interface Nakladnoy {
  id: string;
  number: string;
  fromOwnerType: OwnerType;
  fromOwnerId: string;
  fromOwnerName: string;
  toOwnerType: OwnerType;
  toOwnerId: string;
  toOwnerName: string;
  toObjId?: string;
  toObjName?: string;
  items: NakladnoyPosition[];
  status: 'sent' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  carrierDriver?: string;
  carPlateNumber?: string;
}

// 6. OMBORLAR & BALANSLAR
export interface StockBalance {
  id: string;
  ownerType: OwnerType;
  ownerId: string;
  ownerName: string;
  org?: OrgType;
  objId?: string;
  materialId: string;
  materialName: string;
  unit: string;
  category?: string;
  qty: number;
  lastUpdated: string;
}

// 7. HISOB-FAKTURALAR & ACCOUNTS
export interface AccountInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  supplierName: string;
  supplierInn?: string;
  totalSum: number;
  org: OrgType;
  objId?: string;
  objName?: string;
  items: Array<{
    rawMaterialName: string;
    matchedMaterialId?: string;
    matchedMaterialName?: string;
    unit: string;
    qty: number;
    price: number;
    total: number;
  }>;
  status: 'imported' | 'verified' | 'posted';
  importedAt: string;
  importedBy: string;
}

export interface MaterialSynonymMapping {
  id: string;
  rawSupplierName: string;
  canonicalMaterialId: string;
  canonicalMaterialName: string;
  org?: OrgType;
  createdAt: string;
}

// 8. AUDIT & BACKUP
export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  org: OrgType;
  action: string;
  entityType: 'zayavka' | 'tech_report' | 'umm' | 'pmu' | 'nakladnoy' | 'account' | 'stock' | 'auth' | 'backup' | 'system';
  entityId?: string;
  description: string;
  details?: Record<string, any>;
}

export interface BackupRecord {
  id: string;
  createdAt: string;
  type: 'auto' | 'manual';
  fileName: string;
  sizeBytes: number;
  recordCounts: {
    zayavkas: number;
    techReports: number;
    umm: number;
    pmu: number;
    nakladnoy: number;
    stocks: number;
    activities: number;
  };
}
