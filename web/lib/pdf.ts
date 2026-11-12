import type { ReportSection } from '@/lib/report';

export interface PdfReportInput {
  clientName: string;
  opportunityTitle: string;
  objective: string;
  sections: ReportSection[];
}

type Rgb = [number, number, number];

const VIOLET: Rgb = [101, 66, 194];
const TEXT: Rgb = [23, 32, 51];
const MUTED: Rgb = [102, 112, 133];
const PANEL: Rgb = [246, 247, 249];
const LINE: Rgb = [230, 233, 239];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 16;

// Les polices standard du PDF ne gèrent pas tous les caractères : on normalise
function clean(text: string): string {
  return text.replace(/[  ]/g, ' ').replace(/[‘’]/g, "'").replace(/…/g, '...');
}

function slug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Le module jsPDF est chargé à la demande pour ne pas alourdir la page
export async function downloadReportPdf(input: PdfReportInput): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const today = new Date();
  const dateLabel = today.toLocaleDateString('fr-FR');
  let y = 0;

  const color = (rgb: Rgb) => doc.setTextColor(...rgb);
  const wrap = (text: string, width: number) =>
    doc.splitTextToSize(clean(text), width) as string[];

  function ensureSpace(height: number) {
    if (y + height > PAGE_H - FOOTER_H) {
      doc.addPage();
      y = MARGIN;
    }
  }

  // Bandeau d'en-tête
  doc.setFillColor(...VIOLET);
  doc.rect(0, 0, PAGE_W, 32, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Compte rendu de rendez-vous', MARGIN, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Meeting Copilot', MARGIN, 23);
  y = 42;

  // Bloc d'informations
  // Les valeurs sont en gras : on mesure le texte avec cette police
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const objectiveLines = wrap(input.objective, CONTENT_W - 40);
  const opportunityLines = wrap(input.opportunityTitle, CONTENT_W - 40);
  const rows: [string, string[]][] = [
    ['Client', wrap(input.clientName, CONTENT_W - 40)],
    ['Opportunité', opportunityLines],
    ['Date', [dateLabel]],
    ['Objectif', objectiveLines],
  ];
  const lineH = 5;
  const panelH =
    rows.reduce((total, [, lines]) => total + lines.length * lineH + 2, 0) + 8;
  doc.setFillColor(...PANEL);
  doc.roundedRect(MARGIN, y, CONTENT_W, panelH, 3, 3, 'F');
  let rowY = y + 8;
  doc.setFontSize(10);
  for (const [label, lines] of rows) {
    doc.setFont('helvetica', 'normal');
    color(MUTED);
    doc.text(label, MARGIN + 6, rowY);
    doc.setFont('helvetica', 'bold');
    color(TEXT);
    doc.text(lines, MARGIN + 34, rowY);
    rowY += lines.length * lineH + 2;
  }
  y += panelH + 10;

  // Sections numérotées
  input.sections.forEach((section, index) => {
    ensureSpace(22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    color(VIOLET);
    doc.text(`${index + 1}. ${clean(section.title)}`, MARGIN, y);
    y += 2.5;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    color(TEXT);
    for (const rawLine of section.text.split('\n')) {
      const isBullet = /^\s*[-•]\s+/.test(rawLine);
      const text = rawLine.replace(/^\s*[-•]\s+/, '');
      if (!text.trim()) {
        y += 2.5;
        continue;
      }
      const indent = isBullet ? 6 : 0;
      const lines = wrap(text, CONTENT_W - indent);
      lines.forEach((line, lineIndex) => {
        ensureSpace(6);
        if (isBullet && lineIndex === 0) {
          doc.setFillColor(...VIOLET);
          doc.circle(MARGIN + 1.5, y - 1.2, 0.7, 'F');
        }
        doc.text(line, MARGIN + indent, y);
        y += 5.4;
      });
      y += 0.8;
    }
    y += 6;
  });

  // Pied de page sur chaque page
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...LINE);
    doc.line(MARGIN, PAGE_H - 13, PAGE_W - MARGIN, PAGE_H - 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    color(MUTED);
    doc.text('Prototype - données fictives', MARGIN, PAGE_H - 8);
    doc.text(`Page ${page} / ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 8, {
      align: 'right',
    });
  }

  const isoDate = today.toISOString().slice(0, 10);
  doc.save(`compte-rendu-${slug(input.clientName)}-${isoDate}.pdf`);
}