// =============================================================================
// template-pdf.ts — PDF generation for VisaBud document preparation templates
// Uses jsPDF (already in dependencies) to create professional branded PDFs
// =============================================================================

import jsPDF from 'jspdf';
import { DocumentTemplate } from './template-data';
import { VISA_TYPES } from './visa-data';

// Brand colours
const BRAND = {
  primary: [30, 58, 138] as [number, number, number],     // Deep blue
  secondary: [59, 130, 246] as [number, number, number],   // Lighter blue
  accent: [234, 179, 8] as [number, number, number],       // Gold
  dark: [15, 23, 42] as [number, number, number],          // Near black
  gray: [100, 116, 139] as [number, number, number],       // Text gray
  lightGray: [241, 245, 249] as [number, number, number],  // Background
  white: [255, 255, 255] as [number, number, number],
  red: [220, 38, 38] as [number, number, number],          // For warnings
  green: [22, 163, 74] as [number, number, number],        // For success/tips
};

function setColor(doc: jsPDF, color: [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function drawRect(doc: jsPDF, x: number, y: number, w: number, h: number, color: [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(x, y, w, h, 'F');
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line: string, i: number) => {
    doc.text(line, x, y + i * lineHeight);
  });
  return y + lines.length * lineHeight;
}

function addSectionTitle(doc: jsPDF, title: string, y: number, icon?: string): number {
  setColor(doc, BRAND.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const displayTitle = icon ? `${icon}  ${title}` : title;
  doc.text(displayTitle, 15, y);
  
  // Underline
  doc.setDrawColor(BRAND.secondary[0], BRAND.secondary[1], BRAND.secondary[2]);
  doc.setLineWidth(0.5);
  doc.line(15, y + 1.5, 195, y + 1.5);
  
  return y + 7;
}

function addBulletList(doc: jsPDF, items: string[], x: number, y: number, maxWidth: number, lineHeight: number = 5): number {
  let currentY = y;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, BRAND.dark);
  
  items.forEach((item) => {
    // Check if we need a new page
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.text('•', x, currentY);
    const lines = doc.splitTextToSize(item, maxWidth - 5);
    lines.forEach((line: string, i: number) => {
      doc.text(line, x + 4, currentY + i * lineHeight);
    });
    currentY += lines.length * lineHeight + 1;
  });
  
  return currentY;
}

function addCheckboxList(doc: jsPDF, items: string[], x: number, y: number, maxWidth: number): number {
  let currentY = y;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, BRAND.dark);
  
  items.forEach((item) => {
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    
    // Draw checkbox
    doc.setDrawColor(BRAND.gray[0], BRAND.gray[1], BRAND.gray[2]);
    doc.setLineWidth(0.3);
    doc.rect(x, currentY - 3, 3, 3);
    
    const lines = doc.splitTextToSize(item, maxWidth - 8);
    lines.forEach((line: string, i: number) => {
      doc.text(line, x + 5, currentY + i * 5);
    });
    currentY += lines.length * 5 + 2;
  });
  
  return currentY;
}

