/**
 * Generate 25 missing templates following the exact same structure as existing ones.
 * Each template has: Header → Gov Requirements → Example → Editable Section → Why It Matters
 */

const { Document, Packer, Paragraph, BorderStyle, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'public', 'templates');

function createLockedSection(title, content, guidance = null) {
  const paragraphs = [
    new Paragraph({ text: title, bold: true, size: 24, spacing: { after: 100 }, shading: { fill: 'F0F5FA' } }),
    new Paragraph({
      text: content, spacing: { after: 100, line: 240 }, indent: { left: 400 },
      border: { left: { color: '003366', space: 1, style: BorderStyle.SINGLE, size: 6 } },
    }),
  ];
  if (guidance) {
    paragraphs.push(new Paragraph({ text: `💡 ${guidance}`, italics: true, spacing: { after: 200 }, indent: { left: 500 }, color: '666666' }));
  }
  return paragraphs;
}

function createEditableSection(title, placeholder, guidance = null) {
  const paragraphs = [
    new Paragraph({ text: title, bold: true, size: 24, spacing: { after: 100 }, shading: { fill: 'F0FAF5' }, color: '006633' }),
  ];
  if (guidance) {
    paragraphs.push(new Paragraph({ text: guidance, italics: true, spacing: { after: 100 }, indent: { left: 400 }, color: '666666' }));
  }
  paragraphs.push(new Paragraph({ text: placeholder, spacing: { after: 200, line: 240 }, indent: { left: 400 }, shading: { fill: 'F5F5F5' } }));
  return paragraphs;
}

function createHeader(visaType, title) {
  return [
    new Paragraph({ text: `${visaType} - ${title}`, bold: true, size: 32, spacing: { after: 100 }, alignment: AlignmentType.CENTER }),
    new Paragraph({ text: 'Version: Premium Template | Last Updated: April 2026', size: 18, spacing: { after: 400 }, alignment: AlignmentType.CENTER, color: '808080' }),
  ];
}

