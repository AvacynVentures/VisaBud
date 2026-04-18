/**
 * Example data generators for fictitious but realistic example documents
 * Used to show users what complete, compliant documents look like
 */

export interface ExamplePerson {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
}

export interface ExampleBankStatement {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  sortCode: string;
  statementDate: string;
  openingBalance: number;
  closingBalance: number;
  transactions: Array<{
    date: string;
    description: string;
    debit?: number;
    credit?: number;
    balance: number;
  }>;
}

export interface ExamplePayslip {
  employeeName: string;
  employeeNumber: string;
  employerName: string;
  payPeriod: string;
  grossSalary: number;
  tax: number;
  ni: number;
  netSalary: number;
  ytdGross: number;
}

export interface ExampleUtilityBill {
  accountHolder: string;
  address: string;
  provider: string;
  accountNumber: string;
  billDate: string;
  amount: number;
}

export interface ExampleEmployerLetter {
  employeeName: string;
  jobTitle: string;
  salary: number;
  startDate: string;
  employerName: string;
  employerAddress: string;
  employerPhone: string;
  letterDate: string;
}

/**
 * Generate realistic example person
 */
export function generateExamplePerson(_visaType: string): ExamplePerson {
  const firstNames = ['James', 'Maria', 'Hassan', 'Priya', 'Carlos', 'Elena', 'Rajesh', 'Sophie'];
  const lastNames = ['Smith', 'Garcia', 'Khan', 'Patel', 'Rodriguez', 'Novak', 'Chen', 'Williams'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  const nationalities = ['Indian', 'Polish', 'Filipino', 'Pakistani', 'Nigerian', 'Chinese', 'Brazilian'];
  const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
  
  // Generate DOB (25-45 years old)
  const year = 2000 - Math.floor(Math.random() * 20);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const dob = `${day}/${month}/${year}`;
  
  const passportNum = 'GB' + Math.random().toString(36).substring(2, 11).toUpperCase();
  const expiryYear = 2030 + Math.floor(Math.random() * 5);
  const expiryDate = `01/01/${expiryYear}`;
  
  return {
    fullName: `${firstName} ${lastName}`,
    dateOfBirth: dob,
    nationality,
    passportNumber: passportNum,
    passportExpiry: expiryDate,
  };
}

/**
 * Generate realistic 6-month bank statement
 */
export function generateExampleBankStatement(_person: ExamplePerson): ExampleBankStatement {
  const accountNum = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  const sortCode = `${String(Math.floor(Math.random() * 100)).padStart(2, '0')}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`;
  
  const banks = ['Barclays', 'HSBC', 'Lloyds', 'NatWest', 'Santander'];
  const bankName = banks[Math.floor(Math.random() * banks.length)];
  
  const transactions: ExampleBankStatement['transactions'] = [];
  let balance = 15000;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  // Generate 60+ transactions over 6 months
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i * 6));
    
    // Monthly salary
    balance += 3500;
    transactions.push({
      date: date.toISOString().split('T')[0],
      description: 'Salary Deposit - Employer Ltd',
      credit: 3500,
      balance,
    });
    
    // Random expenses
    const expenses = [
      { desc: 'Tesco Supermarket', amount: 150 },
      { desc: 'Utility Payment - EDF', amount: 120 },
      { desc: 'Amazon Purchase', amount: 45 },
      { desc: 'Mobile Phone Bill', amount: 35 },
      { desc: 'Gym Membership', amount: 40 },
      { desc: 'Restaurant', amount: 65 },
    ];
    
    const expense = expenses[Math.floor(Math.random() * expenses.length)];
    balance -= expense.amount;
    transactions.push({
      date: new Date(date.getTime() + 86400000).toISOString().split('T')[0],
      description: expense.desc,
      debit: expense.amount,
      balance,
    });
  }
  
  return {
    accountHolder: person.fullName,
    bankName,
    accountNumber: accountNum,
    sortCode,
    statementDate: new Date().toISOString().split('T')[0],
    openingBalance: 12000,
    closingBalance: balance,
    transactions: transactions.slice(-30), // Last 30 transactions
  };
}

/**
 * Generate realistic 6-month payslip history
 */
export function generateExamplePayslip(person: ExamplePerson, month: number = 0): ExamplePayslip {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June'];
  const year = 2026;
  
  const grossSalary = 3500;
  const tax = Math.round(grossSalary * 0.15);
  const ni = Math.round(grossSalary * 0.08);
  const netSalary = grossSalary - tax - ni;
  
  return {
    employeeName: person.fullName,
    employeeNumber: 'EMP' + String(Math.floor(Math.random() * 100000)).padStart(5, '0'),
    employerName: 'Example Corporation Ltd',
    payPeriod: `${monthNames[month]} ${year}`,
    grossSalary,
    tax,
    ni,
    netSalary,
    ytdGross: grossSalary * (month + 1),
  };
}

/**
 * Generate realistic utility bill
 */
export function generateExampleUtilityBill(person: ExamplePerson, address: string): ExampleUtilityBill {
  const providers = ['EDF Energy', 'British Gas', 'Eon Energy', 'OVO Energy', 'Scottish Power'];
  const provider = providers[Math.floor(Math.random() * providers.length)];
  
  const accountNum = String(Math.floor(Math.random() * 1000000000)).padStart(9, '0');
  
  const now = new Date();
  const billDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  
  return {
    accountHolder: person.fullName,
    address,
    provider,
    accountNumber: accountNum,
    billDate,
    amount: 120 + Math.random() * 80, // £120-200 per month
  };
}

/**
 * Generate realistic employer letter
 */
export function generateExampleEmployerLetter(person: ExamplePerson): ExampleEmployerLetter {
  const jobTitles = ['Software Engineer', 'Project Manager', 'Senior Accountant', 'Marketing Manager', 'Data Analyst', 'Business Analyst'];
  const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
  
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - Math.floor(Math.random() * 5));
  
  return {
    employeeName: person.fullName,
    jobTitle,
    salary: 38000 + Math.floor(Math.random() * 30000),
    startDate: startDate.toISOString().split('T')[0],
    employerName: 'Example Corporation Ltd',
    employerAddress: '123 Business Park, London, E1 6AN',
    employerPhone: '+44 (0)20 1234 5678',
    letterDate: new Date().toISOString().split('T')[0],
  };
}

/**
 * Generate complete example document package
 */
export function generateExampleDocuments(visaType: string) {
  const person = generateExamplePerson(visaType);
  const address = `42 Example Street, London, SW1A 1AA`;
  
  return {
    person,
    bankStatement: generateExampleBankStatement(person),
    payslips: Array.from({ length: 6 }, (_, i) => generateExamplePayslip(person, i)),
    utilityBill: generateExampleUtilityBill(person, address),
    employerLetter: generateExampleEmployerLetter(person),
  };
}
