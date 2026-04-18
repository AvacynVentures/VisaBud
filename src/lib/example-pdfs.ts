/**
 * Generate PDFs for example documents
 * Uses HTML2Canvas + jsPDF for rendering
 */

import {
  ExampleBankStatement,
  ExamplePayslip,
  ExampleUtilityBill,
  ExampleEmployerLetter,
} from './example-data';

/**
 * Generate HTML representation of bank statement (for testing)
 * In production, these would use a dedicated PDF library
 */
export async function generateExampleBankStatementPDF(
  _statement: ExampleBankStatement
): Promise<Blob> {
  // Placeholder: return empty blob
  // In production: use library like puppeteer or dedicated PDF service
  return new Blob(['placeholder'], { type: 'application/pdf' });
}

/**
 * Generate example payslip PDF
 */
export async function generateExamplePayslipPDF(_payslip: ExamplePayslip): Promise<Blob> {
  return new Blob(['placeholder'], { type: 'application/pdf' });
}

/**
 * Generate example utility bill PDF
 */
export async function generateExampleUtilityBillPDF(_bill: ExampleUtilityBill): Promise<Blob> {
  return new Blob(['placeholder'], { type: 'application/pdf' });
}

/**
 * Generate example employer letter PDF
 */
export async function generateExampleEmployerLetterPDF(_letter: ExampleEmployerLetter): Promise<Blob> {
  return new Blob(['placeholder'], { type: 'application/pdf' });
}

/**
 * Download blob as file
 */
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
