/**
 * Generate Word (.docx) templates for VisaBud Premium tier.
 * Each template includes:
 * - Locked sections (gov guidance + examples)
 * - Comments (WHY each section matters)
 * - Unlocked sections (user editable)
 * - Professional formatting
 */

const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, BorderStyle, AlignmentType, VerticalAlign } = require('docx');
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'public', 'templates');
if (!fs.existsSync(TEMPLATES_DIR)) {
  fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

/**
 * Create a locked section (government guidance)
 */
function createLockedSection(title, content, guidance = null) {
  const paragraphs = [
    // Title (bold, dark blue)
    new Paragraph({
      text: title,
      style: 'Heading2',
      bold: true,
      spacing: { after: 100 },
      shading: { fill: 'F0F5FA' }, // Light blue background
    }),
    // Content
    new Paragraph({
      text: content,
      spacing: { after: 100, line: 240 },
      indent: { left: 400 },
      border: {
        left: { color: '003366', space: 1, style: BorderStyle.SINGLE, size: 6 },
      },
    }),
  ];

  // Add guidance comment if provided
  if (guidance) {
    paragraphs.push(
      new Paragraph({
        text: `💡 ${guidance}`,
        italics: true,
        spacing: { after: 200 },
        indent: { left: 500 },
        color: '666666',
      })
    );
  }

  return paragraphs;
}

/**
 * Create an editable section (for user to fill in)
 */
function createEditableSection(title, placeholder, guidance = null) {
  const paragraphs = [
    // Title (bold, dark green)
    new Paragraph({
      text: title,
      style: 'Heading2',
      bold: true,
      spacing: { after: 100 },
      shading: { fill: 'F0FAF5' }, // Light green background
      color: '006633',
    }),
  ];

  // Add guidance if provided
  if (guidance) {
    paragraphs.push(
      new Paragraph({
        text: guidance,
        italics: true,
        spacing: { after: 100 },
        indent: { left: 400 },
        color: '666666',
      })
    );
  }

  // Placeholder area (light gray)
  paragraphs.push(
    new Paragraph({
      text: placeholder,
      spacing: { after: 200, line: 240 },
      indent: { left: 400 },
      shading: { fill: 'F5F5F5' }, // Light gray background
    })
  );

  return paragraphs;
}

/**
 * Template 1: Spouse - Proof of Relationship
 */
function createSpouseProofOfRelationship() {
  const doc = new Document({
    sections: [
      {
        children: [
          // Header
          new Paragraph({
            text: 'SPOUSE VISA - PROOF OF RELATIONSHIP',
            bold: true,
            size: 32,
            spacing: { after: 100 },
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: 'Version: Premium Template | Last Updated: April 2026',
            size: 18,
            spacing: { after: 400 },
            alignment: AlignmentType.CENTER,
            color: '808080',
          }),

          // Locked: Gov Requirements
          ...createLockedSection(
            '📋 GOVERNMENT REQUIREMENTS',
            'Home Office requires evidence that you have been in a genuine and subsisting relationship with your partner. Evidence must cover the entire period of your relationship (or at least the last 2+ years).\n\nSource: gov.uk/guidance/prove-your-relationship',
            'Immigration officers check for: consistency across all documents, timeline gaps, evidence of genuine cohabitation.'
          ),

          // Locked: Example
          ...createLockedSection(
            '✓ EXAMPLE: What Good Looks Like',
            'My name is John Smith and I have been in a relationship with Sarah Johnson since January 2021 (5 years). We met at University and began living together in September 2021. We purchased our home together in March 2022 and are now planning our wedding for June 2024.\n\nEvidence supporting this relationship is included as:\n• Joint tenancy agreement (2021-2022)\n• Mortgage document with both names (2022-present)\n• Joint utility bills (2022-present)\n• Photos together (2021-2024)\n• Email correspondence (2021-2024)',
            'Notice the specificity: exact dates, names, timeline, and what evidence is attached. This is what immigration officers expect.'
          ),

          // Editable: User section
          ...createEditableSection(
            '✎ YOUR PROOF OF RELATIONSHIP STATEMENT',
            'My name is [YOUR FULL NAME] and I have been in a relationship with [PARTNER\'S NAME] since [START DATE] ([NUMBER] years/months). We met [HOW YOU MET] and began living together in [DATE]. [ADD ANY MAJOR MILESTONES: married, children, property purchase, etc.]\n\nEvidence supporting this relationship is included as:\n• [EVIDENCE TYPE 1]\n• [EVIDENCE TYPE 2]\n• [EVIDENCE TYPE 3]',
            'Edit this section with YOUR details. Keep the same structure and style as the example. Include: names, exact dates, timeline, evidence list.'
          ),

          // Locked: Why it matters
          ...createLockedSection(
            '⚠️ WHY THIS SECTION MATTERS',
            'Immigration officers must determine if your relationship is "genuine and subsisting". They check for:\n\n✓ Dates match across all documents (bank statements, tenancy, photos)\n✓ Timeline is logical (not meeting and cohabiting same month)\n✓ Evidence of daily life together (joint bills, photos, correspondence)\n✓ Consistency with any previous applications/visas\n\nIf dates don\'t match or timeline has unexplained gaps, the application may be rejected or delayed for further enquiries.',
            null
          ),
        ],
      },
    ],
  });

  return doc;
}

/**
 * Template 2: Spouse - Financial Evidence Summary
 */
function createSpouseFinancialEvidence() {
  const doc = new Document({
    sections: [
      {
        children: [
          // Header
          new Paragraph({
            text: 'SPOUSE VISA - FINANCIAL EVIDENCE SUMMARY',
            bold: true,
            size: 32,
            spacing: { after: 100 },
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: 'Version: Premium Template | Last Updated: April 2026',
            size: 18,
            spacing: { after: 400 },
            alignment: AlignmentType.CENTER,
            color: '808080',
          }),

          // Locked: Gov Requirements
          ...createLockedSection(
            '📋 GOVERNMENT FINANCIAL REQUIREMENTS (2024)',
            'Spouse visa applicants must prove their UK sponsor can maintain themselves and their family without public funds.\n\nMinimum annual income: £29,000 (2024)\nPlus additional amount per dependent (£3,800 per child)\n\nSource: gov.uk/guidance/prove-your-income',
            'Immigration officers verify: income matches tax returns, P60s, and payslips; savings meet thresholds if income is lower.'
          ),

          // Locked: Example
          ...createLockedSection(
            '✓ EXAMPLE: What Good Looks Like',
            'FINANCIAL EVIDENCE SUMMARY\nSponsor: John Smith | Dependents: 1 (spouse Sarah Johnson)\n\nINCOME:\nEmployment: £35,000 annual salary (confirmed by P60 and 3 months payslips)\nSelf-employment: £5,000 annual profit (confirmed by accountant reference)\nTOTAL ANNUAL INCOME: £40,000\n\nTHRESHOLD REQUIRED: £29,000 (base) + £3,800 (1 dependent) = £32,800\nSTATUS: ✓ Exceeds requirement by £7,200\n\nSUPPORTING EVIDENCE ATTACHED:\n• P60 for 2023 (confirming £35,000 salary)\n• Payslips for Jan, Feb, Mar 2024 (showing ongoing employment)\n• Accountant reference letter (confirming self-employment income)\n• Bank statements (6 months, showing income deposits)',
            'Notice: Clear calculation, evidence list, and status confirmation. Immigration officers can instantly see if you meet requirements.'
          ),

          // Editable: User section
          ...createEditableSection(
            '✎ YOUR FINANCIAL EVIDENCE',
            'SPONSOR: [YOUR NAME] | DEPENDENTS: [NUMBER] (spouse [NAME])\n\nINCOME:\nEmployment: £[AMOUNT] annual salary (source: P60 and recent payslips)\nSelf-employment: £[AMOUNT] annual profit (source: accountant reference)\n[OTHER INCOME]: £[AMOUNT] (source: [DOCUMENT TYPE])\nTOTAL ANNUAL INCOME: £[TOTAL]\n\nTHRESHOLD REQUIRED: £29,000 + £[3,800 × NUMBER OF DEPENDENTS] = £[TOTAL REQUIRED]\nSTATUS: ✓ [Exceeds/Meets] requirement by £[DIFFERENCE]\n\nSUPPORTING EVIDENCE ATTACHED:\n• [DOCUMENT TYPE 1]\n• [DOCUMENT TYPE 2]\n• [DOCUMENT TYPE 3]',
            'Copy the example format. Replace [BRACKETS] with YOUR actual figures. Always calculate and show: income vs. requirement vs. difference.'
          ),

          // Locked: Why it matters
          ...createLockedSection(
            '⚠️ WHY THIS SECTION MATTERS',
            'Financial evidence is one of the top rejection reasons for spouse visas.\n\nCommon mistakes:\n✗ Not calculating total income correctly (missing self-employment income)\n✗ Not showing how calculation meets threshold\n✗ Missing supporting documents (no payslips, no P60)\n✗ Income figures don\'t match bank statements or tax returns\n\nIf your income doesn\'t meet the threshold:\n• You can use savings (£16,000 per £1 of shortfall)\n• You can combine sponsor + partner income\n• But you MUST document this explicitly',
            null
          ),
        ],
      },
    ],
  });

  return doc;
}

/**
 * Template 3: Skilled Worker - Maintenance of Funds
 */
function createSkilledWorkerMaintenance() {
  const doc = new Document({
    sections: [
      {
        children: [
          // Header
          new Paragraph({
            text: 'SKILLED WORKER VISA - MAINTENANCE OF FUNDS DECLARATION',
            bold: true,
            size: 32,
            spacing: { after: 100 },
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: 'Version: Premium Template | Last Updated: April 2026',
            size: 18,
            spacing: { after: 400 },
            alignment: AlignmentType.CENTER,
            color: '808080',
          }),

          // Locked: Gov Requirements
          ...createLockedSection(
            '📋 GOVERNMENT REQUIREMENTS',
            'Skilled Worker visa applicants must prove they have sufficient funds to maintain themselves in the UK without public funds.\n\nMinimum amount: £3,100 in savings OR\nSponsor can provide maintenance confirmation OR\nSalary covers your living costs\n\nSource: gov.uk/guidance/skilled-worker-visa',
            'Immigration officers check: bank statements match savings claim; funds are accessible and in your name or joint account.'
          ),

          // Locked: Example
          ...createLockedSection(
            '✓ EXAMPLE: What Good Looks Like',
            'I, James Wong, am applying for a Skilled Worker visa. I confirm that:\n\nMAINTENANCE OF FUNDS:\nI have £5,000 in my UK savings account (NatWest Savings Account, sort code 60-40-24, account ending 1234).\nThis account has been held for 28 days continuously (as of 14 Apr 2024).\nBank statement attached confirms this balance.\n\nOR: My employer, Acme Tech Ltd, has confirmed in writing that my salary of £32,500 per annum is sufficient to cover my living costs in London.\n\nDECLARATION:\nI declare that this information is true and complete. I understand that providing false information may result in visa refusal.\n\nSigned: James Wong | Date: 14 April 2024',
            'Clear declaration, specific figures, account details (not full number!), and attached evidence. Immigration officers can easily verify.'
          ),

          // Editable: User section
          ...createEditableSection(
            '✎ YOUR MAINTENANCE OF FUNDS DECLARATION',
            'I, [YOUR FULL NAME], am applying for a Skilled Worker visa. I confirm that:\n\nMAINTENANCE OF FUNDS:\nI have £[AMOUNT] in my savings account ([BANK NAME] [ACCOUNT TYPE], sort code [SORT CODE], account ending [LAST 4 DIGITS]).\nThis account has been held for 28 days continuously (as of [DATE]).\nBank statement attached confirms this balance.\n\nOR: My employer, [EMPLOYER NAME], has confirmed in writing that my salary of £[ANNUAL SALARY] per annum is sufficient to cover my living costs in [CITY].\n\nDECLARATION:\nI declare that this information is true and complete. I understand that providing false information may result in visa refusal.\n\nSigned: [YOUR SIGNATURE] | Date: [DATE]',
            'Edit with YOUR details. IMPORTANT: Do NOT include your full account number (use last 4 digits only). Ensure 28-day fund rule is met.'
          ),

          // Locked: Why it matters
          ...createLockedSection(
            '⚠️ WHY THIS SECTION MATTERS',
            'Maintenance of funds rejections are common because applicants:\n\n✗ Don\'t meet the 28-day continuous fund rule (funds must be held for 28 days)\n✗ Don\'t provide bank statements showing the funds\n✗ List funds that aren\'t accessible (tied up in investments, locked savings)\n✗ Don\'t have evidence they can earn enough to support themselves\n\nThe Home Office will:\n• Check your bank statement balance matches your claim\n• Verify the funds were held 28+ days before application\n• Check that funds are in YOUR name or a joint account (not borrowed)\n\nIf you DON\'T have £3,100 in savings:\n• Your salary must clearly cover living costs (£2,000+ per month in London)\n• Your employer must provide a written confirmation letter',
            null
          ),
        ],
      },
    ],
  });

  return doc;
}

/**
 * Generate all templates
 */
async function generateTemplates() {
  console.log('🚀 Generating Premium Templates...\n');

  try {
    // Template 1
    const doc1 = createSpouseProofOfRelationship();
    const buffer1 = await Packer.toBuffer(doc1);
    fs.writeFileSync(
      path.join(TEMPLATES_DIR, 'Spouse_ProofOfRelationship.docx'),
      buffer1
    );
    console.log('✅ Created: Spouse_ProofOfRelationship.docx');

    // Template 2
    const doc2 = createSpouseFinancialEvidence();
    const buffer2 = await Packer.toBuffer(doc2);
    fs.writeFileSync(
      path.join(TEMPLATES_DIR, 'Spouse_FinancialEvidence.docx'),
      buffer2
    );
    console.log('✅ Created: Spouse_FinancialEvidence.docx');

    // Template 3
    const doc3 = createSkilledWorkerMaintenance();
    const buffer3 = await Packer.toBuffer(doc3);
    fs.writeFileSync(
      path.join(TEMPLATES_DIR, 'SkilledWorker_MaintenanceFunds.docx'),
      buffer3
    );
    console.log('✅ Created: SkilledWorker_MaintenanceFunds.docx');

    console.log(`\n✅ COMPLETE! Templates saved to: ${TEMPLATES_DIR}`);
    console.log('📝 Ready for review and deployment.');
  } catch (err) {
    console.error('❌ Error generating templates:', err);
    process.exit(1);
  }
}

generateTemplates();
