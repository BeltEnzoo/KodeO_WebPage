import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const brandBlue = rgb(0.11, 0.16, 0.34);
const accentGreen = rgb(0.06, 0.46, 0.43);
const lightGray = rgb(0.94, 0.95, 0.97);
const muted = rgb(0.32, 0.35, 0.43);
const ink = rgb(0.18, 0.21, 0.28);

function safeText(value) {
  return String(value ?? '')
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, '')
    .trim();
}

function wrapLines(text, font, size, maxWidth) {
  const source = safeText(text) || '-';
  const words = source.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : ['-'];
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-AR');
}

function remitoCode(equipment) {
  const year = new Date(equipment.intakeDate || Date.now()).getFullYear();
  const seq = String(equipment.id || '')
    .replace(/-/g, '')
    .slice(0, 8)
    .toUpperCase();
  return `${year}-${seq || '00000000'}`;
}

function fileName(equipment) {
  const client = safeText(equipment.client?.businessName || 'Cliente')
    .replace(/[\\/:*?"<>|]+/g, '')
    .slice(0, 40);
  const team = safeText(equipment.equipmentName || 'equipo')
    .replace(/[\\/:*?"<>|]+/g, '')
    .slice(0, 30);
  return `Remito-${client}-${team}.pdf`;
}

function drawField(page, font, fontBold, label, value, x, y, width) {
  page.drawText(label, { x, y: y + 14, size: 8, font: fontBold, color: muted });
  const lines = wrapLines(value, font, 10, width);
  lines.slice(0, 3).forEach((line, index) => {
    page.drawText(line, { x, y: y - index * 13, size: 10, font, color: ink });
  });
}

export async function downloadRemitoPdf(equipment) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const code = remitoCode(equipment);
  const client = equipment.client || {};
  const location = equipment.location === 'CAMPO' ? 'Campo (hospital)' : 'Taller';

  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.99, 0.99, 0.995) });
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 22, color: accentGreen });
  page.drawRectangle({ x: 35, y: 760, width: 250, height: 62, color: lightGray });

  page.drawText('KODE ON', { x: 50, y: 790, size: 22, font: fontBold, color: brandBlue });
  page.drawText('SOLUCIONES DIGITALES', { x: 51, y: 775, size: 8, font, color: muted });

  page.drawText('REMITO', { x: 430, y: 796, size: 18, font: fontBold, color: brandBlue });
  page.drawText(`Nro. ${code}`, { x: 430, y: 778, size: 11, font: fontBold, color: brandBlue });
  page.drawText(`Fecha: ${formatDate(equipment.intakeDate || equipment.createdAt)}`, {
    x: 430,
    y: 762,
    size: 9,
    font,
    color: muted,
  });

  page.drawText('CLIENTE', { x: 35, y: 738, size: 8, font: fontBold, color: muted });
  page.drawText(safeText(client.businessName) || 'Sin cliente', {
    x: 35,
    y: 720,
    size: 14,
    font: fontBold,
    color: brandBlue,
  });
  page.drawText('Emite: KodeON Soluciones', { x: 390, y: 738, size: 8, font, color: muted });
  page.drawText('CUIL: 20-41693774-6', { x: 390, y: 724, size: 8, font, color: muted });
  page.drawText('Servicio tecnico biomedico', { x: 390, y: 710, size: 8, font, color: muted });

  let infoY = 688;
  const clientBits = [
    client.cuit ? `CUIT: ${client.cuit}` : null,
    client.address ? `Direccion: ${client.address}` : null,
    client.phone ? `Tel: ${client.phone}` : null,
    client.email ? `Email: ${client.email}` : null,
  ].filter(Boolean);

  if (clientBits.length) {
    page.drawRectangle({
      x: 35,
      y: infoY - 8 - clientBits.length * 14,
      width: 525,
      height: 16 + clientBits.length * 14,
      color: lightGray,
    });
    clientBits.forEach((line, index) => {
      page.drawText(safeText(line), { x: 45, y: infoY - 2 - index * 14, size: 9, font, color: ink });
    });
    infoY -= 28 + clientBits.length * 14;
  }

  page.drawRectangle({ x: 35, y: infoY - 8, width: 525, height: 24, color: brandBlue });
  page.drawText('EQUIPO INTERVENIDO', { x: 45, y: infoY, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  infoY -= 46;

  drawField(page, font, fontBold, 'Equipo', equipment.equipmentName, 45, infoY, 250);
  drawField(page, font, fontBold, 'Ubicacion', location, 320, infoY, 220);
  infoY -= 48;
  drawField(page, font, fontBold, 'Marca', equipment.brand, 45, infoY, 160);
  drawField(page, font, fontBold, 'Modelo', equipment.model, 220, infoY, 150);
  drawField(page, font, fontBold, 'Nro. de serie', equipment.serialNumber, 390, infoY, 150);
  infoY -= 56;

  function drawBox(title, body) {
    const lines = wrapLines(body, font, 10, 500);
    const height = 28 + lines.length * 13;
    page.drawText(title, { x: 35, y: infoY + 8, size: 8, font: fontBold, color: muted });
    page.drawRectangle({ x: 35, y: infoY - height + 18, width: 525, height, color: lightGray });
    lines.forEach((line, index) => {
      page.drawText(line, { x: 45, y: infoY - 4 - index * 13, size: 10, font, color: ink });
    });
    infoY -= height + 22;
  }

  drawBox('DIAGNOSTICO DE INGRESO', equipment.diagnosis || 'Sin diagnostico');
  drawBox('ACCION TECNICA REALIZADA', equipment.technicalAction || 'Sin accion tecnica registrada');

  page.drawText('Este remito documenta la intervencion tecnica sobre el equipamiento indicado.', {
    x: 35,
    y: 168,
    size: 8,
    font,
    color: muted,
  });

  page.drawLine({ start: { x: 45, y: 120 }, end: { x: 250, y: 120 }, thickness: 1, color: rgb(0.7, 0.72, 0.78) });
  page.drawText('KodeON Soluciones', { x: 70, y: 106, size: 9, font: fontBold, color: brandBlue });
  page.drawText('Tecnico responsable', { x: 78, y: 92, size: 8, font, color: muted });

  page.drawLine({ start: { x: 345, y: 120 }, end: { x: 550, y: 120 }, thickness: 1, color: rgb(0.7, 0.72, 0.78) });
  page.drawText('Cliente / Receptor', { x: 390, y: 106, size: 9, font: fontBold, color: brandBlue });
  page.drawText('Recibi conforme', { x: 398, y: 92, size: 8, font, color: muted });

  page.drawRectangle({ x: 300, y: 36, width: 260, height: 18, color: brandBlue });
  page.drawText('www.kodeonsoluciones.com', { x: 348, y: 42, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('WhatsApp 2944369647  |  on.kode.soluciones@gmail.com', {
    x: 35,
    y: 42,
    size: 8,
    font,
    color: brandBlue,
  });

  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName(equipment);
  link.click();
  URL.revokeObjectURL(url);
}
