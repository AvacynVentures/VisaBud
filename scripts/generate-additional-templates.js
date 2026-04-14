/**
 * Generate 3 additional templates:
 * 1. Spouse - Cover Letter / Statement of Intent
 * 2. Skilled Worker - Cover Letter
 * 3. British Citizenship - Full Immigration History
 */

const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow } = require('docx');
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'public', 'templates');
if (!fs.existsSync(TEMPLATES_DIR)) {
  fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

function createSpouseCoverLetter() {
  const doc = new Document({
    sections: [
      {
        children: [
          // Header
          new Paragraph({
            text: 'SPOUSE VISA - COVER LETTER / STATEMENT OF INTENT',
            bold: true,
            size: 32,
            spacing: { after: 100 },
            alignment: 'center',
          }),
          new Paragraph({
            text: 'Version: Premium Template | Last Updated: April 2026',
            size: 18,
            spacing: { after: 400 },
            alignment: 'center',
            color: '808080',
          }),

          // Purpose (locked)
          new Paragraph({
            text: '📋 PURPOSE OF THIS LETTER',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0F5FA' },
          }),
          new Paragraph({
            text: 'This letter is your opportunity to explain your relationship in a narrative, human way. The immigration officer has already seen your documents — this letter tells them WHY your relationship matters and what your plans are together.\n\nA good cover letter can be the difference between approval and a request for more information.',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: '003366', space: 1, style: 'single', size: 6 },
            },
          }),

          // Structure (locked)
          new Paragraph({
            text: '✓ RECOMMENDED STRUCTURE',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0F5FA' },
          }),
          new Paragraph({
            text: 'Paragraph 1: How you met (date, place, circumstances)\nParagraph 2: Early relationship (first months, key moments)\nParagraph 3: Moving in together (when, decisions made)\nParagraph 4: Major milestones (engagement, marriage, children, property)\nParagraph 5: Current life together (jobs, home, daily life)\nParagraph 6: Future plans (next 5 years, children, career, where you\'ll live)\nParagraph 7: Closing statement (reaffirmation of commitment)\n\nLength: 1–2 pages (300–600 words). Format: Typed, signed and dated.',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: '003366', space: 1, style: 'single', size: 6 },
            },
          }),

          // Example (locked)
          new Paragraph({
            text: '✓ EXAMPLE: What Good Looks Like',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0F5FA' },
          }),
          new Paragraph({
            text: '"My name is John Smith and I am writing to support my application for a Spouse visa to join my wife, Sarah, in the UK.\n\nWe met in January 2021 at University. Sarah was studying at King\'s College London, and I was an exchange student. We spent time together studying in the library and went on our first date to a café in Covent Garden.\n\nAfter three months of dating, we decided to move in together in September 2021. We rented a flat in Clapham and lived together for 18 months while I was still on my student visa.\n\nIn March 2023, we got married at Chelsea Town Hall with 30 friends and family. In May 2023, we purchased a property together in Balham — a three-bedroom house where we plan to raise a family.\n\nToday, I work as a software engineer earning £45,000 per year. Sarah works as a marketing manager. We have a stable, happy life together in London.\n\nLooking ahead, we plan to start a family in 2026 and continue building our life in the UK. This application represents our commitment to our shared future.\n\nYours sincerely,\nJohn Smith\nDate: 14 April 2024"',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            shading: { fill: 'F5F5F5' },
          }),

          // Your Turn (editable)
          new Paragraph({
            text: '✎ WRITE YOUR COVER LETTER',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0FAF5' },
            color: '006633',
          }),
          new Paragraph({
            text: 'Use the structure above. Be factual and chronological. Include specific dates and places. Show genuine emotion but remain professional. Avoid making it overly sentimental — keep it grounded and truthful.',
            italics: true,
            spacing: { after: 100 },
            indent: { left: 400 },
            color: '666666',
          }),
          new Paragraph({
            text: '[Write your cover letter here. Start with: "My name is [YOUR NAME] and I am writing to support my application for a Spouse visa to join my [husband/wife], [PARTNER NAME], in the UK."]\n\n[Paragraph 1: How you met — date, place, what you were doing, first impressions]\n\n[Paragraph 2: Early relationship — how the relationship developed, visits, decisions]\n\n[Paragraph 3: Moving in together — when, where, why this was important]\n\n[Paragraph 4: Milestones — engagement, marriage, children, property purchase]\n\n[Paragraph 5: Current life — jobs, home, daily routines, how you support each other]\n\n[Paragraph 6: Future — next 5 years, family plans, where you\'ll live, career plans]\n\n[Paragraph 7: Closing — reaffirm commitment and love]\n\nSigned: [Your signature]\nDate: [Date]',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            shading: { fill: 'F5F5F5' },
          }),

          // Tips (locked)
          new Paragraph({
            text: '⚠️ CRITICAL TIPS',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'FFF5F0' },
          }),
          new Paragraph({
            text: '✗ Don\'t: Make it generic or templated (officers can tell)\n✗ Don\'t: Use overly flowery or emotional language\n✗ Don\'t: Contradict documents you\'ve submitted\n✗ Don\'t: Exceed 2 pages — keep it focused\n✗ Don\'t: Leave out major events (marriage, moving in, etc.)\n\n✓ DO: Be specific with dates, places, and names\n✓ DO: Show the relationship developed naturally over time\n✓ DO: Reference supporting evidence (photos, messages, etc.)\n✓ DO: Have your partner read it for accuracy\n✓ DO: Print, sign, and date it before submitting',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: 'CC6600', space: 1, style: 'single', size: 6 },
            },
          }),
        ],
      },
    ],
  });
  return doc;
}

