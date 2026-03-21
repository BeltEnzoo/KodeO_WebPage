import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value);
}

function getFormattedQuoteCode(num: number, date: Date) {
  const seq = String(num).padStart(3, '0');
  return `${seq}-${date.getFullYear()}`;
}

async function loadImageFromDataUrl(pdfDoc: PDFDocument, dataUrl: string) {
  if (!dataUrl?.startsWith('data:image/')) return null;
  const idx = dataUrl.indexOf(',');
  if (idx < 0) return null;
  const base64 = dataUrl.slice(idx + 1);
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const meta = dataUrl.slice(0, idx).toLowerCase();
  if (meta.includes('image/png')) return pdfDoc.embedPng(bytes);
  if (meta.includes('image/jpeg') || meta.includes('image/jpg')) return pdfDoc.embedJpg(bytes);
  return null;
}

async function loadImageFromStorage(
  supabase: ReturnType<typeof createClient>,
  pdfDoc: PDFDocument,
  path: string
) {
  try {
    const { data, error } = await supabase.storage.from('pdf-assets').download(path);
    if (error || !data) return null;
    const bytes = new Uint8Array(await data.arrayBuffer());
    const lower = path.toLowerCase();
    if (lower.endsWith('.png')) return pdfDoc.embedPng(bytes);
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return pdfDoc.embedJpg(bytes);
    return null;
  } catch {
    return null;
  }
}

