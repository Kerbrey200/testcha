import * as XLSX from 'xlsx';
import { MaterialZayavka, TechReport, Nakladnoy, StockBalance, AccountInvoice } from '@/types/stroy';

// Helper to trigger browser download of an xlsx workbook
function downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

// 1. Export Material Zayavka
export function exportZayavkaToExcel(zayavka: MaterialZayavka) {
  const data = [
    ['«СТРОЙМЕНЕДЖЕР» ТИЗИМИ — МАТЕРИАЛЛАР ЗАЯВКАСИ'],
    [`Ҳужжат рақами:`, zayavka.number, '', `Сана:`, zayavka.createdAt],
    [`Объект:`, zayavka.objName, '', `Бошқарма (ОРГ):`, zayavka.org],
    [`Муаллиф (Прораб):`, zayavka.authorName, '', `Ҳолати (Статус):`, zayavka.status],
    [`Шарнома рақами:`, zayavka.contractNo || '—', '', `Шарнома санаси:`, zayavka.contractDate || '—'],
    [],
    ['№', 'Материал номи', 'Ўлчов бирлиги', 'Сўралган миқдор', 'Тасдиқланган миқдор', 'Бош ПТО белгиси', 'ПТО изоҳи', 'Қўшимча изоҳ'],
  ];

  zayavka.positions.forEach((pos, idx) => {
    data.push([
      String(idx + 1),
      pos.materialName,
      pos.unit,
      String(pos.requestedQty),
      String(pos.approvedQty ?? pos.requestedQty),
      pos.ptoChecked ? 'Тасдиқланган' : 'Кўриб чиқилмоқда',
      pos.ptoNote || '',
      pos.notes || '',
    ]);
  });

  data.push([]);
  data.push(['ТАСДИҚЛОВЧИЛАР ИМЗОЛАРИ:']);
  data.push(['Бошқарма раҳбарияти (Гл.инж / Нач.упр):', zayavka.signatures.glinj_upr ? `${zayavka.signatures.glinj_upr.name} (${zayavka.signatures.glinj_upr.date})` : '—']);
  data.push(['Бош ПТО СО (pto_so):', zayavka.signatures.pto_so ? `${zayavka.signatures.pto_so.name} (${zayavka.signatures.pto_so.date})` : '—']);
  data.push(['Бош муҳандис СО (glinj_so):', zayavka.signatures.glinj_so ? `${zayavka.signatures.glinj_so.name} (${zayavka.signatures.glinj_so.date})` : '—']);
  data.push(['Таъминот СО (snab_so):', zayavka.signatures.snab_so ? `${zayavka.signatures.snab_so.name} (${zayavka.signatures.snab_so.date})` : '—']);

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Заявка');
  downloadWorkbook(wb, `Zayavka_${zayavka.number.replace(/[/\\?%*:|"<>]/g, '_')}`);
}

// 2. Export Technical Report (M-29)
export function exportTechReportToExcel(report: TechReport) {
  const data = [
    ['М-29 ШАКЛДАГИ ОЙЛИК ТЕХНИК ҲИСОБОТ (МАТЕРИАЛЛАР САРФИ)'],
    [`Ҳисобот №:`, report.number, '', `Ҳисобот даври:`, report.monthName],
    [`Объект:`, report.objName, '', `Бошқарма:`, report.org],
    [`Майдон бошлиғи (Прораб):`, report.authorName, '', `Ҳолати:`, report.status],
    [],
    ['№', 'Материал номи', 'Бирлиги', 'Норматив бўйича', '1-устун: Фактически (ПРОРАБ/ПТО)', '2-устун: Списание (БУХГАЛТЕР)', '3-устун: Иқтисод(-) / Ортиқча(+) сарф', 'Изоҳ'],
  ];

  report.rows.forEach((r, idx) => {
    data.push([
      String(idx + 1),
      r.materialName,
      r.unit,
      String(r.normQty),
      String(r.factQty),
      String(r.spisanieQty),
      String(r.differenceQty),
      r.note || '',
    ]);
  });

  data.push([]);
  data.push(['МАСЪУЛ ШАХСЛАР ИМЗОЛАРИ:']);
  data.push(['1. Прораб (топширди):', report.signatures.prorab ? `${report.signatures.prorab.name} (${report.signatures.prorab.date})` : '—']);
  data.push(['2. ПТО бошқарма (текширди):', report.signatures.pto_upr ? `${report.signatures.pto_upr.name} (${report.signatures.pto_upr.date})` : '—']);
  data.push(['3. Бухгалтер бошқарма (ҳисоблади):', report.signatures.buh_upr ? `${report.signatures.buh_upr.name} (${report.signatures.buh_upr.date})` : '—']);
  data.push(['4. Бош муҳандис (ўтказди - Провести):', report.signatures.glinj_upr ? `${report.signatures.glinj_upr.name} (${report.signatures.glinj_upr.date})` : '—']);

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Техник ҳисобот');
  downloadWorkbook(wb, `Tex_Hisobot_${report.number.replace(/[/\\?%*:|"<>]/g, '_')}`);
}