function buildDoc(visaType, title, govReq, govGuidance, example, exampleGuidance, editTitle, editPlaceholder, editGuidance, whyMatters) {
  return new Document({
    sections: [{
      children: [
        ...createHeader(visaType, title),
        ...createLockedSection('📋 GOVERNMENT REQUIREMENTS', govReq, govGuidance),
        ...createLockedSection('✓ EXAMPLE: What Good Looks Like', example, exampleGuidance),
        ...createEditableSection(`✎ ${editTitle}`, editPlaceholder, editGuidance),
        ...createLockedSection('⚠️ WHY THIS SECTION MATTERS', whyMatters, null),
      ],
    }],
  });
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const TEMPLATES = [
  // ─── SPOUSE ───────────────────────────────────────────────
  {
    filename: 'Spouse_PassportPreparation.docx',
    visaType: 'SPOUSE VISA',
    title: 'PASSPORT PREPARATION GUIDE',
    govReq: 'You must provide your current valid passport or other valid travel document. You must also provide any previous passports you hold.\n\nThe passport must have at least 6 months validity remaining from your intended travel date.\n\nSource: gov.uk/uk-family-visa/provide-information',
    govGuidance: 'Immigration officers check every page — stamps, visas, and blank pages all tell a story about your travel history.',
    example: 'PASSPORT CHECKLIST:\n✓ Bio data page — scanned in full colour at 300+ DPI\n✓ All stamped pages — both sides if double-sided stamps\n✓ All blank pages — proves completeness\n✓ Previous passport (expired 2019) — scanned in full\n✓ Passport validity: expires March 2029 (4+ years remaining)\n✓ Name matches marriage certificate: Sarah Jane Smith\n\nSCANNING NOTES:\n- Used flatbed scanner at 300 DPI\n- Each page saved as separate JPEG\n- Combined into single PDF for upload',
    exampleGuidance: 'Notice: every page scanned, previous passports included, validity checked, and name consistency confirmed.',
    editTitle: 'YOUR PASSPORT PREPARATION',
    editPlaceholder: 'PASSPORT CHECKLIST:\n[ ] Bio data page scanned in full colour at 300+ DPI\n[ ] All stamped pages scanned (both sides)\n[ ] All blank pages scanned\n[ ] Previous passport(s): [LIST ANY PREVIOUS PASSPORTS]\n[ ] Passport validity: expires [DATE] ([X] months remaining)\n[ ] Name matches all other documents: [YOUR FULL NAME AS ON PASSPORT]\n\nNOTES:\n[Add any notes about name changes, damaged pages, or missing passports]',
    editGuidance: 'Check each box as you complete it. If your name has changed, add a note explaining the change with evidence.',
    whyMatters: 'Passport issues are a common cause of delays:\n\n✗ Not scanning blank pages (Home Office may think you\'re hiding stamps)\n✗ Passport expiring within 6 months (application may be refused)\n✗ Name on passport not matching other documents (triggers additional scrutiny)\n✗ Missing previous passports (can\'t verify travel history)\n✗ Blurry scans (caseworker can\'t read stamps — delays processing)\n\nIf you\'ve lost a previous passport, request entry/exit records from the Home Office using a Subject Access Request (SAR). This takes 1-3 months — start early.',
  },
  {
    filename: 'Spouse_BiometricsGuide.docx',
    visaType: 'SPOUSE VISA',
    title: 'BIOMETRICS APPOINTMENT GUIDE',
    govReq: 'Once you submit your visa application, UKVI will ask you to book and attend a biometrics appointment to provide your fingerprints and photograph.\n\nYou can only book AFTER submitting your online application.\n\nIf in the UK, you may be able to use the UK Immigration: ID Check app instead.\n\nSource: gov.uk/find-a-visa-application-centre',
    govGuidance: 'Book immediately after submission — popular VACs fill up fast, especially January–March.',
    example: 'BIOMETRICS PREPARATION:\n\nOnline application submitted: 14 April 2026\nBiometrics appointment booked: 15 April 2026 (next day)\nVAC location: VFS Global, 3rd Floor, 66 Wilson Street, London EC2A 2BT\nAppointment date: 22 April 2026, 10:30 AM\n\nDOCUMENTS TO BRING:\n✓ Current passport (original)\n✓ Application confirmation email (printed)\n✓ Appointment confirmation (printed)\n✓ 2 passport-style photographs (as backup)\n✓ Supporting documents (if submitting physical copies)',
    exampleGuidance: 'Book within 24 hours of online submission. Print ALL confirmations — some VACs don\'t accept digital.',
    editTitle: 'YOUR BIOMETRICS PREPARATION',
    editPlaceholder: 'Online application submitted: [DATE]\nBiometrics appointment booked: [DATE]\nVAC location: [ADDRESS]\nAppointment date: [DATE AND TIME]\n\nDOCUMENTS TO BRING:\n[ ] Current passport (original)\n[ ] Application confirmation email (printed)\n[ ] Appointment confirmation (printed)\n[ ] 2 passport-style photographs\n[ ] Supporting documents (if required)',
    editGuidance: 'Fill in as soon as you submit your application online. Book the earliest available slot.',
    whyMatters: 'Biometrics delays are avoidable:\n\n✗ Waiting too long to book (slots fill up — especially Jan-Mar peak)\n✗ Going to wrong VAC location\n✗ Forgetting to bring passport or confirmation\n✗ Not checking VAC-specific requirements for your country\n\nIMPORTANT: You cannot complete your application without biometrics. The clock on processing time doesn\'t start until biometrics are done.',
  },
  {
    filename: 'Spouse_TBTestCertificate.docx',
    visaType: 'SPOUSE VISA',
    title: 'TB TEST CERTIFICATE GUIDE',
    govReq: 'If you are applying from a country where TB screening is required, you must provide a valid TB test certificate from a Home Office approved clinic.\n\nThe certificate is valid for 6 months from the test date.\n\nCheck gov.uk/tb-test-visa for the list of countries and approved clinics.\n\nSource: gov.uk/tb-test-visa',
    govGuidance: 'Not all countries require a TB test. Check the gov.uk list BEFORE booking — you may not need one.',
    example: 'TB TEST DETAILS:\n\nCountry of application: Nigeria\nTB test required: YES (Nigeria is on the list)\nApproved clinic: IOM Lagos, 4th Floor, Wing B, Providence House, Admiralty Way, Lekki Phase 1\nTest date: 1 April 2026\nCertificate validity: 1 April 2026 – 1 October 2026 (6 months)\nResult: CLEAR\nCertificate reference: TB-NG-2026-04-12345\n\nApplication submission planned: May 2026 (within validity)',
    exampleGuidance: 'Schedule the TB test early but not TOO early — 6-month validity means timing matters.',
    editTitle: 'YOUR TB TEST DETAILS',
    editPlaceholder: 'Country of application: [COUNTRY]\nTB test required: [YES/NO — check gov.uk/tb-test-visa]\nApproved clinic: [CLINIC NAME AND ADDRESS]\nTest date: [DATE]\nCertificate validity: [DATE] – [DATE + 6 MONTHS]\nResult: [CLEAR/REFERRED]\nCertificate reference: [REFERENCE NUMBER]\n\nApplication submission planned: [DATE] (confirm within validity)',
    editGuidance: 'If your country is NOT on the list, you can skip this entirely. If it is, book at an approved clinic only.',
    whyMatters: 'TB test issues that cause problems:\n\n✗ Using a non-approved clinic (certificate not accepted)\n✗ Certificate expired (only valid 6 months — if application is delayed, you need a new one)\n✗ Name on certificate doesn\'t match passport\n✗ Not checking if your country requires it (wastes time and money if not needed)\n\nSome countries have very few approved clinics with long wait times. Book as early as practical within the 6-month window.',
  },
  {
    filename: 'Spouse_EnglishLanguage.docx',
    visaType: 'SPOUSE VISA',
    title: 'ENGLISH LANGUAGE EVIDENCE GUIDE',
    govReq: 'For a first spouse visa application, you must prove English at CEFR A1 level (speaking and listening).\n\nAccepted evidence:\n- SELT test from an approved provider (e.g., IELTS Life Skills A1, Trinity GESE Grade 2)\n- Degree from a UK institution\n- Degree taught in English from a non-UK institution (with Ecctis confirmation)\n- Nationality exemption (USA, Australia, Canada, NZ, and other listed countries)\n\nExemptions: over 65, physical/mental condition, nationals of listed English-speaking countries.\n\nSource: gov.uk/uk-family-visa/knowledge-of-english',
    govGuidance: 'Check exemptions first — you might not need a test at all. If you need one, book IELTS Life Skills A1 specifically (not general IELTS).',
    example: 'ENGLISH LANGUAGE EVIDENCE:\n\nExemption check: Not exempt (Nigerian national, under 65, no disability)\nTest taken: IELTS Life Skills A1 (Speaking and Listening)\nTest provider: British Council (approved SELT provider)\nTest date: 15 March 2026\nResult: PASS (A1 level confirmed)\nCertificate reference: IELTS-LS-2026-78901\nCertificate validity: within 2 years of test date',
    exampleGuidance: 'Make sure you take the right test — IELTS Life Skills A1, NOT general IELTS Academic or General Training.',
    editTitle: 'YOUR ENGLISH LANGUAGE EVIDENCE',
    editPlaceholder: 'Exemption check: [EXEMPT / NOT EXEMPT]\nIf exempt, reason: [NATIONALITY / AGE / DISABILITY / UK DEGREE]\n\nIf test required:\nTest taken: [TEST NAME]\nTest provider: [PROVIDER — must be on approved SELT list]\nTest date: [DATE]\nResult: [PASS/FAIL]\nCertificate reference: [REFERENCE]\n\nIf using degree:\nDegree: [DEGREE TITLE] from [INSTITUTION]\nCountry: [UK / OTHER]\nIf non-UK: Ecctis confirmation code: [CODE]',
    editGuidance: 'For extension after 2.5 years, you\'ll need A2. For ILR after 5 years, you\'ll need B1. Consider taking B1 now to avoid retesting.',
    whyMatters: 'English language errors:\n\n✗ Taking the wrong test (must be on the approved SELT list — general IELTS doesn\'t count)\n✗ Test certificate expired (must be within 2 years for some providers)\n✗ Not checking nationality exemptions (citizens of 18+ countries are exempt)\n✗ Getting Ecctis confirmation for a UK degree (not needed — UK degrees just need the certificate)\n\nPro tip: If you pass B1 now, you can reuse it for your extension AND ILR. Saves money and stress later.',
  },
  {
    filename: 'Spouse_PreviousVisas.docx',
    visaType: 'SPOUSE VISA',
    title: 'PREVIOUS VISA HISTORY GUIDE',
    govReq: 'You must declare all previous visa applications, visas granted, refusals, and curtailments from ANY country — not just the UK.\n\nFailure to disclose previous refusals is treated as deception and can result in automatic refusal plus a 10-year re-entry ban.\n\nSource: gov.uk/uk-family-visa/provide-information',
    govGuidance: 'Honesty is absolutely critical. The Home Office has access to international databases. They WILL find undisclosed refusals.',
    example: 'IMMIGRATION HISTORY:\n\n1. UK Student Visa (Tier 4) — Granted September 2018, expired September 2021\n   Status: Completed, no issues\n   Evidence: Copy of BRP attached\n\n2. US B1/B2 Tourist Visa — Granted March 2017, valid until March 2027\n   Status: Active, used for 2 holidays\n   Evidence: Copy of visa page attached\n\n3. Schengen Visa (France) — REFUSED June 2019\n   Reason: Insufficient financial evidence\n   What changed: Now employed full-time, salary £35,000+\n   Evidence: Refusal letter attached with translation\n\nPREVIOUS UK ADDRESSES: [Listed in separate address history]',
    exampleGuidance: 'Notice: the Schengen refusal is disclosed honestly with explanation of what changed. This is exactly what the Home Office wants to see.',
    editTitle: 'YOUR IMMIGRATION HISTORY',
    editPlaceholder: '1. [COUNTRY] [VISA TYPE] — [GRANTED/REFUSED] [DATE]\n   Status: [COMPLETED/ACTIVE/REFUSED]\n   Evidence: [WHAT\'S ATTACHED]\n\n2. [COUNTRY] [VISA TYPE] — [GRANTED/REFUSED] [DATE]\n   Status: [COMPLETED/ACTIVE/REFUSED]\n   Evidence: [WHAT\'S ATTACHED]\n\nIf REFUSED anywhere:\n   Reason given: [REASON]\n   What has changed since: [EXPLANATION]\n   Evidence of change: [DOCUMENTS]\n\nIf NO previous visa history:\n   I confirm I have never applied for a visa to any country.',
    editGuidance: 'List EVERY visa from EVERY country. Include refusals. If you have no history, state that clearly.',
    whyMatters: 'Immigration history deception is one of the most serious issues:\n\n✗ Failing to disclose a refusal from another country = treated as deception\n✗ Deception = automatic refusal + potential 10-year ban from the UK\n✗ The Home Office cross-references with international databases\n✗ Even minor omissions (e.g., a tourist visa refusal from 10 years ago) can cause problems\n\nIf you were refused and you\'re worried about it:\n- Disclose it honestly\n- Explain what happened and what has changed\n- Provide the refusal letter with translation\n- Consider professional immigration advice for complex refusal histories',
  },
  {
    filename: 'Spouse_AccommodationEvidence.docx',
    visaType: 'SPOUSE VISA',
    title: 'ACCOMMODATION EVIDENCE GUIDE',
    govReq: 'You must prove that you have adequate housing in the UK. The property must not be overcrowded according to UK housing standards.\n\nAccepted evidence: tenancy agreement, mortgage statement, or letter from landlord confirming permission to stay.\n\nSource: gov.uk/uk-family-visa/partner-spouse',
    govGuidance: 'If living with family/friends, a letter from the property owner confirming permission and room availability is essential.',
    example: 'ACCOMMODATION DETAILS:\n\nProperty: 24 Oak Lane, Birmingham, B15 3QR\nType: 2-bedroom flat (rented)\nTenancy: Joint tenancy — John Smith and Sarah Johnson\nLandlord: Midlands Property Management Ltd\nTenancy start: 1 January 2025\nMonthly rent: £850\n\nOCCUPANTS:\n1. John Smith (sponsor) — Bedroom 1\n2. Sarah Johnson (applicant) — Bedroom 1\nTotal bedrooms: 2 | Total occupants: 2\nOvercrowding assessment: NOT overcrowded\n\nEVIDENCE ATTACHED:\n✓ Signed tenancy agreement (both names)\n✓ Council Tax bill (showing address)\n✓ Recent utility bill (showing address)',
    exampleGuidance: 'Show clearly: who lives there, how many rooms, and that it\'s not overcrowded. Include tenancy + Council Tax.',
    editTitle: 'YOUR ACCOMMODATION DETAILS',
    editPlaceholder: 'Property: [FULL ADDRESS]\nType: [HOUSE/FLAT/ROOM — NUMBER OF BEDROOMS]\nTenancy: [SOLE/JOINT — NAMES ON TENANCY]\nLandlord: [NAME OR MANAGEMENT COMPANY]\nTenancy start: [DATE]\nMonthly rent/mortgage: £[AMOUNT]\n\nOCCUPANTS:\n1. [NAME] — [BEDROOM]\n2. [NAME] — [BEDROOM]\nTotal bedrooms: [X] | Total occupants: [X]\nOvercrowding: [NOT OVERCROWDED / EXPLAIN]\n\nEVIDENCE ATTACHED:\n[ ] Tenancy agreement or mortgage statement\n[ ] Council Tax bill\n[ ] Utility bill at address\n[ ] Landlord letter (if living with family/friends)',
    editGuidance: 'If living with family, get a signed letter from the homeowner confirming: permission to stay, number of rooms, current occupants.',
    whyMatters: 'Accommodation issues:\n\n✗ No tenancy agreement or proof of address\n✗ Property overcrowded (too many people for the number of rooms)\n✗ Living with family but no letter from homeowner\n✗ Address on tenancy doesn\'t match other documents\n\nThe Home Office checks that the property meets the Housing Act standards for overcrowding. Two adults sharing a bedroom is fine. But 4 adults in a 1-bed flat is not.',
  },
  {
    filename: 'Spouse_SponsorIdentity.docx',
    visaType: 'SPOUSE VISA',
    title: 'SPONSOR IDENTITY DOCUMENTS GUIDE',
    govReq: 'Your UK-based partner (sponsor) must prove they are a British citizen or have settled status in the UK.\n\nAccepted: British passport, naturalisation certificate, BRP showing ILR, or EU Settlement Scheme share code.\n\nSource: gov.uk/uk-family-visa/partner-spouse',
    govGuidance: 'The sponsor\'s right to be in the UK is the foundation of the entire application. Without it, nothing else matters.',
    example: 'SPONSOR IDENTITY:\n\nSponsor name: John Andrew Smith\nNationality: British\nStatus: British citizen by birth\n\nEVIDENCE:\n✓ British passport — bio page scanned (colour, 300 DPI)\n   Passport number: 123456789\n   Expiry: 15 March 2032\n\nNote: Sponsor was born in the UK and holds a British passport. No naturalisation certificate needed.',
    exampleGuidance: 'If your sponsor naturalised, include the naturalisation certificate. If they have EU settled status, include their share code.',
    editTitle: 'YOUR SPONSOR\'S IDENTITY DETAILS',
    editPlaceholder: 'Sponsor name: [FULL NAME]\nNationality: [BRITISH / OTHER]\nStatus: [BRITISH CITIZEN / ILR / SETTLED STATUS / PRE-SETTLED STATUS]\n\nEVIDENCE:\n[ ] British passport — bio page scanned\n[ ] Naturalisation certificate (if applicable)\n[ ] BRP showing ILR (if applicable)\n[ ] EU Settlement Scheme share code (if applicable)\n\nPassport/BRP number: [NUMBER]\nExpiry: [DATE]',
    editGuidance: 'Scan the bio page in colour at 300 DPI minimum. If sponsor has multiple nationalities, include all relevant documents.',
    whyMatters: 'Without valid sponsor identity evidence, your application has no legal basis:\n\n✗ Sponsor\'s passport expired (they need to renew first)\n✗ Sponsor claims ILR but can\'t prove it (BRP lost — request replacement)\n✗ Sponsor has pre-settled status but not settled (different eligibility rules apply)\n✗ Sponsor\'s name doesn\'t match your marriage certificate',
  },
  {
    filename: 'Spouse_ThirdPartyLetters.docx',
    visaType: 'SPOUSE VISA',
    title: 'THIRD-PARTY SUPPORT LETTERS GUIDE',
    govReq: 'Supporting letters from people who know your relationship can strengthen your application. These are not mandatory but strongly recommended, especially for shorter relationships or those without cohabitation.\n\nSource: gov.uk/uk-family-visa/partner-spouse',
    govGuidance: '2-4 letters from different people on both sides of the relationship. Each should include a copy of their ID.',
    example: 'LETTER FROM: Margaret Smith (sponsor\'s mother)\n\nTo Whom It May Concern,\n\nI am writing in support of the visa application for Sarah Johnson, who is the partner of my son John Smith.\n\nI have known Sarah since December 2020 when John first introduced her to our family at Christmas dinner. Over the past 5 years, I have witnessed their relationship grow from dating to living together (2021), to getting engaged (2023), and married (2024).\n\nThey visit us regularly as a couple — approximately every 2-3 weeks. I have seen them build a life together including purchasing a home in Birmingham in 2022.\n\nI am confident their relationship is genuine and that they are committed to building their life together in the UK.\n\nSigned: Margaret Smith\nDate: 10 April 2026\nAddress: 12 Church Lane, Solihull, B91 2AA\nRelationship to applicant: Mother-in-law\n\n[Copy of Margaret Smith\'s driving licence attached]',
    exampleGuidance: 'Specific dates, events, and observations. Not generic praise — concrete evidence of witnessing the relationship.',
    editTitle: 'TEMPLATE FOR YOUR SUPPORT LETTERS',
    editPlaceholder: 'LETTER FROM: [FULL NAME] ([RELATIONSHIP TO YOU/YOUR PARTNER])\n\nTo Whom It May Concern,\n\nI am writing in support of the visa application for [APPLICANT NAME], who is the partner of [SPONSOR NAME].\n\nI have known [APPLICANT/COUPLE] since [DATE/OCCASION]. [DESCRIBE HOW YOU KNOW THEM AND WHAT YOU HAVE WITNESSED OF THEIR RELATIONSHIP — be specific about dates, events, visits].\n\n[DESCRIBE SPECIFIC EXAMPLES: holidays together, family events, daily life you have observed].\n\nI am confident their relationship is genuine and that they are committed to building their life together in the UK.\n\nSigned: [NAME]\nDate: [DATE]\nAddress: [FULL ADDRESS]\nRelationship to applicant: [RELATIONSHIP]\n\n[Attach copy of ID — passport or driving licence]',
    editGuidance: 'Give this template to 2-4 people (mix of your side and partner\'s side). Ask them to write in their own words using this structure.',
    whyMatters: 'Support letters strengthen applications when:\n- Relationship is relatively new (under 2 years)\n- You haven\'t lived together\n- Other evidence is thin\n\nCommon mistakes:\n✗ Generic letters that don\'t mention specific dates or events\n✗ No ID copy attached (caseworker can\'t verify the writer)\n✗ All letters from one side of the relationship\n✗ Letters from family members only (include friends, colleagues)',
  },

  // ─── SKILLED WORKER ───────────────────────────────────────
  {
    filename: 'SkilledWorker_PassportPreparation.docx',
    visaType: 'SKILLED WORKER VISA',
    title: 'PASSPORT PREPARATION GUIDE',
    govReq: 'You must provide a current passport or other valid travel document.\n\nIMPORTANT: The name on your passport MUST exactly match the name your employer used on your Certificate of Sponsorship. Even minor differences cause delays.\n\nSource: gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    govGuidance: 'Check name matches CoS BEFORE submitting. Middle names, spelling variations, and transliteration differences are common issues.',
    example: 'PASSPORT DETAILS:\n\nName on passport: JAMES KWESI WONG\nName on CoS: JAMES KWESI WONG\nMatch: ✓ Exact match confirmed\n\nPassport number: E12345678\nExpiry: 20 November 2030 (4+ years remaining)\n\nScanned: bio page + all stamped pages + blank pages\nFormat: colour PDF, 300 DPI',
    exampleGuidance: 'The name match between passport and CoS is critical. Any discrepancy must be resolved with your employer before applying.',
    editTitle: 'YOUR PASSPORT PREPARATION',
    editPlaceholder: 'Name on passport: [FULL NAME]\nName on CoS: [FULL NAME — check with employer]\nMatch: [ ] Exact match confirmed / [ ] Discrepancy — needs resolution\n\nPassport number: [NUMBER]\nExpiry: [DATE] ([X months remaining])\n\nScan checklist:\n[ ] Bio data page (colour, 300 DPI)\n[ ] All stamped pages\n[ ] All blank pages\n[ ] Previous passports',
    editGuidance: 'If names don\'t match exactly, contact your employer to correct the CoS BEFORE you apply.',
    whyMatters: 'For Skilled Worker visas specifically:\n\n✗ Name mismatch between passport and CoS = guaranteed delay or refusal\n✗ Passport expiring within visa period (renew first)\n✗ Not including previous passports with UK stamps\n\nYour employer\'s HR team should verify the CoS name matches your passport exactly before you start your application.',
  },
  {
    filename: 'SkilledWorker_EnglishLanguage.docx',
    visaType: 'SKILLED WORKER VISA',
    title: 'ENGLISH LANGUAGE EVIDENCE GUIDE',
    govReq: 'You must prove English at CEFR B1 level (speaking, reading, writing, and understanding).\n\nAccepted: IELTS for UKVI (min 4.0 in each component), UK degree, non-UK degree taught in English (with Ecctis confirmation), or nationality exemption.\n\nSource: gov.uk/skilled-worker-visa/knowledge-of-english',
    govGuidance: 'B1 for Skilled Worker is higher than A1 for Spouse. Make sure you\'re taking the right test at the right level.',
    example: 'ENGLISH LANGUAGE EVIDENCE:\n\nMethod: UK Bachelor\'s Degree\nUniversity: University of Manchester\nDegree: BSc Computer Science (2018)\nCertificate: Original degree certificate attached\n\nNo Ecctis confirmation needed (UK institution).\nNo SELT test needed.',
    exampleGuidance: 'A UK degree is the simplest proof. If your degree is from outside the UK, you\'ll need Ecctis confirmation (takes 10-15 working days).',
    editTitle: 'YOUR ENGLISH LANGUAGE EVIDENCE',
    editPlaceholder: 'Method: [UK DEGREE / NON-UK DEGREE / SELT TEST / NATIONALITY EXEMPTION]\n\nIf degree:\n  University: [NAME]\n  Degree: [TITLE AND YEAR]\n  Country: [UK / OTHER]\n  If non-UK: Ecctis code: [CODE]\n\nIf SELT test:\n  Test: [IELTS for UKVI / OTHER]\n  Date: [DATE]\n  Scores: Reading [X] Writing [X] Speaking [X] Listening [X]\n  Overall: [X] (minimum 4.0 in each component)\n\nIf exempt:\n  Nationality: [COUNTRY from exempt list]',
    editGuidance: 'For Skilled Worker you need B1 (higher than Spouse A1). IELTS for UKVI minimum 4.0 in EACH component.',
    whyMatters: 'English language for Skilled Worker:\n\n✗ Taking general IELTS instead of IELTS for UKVI (different test — must be on approved list)\n✗ Scoring 4.0 overall but below 4.0 in one component (ALL components must be 4.0+)\n✗ Non-UK degree without Ecctis confirmation\n✗ Test certificate expired\n\nOrder Ecctis confirmation early — it takes 10-15 working days and they can have backlogs.',
  },
  {
    filename: 'SkilledWorker_CriminalRecord.docx',
    visaType: 'SKILLED WORKER VISA',
    title: 'CRIMINAL RECORD CERTIFICATE GUIDE',
    govReq: 'Required for roles working with children or vulnerable adults (healthcare, education, social work).\n\nYou need a criminal record certificate from EACH country you have lived in for 12+ months in the last 10 years.\n\nSource: gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    govGuidance: 'Processing times vary wildly by country (2 weeks to 3 months). Start this early. Ask your employer\'s HR if this applies to your role.',
    example: 'CRIMINAL RECORD CERTIFICATES:\n\nRole: Senior Care Worker (works with vulnerable adults)\nCriminal record check required: YES\n\nCountries lived in 12+ months (last 10 years):\n1. Nigeria (2015-2020): Police clearance from Nigeria Police Force\n   Applied: 1 March 2026 | Received: 15 April 2026\n   Result: No criminal record\n   Certified translation: Attached\n\n2. UK (2020-present): DBS check arranged by employer\n   Result: Enhanced DBS — clear\n\nAll certificates attached with certified English translations where applicable.',
    exampleGuidance: 'Start police clearance requests immediately — some countries take months. Your employer should arrange the UK DBS check.',
    editTitle: 'YOUR CRIMINAL RECORD CERTIFICATES',
    editPlaceholder: 'Role: [JOB TITLE]\nCriminal record check required: [YES/NO — ask employer]\n\nCountries lived in 12+ months (last 10 years):\n1. [COUNTRY] ([YEARS]): [STATUS — applied/received/pending]\n   Applied: [DATE] | Received: [DATE]\n   Result: [CLEAR/DETAILS]\n   Translation needed: [YES/NO]\n\n2. [COUNTRY] ([YEARS]): [STATUS]\n\nUK DBS check: [ARRANGED BY EMPLOYER / PENDING / COMPLETE]',
    editGuidance: 'If you\'re unsure whether your role requires this, ask your employer — they should know based on the SOC code.',
    whyMatters: 'Criminal record certificate delays are the #1 cause of Skilled Worker visa delays for healthcare/education workers:\n\n✗ Not requesting certificates early enough (some countries take 3 months)\n✗ Forgetting a country you lived in for 12+ months\n✗ No certified English translation for non-English certificates\n✗ Not realising your role requires it (check with employer)',
  },
  {
    filename: 'SkilledWorker_CoSChecklist.docx',
    visaType: 'SKILLED WORKER VISA',
    title: 'CERTIFICATE OF SPONSORSHIP (CoS) CHECKLIST',
    govReq: 'Your employer assigns your CoS via the Sponsor Management System. It contains your CoS reference number, job details, salary, and SOC code.\n\nThe CoS is valid for 3 months from assignment. Apply BEFORE it expires.\n\nYou do NOT receive a physical document — just a reference number.\n\nSource: gov.uk/skilled-worker-visa/your-job',
    govGuidance: 'Apply within 2 weeks of CoS assignment. Verify every detail matches your contract BEFORE you apply.',
    example: 'CoS VERIFICATION CHECKLIST:\n\nCoS reference number: ABC1234567\nAssigned: 1 April 2026\nExpiry: 1 July 2026 (3 months)\n\nVERIFICATION:\n✓ Job title on CoS matches contract: Senior Software Engineer\n✓ SOC code: 2134 (Programmers and software development professionals)\n✓ Salary on CoS: £45,000 — matches employment contract\n✓ Start date: 1 May 2026\n✓ Employer name: Acme Tech Ltd\n✓ Sponsor licence: verified on public register\n✓ Maintenance certified by employer: YES',
    exampleGuidance: 'Check EVERY field matches your employment contract. Any discrepancy between CoS and contract = refusal risk.',
    editTitle: 'YOUR CoS VERIFICATION',
    editPlaceholder: 'CoS reference number: [NUMBER]\nAssigned: [DATE]\nExpiry: [DATE + 3 MONTHS]\n\nVERIFICATION:\n[ ] Job title matches contract: [TITLE]\n[ ] SOC code: [CODE] — verified correct for role\n[ ] Salary matches contract: £[AMOUNT]\n[ ] Start date: [DATE]\n[ ] Employer name: [COMPANY]\n[ ] Sponsor licence on public register: [ ] Verified\n[ ] Maintenance certified by employer: [YES/NO]',
    editGuidance: 'Get this information from your employer\'s HR team. They assigned the CoS and should provide you the reference number.',
    whyMatters: 'CoS issues cause immediate refusal:\n\n✗ CoS expired before application submitted (only valid 3 months)\n✗ Salary on CoS doesn\'t match employment contract\n✗ Wrong SOC code (employer used incorrect occupation code)\n✗ Employer\'s sponsor licence revoked or suspended\n\nIMPORTANT: If your employer\'s licence is revoked after your visa is granted, you have only 60 days to find a new sponsor.',
  },
  {
    filename: 'SkilledWorker_Qualifications.docx',
    visaType: 'SKILLED WORKER VISA',
    title: 'ACADEMIC & PROFESSIONAL QUALIFICATIONS GUIDE',
    govReq: 'Not always required, but recommended — especially if your salary is near the minimum threshold or your career path isn\'t obvious.\n\nFor non-UK qualifications, you may need an Ecctis (formerly NARIC) assessment to confirm equivalency.\n\nSource: gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    govGuidance: 'Ecctis assessments take 10-15 working days. Order early if needed.',
    example: 'QUALIFICATIONS:\n\n1. BSc Computer Science — University of Lagos, Nigeria (2018)\n   Ecctis confirmation: Yes (equivalent to UK Bachelor\'s degree)\n   Ecctis code: ECCTIS-2026-12345\n\n2. AWS Solutions Architect Professional — Amazon (2022)\n   Industry certification — no Ecctis needed\n\n3. PRINCE2 Practitioner — Axelos (2021)\n   Professional certification — no Ecctis needed',
    exampleGuidance: 'Include all relevant qualifications. Only non-UK degrees need Ecctis assessment.',
    editTitle: 'YOUR QUALIFICATIONS',
    editPlaceholder: '1. [DEGREE/QUALIFICATION] — [INSTITUTION], [COUNTRY] ([YEAR])\n   Ecctis needed: [YES — non-UK degree / NO — UK degree or professional cert]\n   Ecctis code: [CODE if applicable]\n\n2. [QUALIFICATION] — [ISSUER] ([YEAR])\n\n3. [QUALIFICATION] — [ISSUER] ([YEAR])',
    editGuidance: 'Only non-UK academic degrees need Ecctis. Professional certifications (AWS, PRINCE2, etc.) don\'t.',
    whyMatters: 'Qualification issues:\n\n✗ Non-UK degree without Ecctis confirmation (especially important if English evidence relies on the degree)\n✗ Qualifications don\'t match the role on the CoS\n✗ Missing certificates (request duplicates from your university early)\n\nWhile not always mandatory, strong qualifications support your case, especially if your salary is close to the minimum threshold.',
  },
  {
    filename: 'SkilledWorker_ATASCertificate.docx',
    visaType: 'SKILLED WORKER VISA',
    title: 'ATAS CERTIFICATE GUIDE',
    govReq: 'The Academic Technology Approval Scheme (ATAS) certificate is required for certain PhD-level research roles in sensitive subjects (engineering, technology, some sciences).\n\nProcessing takes up to 20 working days. Your employer should confirm if ATAS applies to your role.\n\nSource: gov.uk/guidance/academic-technology-approval-scheme',
    govGuidance: 'Not all research roles need ATAS. Check the specific SOC code requirements. Your employer\'s HR should know.',
    example: 'ATAS DETAILS:\n\nRole: Research Fellow in Materials Science\nSOC code: 2119 (Natural and social science professionals n.e.c.)\nATAS required: YES\n\nApplication submitted: 1 March 2026\nATAS certificate received: 25 March 2026\nCertificate reference: ATAS-2026-56789\nValid until: 6 months from issue',
    exampleGuidance: 'Apply for ATAS as soon as you know your role requires it — 20 working days is the estimate but it can take longer.',
    editTitle: 'YOUR ATAS DETAILS',
    editPlaceholder: 'Role: [JOB TITLE]\nSOC code: [CODE]\nATAS required: [YES/NO — confirm with employer]\n\nIf required:\nApplication submitted: [DATE]\nATAS certificate received: [DATE]\nCertificate reference: [REFERENCE]\nValid until: [DATE]',
    editGuidance: 'If your SOC code doesn\'t require ATAS, you can skip this entirely.',
    whyMatters: 'ATAS delays can hold up your entire visa application:\n\n✗ Not checking if your role requires it (wastes time if it does)\n✗ Applying too late (20+ working days processing)\n✗ Certificate expired before visa application submitted\n\nYour employer should be able to confirm ATAS requirements based on the SOC code and job description.',
  },
  {
    filename: 'SkilledWorker_PreviousVisas.docx',
    visaType: 'SKILLED WORKER VISA',
    title: 'PREVIOUS VISA HISTORY GUIDE',
    govReq: 'Disclose all previous UK visas, BRPs, and any refusal/curtailment letters from any country.\n\nUndisclosed refusals — even from other countries — count as deception and can lead to a 10-year ban.\n\nIf this is your first visa application, confirm this on the form.\n\nSource: gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    govGuidance: 'The Home Office cross-references international databases. Always disclose everything.',
    example: 'PREVIOUS VISA HISTORY:\n\n1. UK Student Visa (Tier 4) — Granted 2019, expired 2022\n   Evidence: BRP copy attached\n\n2. No refusals from any country.\n\nOR: First-time visa applicant — no previous history.',
    exampleGuidance: 'Simple and honest. If you have no history, just state it clearly.',
    editTitle: 'YOUR VISA HISTORY',
    editPlaceholder: '[LIST ALL PREVIOUS VISAS AND REFUSALS]\n\nOR: I confirm this is my first visa application. I have no previous visa history from any country.',
    editGuidance: 'Include everything. If in doubt about whether to include something, include it.',
    whyMatters: 'Same rules apply as for all visa types — deception about previous refusals is the fastest route to a 10-year ban.',
  },
  {
    filename: 'SkilledWorker_ChildrenDependants.docx',
    visaType: 'SKILLED WORKER VISA',
    title: 'CHILDREN AS DEPENDANTS GUIDE',
    govReq: 'Your children can apply to join you as dependants. Each child needs their own application, documents, and fees.\n\nFees: same as your application fee (based on duration) + IHS (£776/year for under-18s).\n\nSource: gov.uk/skilled-worker-visa/your-partner-and-children',
    govGuidance: 'Ask your employer if they certify maintenance for dependants too — saves providing bank statements.',
    example: 'DEPENDANT CHILDREN:\n\n1. Emily Wong, age 7\n   Passport: E98765432 (valid until 2032)\n   Birth certificate: attached (certified translation from Mandarin)\n   Other parent consent: Written consent from mother (Li Wei) attached\n   Maintenance: Certified by employer on CoS',
    exampleGuidance: 'Each child needs: passport, birth certificate, and consent from any parent not applying.',
    editTitle: 'YOUR DEPENDANT CHILDREN',
    editPlaceholder: '1. [CHILD NAME], age [AGE]\n   Passport: [NUMBER] (valid until [DATE])\n   Birth certificate: [ ] Attached [ ] Translation needed\n   Other parent consent: [ ] Attached [ ] Not applicable (sole custody)\n   Maintenance: [ ] Employer certified [ ] Bank statements provided',
    editGuidance: 'Get written consent from the other parent early — this can take time, especially if the relationship is difficult.',
    whyMatters: 'Common dependant issues:\n\n✗ Missing consent from other parent (if not applying together)\n✗ Birth certificate without certified translation\n✗ Not budgeting for dependant fees (each child costs the full application fee)\n✗ Children 18+ have different rules — check gov.uk',
  },

  // ─── CITIZENSHIP ──────────────────────────────────────────
  {
    filename: 'Citizenship_BirthCertificate.docx',
    visaType: 'BRITISH CITIZENSHIP',
    title: 'BIRTH CERTIFICATE GUIDE',
    govReq: 'You must provide your original birth certificate. If not in English, include a certified translation.\n\nIf you cannot obtain a birth certificate, provide a statutory declaration explaining why and alternative identity evidence.\n\nSource: gov.uk/apply-citizenship-indefinite-leave-to-remain',
    govGuidance: 'Some countries make it difficult to obtain birth certificates. Start early — request from your country\'s civil registry.',
    example: 'BIRTH CERTIFICATE:\n\nFull name: Aisha Fatima Mohammed\nDate of birth: 15 March 1988\nPlace of birth: Lagos, Nigeria\nParents: Mohammed Ibrahim (father), Fatima Abubakar (mother)\n\nOriginal: Yes (certified copy from Nigerian National Population Commission)\nLanguage: English (no translation needed)\n\nNote: Name on birth certificate matches passport exactly.',
    exampleGuidance: 'Ensure the name matches your passport. If it doesn\'t, provide evidence of name change (marriage cert, deed poll).',
    editTitle: 'YOUR BIRTH CERTIFICATE DETAILS',
    editPlaceholder: 'Full name on certificate: [NAME]\nDate of birth: [DATE]\nPlace of birth: [CITY, COUNTRY]\nParents: [FATHER NAME], [MOTHER NAME]\n\nOriginal available: [YES/NO]\nLanguage: [ENGLISH / OTHER — translation needed]\nName matches passport: [YES / NO — explain difference]',
    editGuidance: 'If you can\'t get your birth certificate, explain why in a statutory declaration and provide alternative ID.',
    whyMatters: 'Birth certificate issues:\n\n✗ Not in English without certified translation\n✗ Name doesn\'t match passport (need evidence of change)\n✗ Unable to obtain one (provide statutory declaration)\n✗ Damaged or illegible (request a new certified copy)',
  },
  {
    filename: 'Citizenship_AddressHistory.docx',
    visaType: 'BRITISH CITIZENSHIP',
    title: 'ADDRESS HISTORY (5 YEARS) GUIDE',
    govReq: 'You must provide all UK addresses in the last 5 years with dates of residence.\n\nEvidence: Council Tax bills, tenancy agreements, utility bills, or bank statements showing each address.\n\nSource: gov.uk/apply-citizenship-indefinite-leave-to-remain',
    govGuidance: 'Gaps in address history raise questions. If you lived with someone without bills in your name, get a letter confirming your stay.',
    example: 'ADDRESS HISTORY (5 YEARS):\n\n1. 24 Oak Lane, Birmingham, B15 3QR\n   From: March 2023 – Present\n   Evidence: Council Tax bill + tenancy agreement\n\n2. 8 Victoria Road, London, SE1 7PQ\n   From: June 2021 – February 2023\n   Evidence: Utility bills (gas + electric)\n\n3. 42 High Street, Manchester, M1 4BH\n   From: April 2021 – May 2021 (temporary)\n   Evidence: Letter from householder confirming stay\n\nNO GAPS in address history.',
    exampleGuidance: 'Account for every period — even short stays. Gaps trigger additional enquiries and delays.',
    editTitle: 'YOUR ADDRESS HISTORY',
    editPlaceholder: '1. [FULL ADDRESS]\n   From: [DATE] – [DATE or PRESENT]\n   Evidence: [DOCUMENT TYPE]\n\n2. [FULL ADDRESS]\n   From: [DATE] – [DATE]\n   Evidence: [DOCUMENT TYPE]\n\n[Continue for all addresses in last 5 years]\n\nGaps: [NONE / EXPLAIN ANY GAPS]',
    editGuidance: 'Include every address, even temporary ones. For each, attach at least one piece of evidence.',
    whyMatters: 'Address history gaps are a red flag:\n\n✗ Missing addresses (where were you?)\n✗ No evidence for an address (no bills in your name)\n✗ Dates don\'t match other documents\n✗ Frequent moves without explanation\n\nThe Home Office uses address history to verify your continuous residence claim.',
  },
  {
    filename: 'Citizenship_TaxRecords.docx',
    visaType: 'BRITISH CITIZENSHIP',
    title: 'TAX & NATIONAL INSURANCE RECORD GUIDE',
    govReq: 'Evidence of tax compliance shows you have been economically active and law-abiding. Provide P60s, tax returns, or HMRC tax summaries.\n\nAccess records via your Personal Tax Account on gov.uk.\n\nSource: gov.uk/apply-citizenship-indefinite-leave-to-remain',
    govGuidance: 'If you have any tax debts or missed filings, resolve them BEFORE applying. Tax issues can affect your good character assessment.',
    example: 'TAX RECORD SUMMARY:\n\nNational Insurance number: AB 12 34 56 C\n\nTax year 2025-26: P60 showing £42,000 income, £6,800 tax paid\nTax year 2024-25: P60 showing £38,000 income, £5,900 tax paid\nTax year 2023-24: P60 showing £35,000 income, £5,200 tax paid\nTax year 2022-23: P60 showing £32,000 income, £4,600 tax paid\nTax year 2021-22: P60 showing £28,000 income, £3,400 tax paid\n\nAll tax paid on time. No outstanding debts or missed filings.',
    exampleGuidance: 'Download your HMRC tax summaries online — they\'re the easiest way to show your complete tax history.',
    editTitle: 'YOUR TAX RECORDS',
    editPlaceholder: 'National Insurance number: [NI NUMBER]\n\nTax year [YEAR]: [P60/SA302] showing £[INCOME], £[TAX PAID]\nTax year [YEAR]: [P60/SA302] showing £[INCOME], £[TAX PAID]\n[Continue for qualifying period]\n\nOutstanding tax debts: [NONE / DETAILS]\nMissed filings: [NONE / DETAILS]',
    editGuidance: 'Access your records at gov.uk/personal-tax-account. Resolve any debts before applying.',
    whyMatters: 'Tax compliance matters for the "good character" requirement:\n\n✗ Outstanding tax debts (may fail good character test)\n✗ Missed Self Assessment filings\n✗ Working cash-in-hand without declaring income\n✗ Not having records for the full qualifying period',
  },
  {
    filename: 'Citizenship_CriminalRecord.docx',
    visaType: 'BRITISH CITIZENSHIP',
    title: 'CRIMINAL RECORD DECLARATION GUIDE',
    govReq: 'You must declare ALL criminal convictions, cautions, and penalties — including driving offences and overseas convictions.\n\nIMPORTANT: Unlike visa applications, SPENT convictions ARE relevant for citizenship. Even penalty points must be declared.\n\nNon-disclosure = refusal + potential ban.\n\nSource: gov.uk/apply-citizenship-indefinite-leave-to-remain',
    govGuidance: 'The good character requirement for citizenship is stricter than for visas. Declare everything — even minor driving offences.',
    example: 'CRIMINAL RECORD DECLARATION:\n\nConvictions: NONE\nCautions: NONE\nPenalties: 3 penalty points on driving licence (speeding, July 2023)\n  Fine: £100\n  Points: expired/active\n  Declared: YES\n\nOverseas convictions: NONE\n\nI declare that the above is a complete and truthful record of my criminal history in all countries.',
    exampleGuidance: 'Even 3 penalty points for speeding must be declared. The Home Office checks DVLA records.',
    editTitle: 'YOUR CRIMINAL RECORD DECLARATION',
    editPlaceholder: 'Convictions: [NONE / LIST ALL]\nCautions: [NONE / LIST ALL]\nPenalties: [NONE / LIST ALL including driving offences]\nOverseas convictions: [NONE / LIST ALL]\n\nFor each offence:\n  Date: [DATE]\n  Offence: [DESCRIPTION]\n  Outcome: [FINE/SENTENCE/POINTS]\n  Country: [UK / OTHER]\n\nI declare this is a complete record of my criminal history.',
    editGuidance: 'Declare EVERYTHING. Spent convictions count for citizenship. Driving offences count. Overseas offences count.',
    whyMatters: 'The good character requirement is the strictest part of citizenship:\n\n✗ Not declaring spent convictions (they still count for citizenship)\n✗ Not declaring driving offences (penalty points, speeding fines)\n✗ Not declaring overseas convictions\n✗ Non-disclosure is treated as dishonesty — worse than the offence itself\n\nSerious convictions (prison sentences) may make you permanently ineligible. Minor offences (speeding) won\'t prevent citizenship if declared honestly.',
  },
  {
    filename: 'Citizenship_Referees.docx',
    visaType: 'BRITISH CITIZENSHIP',
    title: 'TWO REFEREES GUIDE',
    govReq: 'You need two referees who have known you for 3+ years:\n- One must be a professional person (doctor, lawyer, teacher, civil servant, bank officer, etc.)\n- The other must be a British citizen\n- Neither can be related to you, each other, or your solicitor\n\nThey complete sections of the application form directly.\n\nSource: gov.uk/apply-citizenship-indefinite-leave-to-remain',
    govGuidance: 'Choose referees carefully — the Home Office may contact them. Ensure they can respond promptly.',
    example: 'REFEREE 1 (Professional):\nName: Dr Sarah Williams\nProfession: General Practitioner\nKnown applicant since: 2020 (6 years)\nRelationship: Family doctor\nBritish citizen: Yes\nRelated to applicant: No\n\nREFEREE 2 (British Citizen):\nName: David Thompson\nProfession: Accountant\nKnown applicant since: 2019 (7 years)\nRelationship: Friend and former colleague\nBritish citizen: Yes\nRelated to applicant: No',
    exampleGuidance: 'Both referees must have known you 3+ years. The professional referee doesn\'t need to be British, but the other one does.',
    editTitle: 'YOUR REFEREES',
    editPlaceholder: 'REFEREE 1 (Professional — doctor, lawyer, teacher, etc.):\nName: [FULL NAME]\nProfession: [PROFESSIONAL TITLE]\nKnown you since: [YEAR] ([X] years)\nRelationship: [HOW YOU KNOW THEM]\nBritish citizen: [YES/NO — not required for professional referee]\n\nREFEREE 2 (Must be British citizen):\nName: [FULL NAME]\nProfession: [ANY]\nKnown you since: [YEAR] ([X] years)\nRelationship: [HOW YOU KNOW THEM]\nBritish citizen: YES (required)\n\nConfirm: Neither referee is related to you, each other, or your solicitor: [ ]',
    editGuidance: 'Ask your referees well in advance. Explain the process — they\'ll need to fill in part of the form and may be contacted.',
    whyMatters: 'Referee issues delay applications:\n\n✗ Referee hasn\'t known you for 3 years (check dates)\n✗ Referee is a family member (not allowed)\n✗ Neither referee is a British citizen (at least one must be)\n✗ Professional referee isn\'t in an accepted profession\n✗ Referees don\'t respond to Home Office contact (choose reliable people)',
  },
  {
    filename: 'Citizenship_PartnerPassport.docx',
    visaType: 'BRITISH CITIZENSHIP',
    title: 'BRITISH SPOUSE PASSPORT GUIDE',
    govReq: 'If applying via the 3-year route (married to a British citizen), provide a colour copy of your British citizen spouse\'s passport.\n\nIf they naturalised, include their naturalisation certificate.\n\nSource: gov.uk/apply-citizenship-indefinite-leave-to-remain',
    govGuidance: 'This proves your spouse is British, which qualifies you for the shorter 3-year residency requirement.',
    example: 'SPOUSE DETAILS:\n\nName: John Andrew Smith\nNationality: British (by birth)\nPassport number: 987654321\nExpiry: 2031\n\nEvidence: Colour scan of bio page attached (300 DPI)',
    exampleGuidance: 'Simple — just a clear colour scan of the bio page. If naturalised, add the certificate.',
    editTitle: 'YOUR SPOUSE\'S DETAILS',
    editPlaceholder: 'Spouse name: [FULL NAME]\nNationality: British (by [BIRTH/NATURALISATION])\nPassport number: [NUMBER]\nExpiry: [DATE]\n\n[ ] Bio page scanned in colour\n[ ] Naturalisation certificate attached (if applicable)',
    editGuidance: 'If your spouse naturalised, the certificate is essential. If by birth, passport alone is sufficient.',
    whyMatters: 'Without proof your spouse is British, you cannot use the 3-year route:\n\n✗ Spouse\'s passport expired (they need to renew)\n✗ Naturalisation certificate lost (request replacement from Home Office)\n✗ Not clear if spouse is British (check their immigration status)',
  },
  {
    filename: 'Citizenship_CeremonyBooking.docx',
    visaType: 'BRITISH CITIZENSHIP',
    title: 'CITIZENSHIP CEREMONY GUIDE',
    govReq: 'After your naturalisation is approved, you must attend a citizenship ceremony within 3 months.\n\nThe £130 ceremony fee is included in the £1,839 application fee.\n\nYou\'ll take an oath or affirmation of allegiance and receive your certificate of naturalisation.\n\nSource: gov.uk/citizenship-ceremonies',
    govGuidance: 'Many councils let you book in advance. Popular dates (near holidays) fill up quickly.',
    example: 'CEREMONY PLANNING:\n\nApproval received: [Expected ~ 6 months after application]\nDeadline to attend ceremony: [3 months after approval]\n\nLocal council: Birmingham City Council\nCeremony options:\n- Group ceremony (free after fee) — monthly dates\n- Private ceremony (just you + 2 guests) — book specific date\n\nPreferred date: [TBD after approval]\nGuests: [Partner] and [Friend/Family member]',
    exampleGuidance: 'You can\'t book until you\'re approved, but research your council\'s ceremony dates and options in advance.',
    editTitle: 'YOUR CEREMONY PLANNING',
    editPlaceholder: 'Local council: [COUNCIL NAME]\nCeremony preference: [GROUP / PRIVATE]\nPreferred date range: [MONTH/YEAR — after expected approval]\nGuests to invite: [NAMES]\n\nContact details for booking:\nCouncil ceremonies team: [PHONE/EMAIL]\nWebsite: [URL]',
    editGuidance: 'Research your local council\'s ceremony options now. After approval, you\'ll have 3 months — don\'t leave it to the last minute.',
    whyMatters: 'Ceremony timing matters:\n\n✗ Missing the 3-month deadline means your approval may lapse\n✗ Popular dates fill up (Christmas, summer)\n✗ You cannot apply for a British passport until AFTER the ceremony\n✗ Your naturalisation certificate is issued AT the ceremony — it\'s your proof of citizenship',
  },
  {
    filename: 'Citizenship_NameChange.docx',
    visaType: 'BRITISH CITIZENSHIP',
    title: 'NAME CHANGE EVIDENCE GUIDE',
    govReq: 'If your name has changed at any point (marriage, deed poll, religious reasons, etc.), you must provide evidence of each change.\n\nAll name changes must be declared on the application form.\n\nSource: gov.uk/change-name-deed-poll',
    govGuidance: 'Ensure your current passport reflects your current legal name. If it doesn\'t, update it before applying.',
    example: 'NAME CHANGE HISTORY:\n\nBirth name: Aisha Fatima Mohammed\n\nChange 1: Marriage (2019)\n  New name: Aisha Fatima Smith\n  Evidence: Marriage certificate attached\n\nCurrent legal name: Aisha Fatima Smith\nPassport reflects current name: YES',
    exampleGuidance: 'Simple chronological record. Each change needs evidence (marriage cert, deed poll, or statutory declaration).',
    editTitle: 'YOUR NAME CHANGE HISTORY',
    editPlaceholder: 'Birth name: [FULL NAME AT BIRTH]\n\nChange 1: [REASON — marriage/deed poll/other] ([YEAR])\n  New name: [FULL NAME AFTER CHANGE]\n  Evidence: [DOCUMENT TYPE]\n\n[Add more changes if applicable]\n\nCurrent legal name: [CURRENT NAME]\nPassport reflects current name: [YES/NO]',
    editGuidance: 'If your passport doesn\'t reflect your current name, update it before applying for citizenship.',
    whyMatters: 'Name discrepancies cause confusion and delays:\n\n✗ Name on application doesn\'t match passport\n✗ Previous documents (BRP, visas) show a different name without explanation\n✗ No evidence of name change (deed poll or marriage certificate missing)\n✗ Using a different name informally but not legally changed',
  },
  {
    filename: 'Citizenship_ChildrenRegistration.docx',
    visaType: 'BRITISH CITIZENSHIP',
    title: 'CHILDREN REGISTRATION AS BRITISH CITIZENS GUIDE',
    govReq: 'Children do NOT automatically become British when you naturalise. They may be eligible to register separately.\n\nChildren born in the UK to a parent who later becomes British can register using Form MN1.\nCost: £1,214 per child.\n\nSource: gov.uk/register-british-citizen/born-in-uk',
    govGuidance: 'Apply for child registration AFTER your own citizenship is confirmed. The rules differ for children born in vs outside the UK.',
    example: 'CHILDREN REGISTRATION PLAN:\n\n1. Emily Mohammed-Smith, age 7\n   Born: Birmingham, UK\n   Eligible to register: YES (born in UK, parent becoming British)\n   Form: MN1\n   Fee: £1,214\n   Timing: After my citizenship ceremony\n\n2. Omar Mohammed-Smith, age 3\n   Born: Birmingham, UK\n   Eligible: YES\n   Form: MN1\n   Fee: £1,214',
    exampleGuidance: 'Budget £1,214 per child. Don\'t apply for their registration until your own citizenship is confirmed.',
    editTitle: 'YOUR CHILDREN\'S REGISTRATION PLAN',
    editPlaceholder: '1. [CHILD NAME], age [AGE]\n   Born: [CITY, COUNTRY]\n   Eligible to register: [CHECK gov.uk/register-british-citizen]\n   Form needed: [MN1 / OTHER]\n   Fee: £1,214\n\n2. [CHILD NAME], age [AGE]\n   Born: [CITY, COUNTRY]\n   Eligible: [CHECK]\n\nTotal budget for children: £[TOTAL]',
    editGuidance: 'Check specific eligibility at gov.uk/register-british-citizen — rules differ for children born inside vs outside the UK.',
    whyMatters: 'Common misunderstandings about children and citizenship:\n\n✗ Assuming children automatically become British (they don\'t)\n✗ Not budgeting for registration fees (£1,214 each)\n✗ Applying for child registration before your own citizenship is confirmed\n✗ Different rules for children born in UK vs outside UK — check carefully\n✗ Some routes have age limits — don\'t wait too long',
  },
];

// ═══════════════════════════════════════════════════════════════
// GENERATE ALL TEMPLATES
// ═══════════════════════════════════════════════════════════════

async function generateAll() {
  console.log(`🚀 Generating ${TEMPLATES.length} templates...\n`);
  let success = 0;
  let failed = 0;

  for (const t of TEMPLATES) {
    try {
      const doc = buildDoc(
        t.visaType, t.title,
        t.govReq, t.govGuidance,
        t.example, t.exampleGuidance,
        t.editTitle, t.editPlaceholder, t.editGuidance,
        t.whyMatters
      );
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(path.join(TEMPLATES_DIR, t.filename), buffer);
      console.log(`✅ ${t.filename}`);
      success++;
    } catch (err) {
      console.error(`❌ ${t.filename}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${success} succeeded, ${failed} failed`);
  console.log(`📁 Templates saved to: ${TEMPLATES_DIR}`);
}

generateAll();