async function loadIconFromUrl(pdfDoc: PDFDocument, url: string) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KodeON-PDF/1.0; +https://kodeonsoluciones.com)' },
    });
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    return pdfDoc.embedPng(bytes);
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No autorizado.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'No autorizado.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Solo administradores pueden generar PDFs.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { quoteId } = await req.json();
    if (!quoteId) {
      return new Response(
        JSON.stringify({ error: 'Falta quoteId.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: quote, error: quoteErr } = await supabase
      .from('quotes')
      .select(`
        *,
        client:clients(business_name),
        items:quote_items(*)
      `)
      .eq('id', quoteId)
      .single();

    if (quoteErr || !quote) {
      return new Response(
        JSON.stringify({ error: 'Presupuesto no encontrado.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clientName = (quote.client as { business_name?: string })?.business_name ?? 'Cliente';
    const items = (quote.items ?? []) as Array<{
      description: string;
      unit_price: number;
      qty: number;
      line_total: number;
      image_data?: string;
    }>;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const brandBlue = rgb(0.11, 0.16, 0.34);
    const accentGreen = rgb(0.14, 0.85, 0.55);
    const lightGray = rgb(0.94, 0.95, 0.97);
    const quoteCode = getFormattedQuoteCode(quote.number, new Date(quote.issue_date));
    const issueDateLabel = new Date(quote.issue_date).toLocaleDateString('es-AR');

    const logoImg = await loadImageFromStorage(supabase, pdfDoc, 'logo.png');
    const signatureImg = await loadImageFromStorage(supabase, pdfDoc, 'signature.png');
    const iconUrls = {
      instagram: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/48px-Instagram_logo_2016.svg.png',
        'https://img.icons8.com/color/48/instagram-new.png',
      ],
      whatsapp: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/48px-WhatsApp.svg.png',
        'https://img.icons8.com/color/48/whatsapp.png',
      ],
    };
    let instagramIcon = await loadImageFromStorage(supabase, pdfDoc, 'instagram.png');
    if (!instagramIcon) for (const u of iconUrls.instagram) { instagramIcon = await loadIconFromUrl(pdfDoc, u); if (instagramIcon) break; }
    let whatsappIcon = await loadImageFromStorage(supabase, pdfDoc, 'whatsapp.png');
    if (!whatsappIcon) for (const u of iconUrls.whatsapp) { whatsappIcon = await loadIconFromUrl(pdfDoc, u); if (whatsappIcon) break; }

    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.99, 0.99, 0.995) });
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 22, color: accentGreen });
    page.drawRectangle({ x: 35, y: 760, width: 250, height: 62, color: lightGray });

    if (logoImg) {
      const dims = logoImg.scaleToFit(230, 55);
      page.drawImage(logoImg, { x: 40, y: 768, width: dims.width, height: dims.height });
    } else {
      page.drawText('KODE ON', { x: 50, y: 790, size: 24, font: fontBold, color: brandBlue });
      page.drawText('SOLUCIONES DIGITALES', { x: 51, y: 775, size: 8, font, color: rgb(0.37, 0.41, 0.5) });
    }
    page.drawText('PRESUPUESTO', { x: 392, y: 796, size: 18, font: fontBold, color: brandBlue });
    page.drawText(`N° ${quoteCode}`, { x: 445, y: 778, size: 11, font: fontBold, color: brandBlue });
    page.drawText('CLIENTE', { x: 35, y: 740, size: 8, font: fontBold, color: rgb(0.4, 0.44, 0.52) });
    page.drawText(clientName, { x: 35, y: 723, size: 14, font: fontBold, color: brandBlue });
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
    let rowNum = 1;
    for (const item of items) {
      page.drawRectangle({
        x: 35,
        y: cursorY - 8,
        width: 525,
        height: 22,
        color: rowNum % 2 === 0 ? rgb(0.97, 0.98, 1) : rgb(1, 1, 1),
      });
      page.drawText(String(rowNum), { x: 50, y: cursorY, size: 9, font, color: brandBlue });
      page.drawText(item.description.slice(0, 42), { x: 90, y: cursorY, size: 9, font, color: rgb(0.18, 0.21, 0.28) });
      page.drawText(formatCurrency(item.unit_price), { x: 360, y: cursorY, size: 9, font, color: rgb(0.18, 0.21, 0.28) });
      page.drawText(String(item.qty), { x: 447, y: cursorY, size: 9, font, color: rgb(0.18, 0.21, 0.28) });
      page.drawText(formatCurrency(item.line_total), { x: 500, y: cursorY, size: 9, fontBold, color: brandBlue });
      cursorY -= 24;

      if (item.image_data) {
        const img = await loadImageFromDataUrl(pdfDoc, item.image_data);
        if (img) {
          const dims = img.scale(0.16);
          page.drawImage(img, {
            x: 90,
            y: cursorY - 6,
            width: Math.min(dims.width, 68),
            height: Math.min(dims.height, 38),
          });
          cursorY -= 42;
        }
      }
      rowNum++;
    }

    const totalsStartY = cursorY - 100;
    page.drawRectangle({ x: 340, y: totalsStartY + 42, width: 220, height: 20, color: lightGray });
    page.drawText('Subtotal', { x: 350, y: totalsStartY + 48, size: 9, font: fontBold, color: brandBlue });
    page.drawText(formatCurrency(Number(quote.subtotal)), { x: 470, y: totalsStartY + 48, size: 9, font: fontBold, color: brandBlue });
    page.drawRectangle({ x: 340, y: totalsStartY + 20, width: 220, height: 20, color: lightGray });
    page.drawText('Impuestos', { x: 350, y: totalsStartY + 26, size: 9, font: fontBold, color: brandBlue });
    page.drawText(formatCurrency(Number(quote.tax)), { x: 470, y: totalsStartY + 26, size: 9, font: fontBold, color: brandBlue });
    page.drawRectangle({ x: 340, y: totalsStartY - 8, width: 220, height: 24, color: brandBlue });
    page.drawText('TOTAL', { x: 350, y: totalsStartY, size: 11, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText(formatCurrency(Number(quote.total)), { x: 458, y: totalsStartY, size: 11, font: fontBold, color: rgb(1, 1, 1) });

    const notesY = Math.max(totalsStartY - 70, 180);
    page.drawText('NOTAS', { x: 35, y: notesY + 24, size: 9, font: fontBold, color: brandBlue });
    page.drawRectangle({ x: 35, y: notesY - 4, width: 300, height: 36, color: lightGray });
    page.drawText((quote.notes as string) || 'Sin notas', {
      x: 43, y: notesY + 9, size: 9, font, color: rgb(0.2, 0.22, 0.3), maxWidth: 285,
    });

    page.drawText('FIRMA', { x: 238, y: 172, size: 9, font: fontBold, color: brandBlue });
    if (signatureImg) {
      const dims = signatureImg.scaleToFit(180, 55);
      page.drawImage(signatureImg, { x: 208, y: 156, width: dims.width, height: dims.height });
    }
    page.drawLine({ start: { x: 205, y: 154 }, end: { x: 360, y: 154 }, thickness: 1, color: rgb(0.7, 0.72, 0.78) });
    page.drawText('Enzo Gonzalo Beltran', { x: 220, y: 138, size: 9, font, color: rgb(0.32, 0.35, 0.43) });
    page.drawRectangle({ x: 300, y: 60, width: 260, height: 18, color: brandBlue });
    page.drawText('www.kodeonsoluciones.com', { x: 365, y: 66, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
    const iconSize = 20;
    if (instagramIcon) {
      const igDims = instagramIcon.scaleToFit(iconSize, iconSize);
      page.drawImage(instagramIcon, { x: 35, y: 25, width: igDims.width, height: igDims.height });
      page.drawText('kode.on.soluciones', { x: 35 + iconSize + 4, y: 30, size: 8, font, color: brandBlue });
    } else {
      page.drawText('instagram: kode.on.soluciones', { x: 35, y: 30, size: 8, font, color: brandBlue });
    }
    if (whatsappIcon) {
      const waDims = whatsappIcon.scaleToFit(iconSize, iconSize);
      page.drawImage(whatsappIcon, { x: 395, y: 25, width: waDims.width, height: waDims.height });
      page.drawText('2944369647', { x: 395 + iconSize + 4, y: 30, size: 8, font, color: brandBlue });
    } else {
      page.drawText('whatsapp: 2944369647', { x: 410, y: 30, size: 8, font, color: brandBlue });
    }

    const pdfBytes = await pdfDoc.save();
    const storagePath = `quotes/${quoteId}.pdf`;

    const { error: uploadErr } = await supabase.storage
      .from('quote-pdfs')
      .upload(storagePath, pdfBytes, { upsert: true, contentType: 'application/pdf' });

    if (uploadErr) {
      return new Response(
        JSON.stringify({ error: 'Error al guardar PDF: ' + uploadErr.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('quotes')
      .update({ pdf_path: storagePath, updated_at: new Date().toISOString() })
      .eq('id', quoteId);

    const { data: signed } = await supabase.storage
      .from('quote-pdfs')
      .createSignedUrl(storagePath, 3600);

    return new Response(
      JSON.stringify({
        downloadUrl: signed?.signedUrl ?? null,
        quote: { ...quote, pdf_path: storagePath },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? 'Error interno.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
