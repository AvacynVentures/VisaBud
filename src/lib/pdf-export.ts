import jsPDF from 'jspdf';

interface ChecklistItem {
  id: string;
  label: string;
  tip: string;
}

interface PDFExportOptions {
  visa: string;
  answers: any;
  checklist: {
    personal: ChecklistItem[];
    financial: ChecklistItem[];
    supporting: ChecklistItem[];
  };
  risks: any[];
  timeline: any[];
  unlocked?: boolean; // When true, show all sections fully (paid user)
}

/**
 * Generate a personalised VisaBud PDF checklist
 * Includes: visa type, checklist, timeline, and risks
 */
export async function generateVisaBudPDF(options: PDFExportOptions): Promise<Blob> {
  const { visa, answers, checklist, risks, timeline, unlocked = true } = options;

  // Create new PDF document (A4, portrait)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  let yPosition = margin;

  // ---- HEADER ----
  pdf.setFillColor(30, 58, 138); // Deep blue
  pdf.rect(0, 0, pageWidth, 50, 'F');

  // Logo + Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.text('VisaBud', margin, 20);
  pdf.setFontSize(12);
  pdf.text('Your UK Visa Application Checklist', margin, 30);

  // Visa type badge
  pdf.setFillColor(212, 175, 55); // Gold
  pdf.rect(pageWidth - 60, 12, 45, 26, 'F');
  pdf.setTextColor(30, 58, 138);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(visa.toUpperCase(), pageWidth - 57, 25);
  pdf.setFont('helvetica', 'normal');

  pdf.setTextColor(0, 0, 0);
  yPosition = 65;

  // ---- METADATA ----
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, margin, yPosition);
  yPosition += 8;
  
  if (answers.nationality) {
    pdf.text(`Nationality: ${answers.nationality}`, margin, yPosition);
    yPosition += 8;
  }
  
  if (answers.location) {
    pdf.text(`Location: ${answers.location}`, margin, yPosition);
    yPosition += 8;
  }

  yPosition += 4;

  // ---- SECTION: CHECKLIST ----
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('📋 Your Document Checklist', margin, yPosition);
  yPosition += 8;

  // Personal documents
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Personal Documents', margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  checklist.personal.forEach((item) => {
    const lines = pdf.splitTextToSize(`☐ ${item.label}`, contentWidth - 5);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin + 3, yPosition);
      yPosition += 5;
    });
    // Tip text (smaller)
    pdf.setTextColor(100, 100, 100);
    const tipLines = pdf.splitTextToSize(item.tip, contentWidth - 10);
    tipLines.forEach((tipLine: string) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.setFontSize(8);
      pdf.text(tipLine, margin + 6, yPosition);
      yPosition += 3;
      pdf.setFontSize(10);
    });
    pdf.setTextColor(0, 0, 0);
    yPosition += 2;
  });

  yPosition += 4;

  // Financial documents
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(unlocked ? 'Financial Documents' : 'Financial Documents (Requires Full Pack)', margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  if (!unlocked) pdf.setTextColor(150, 150, 150);
  checklist.financial.forEach((item) => {
    const lines = pdf.splitTextToSize(`☐ ${item.label}`, contentWidth - 5);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin + 3, yPosition);
      yPosition += 5;
    });
    if (unlocked && item.tip) {
      pdf.setTextColor(100, 100, 100);
      const tipLines = pdf.splitTextToSize(item.tip, contentWidth - 10);
      tipLines.forEach((tipLine: string) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.setFontSize(8);
        pdf.text(tipLine, margin + 6, yPosition);
        yPosition += 3;
        pdf.setFontSize(10);
      });
      pdf.setTextColor(0, 0, 0);
    }
    yPosition += 2;
  });
  pdf.setTextColor(0, 0, 0);

  yPosition += 4;

  // Supporting documents
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(unlocked ? 'Supporting Documents' : 'Supporting Documents (Requires Full Pack)', margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  if (!unlocked) pdf.setTextColor(150, 150, 150);
  checklist.supporting.forEach((item) => {
    const lines = pdf.splitTextToSize(`☐ ${item.label}`, contentWidth - 5);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin + 3, yPosition);
      yPosition += 5;
    });
    if (unlocked && item.tip) {
      pdf.setTextColor(100, 100, 100);
      const tipLines = pdf.splitTextToSize(item.tip, contentWidth - 10);
      tipLines.forEach((tipLine: string) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.setFontSize(8);
        pdf.text(tipLine, margin + 6, yPosition);
        yPosition += 3;
        pdf.setFontSize(10);
      });
      pdf.setTextColor(0, 0, 0);
    }
    yPosition += 2;
  });
  pdf.setTextColor(0, 0, 0);

  // ---- PAGE BREAK ----
  pdf.addPage();
  yPosition = margin;

  // ---- SECTION: TIMELINE ----
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('⏱️ Your Application Timeline', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  timeline.forEach((milestone: any, _index: number) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = margin;
    }

    // Week label
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${milestone.week}`, margin, yPosition);
    yPosition += 5;

    // Milestone title
    pdf.setFont('helvetica', 'normal');
    const titleLines = pdf.splitTextToSize(milestone.label, contentWidth - 5);
    titleLines.forEach((line: string) => {
      pdf.text(line, margin + 3, yPosition);
      yPosition += 5;
    });

    // Milestone detail
    pdf.setTextColor(100, 100, 100);
    const detailLines = pdf.splitTextToSize(milestone.detail, contentWidth - 5);
    detailLines.forEach((line: string) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.setFontSize(9);
      pdf.text(line, margin + 6, yPosition);
      yPosition += 4;
      pdf.setFontSize(10);
    });
    pdf.setTextColor(0, 0, 0);

    yPosition += 4;
  });

  // ---- PAGE BREAK ----
  pdf.addPage();
  yPosition = margin;

  // ---- SECTION: RISKS ----
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('⚠️ Risk Assessment', margin, yPosition);
  yPosition += 8;

  if (risks.length === 0) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('No major risks identified based on your answers.', margin, yPosition);
    yPosition += 6;
    pdf.text('Always verify with Gov.uk before submitting.', margin, yPosition);
  } else {
    risks.forEach((risk: any) => {
      if (yPosition > pageHeight - 25) {
        pdf.addPage();
        yPosition = margin;
      }

      // Risk badge (HIGH/MEDIUM/LOW)
      const badgeColor = risk.level === 'high' ? [220, 53, 69] : risk.level === 'medium' ? [255, 193, 7] : [13, 110, 253];
      pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      pdf.rect(margin, yPosition - 4, 15, 6, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.text(risk.level.toUpperCase(), margin + 1, yPosition + 0.5);

      // Risk title
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      const titleLines = pdf.splitTextToSize(risk.title, contentWidth - 20);
      titleLines.forEach((line: string, idx: number) => {
        pdf.text(line, margin + 20, yPosition + (idx * 5));
      });

      yPosition += titleLines.length * 5 + 3;

      // Risk detail
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      const detailLines = pdf.splitTextToSize(risk.detail, contentWidth - 5);
      detailLines.forEach((line: string) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin + 3, yPosition);
        yPosition += 4;
      });

      yPosition += 4;
    });
  }

  // ---- ADD FOOTER TO ALL PAGES ----
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);

    // Footer line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

    // Footer text
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      'VisaBud — visabud.co.uk | Based on official Gov.uk guidance. Always verify before submitting.',
      margin,
      pageHeight - 13
    );
    pdf.text(
      `Generated ${new Date().toLocaleDateString('en-GB')} · Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 13,
      { align: 'right' }
    );
  }

  // Convert PDF to Blob
  const pdfBlob = pdf.output('blob');
  return pdfBlob;
}

/**
 * Trigger PDF download in browser
 */
export function downloadVisaBudPDF(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
