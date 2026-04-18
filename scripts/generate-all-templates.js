/**
 * Generate ALL Word (.docx) templates for VisaBud Premium tier.
 * Complete set: 19 templates across Spouse, Skilled Worker, and Citizenship visas.
 */

const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'public', 'templates');
if (!fs.existsSync(TEMPLATES_DIR)) {
  fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

/**
 * Template definitions: visa type, category, document name, requirements, example, placeholder, guidance
 */
const TEMPLATES = [
  // ========== SPOUSE VISA (12 templates) ==========
  {
    filename: 'Spouse_ProofOfRelationship.docx',
    title: 'SPOUSE VISA - PROOF OF RELATIONSHIP',
    govRequirement: 'Home Office requires evidence that you have been in a genuine and subsisting relationship with your partner. Evidence must cover the entire period of your relationship (or at least the last 2+ years).\n\nSource: gov.uk/guidance/prove-your-relationship',
    govComment: 'Immigration officers check for: consistency across all documents, timeline gaps, evidence of genuine cohabitation.',
    example: 'My name is John Smith and I have been in a relationship with Sarah Johnson since January 2021 (5 years). We met at University and began living together in September 2021. We purchased our home together in March 2022.\n\nEvidence: Joint tenancy, mortgage, utility bills, photos, email correspondence.',
    placeholder: 'My name is [YOUR FULL NAME] and I have been in a relationship with [PARTNER\'S NAME] since [START DATE]...',
    guidance: 'Edit with YOUR details. Include: exact dates, how you met, major milestones, and list all evidence.',
    whyMatters: 'Immigration officers must verify your relationship is genuine. Dates must match across all documents (bank statements, tenancy, photos). Timeline must be logical with no unexplained gaps.',
  },
  {
    filename: 'Spouse_FinancialEvidence.docx',
    title: 'SPOUSE VISA - FINANCIAL EVIDENCE SUMMARY',
    govRequirement: 'Spouse visa applicants must prove their UK sponsor can maintain themselves and their family without public funds.\n\nMinimum annual income: £29,000 (2024)\nPlus £3,800 per dependent child\n\nSource: gov.uk/guidance/prove-your-income',
    govComment: 'Immigration officers verify: income matches tax returns, P60s, and payslips; savings meet thresholds if income is lower.',
    example: 'Sponsor: John Smith | Income: £35,000 salary (P60 + payslips) + £5,000 self-employment (accountant reference) = £40,000 TOTAL\n\nThreshold: £29,000 + £0 dependents = £29,000\nStatus: ✓ Exceeds by £11,000\n\nAttached: P60, payslips (3 months), accountant letter, bank statements.',
    placeholder: 'Sponsor: [NAME] | Total Income: £[AMOUNT]\nThreshold: £[REQUIRED]\nStatus: ✓ [Exceeds/Meets] by £[DIFFERENCE]',
    guidance: 'Show clear calculation: Income vs. Threshold vs. Difference. Include source of each income component.',
    whyMatters: 'Financial evidence is a top rejection reason. Income must be verified, calculations must be clear, and all supporting documents (P60, payslips, accounts) must match the figures you claim.',
  },
  {
    filename: 'Spouse_ProofOfCohabitation.docx',
    title: 'SPOUSE VISA - PROOF OF COHABITATION',
    govRequirement: 'You must prove you have been living together as a couple for the entire period you claim the relationship has existed (or at least 2+ years).\n\nEvidence: joint tenancy, mortgage, utility bills (both names), council tax, life insurance, etc.',
    govComment: 'Officers check: bills are in both names, address matches other documents, timeline is continuous without gaps.',
    example: 'Joint Tenancy Agreement: 123 Green Street, London from 01 Sep 2021 to 31 Aug 2022 (both names)\nMortgage: Same address from 01 Mar 2022 (both names)\nUtility Bills: Gas, electricity, water (all in both names, 6+ months)',
    placeholder: '[DOCUMENT TYPE 1]: [ADDRESS] from [DATE] (both names)\n[DOCUMENT TYPE 2]: [ADDRESS] from [DATE] (both names)\n[DOCUMENT TYPE 3]: [AMOUNT] per month, [ACCOUNT TYPE]',
    guidance: 'List each cohabitation document with dates and property address. Ensure no unexplained gaps between documents.',
    whyMatters: 'Officers must see continuous evidence of living together. If there\'s a 6-month gap with no bills/tenancy, they may question if relationship was paused or ended.',
  },
  {
    filename: 'Spouse_SavingsAndSponsorship.docx',
    title: 'SPOUSE VISA - SAVINGS & SPONSORSHIP DECLARATION',
    govRequirement: 'If sponsor\'s income doesn\'t meet the £29,000 threshold, they can use savings. Formula: savings × 16% (annual return) + gross income ≥ £29,000 minimum.\n\nExample: £10,000 shortfall requires £160,000 in savings.',
    govComment: 'Officers verify: savings are accessible, in sponsor\'s name, held 6+ months, and calculation is correct.',
    example: 'Income: £25,000 | Shortfall: £4,000 | Savings held 6+ months: £65,000\nCalculation: (£65,000 × 16% = £10,400) + £25,000 = £35,400 ≥ £29,000 ✓\nBank statements attached showing £65,000 balance.',
    placeholder: 'Income: £[AMOUNT] | Shortfall: £[AMOUNT]\nSavings held 6+ months: £[AMOUNT]\nCalculation: (£[SAVINGS] × 16% = £[X]) + £[INCOME] = £[TOTAL] ≥ £29,000',
    guidance: 'If using savings, calculate precisely. Savings must be held 6+ months minimum. Provide bank statements showing the balance.',
    whyMatters: 'Savings calculations are complex. Even small errors (wrong interest rate, wrong dates) can cause rejection. Always round DOWN when calculating.',
  },
  {
    filename: 'Spouse_EmploymentLetter.docx',
    title: 'SPOUSE VISA - EMPLOYER VERIFICATION LETTER',
    govRequirement: 'If claiming employment income, provide a letter from your employer on company letterhead confirming: job title, salary, start date, employment status (permanent/contract), and that employment is expected to continue.',
    govComment: 'Officers verify: letter is on official company letterhead, contact details match employer records, salary matches P60/payslips.',
    example: '[EMPLOYER LETTERHEAD]\n\nTo Whom It May Concern,\n\nThis confirms that John Smith has been employed at Acme Ltd as a Senior Developer since 01 January 2020. His current annual salary is £35,000 (gross). He is a permanent employee and his employment is expected to continue.\n\nSigned: [HR Manager Name]\nDate: 14 April 2024',
    placeholder: '[EMPLOYER LETTERHEAD]\n\nThis confirms that [YOUR NAME] has been employed at [COMPANY NAME] as a [JOB TITLE] since [START DATE]. His/her current annual salary is £[AMOUNT] (gross). [He/She] is a [permanent/contract] employee and employment is expected to continue.\n\nSigned: [NAME]\nDate: [DATE]',
    guidance: 'Request from HR/payroll. Must be on official letterhead with contact details. Salary must match P60 and payslips.',
    whyMatters: 'Officers verify employment through employer records. Letter must be official and match other documents. If salary differs from P60, application will be questioned.',
  },
  {
    filename: 'Spouse_SelfEmploymentAccounts.docx',
    title: 'SPOUSE VISA - SELF-EMPLOYMENT ACCOUNTS & TAX RETURNS',
    govRequirement: 'Self-employed income must be verified by: accountant reference letter (on letterhead), tax return (SA302 or equivalent), and business accounts for last 2 years.\n\nMinimum: must show consistent income that meets threshold.',
    govComment: 'Officers check: accounts match tax returns, accountant reference is on official letterhead, profit matches claimed income.',
    example: 'Accountant Reference: Confirms John Smith has been self-employed as a consultant since 01 Jan 2020. Net profit: £15,000 (2022), £18,000 (2023).\n\nAttached: Tax returns (2022, 2023), business accounts, accountant letter on official letterhead with contact details.',
    placeholder: '[ACCOUNTANT NAME & FIRM] confirms [YOUR NAME] has been self-employed as [BUSINESS TYPE] since [DATE]. Net profit: £[2022], £[2023].\n\nAttached: Tax returns, accounts, accountant reference letter.',
    guidance: 'Get accountant reference on official letterhead. Include full addresses and contact details. Provide 2 years of accounts minimum.',
    whyMatters: 'Self-employment income is scrutinized heavily. Accounts must match tax returns exactly. If profit varies wildly or is inconsistent, officers may challenge whether income is sustainable.',
  },
  {
    filename: 'Spouse_BankStatements.docx',
    title: 'SPOUSE VISA - BANK STATEMENTS & FINANCIAL RECORDS',
    govRequirement: 'Bank statements must cover 6 consecutive months (or 12 if savings are key evidence). Both sponsor and applicant must provide statements showing: salary deposits, living expenses, and any savings balance.',
    govComment: 'Officers verify: deposits match claimed income, expenses are reasonable for household size, balance is consistent with claimed savings.',
    example: 'Main account: 6 months of statements showing monthly salary of £2,917 (£35,000 annual), regular household expenses, final balance £5,000.\n\nSavings account: 6 months showing balance increasing from £40,000 to £50,000 (no withdrawals).',
    placeholder: 'Account: [BANK NAME] [ACCOUNT TYPE]\nBalance: £[AMOUNT]\nMonthly deposits: £[SALARY AMOUNT]\nPeriod: [START DATE] to [END DATE] (6 consecutive months)\nAttached: All 6 monthly statements',
    guidance: 'Download 6 consecutive months of statements. Ensure they show continuous balance or deposits. Avoid large unexplained withdrawals.',
    whyMatters: 'Bank statements prove income is real and living expenses are reasonable. If deposits don\'t match claimed salary or balance drops unexpectedly, officers will investigate further.',
  },
  {
    filename: 'Spouse_TaxReturns.docx',
    title: 'SPOUSE VISA - TAX RETURNS & P60 FORMS',
    govRequirement: 'Last 2 years of tax returns (SA302) or P60 forms (employment). P60 is annual earnings summary from employer. SAA302 is tax return summary from HMRC.',
    govComment: 'Officers verify: income matches employment letter and payslips, no discrepancies between P60 and claimed salary.',
    example: 'P60 2023: John Smith | Employer: Acme Ltd | Gross salary: £35,000 | PAYE tax: £6,500 | National Insurance: £4,000\n\nP60 2022: Same employer | Gross: £35,000 (confirming consistent income)',
    placeholder: 'P60 [YEAR]: [EMPLOYER NAME] | Gross salary: £[AMOUNT] | Tax: £[AMOUNT]\nP60 [PREVIOUS YEAR]: [EMPLOYER NAME] | Gross: £[AMOUNT]\nAttached: Official P60 forms from HMRC/employer',
    guidance: 'Request P60 from employer (January each year) or download from HMRC online. Include last 2 years minimum.',
    whyMatters: 'P60 is the official earnings record. If your claimed salary doesn\'t match P60, application will be rejected. Officers can verify P60 directly with HMRC.',
  },
  {
    filename: 'Spouse_UtilityBills.docx',
    title: 'SPOUSE VISA - UTILITY BILLS & COUNCIL TAX',
    govRequirement: 'Utility bills and council tax bills must show both names (or at least the main account holder\'s name), property address, and be dated within last 3 months.',
    govComment: 'Officers check: both names appear, address is consistent with other documents, bill amount is recent (not old).',
    example: 'Gas Bill: ABC Energy | Both names: John Smith & Sarah Johnson | Address: 123 Green Street, London | Date: 14 Mar 2024\n\nCouncil Tax: Royal Borough of X | Address: 123 Green Street | Both names | Amount: £150/month | Period: April 2024-March 2025',
    placeholder: '[UTILITY]: [COMPANY NAME] | Both names | [ADDRESS] | Amount: £[MONTHLY] | Date: [DATE - within 3 months]',
    guidance: 'Collect recent bills (not older than 3 months). Ideally in both names. If only one name, explain why (e.g., "account in my name as I was the first on tenancy").',
    guidance: 'Utility bills and council tax bills must show both names (or at least the main account holder\'s name) and recent date (within 3 months).',
    whyMatters: 'Bills prove you live together at the same address. If address doesn\'t match other documents or if there are multiple different addresses, officers will suspect you don\'t actually cohabit.',
  },
  {
    filename: 'Spouse_Photos.docx',
    title: 'SPOUSE VISA - RELATIONSHIP PHOTOS & DOCUMENTATION',
    govRequirement: 'Provide photos together dating throughout the relationship (from start to recent). Include: photos together, with family, on holiday, at home, at events. Date and caption each photo explaining when and where.',
    govComment: 'Officers check: photos span entire relationship timeline, both people appear together, progression shows genuine relationship development.',
    example: 'Photos spanning 5 years:\n- January 2021: Meeting at university (with friend group)\n- September 2021: Moving house together (with boxes, both visible)\n- March 2022: Holiday in Spain (both in photos)\n- December 2023: Christmas with families (multiple photos)\n- March 2024: Recent photos at home\n\nEach photo captioned with date, location, and brief description.',
    placeholder: '[Photo 1]: [DATE] - [LOCATION] - [DESCRIPTION]\n[Photo 2]: [DATE] - [LOCATION] - [DESCRIPTION]\n[Photo 3]: [DATE] - [LOCATION] - [DESCRIPTION]\n\nInclude at least 10-15 photos spanning entire relationship.',
    guidance: 'Organize chronologically. Caption each with date, location, and explanation. Mix of couple photos, family occasions, holidays, and home life.',
    whyMatters: 'Photos are powerful evidence of genuine relationship. They show progression and shared experiences. Include at least one photo per year of relationship.',
  },
  {
    filename: 'Spouse_EmailCommunication.docx',
    title: 'SPOUSE VISA - EMAIL & MESSAGE CORRESPONDENCE',
    govRequirement: 'Email exchanges, text messages, WhatsApp messages, or letters between you and your partner showing genuine communication and affection over time.',
    govComment: 'Officers check: messages span entire relationship period, show natural communication, reflect relationship development.',
    example: 'Sample messages:\n- Jan 2021: "I\'ve really enjoyed getting to know you at uni. Would you like to meet up again?"\n- Sep 2021: "I\'m so excited about our new flat together!"\n- Mar 2022: "The key to our new house just arrived! Can\'t wait to move in with you."\n- Dec 2023: "So looking forward to spending Christmas with your family."',
    placeholder: 'Attach screenshots or printouts showing:\n- Date of message\n- Names of sender/receiver\n- Message content\n- Platform (email, WhatsApp, etc.)\n\nInclude at least 20-30 messages spanning relationship.',
    guidance: 'Save/screenshot messages with dates visible. Include natural communication (not just formal messages). Show affection, plans together, family discussions.',
    whyMatters: 'Messages prove you communicate regularly and have genuine feelings for each other. They show the relationship developed naturally over time.',
  },
  {
    filename: 'Spouse_ChildrenDocumentation.docx',
    title: 'SPOUSE VISA - CHILDREN DOCUMENTATION',
    govRequirement: 'If you have children together or from previous relationships, provide: birth certificates, custody documents, school records, and declarations regarding each child\'s status.',
    govComment: 'Officers verify: child\'s parentage, custody arrangements, and any financial commitments to the child.',
    example: 'Child: Emma Smith (DOB: 15 Aug 2022)\n\nBirth Certificate: Shows John Smith and Sarah Johnson as parents. Registered: 20 Aug 2022.\n\nSchool Registration: Registered at Primary School from Sep 2023.\n\nFinancial Evidence: Both parents contributing to childcare (daycare invoices, shared accounts).',
    placeholder: 'Child: [NAME] | DOB: [DATE]\n\nBirth Certificate: [DATE REGISTERED] | Both parents listed\nSchool: [SCHOOL NAME] | Registered [DATE]\nFinancial: [CHILDCARE/SUPPORT DETAILS]',
    guidance: 'Provide birth certificates, school enrollment letters, and proof of shared childcare costs.',
    whyMatters: 'Children are evidence of genuine relationship and family commitment. Courts recognize this as strong proof of cohabitation and intent to stay together.',
  },

  // ========== SKILLED WORKER VISA (4 templates) ==========
  {
    filename: 'SkilledWorker_MaintenanceFunds.docx',
    title: 'SKILLED WORKER VISA - MAINTENANCE OF FUNDS DECLARATION',
    govRequirement: 'Must have £3,100 in accessible savings held for 28+ consecutive days, OR sponsor provides written confirmation, OR salary covers living costs.',
    govComment: 'Officers verify: funds are in your name/joint account, held 28+ days, and accessible (not locked in investments).',
    example: 'I have £5,000 in my NatWest Savings Account (sort code 60-40-24, ending 1234). This account has been held for 28 days continuously (as of 14 Apr 2024). Bank statement attached.\n\nOR: My employer, Acme Tech, confirms my salary of £32,500 per annum is sufficient to cover my living costs in London.',
    placeholder: 'I have £[AMOUNT] in my [BANK] [ACCOUNT TYPE] (sort code [XXX-XX-XX], ending [XXXX]). This account has been held for 28+ days continuously (as of [DATE]).\n\nOR: My employer confirms my salary of £[AMOUNT] is sufficient for my living costs.',
    guidance: 'Provide bank statement showing balance and 28+ day holding period. Do NOT include full account number (use last 4 digits only).',
    whyMatters: 'The 28-day rule is strict. Funds must be clearly held for 28+ days before application date. If not, application will be rejected.',
  },
  {
    filename: 'SkilledWorker_SponsorshipLetter.docx',
    title: 'SKILLED WORKER VISA - SPONSOR CERTIFICATION LETTER',
    govRequirement: 'Your employer (sponsor) must provide a letter on company letterhead confirming: job title, start date, salary, job location, and that they are licensed to sponsor visa holders.',
    govComment: 'Officers verify: letter is on official letterhead, salary matches payslips, sponsor is listed in UKVI sponsor register.',
    example: '[COMPANY LETTERHEAD]\n\nTo UKVI,\n\nThis confirms [APPLICANT NAME] has been offered/employed as a [JOB TITLE] at [COMPANY NAME] with effect from [DATE]. Annual salary: £[AMOUNT]. Employment location: [OFFICE ADDRESS]. [COMPANY NAME] is a licensed Tier 2/5 sponsor.\n\nSigned: [HR/MANAGER NAME]\nDate: [DATE]',
    placeholder: '[COMPANY LETTERHEAD]\n\nThis confirms [YOUR NAME] has been employed as a [JOB TITLE] since [START DATE]. Salary: £[AMOUNT] per annum. Location: [OFFICE ADDRESS]. We are licensed to sponsor visa holders.\n\nSigned: [NAME]\nDate: [DATE]',
    guidance: 'Request from HR department. Must be on official company letterhead with contact details. Salary must match payslips.',
    whyMatters: 'Sponsorship letter is your authorization to work. Without it, application cannot proceed. Ensure it\'s signed by authorized HR/manager.',
  },
  {
    filename: 'SkilledWorker_PayslipsAndP60.docx',
    title: 'SKILLED WORKER VISA - PAYSLIPS & TAX RECORDS',
    govRequirement: 'Provide recent payslips (3 months) and P60 form showing salary matches sponsorship letter and is sufficient for the job level.',
    govComment: 'Officers verify: payslips show regular salary deposits, P60 confirms gross annual income, no unexplained deductions.',
    example: 'Payslips for Jan, Feb, Mar 2024:\n- Each shows gross salary: £2,917 (= £35,000 annual)\n- Tax and NI deductions consistent\n- Net pay: £2,150 per month\n\nP60 2023: Confirms gross annual salary £35,000 from employer.',
    placeholder: 'Payslips for [MONTH 1], [MONTH 2], [MONTH 3] 2024\n- Gross salary: £[AMOUNT] per month\n- Total annual: £[AMOUNT]\n\nP60 [YEAR]: Confirms gross salary £[AMOUNT]',
    guidance: 'Request recent payslips from payroll. Download P60 from HMRC online or request from employer.',
    whyMatters: 'Payslips prove you\'re actually earning the salary stated. Officers verify these with HMRC. If payslips show different salary than stated, application fails.',
  },
  {
    filename: 'SkilledWorker_JobOffer.docx',
    title: 'SKILLED WORKER VISA - JOB OFFER LETTER',
    govRequirement: 'If not yet employed, provide written job offer (contract) showing: job title, salary, start date, job location, working hours, and role description.',
    govComment: 'Officers verify: offer is from licensed sponsor, salary meets minimum, role description is specific (not vague).',
    example: '[COMPANY LETTERHEAD]\n\nOffer of Employment\n\nPosition: Senior Developer\nSalary: £35,000 per annum\nStart Date: 01 May 2024\nLocation: London Office\nContract: Permanent, Full-time (40 hours/week)\n\nRole: Develop and maintain internal software systems, manage databases, support team members.\n\nThis offer is subject to successful visa sponsorship approval.\n\nSigned: [HR Manager]\nDate: 14 April 2024',
    placeholder: '[COMPANY LETTERHEAD]\n\nOffer of Employment\n\nPosition: [JOB TITLE]\nSalary: £[AMOUNT] per annum\nStart Date: [DATE]\nLocation: [OFFICE ADDRESS]\nRole: [DESCRIPTION]\n\nSigned: [NAME]\nDate: [DATE]',
    guidance: 'Ensure job title and salary are specific. Role description must be detailed (explain what you\'ll actually do).',
    whyMatters: 'Job offer must be specific and genuine. Vague offers or offers below market rate may be questioned. Salary must meet minimum threshold for the role.',
  },

  // ========== BRITISH CITIZENSHIP (3 templates) ==========
  {
    filename: 'Citizenship_ResidenceProof.docx',
    title: 'BRITISH CITIZENSHIP - CONTINUOUS RESIDENCE PROOF',
    govRequirement: 'You must prove continuous residence in the UK for at least 5 years (or 3 years if married to a British citizen). Evidence: tenancy agreements, council tax, utility bills, mortgage, NHS registration, employment records.',
    govComment: 'Officers check: residence is continuous (no gaps over 90 days), address changes are explained, documentation covers entire 5-year period.',
    example: 'Sep 2019-Aug 2020: Tenancy, 123 Green St, London (tenancy agreement, utility bills)\nAug 2020-Mar 2022: Tenancy, 456 Blue Ave, London (tenancy agreement, council tax)\nMar 2022-Present: Homeowner, 789 Red Lane, London (mortgage, utility bills, council tax)\n\nNo gaps exceeding 90 days. All 5 years continuously covered by official documents.',
    placeholder: '[DATE]-[DATE]: [ADDRESS] ([DOCUMENT TYPE])\n[DATE]-[DATE]: [ADDRESS] ([DOCUMENT TYPE])\n[DATE]-Present: [ADDRESS] ([DOCUMENT TYPE])\n\nEnsure no gaps over 90 days.',
    guidance: 'Create a timeline showing where you lived each year. Use tenancy, council tax, utility bills, mortgage. Explain any gaps (travel, temporary relocation).',
    whyMatters: 'Continuous residence is a legal requirement for citizenship. Even a 4-year 11-month history may be rejected. Ensure all 5 years are covered with no unexplained gaps.',
  },
  {
    filename: 'Citizenship_EnglishLanguageTest.docx',
    title: 'BRITISH CITIZENSHIP - ENGLISH LANGUAGE PROFICIENCY CERTIFICATE',
    govRequirement: 'Applicants must pass an English language test at CEFR level B1 (speaking, listening, reading, writing) or be exempt (e.g., native English speaker, educated in English-medium school).',
    govComment: 'Officers verify: test certificate is from approved provider (British Council, Trinity, etc.), achieved B1 level minimum.',
    example: 'IELTS Certificate:\n- Reading: 5.5\n- Writing: 5.5\n- Listening: 6.0\n- Speaking: 6.0\n- Overall: B1 level ✓ (meets requirement)\n\nTest date: 14 Mar 2024\nApproved Provider: British Council',
    placeholder: '[TEST PROVIDER]: [TEST NAME]\n- Reading: [SCORE]\n- Writing: [SCORE]\n- Listening: [SCORE]\n- Speaking: [SCORE]\n\nOverall Level: B1 (minimum required)\nTest Date: [DATE]',
    guidance: 'Take IELTS, TOEFL, Trinity, or other approved test. Need minimum B1 level. Some applicants are exempt (schooling in English, British national, etc.).',
    whyMatters: 'Language requirement is compulsory. Failure to meet B1 level means automatic rejection. Take test early to allow time for retake if needed.',
  },
  {
    filename: 'Citizenship_LifeInUKTest.docx',
    title: 'BRITISH CITIZENSHIP - LIFE IN THE UK TEST CERTIFICATE',
    govRequirement: 'Pass the official Home Office "Life in the UK Test" (24 multiple choice questions about British history, government, culture, values). Minimum pass: 18/24 (75%).',
    govComment: 'Officers verify: test is official Home Office approved, score is 18 or above, test date is within 2 years of application.',
    example: 'Life in the UK Test Certificate:\n\nTest Date: 14 Apr 2024\nScore: 22/24 (92%) ✓ PASS\nTest Centre: British Council, London\nReference: [CERTIFICATE NUMBER]',
    placeholder: 'Life in the UK Test Certificate:\n\nTest Date: [DATE]\nScore: [X]/24\nStatus: [PASS/FAIL]\nTest Centre: [LOCATION]',
    guidance: 'Book test at approved centre (British Council, IPS, etc.). Study guide available free on gov.uk. Test costs £50. Pass in first attempt if possible.',
    whyMatters: 'Test is required by law. Even one point below 18/24 means failure and you must retake (and pay again). Study thoroughly to avoid retake costs.',
  },
];

/**
 * Create a single template document
 */
function createTemplateDocument(templateData) {
  const paragraphs = [];

  // Header
  paragraphs.push(
    new Paragraph({
      text: templateData.title,
      bold: true,
      size: 32,
      spacing: { after: 100 },
      alignment: 'center',
    })
  );

  paragraphs.push(
    new Paragraph({
      text: 'Version: Premium Template | Last Updated: April 2026',
      size: 18,
      spacing: { after: 400 },
      alignment: 'center',
      color: '808080',
    })
  );

  // Gov Requirement (locked section)
  paragraphs.push(
    new Paragraph({
      text: '📋 GOVERNMENT REQUIREMENTS',
      bold: true,
      size: 24,
      spacing: { after: 100 },
      shading: { fill: 'F0F5FA' },
    })
  );

  paragraphs.push(
    new Paragraph({
      text: templateData.govRequirement,
      spacing: { after: 100, line: 240 },
      indent: { left: 400 },
      border: {
        left: { color: '003366', space: 1, style: 'single', size: 6 },
      },
    })
  );

  if (templateData.govComment) {
    paragraphs.push(
      new Paragraph({
        text: `💡 ${templateData.govComment}`,
        italics: true,
        spacing: { after: 200 },
        indent: { left: 500 },
        color: '666666',
      })
    );
  }

  // Example (locked section)
  paragraphs.push(
    new Paragraph({
      text: '✓ EXAMPLE: What Good Looks Like',
      bold: true,
      size: 24,
      spacing: { after: 100 },
      shading: { fill: 'F0F5FA' },
    })
  );

  paragraphs.push(
    new Paragraph({
      text: templateData.example,
      spacing: { after: 100, line: 240 },
      indent: { left: 400 },
      border: {
        left: { color: '003366', space: 1, style: 'single', size: 6 },
      },
    })
  );

  paragraphs.push(
    new Paragraph({
      text: '💡 Study this example carefully. Immigration officers expect this level of detail and clarity.',
      italics: true,
      spacing: { after: 200 },
      indent: { left: 500 },
      color: '666666',
    })
  );

  // User section (editable)
  paragraphs.push(
    new Paragraph({
      text: '✎ YOUR INFORMATION',
      bold: true,
      size: 24,
      spacing: { after: 100 },
      shading: { fill: 'F0FAF5' },
      color: '006633',
    })
  );

  if (templateData.guidance) {
    paragraphs.push(
      new Paragraph({
        text: templateData.guidance,
        italics: true,
        spacing: { after: 100 },
        indent: { left: 400 },
        color: '666666',
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      text: templateData.placeholder,
      spacing: { after: 200, line: 240 },
      indent: { left: 400 },
      shading: { fill: 'F5F5F5' },
    })
  );

  // Why it matters (locked section)
  paragraphs.push(
    new Paragraph({
      text: '⚠️ WHY THIS SECTION MATTERS',
      bold: true,
      size: 24,
      spacing: { after: 100 },
      shading: { fill: 'FFF5F0' },
    })
  );

  paragraphs.push(
    new Paragraph({
      text: templateData.whyMatters,
      spacing: { after: 200, line: 240 },
      indent: { left: 400 },
      border: {
        left: { color: 'CC6600', space: 1, style: 'single', size: 6 },
      },
    })
  );

  return new Document({ sections: [{ children: paragraphs }] });
}

/**
 * Generate all templates
 */
async function generateAllTemplates() {
  console.log('🚀 Generating Complete VisaBud Premium Template Suite...\n');
  console.log(`📋 Creating ${TEMPLATES.length} templates...\n`);

  let created = 0;
  let failed = 0;

  for (const template of TEMPLATES) {
    try {
      const doc = createTemplateDocument(template);
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(path.join(TEMPLATES_DIR, template.filename), buffer);
      console.log(`✅ ${created + 1}/${TEMPLATES.length} ${template.filename}`);
      created++;
    } catch (err) {
      console.error(`❌ Failed: ${template.filename}`);
      console.error(`   ${err.message}`);
      failed++;
    }
  }

  console.log(`\n🎉 COMPLETE!\n`);
  console.log(`✅ Created: ${created} templates`);
  if (failed > 0) console.log(`❌ Failed: ${failed} templates`);
  console.log(`\n📁 Location: ${TEMPLATES_DIR}`);
  console.log('\n📊 Template Summary:');
  console.log('   - Spouse Visa: 8 templates');
  console.log('   - Skilled Worker Visa: 4 templates');
  console.log('   - British Citizenship: 3 templates');
  console.log('   - TOTAL: 15 templates');
  console.log('\n🚀 Ready for integration with download UI.');
}

generateAllTemplates().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
