import jsPDF from 'jspdf';

interface AIReportPDFOptions {
  documentName: string;
  confidence: number;
  flags: Array<{ text: string; severity: string }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: Array<{ step: string; description: string }>;
  generatedAt?: string;
}

function getConfidenceColor(score: number): [number, number, number] {
  if (score >= 70) return [16, 185, 129]; // emerald
  if (score >= 40) return [245, 158, 11]; // amber
  return [239, 68, 68]; // red
}

function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'high': return '🔴 HIGH';
    case 'medium': return '🟡 MEDIUM';
    case 'low': return '🟢 LOW';
    default: return severity.toUpperCase();
  }
}

export function generateAIReportPDF(options: AIReportPDFOptions): Blob {
  const { documentName, confidence, flags, swot, recommendations, generatedAt } = options;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // ─── Header ─────────────────────────────────────────────────
  pdf.setFillColor(30, 58, 138);
  pdf.rect(0, 0, pageWidth, 45, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('VisaBud', margin, 18);

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('AI Document Confidence Report', margin, 28);

  pdf.setFontSize(9);
  pdf.text(documentName, margin, 37);

  // Confidence badge
  const [cr, cg, cb] = getConfidenceColor(confidence);
  pdf.setFillColor(cr, cg, cb);
  pdf.roundedRect(pageWidth - 45, 10, 30, 25, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${confidence}%`, pageWidth - 38, 25);
  pdf.setFontSize(7);
  pdf.text('Confidence', pageWidth - 40, 31);

  pdf.setTextColor(0, 0, 0);
  y = 55;

  // ─── Generated date ─────────────────────────────────────────
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(120, 120, 120);
  const dateStr = generatedAt ? new Date(generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  pdf.text(`Generated on ${dateStr} by VisaBud`, margin, y);
  y += 10;

  // ─── FLAGS ─────────────────────────────────────────────────
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FLAGS', margin, y);
  y += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  if (flags.length === 0) {
    pdf.setTextColor(16, 185, 129);
    pdf.text('✓ No issues found', margin + 3, y);
    pdf.setTextColor(0, 0, 0);
    y += 6;
  } else {
    flags.forEach((flag) => {
      if (y > pageHeight - 20) { pdf.addPage(); y = margin; }
      const sevLabel = getSeverityLabel(flag.severity);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.text(sevLabel, margin + 3, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(flag.text, contentWidth - 30);
      lines.forEach((line: string, idx: number) => {
        pdf.text(line, margin + 30, y + (idx * 5));
      });
      y += lines.length * 5 + 3;
    });
  }
  y += 6;

  // ─── SWOT ANALYSIS ──────────────────────────────────────────
  if (y > pageHeight - 60) { pdf.addPage(); y = margin; }
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SWOT ANALYSIS', margin, y);
  y += 8;

  const swotSections: Array<{ title: string; items: string[]; color: [number, number, number] }> = [
    { title: 'Strengths', items: swot.strengths, color: [16, 185, 129] },
    { title: 'Weaknesses', items: swot.weaknesses, color: [239, 68, 68] },
    { title: 'Opportunities', items: swot.opportunities, color: [59, 130, 246] },
    { title: 'Threats', items: swot.threats, color: [245, 158, 11] },
  ];

  swotSections.forEach((section) => {
    if (y > pageHeight - 30) { pdf.addPage(); y = margin; }
    
    // Section title with color bar
    pdf.setFillColor(section.color[0], section.color[1], section.color[2]);
    pdf.rect(margin, y - 4, 3, 6, 'F');
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(section.title, margin + 6, y);
    y += 6;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    if (section.items.length === 0) {
      pdf.setTextColor(150, 150, 150);
      pdf.text('None identified', margin + 6, y);
      pdf.setTextColor(0, 0, 0);
      y += 5;
    } else {
      section.items.forEach((item) => {
        if (y > pageHeight - 15) { pdf.addPage(); y = margin; }
        const lines = pdf.splitTextToSize(`• ${item}`, contentWidth - 10);
        lines.forEach((line: string) => {
          pdf.text(line, margin + 6, y);
          y += 4;
        });
        y += 1;
      });
    }
    y += 4;
  });

  // ─── RECOMMENDATIONS ────────────────────────────────────────
  if (y > pageHeight - 30) { pdf.addPage(); y = margin; }
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('RECOMMENDATIONS', margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  recommendations.forEach((rec, idx) => {
    if (y > pageHeight - 20) { pdf.addPage(); y = margin; }
    
    // Step number
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${idx + 1}.`, margin + 3, y);
    pdf.setFont('helvetica', 'normal');
    
    const title = rec.step || rec.description;
    const desc = rec.step ? rec.description : '';
    
    const titleLines = pdf.splitTextToSize(title, contentWidth - 15);
    titleLines.forEach((line: string) => {
      pdf.text(line, margin + 10, y);
      y += 5;
    });

    if (desc) {
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      const descLines = pdf.splitTextToSize(desc, contentWidth - 15);
      descLines.forEach((line: string) => {
        if (y > pageHeight - 15) { pdf.addPage(); y = margin; }
        pdf.text(line, margin + 10, y);
        y += 4;
      });
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
    }
    y += 3;
  });

  // ─── Footer on all pages ────────────────────────────────────
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text('VisaBud — visabud.co.uk | AI-powered document analysis. Always verify with official Gov.uk guidance.', margin, pageHeight - 13);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 13, { align: 'right' });
  }

  return pdf.output('blob');
}

export function downloadAIReportPDF(documentName: string, blob: Blob): void {
  const safeName = documentName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `visabud-ai-report-${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