export function generateTemplatePDF(template: DocumentTemplate): ArrayBuffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const visaInfo = VISA_TYPES[template.visaType];
  const pageWidth = 210;

  // =========================================================================
  // PAGE 1 — Header & Core Info
  // =========================================================================

  // Top banner
  drawRect(doc, 0, 0, pageWidth, 35, BRAND.primary);
  
  // Logo text
  setColor(doc, BRAND.white);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('VisaBud', 15, 15);
  
  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('UK Visa Document Preparation Guide', 15, 22);
  
  // Visa type badge
  drawRect(doc, 130, 8, 65, 18, BRAND.accent);
  setColor(doc, BRAND.dark);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(visaInfo.shortLabel.toUpperCase(), 133, 15);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  setColor(doc, BRAND.dark);
  const priorityLabel = template.priority === 'critical' ? 'CRITICAL DOCUMENT' : 
                         template.priority === 'important' ? 'IMPORTANT DOCUMENT' : 'OPTIONAL DOCUMENT';
  doc.text(priorityLabel, 133, 21);

  // Document title
  let y = 45;
  setColor(doc, BRAND.dark);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(template.shortTitle, 180);
  titleLines.forEach((line: string, i: number) => {
    doc.text(line, 15, y + i * 8);
  });
  y += titleLines.length * 8 + 5;

  // ── What is this? ──
  y = addSectionTitle(doc, 'What is this document?', y);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, BRAND.dark);
  y = addWrappedText(doc, template.whatIsThis, 15, y, 180, 5);
  y += 5;

  // ── What Home Office Requires ──
  y = addSectionTitle(doc, 'What the Home Office requires', y);
  
  // Info box
  drawRect(doc, 15, y - 2, 180, 0, BRAND.lightGray); // will expand
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  setColor(doc, BRAND.primary);
  const reqLines = doc.splitTextToSize(template.homeOfficeRequires, 170);
  const reqHeight = reqLines.length * 5 + 4;
  drawRect(doc, 15, y - 2, 180, reqHeight, BRAND.lightGray);
  reqLines.forEach((line: string, i: number) => {
    doc.text(line, 20, y + 2 + i * 5);
  });
  y += reqHeight + 5;

  // ── Format Specifications ──
  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Format Specifications', y);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, BRAND.dark);
  
  const specs = template.formatSpecs;
  const specItems = [
    `File types: ${specs.fileTypes.join(', ')}`,
    `Resolution: ${specs.resolution}`,
    `Max file size: ${specs.maxFileSize}`,
    `Colour mode: ${specs.colorMode}`,
    ...specs.additionalSpecs,
  ];
  y = addBulletList(doc, specItems, 15, y, 180);
  y += 3;

  // ── What to Include ──
  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'What to include', y);
  y = addBulletList(doc, template.whatToInclude, 15, y, 180);
  y += 3;

  // =========================================================================
  // PAGE 2 (or continued) — Mistakes, Tips, Checklist
  // =========================================================================

  // ── Common Mistakes ──
  if (y > 200) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Common Mistakes to Avoid', y);
  
  // Red warning box background
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, BRAND.red);
  template.commonMistakes.forEach((mistake) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text('✗', 15, y);
    setColor(doc, BRAND.dark);
    const lines = doc.splitTextToSize(mistake, 173);
    lines.forEach((line: string, i: number) => {
      doc.text(line, 22, y + i * 5);
    });
    y += lines.length * 5 + 2;
    setColor(doc, BRAND.red);
  });
  y += 3;

  // ── Pro Tips ──
  if (y > 200) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Pro Tips', y);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, BRAND.green);
  template.proTips.forEach((tip) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text('✓', 15, y);
    setColor(doc, BRAND.dark);
    const lines = doc.splitTextToSize(tip, 173);
    lines.forEach((line: string, i: number) => {
      doc.text(line, 22, y + i * 5);
    });
    y += lines.length * 5 + 2;
    setColor(doc, BRAND.green);
  });
  y += 3;

  // ── Ready Checklist ──
  if (y > 200) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Ready-to-Upload Checklist', y);
  y = addCheckboxList(doc, template.checklist, 15, y, 180);
  y += 5;

  // ── Gov.uk Reference ──
  if (y > 265) { doc.addPage(); y = 20; }
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  setColor(doc, BRAND.gray);
  doc.text(`Official guidance: ${template.govUkReference}`, 15, y);
  y += 8;

  // ── Footer on every page ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(BRAND.lightGray[0], BRAND.lightGray[1], BRAND.lightGray[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 285, 195, 285);
    
    // Footer text
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    setColor(doc, BRAND.gray);
    doc.text('VisaBud — Document Preparation Guide', 15, 290);
    doc.text(`Page ${i} of ${pageCount}`, 175, 290);
    doc.text('This guide is for informational purposes. Always verify requirements at gov.uk.', 15, 294);
  }

  return doc.output('arraybuffer');
}

/**
 * Generate a filename for a template PDF
 */
export function getTemplateFilename(template: DocumentTemplate): string {
  const visaLabel = VISA_TYPES[template.visaType].shortLabel.replace(/\s+/g, '-').toLowerCase();
  return `VisaBud-${visaLabel}-${template.id}.pdf`;
}