function createSkilledWorkerCoverLetter() {
  const doc = new Document({
    sections: [
      {
        children: [
          // Header
          new Paragraph({
            text: 'SKILLED WORKER VISA - COVER LETTER',
            bold: true,
            size: 32,
            spacing: { after: 100 },
            alignment: 'center',
          }),
          new Paragraph({
            text: 'Version: Premium Template | Last Updated: April 2026',
            size: 18,
            spacing: { after: 400 },
            alignment: 'center',
            color: '808080',
          }),

          // Purpose (locked)
          new Paragraph({
            text: '📋 PURPOSE OF THIS LETTER',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0F5FA' },
          }),
          new Paragraph({
            text: 'Your cover letter introduces you and explains your application. It\'s your chance to show the immigration officer why you\'re a genuine, qualified professional coming to work for a legitimate UK employer.\n\nNot required, but highly recommended. A clear, professional cover letter can speed up decision-making.',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: '003366', space: 1, style: 'single', size: 6 },
            },
          }),

          // Structure (locked)
          new Paragraph({
            text: '✓ RECOMMENDED STRUCTURE',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0F5FA' },
          }),
          new Paragraph({
            text: 'Paragraph 1: Your background (name, current role, qualifications)\nParagraph 2: Why you\'re applying (role description, why this job excites you)\nParagraph 3: Your qualifications (degrees, certifications, relevant experience)\nParagraph 4: Why the UK & this employer (career progression, company reputation, industry)\nParagraph 5: Your plans (how long you intend to stay, career trajectory, contribution to the company)\nParagraph 6: Closing (confirmation of documents submitted, readiness to start)\n\nLength: 1 page (250–400 words). Format: Typed, on letterhead if you have it, signed and dated.',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: '003366', space: 1, style: 'single', size: 6 },
            },
          }),

          // Example (locked)
          new Paragraph({
            text: '✓ EXAMPLE: What Good Looks Like',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0F5FA' },
          }),
          new Paragraph({
            text: '"To UK Visas and Immigration,\n\nI am writing to support my application for a Skilled Worker visa to work for Acme Tech Ltd in London.\n\nI hold a Master\'s degree in Computer Science from [University] and have 5 years of experience as a Senior Software Engineer. For the past 3 years, I have worked at [Current Company] in a lead development role managing a team of 8 engineers.\n\nI am applying to join Acme Tech as a Senior Software Architect, a role that will allow me to contribute to their AI research team. This position aligns with my career goals and offers the opportunity to work on cutting-edge projects with a globally recognised team.\n\nI am committed to contributing meaningfully to Acme Tech and to building my career in the UK tech industry. I plan to remain in this role for a minimum of 3 years and to apply for Indefinite Leave to Remain after 5 years, should my employment continue.\n\nI have submitted all required documentation including my Certificate of Sponsorship, employment contract, and academic qualifications. I am ready to commence work on [start date] and will comply with all visa conditions.\n\nThank you for considering my application.\n\nYours faithfully,\n[Your Name]\nDate: 14 April 2024"',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            shading: { fill: 'F5F5F5' },
          }),

          // Your Turn (editable)
          new Paragraph({
            text: '✎ WRITE YOUR COVER LETTER',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0FAF5' },
            color: '006633',
          }),
          new Paragraph({
            text: '[Write your letter here. Address it to: "To UK Visas and Immigration,"]\n\n[Paragraph 1: Your name, background, current role, qualifications]\n\n[Paragraph 2: The job you\'re applying for, why it excites you, employer name]\n\n[Paragraph 3: Your qualifications and experience — be specific]\n\n[Paragraph 4: Why the UK and why this employer — career development, company mission]\n\n[Paragraph 5: How long you plan to stay, your career plans, your commitment]\n\n[Paragraph 6: Confirm documents submitted, ready to start on [date]]\n\nSigned: [Your Name]\nDate: [Date]',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            shading: { fill: 'F5F5F5' },
          }),

          // Tips (locked)
          new Paragraph({
            text: '⚠️ CRITICAL TIPS',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'FFF5F0' },
          }),
          new Paragraph({
            text: '✗ Don\'t: Make it sound generic or templated\n✗ Don\'t: Contradict your CV or employment contract\n✗ Don\'t: Make promises about staying (stick to "minimum 3 years")\n✗ Don\'t: Criticise your current employer\n\n✓ DO: Explain what excites you about THIS role\n✓ DO: Show you understand the employer\'s business\n✓ DO: Be professional and formal in tone\n✓ DO: Reference your qualifications and experience\n✓ DO: Confirm your commitment to visa conditions',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: 'CC6600', space: 1, style: 'single', size: 6 },
            },
          }),
        ],
      },
    ],
  });
  return doc;
}