// 3. Export Nakladnoy (Waybill)
export function exportNakladnoyToExcel(nak: Nakladnoy) {
  const data = [
    ['М-11 ШАКЛДАГИ ИЧКИ КЎЧИРИШ ЮК ХАТИ (НАКЛАДНОЙ)'],
    [`Юк хати №:`, nak.number, '', `Сана:`, nak.createdAt],
    [`Юк жўнатувчи:`, `${nak.fromOwnerName} (${nak.fromOwnerType})`, '', `Юк қабул қилувчи:`, `${nak.toOwnerName} (${nak.toOwnerType})`],
    [`Етказувчи ҳайдовчи:`, nak.carrierDriver || '—', '', `Авто рақами:`, nak.carPlateNumber || '—'],
    [`Қабул қилинган объект:`, nak.toObjName || '—', '', `Ҳолати:`, nak.status],
    [],
    ['№', 'Материал номи', 'Ўлчов бирлиги', 'Миқдори', 'Нархи (сўм)', 'Жами суммаси (сўм)'],
  ];

  let totalSum = 0;
  nak.items.forEach((item, idx) => {
    const itemTotal = (item.price || 0) * item.qty;
    totalSum += itemTotal;
    data.push([
      String(idx + 1),
      item.materialName,
      item.unit,
      String(item.qty),
      item.price ? item.price.toLocaleString() : '0',
      itemTotal.toLocaleString(),
    ]);
  });

  data.push(['', '', '', '', 'ЖАМИ:', totalSum.toLocaleString()]);

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Накладной');
  downloadWorkbook(wb, `Nakladnoy_${nak.number.replace(/[/\\?%*:|"<>]/g, '_')}`);
}

// 4. Export Stocks / Balances
export function exportStocksToExcel(stocks: StockBalance[]) {
  const data = [
    ['«СТРОЙМЕНЕДЖЕР» — ОМБОР ВА ОБЪЕКТЛАРДАГИ ҚОЛДИҚЛАР ЖУРНАЛИ'],
    [`Экспорт вақти:`, new Date().toLocaleString(), '', `Жами позициялар:`, String(stocks.length)],
    [],
    ['№', 'Омбор эгаси / Объект', 'Омбор тури', 'Бошқарма (ОРГ)', 'Материал номи', 'Бирлиги', 'Категория', 'Қолдиқ миқдори', 'Сўнгги ўзгариш'],
  ];

  stocks.forEach((stk, idx) => {
    data.push([
      String(idx + 1),
      stk.ownerName,
      stk.ownerType === 'admin' ? 'Марказий омбор' : stk.ownerType === 'prorab' ? 'Прораб объекти' : 'Экспедитор',
      stk.org || '—',
      stk.materialName,
      stk.unit,
      stk.category || '—',
      String(stk.qty),
      stk.lastUpdated,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Қолдиқлар');
  downloadWorkbook(wb, `Ombor_Qoldiqlari_${new Date().toISOString().slice(0, 10)}`);
}

// Parse uploaded Excel for Tech Report
export function parseTechReportExcel(file: File): Promise<Array<{ materialName: string; unit: string; normQty: number; factQty: number; note?: string }>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any[]>(firstSheet, { header: 1 });

        // Find header row containing "Материал" or "Номи"
        let headerIdx = -1;
        for (let i = 0; i < Math.min(rows.length, 10); i++) {
          const rowStr = (rows[i] || []).join(' ').toLowerCase();
          if (rowStr.includes('материал') || rowStr.includes('номи') || rowStr.includes('фактически')) {
            headerIdx = i;
            break;
          }
        }

        const parsedRows: Array<{ materialName: string; unit: string; normQty: number; factQty: number; note?: string }> = [];

        const startIdx = headerIdx !== -1 ? headerIdx + 1 : 1;
        for (let i = startIdx; i < rows.length; i++) {
          const r = rows[i];
          if (!r || r.length < 2) continue;
          
          // Let's identify columns
          const matName = String(r[1] || r[0] || '').trim();
          if (!matName || matName.startsWith('№') || matName.startsWith('Жами') || matName.startsWith('ИТОГО')) continue;
          
          const unit = String(r[2] || 'тн').trim();
          const normQty = parseFloat(String(r[3] || '0').replace(',', '.')) || 0;
          const factQty = parseFloat(String(r[4] || r[3] || '0').replace(',', '.')) || normQty;
          const note = r[7] || r[6] || r[5] ? String(r[7] || r[6] || r[5]) : '';

          parsedRows.push({
            materialName: matName,
            unit: unit || 'дона',
            normQty,
            factQty,
            note,
          });
        }

        resolve(parsedRows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
