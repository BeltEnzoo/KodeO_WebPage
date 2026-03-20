import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const quotesRouter = Router();

const quoteItemSchema = z.object({
  description: z.string().min(2, 'Descripcion de item invalida.'),
  imageData: z.string().trim().optional(),
  qty: z.coerce.number().positive('Cantidad invalida.'),
  unitPrice: z.coerce.number().nonnegative('Precio unitario invalido.'),
});

const createQuoteSchema = z.object({
  clientId: z.string().min(1, 'Debe seleccionar un cliente.'),
  validUntil: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  taxPercent: z.coerce.number().min(0).max(100).default(0),
  items: z.array(quoteItemSchema).min(1, 'Debe cargar al menos un item.'),
});

async function getNextQuoteNumber() {
  const lastQuote = await prisma.quote.findFirst({
    orderBy: { number: 'desc' },
    select: { number: true },
  });
  return (lastQuote?.number ?? 0) + 1;
}

function getFormattedQuoteCode(number, date = new Date()) {
  const sequence = String(number).padStart(3, '0');
  const year = date.getFullYear();
  return `${sequence}-${year}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value);
}

async function loadImageFromCandidates(pdfDoc, candidatePaths) {
  for (const candidatePath of candidatePaths) {
    try {
      const bytes = await fs.readFile(candidatePath);
      const lowerPath = candidatePath.toLowerCase();
      if (lowerPath.endsWith('.png')) {
        const image = await pdfDoc.embedPng(bytes);
        return { image, path: candidatePath };
      }
      if (lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg')) {
        const image = await pdfDoc.embedJpg(bytes);
        return { image, path: candidatePath };
      }
    } catch {
      // Ignore missing/invalid files and continue trying candidates.
    }
  }

  return null;
}

async function loadImageFromDataUrl(pdfDoc, dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return null;
  }

  const splitIndex = dataUrl.indexOf(',');
  if (splitIndex < 0) {
    return null;
  }

  const metadata = dataUrl.slice(0, splitIndex).toLowerCase();
  const base64 = dataUrl.slice(splitIndex + 1);
  const bytes = Buffer.from(base64, 'base64');

  if (metadata.includes('image/png')) {
    return pdfDoc.embedPng(bytes);
  }
  if (metadata.includes('image/jpeg') || metadata.includes('image/jpg')) {
    return pdfDoc.embedJpg(bytes);
  }

  return null;
}

function calculateTotals(items, taxPercent) {
  const normalizedItems = items.map((item) => {
    const lineTotal = Number((item.qty * item.unitPrice).toFixed(2));
    return { ...item, lineTotal };
  });
  const subtotal = Number(normalizedItems.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2));
  const tax = Number((subtotal * (taxPercent / 100)).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));
  return { normalizedItems, subtotal, tax, total };
}

async function generateQuotePdf(quote) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const brandBlue = rgb(0.11, 0.16, 0.34);
  const accentGreen = rgb(0.14, 0.85, 0.55);
  const lightGray = rgb(0.94, 0.95, 0.97);
  const quoteCode = getFormattedQuoteCode(quote.number, new Date(quote.issueDate));
  const issueDateLabel = new Date(quote.issueDate).toLocaleDateString('es-AR');
  const logoAsset = await loadImageFromCandidates(pdfDoc, [
    path.join(process.cwd(), 'storage', 'pdf-assets', 'logo.png'),
    path.join(process.cwd(), 'storage', 'pdf-assets', 'logo.jpg'),
    path.join(process.cwd(), 'storage', 'pdf-assets', 'logo.jpeg'),
  ]);
  const signatureAsset = await loadImageFromCandidates(pdfDoc, [
    path.join(process.cwd(), 'storage', 'pdf-assets', 'signature.png'),
    path.join(process.cwd(), 'storage', 'pdf-assets', 'signature.jpg'),
    path.join(process.cwd(), 'storage', 'pdf-assets', 'signature.jpeg'),
  ]);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595,
    height: 842,
    color: rgb(0.99, 0.99, 0.995),
  });

  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595,
    height: 22,
    color: accentGreen,
  });

  page.drawRectangle({
    x: 35,
    y: 760,
    width: 250,
    height: 62,
    color: lightGray,
  });

  if (logoAsset) {
    const logoDims = logoAsset.image.scale(0.42);
    page.drawImage(logoAsset.image, {
      x: 48,
      y: 768,
      width: Math.min(logoDims.width, 180),
      height: Math.min(logoDims.height, 46),
    });
  } else {
    page.drawText('KODE ON', { x: 50, y: 790, size: 24, font: fontBold, color: brandBlue });
    page.drawText('SOLUCIONES DIGITALES', { x: 51, y: 775, size: 8, font, color: rgb(0.37, 0.41, 0.5) });
  }

  page.drawText('PRESUPUESTO', { x: 392, y: 796, size: 18, font: fontBold, color: brandBlue });
  page.drawText(`N° ${quoteCode}`, { x: 445, y: 778, size: 11, font: fontBold, color: brandBlue });

  page.drawText('CLIENTE', { x: 35, y: 740, size: 8, font: fontBold, color: rgb(0.4, 0.44, 0.52) });
  page.drawText(quote.client.businessName, { x: 35, y: 723, size: 14, font: fontBold, color: brandBlue });
  page.drawText(`Fecha: ${issueDateLabel}`, { x: 390, y: 740, size: 9, font: fontBold, color: brandBlue });
  page.drawText('Emite: KodeON Soluciones', { x: 390, y: 726, size: 8, font, color: rgb(0.32, 0.35, 0.43) });
  page.drawText('CUIL: 20-41693774-6', { x: 390, y: 714, size: 8, font, color: rgb(0.32, 0.35, 0.43) });

  page.drawRectangle({ x: 35, y: 678, width: 525, height: 24, color: brandBlue });
  page.drawText('#', { x: 50, y: 686, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('DESCRIPCION', { x: 90, y: 686, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('PRECIO', { x: 360, y: 686, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('CANTIDAD', { x: 430, y: 686, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('TOTAL', { x: 505, y: 686, size: 9, font: fontBold, color: rgb(1, 1, 1) });

  let cursorY = 662;
  let rowNumber = 1;
  for (const item of quote.items) {
    page.drawRectangle({
      x: 35,
      y: cursorY - 8,
      width: 525,
      height: 22,
      color: rowNumber % 2 === 0 ? rgb(0.97, 0.98, 1) : rgb(1, 1, 1),
    });
    page.drawText(String(rowNumber), { x: 50, y: cursorY, size: 9, font, color: brandBlue });
    page.drawText(item.description.slice(0, 42), { x: 90, y: cursorY, size: 9, font, color: rgb(0.18, 0.21, 0.28) });
    page.drawText(formatCurrency(item.unitPrice), { x: 360, y: cursorY, size: 9, font, color: rgb(0.18, 0.21, 0.28) });
    page.drawText(String(item.qty), { x: 447, y: cursorY, size: 9, font, color: rgb(0.18, 0.21, 0.28) });
    page.drawText(formatCurrency(item.lineTotal), { x: 500, y: cursorY, size: 9, fontBold, color: brandBlue });
    cursorY -= 24;

    if (item.imageData) {
      const embeddedItemImage = await loadImageFromDataUrl(pdfDoc, item.imageData);
      if (embeddedItemImage) {
        const itemDims = embeddedItemImage.scale(0.16);
        const drawWidth = Math.min(itemDims.width, 68);
        const drawHeight = Math.min(itemDims.height, 38);
        page.drawImage(embeddedItemImage, {
          x: 90,
          y: cursorY - 6,
          width: drawWidth,
          height: drawHeight,
        });
        cursorY -= 42;
      }
    }

    rowNumber += 1;
  }

  const totalsStartY = cursorY - 24;
  page.drawRectangle({ x: 340, y: totalsStartY + 42, width: 220, height: 20, color: lightGray });
  page.drawText('Subtotal', { x: 350, y: totalsStartY + 48, size: 9, font: fontBold, color: brandBlue });
  page.drawText(formatCurrency(quote.subtotal), { x: 470, y: totalsStartY + 48, size: 9, font: fontBold, color: brandBlue });

  page.drawRectangle({ x: 340, y: totalsStartY + 20, width: 220, height: 20, color: lightGray });
  page.drawText('Impuestos', { x: 350, y: totalsStartY + 26, size: 9, font: fontBold, color: brandBlue });
  page.drawText(formatCurrency(quote.tax), { x: 470, y: totalsStartY + 26, size: 9, font: fontBold, color: brandBlue });

  page.drawRectangle({ x: 340, y: totalsStartY - 8, width: 220, height: 24, color: brandBlue });
  page.drawText('TOTAL', { x: 350, y: totalsStartY, size: 11, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText(formatCurrency(quote.total), { x: 458, y: totalsStartY, size: 11, font: fontBold, color: rgb(1, 1, 1) });

  const notesY = Math.max(totalsStartY - 70, 180);
  page.drawText('NOTAS', { x: 35, y: notesY + 24, size: 9, font: fontBold, color: brandBlue });
  page.drawRectangle({ x: 35, y: notesY - 4, width: 300, height: 36, color: lightGray });
  page.drawText(quote.notes || 'Sin notas', {
    x: 43,
    y: notesY + 9,
    size: 9,
    font,
    color: rgb(0.2, 0.22, 0.3),
    maxWidth: 285,
  });

  page.drawText('FIRMA', { x: 238, y: 172, size: 9, font: fontBold, color: brandBlue });
  page.drawLine({ start: { x: 205, y: 154 }, end: { x: 360, y: 154 }, thickness: 1, color: rgb(0.7, 0.72, 0.78) });
  if (signatureAsset) {
    const signatureDims = signatureAsset.image.scale(0.42);
    page.drawImage(signatureAsset.image, {
      x: 220,
      y: 142,
      width: Math.min(signatureDims.width, 140),
      height: Math.min(signatureDims.height, 54),
    });
  } else {
    page.drawText('Belen Gonzalez Beltran', { x: 220, y: 138, size: 9, font, color: rgb(0.32, 0.35, 0.43) });
  }

  page.drawRectangle({ x: 300, y: 60, width: 260, height: 18, color: brandBlue });
  page.drawText('www.kodeonsoluciones.com', { x: 365, y: 66, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });

  page.drawText('instagram: kode.on.soluciones', { x: 35, y: 30, size: 8, font, color: brandBlue });
  page.drawText('whatsapp: 2944369647', { x: 410, y: 30, size: 8, font, color: brandBlue });

  const outputDir = path.join(process.cwd(), 'storage', 'pdf', 'quotes');
  await fs.mkdir(outputDir, { recursive: true });
  const fileName = `quote-${quote.number}-${quote.id}.pdf`;
  const filePath = path.join(outputDir, fileName);

  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(filePath, pdfBytes);

  return { fileName, relativePath: path.join('storage', 'pdf', 'quotes', fileName) };
}

quotesRouter.get('/', requireAuth, requireRole('ADMIN'), async (_req, res) => {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { id: true, businessName: true } },
      items: true,
    },
  });

  return res.json({ quotes });
});

quotesRouter.post('/', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const parsed = createQuoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' });
  }

  const quoteNumber = await getNextQuoteNumber();
  const { normalizedItems, subtotal, tax, total } = calculateTotals(parsed.data.items, parsed.data.taxPercent);

  try {
    const quote = await prisma.quote.create({
      data: {
        number: quoteNumber,
        clientId: parsed.data.clientId,
        validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : null,
        notes: parsed.data.notes || null,
        subtotal,
        tax,
        total,
        items: {
          create: normalizedItems.map((item) => ({
            description: item.description,
            imageData: item.imageData || null,
            qty: item.qty,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        },
      },
      include: {
        client: { select: { id: true, businessName: true } },
        items: true,
      },
    });

    return res.status(201).json({ quote });
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cliente invalido.' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Numero de presupuesto duplicado. Reintentar.' });
    }
    return res.status(500).json({ error: 'No se pudo crear el presupuesto.' });
  }
});

quotesRouter.post('/:quoteId/generate-pdf', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const quote = await prisma.quote.findUnique({
    where: { id: req.params.quoteId },
    include: {
      client: { select: { businessName: true } },
      items: true,
    },
  });

  if (!quote) {
    return res.status(404).json({ error: 'Presupuesto no encontrado.' });
  }

  const { relativePath } = await generateQuotePdf(quote);
  const updatedQuote = await prisma.quote.update({
    where: { id: quote.id },
    data: { pdfPath: relativePath },
  });

  return res.json({
    quote: updatedQuote,
    downloadUrl: `/api/quotes/${quote.id}/pdf`,
  });
});

quotesRouter.get('/:quoteId/pdf', requireAuth, async (req, res) => {
  const quote = await prisma.quote.findUnique({
    where: { id: req.params.quoteId },
    select: { id: true, clientId: true, number: true, pdfPath: true },
  });

  if (!quote || !quote.pdfPath) {
    return res.status(404).json({ error: 'PDF no disponible.' });
  }

  const isAdmin = req.user.role === 'ADMIN';
  const isOwnerClient = req.user.role === 'CLIENT' && req.user.clientId === quote.clientId;

  if (!isAdmin && !isOwnerClient) {
    return res.status(403).json({ error: 'No autorizado para ver este documento.' });
  }

  const absolutePath = path.join(process.cwd(), quote.pdfPath);
  return res.download(absolutePath, `presupuesto-${getFormattedQuoteCode(quote.number)}.pdf`);
});

quotesRouter.delete('/:quoteId', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const quote = await prisma.quote.findUnique({
    where: { id: req.params.quoteId },
    select: { id: true, pdfPath: true },
  });

  if (!quote) {
    return res.status(404).json({ error: 'Presupuesto no encontrado.' });
  }

  if (quote.pdfPath) {
    const absolutePath = path.join(process.cwd(), quote.pdfPath);
    await fs.unlink(absolutePath).catch(() => null);
  }

  await prisma.quote.delete({ where: { id: quote.id } });
  return res.status(204).send();
});

export { quotesRouter };