function createCitizenshipImmigrationHistory() {
  const doc = new Document({
    sections: [
      {
        children: [
          // Header
          new Paragraph({
            text: 'BRITISH CITIZENSHIP - IMMIGRATION HISTORY RECORD',
            bold: true,
            size: 32,
            spacing: { after: 100 },
            alignment: 'center',
          }),
          new Paragraph({
            text: 'Version: Premium Template | Last Updated: April 2026',
            size: 18,
            spacing: { after: 400 },
            alignment: 'center',
            color: '808080',
          }),

          // Purpose (locked)
          new Paragraph({
            text: '📋 PURPOSE OF THIS RECORD',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0F5FA' },
          }),
          new Paragraph({
            text: 'You must provide a complete record of every entry and exit from the UK during your qualifying period (5 years, or 3 years if married to a British citizen).\n\nThis spreadsheet helps you organize all trips and calculate days absent. The Home Office will verify against your passport stamps and entry/exit records.',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: '003366', space: 1, style: 'single', size: 6 },
            },
          }),

          // Critical Rules (locked)
          new Paragraph({
            text: '⚠️ CRITICAL RULES',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'FFF5F0' },
          }),
          new Paragraph({
            text: 'MAX 450 days outside UK in the entire 5-year period\nMAX 90 days outside UK in the final 12 months\n\nEven 1 day over these limits = AUTOMATIC REFUSAL\n\nCounting includes:\n• All trips abroad\n• Every day away from the UK (partial days count as full days)\n• Travel for work, holidays, family visits, emergencies\n\nDoes NOT count against limits:\n• Days inside the UK (even if you leave and return same day)\n• Trips you haven\'t taken yet',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: 'CC3300', space: 1, style: 'single', size: 6 },
            },
          }),

          // Template Instructions (locked)
          new Paragraph({
            text: '✓ HOW TO FILL IN YOUR RECORD',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0F5FA' },
          }),
          new Paragraph({
            text: '1. Create a spreadsheet with these columns:\n   - Date Left UK | Date Returned to UK | Destination | Purpose | Days Away\n\n2. Go through your passport page by page\n   - Find every exit stamp (when you left)\n   - Find every entry stamp (when you returned)\n   - Record exact dates\n\n3. Cross-reference with:\n   - Flight bookings (emails, confirmations)\n   - Travel agency receipts\n   - Employer records (if travel was for work)\n   - Bank/credit card statements (showing transactions abroad)\n\n4. Calculate days:\n   - Count every full and partial day outside UK\n   - Add them up for the 5-year period\n   - Add them up for the final 12 months separately\n   - Compare to limits (450 and 90)\n\n5. Add a buffer:\n   - If you\'re close to the limits, consider waiting before applying\n   - For example: 440 days in 5 years leaves only 10-day margin for error\n   - Recommend: Stay under 430 days in 5 years, under 75 days in final 12 months',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: '003366', space: 1, style: 'single', size: 6 },
            },
          }),

          // Example (locked)
          new Paragraph({
            text: '✓ EXAMPLE SPREADSHEET',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'F0F5FA' },
          }),
          new Paragraph({
            text: 'Date Left UK | Date Returned | Destination | Purpose | Days Away\n14 Jan 2020 | 21 Jan 2020 | Spain | Holiday | 7\n15 Mar 2020 | 18 Mar 2020 | France | Work Conference | 3\n... (continue for each trip)\n\nTOTAL DAYS (5 years): 420 days ✓ Under 450 limit\nTOTAL DAYS (final 12 months): 45 days ✓ Under 90 limit\nSTATUS: ELIGIBLE',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            shading: { fill: 'F5F5F5' },
          }),

          // Warnings (locked)
          new Paragraph({
            text: '⚠️ COMMON MISTAKES',
            bold: true,
            size: 24,
            spacing: { after: 100 },
            shading: { fill: 'FFF5F0' },
          }),
          new Paragraph({
            text: '✗ Forgetting day trips (leaving and returning same day = 1 day counted)\n✗ Miscounting partial days (if you left on the 1st and returned on the 3rd, that\'s 3 days)\n✗ Not including work trips or emergency travel\n✗ Using passport stamps only (some countries don\'t stamp — use flight records)\n✗ Applying before completing 5 years (application must be made ON or AFTER your qualifying date)\n✗ Not accounting for trip you took between application date and decision date',
            spacing: { after: 200, line: 240 },
            indent: { left: 400 },
            border: {
              left: { color: 'CC3300', space: 1, style: 'single', size: 6 },
            },
          }),
        ],
      },
    ],
  });
  return doc;
}

async function generateAdditionalTemplates() {
  console.log('🚀 Generating 3 Additional Templates...\n');

  try {
    // Template 1: Spouse Cover Letter
    const doc1 = createSpouseCoverLetter();
    const buffer1 = await Packer.toBuffer(doc1);
    fs.writeFileSync(
      path.join(TEMPLATES_DIR, 'Spouse_CoverLetter.docx'),
      buffer1
    );
    console.log('✅ 1/3 Spouse_CoverLetter.docx');

    // Template 2: Skilled Worker Cover Letter
    const doc2 = createSkilledWorkerCoverLetter();
    const buffer2 = await Packer.toBuffer(doc2);
    fs.writeFileSync(
      path.join(TEMPLATES_DIR, 'SkilledWorker_CoverLetter.docx'),
      buffer2
    );
    console.log('✅ 2/3 SkilledWorker_CoverLetter.docx');

    // Template 3: Citizenship Immigration History
    const doc3 = createCitizenshipImmigrationHistory();
    const buffer3 = await Packer.toBuffer(doc3);
    fs.writeFileSync(
      path.join(TEMPLATES_DIR, 'Citizenship_ImmigrationHistory.docx'),
      buffer3
    );
    console.log('✅ 3/3 Citizenship_ImmigrationHistory.docx');

    console.log(`\n🎉 COMPLETE!\n`);
    console.log(`📁 Location: ${TEMPLATES_DIR}`);
    console.log('\n✅ Template count: 22 total (19 original + 3 new)');
    console.log('🚀 Ready to update template-mapping.ts');
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

generateAdditionalTemplates();
