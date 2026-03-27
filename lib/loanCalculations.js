export const LOAN_PROGRAMS = {
  'Bridge Loan': {
    minRate: 9.99,
    maxRate: 12.99,
    maxLTV: 0.80,
    maxLTC: null,
    points: [1.5, 3],
    termMonths: [12, 24],
    interestOnly: true,
  },
  'Fix & Flip': {
    minRate: 10.49,
    maxRate: 13.49,
    maxLTV: null,
    maxLTC: 0.90,
    points: [1.5, 3],
    termMonths: [6, 18],
    interestOnly: true,
    rehabFundPct: 1.0,
    usesRehab: true,
  },
  'New Construction': {
    minRate: 10.99,
    maxRate: 13.99,
    maxLTV: null,
    maxLTC: 0.85,
    points: [2, 3],
    termMonths: [12, 24],
    interestOnly: true,
    usesRehab: true,
  },
  'DSCR / Rental': {
    minRate: 7.49,
    maxRate: 9.99,
    maxLTV: 0.75,
    maxLTC: null,
    points: [1, 2],
    termMonths: [360],
    interestOnly: false,
  },
  'Ground-Up Development': {
    minRate: 11.49,
    maxRate: 14.49,
    maxLTV: null,
    maxLTC: 0.70,
    points: [2, 3.5],
    termMonths: [12, 24],
    interestOnly: true,
    usesRehab: true,
  },
  'Multifamily': {
    minRate: 9.99,
    maxRate: 12.99,
    maxLTV: 0.75,
    maxLTC: null,
    points: [1, 2.5],
    termMonths: [12, 36],
    interestOnly: true,
  },
};

export function parseCurrency(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  return parseFloat(String(str).replace(/[^0-9.-]/g, '')) || 0;
}

export function formatCurrency(num) {
  if (!num && num !== 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function calculateLTV(loanAmount, propertyValue) {
  if (!propertyValue || propertyValue <= 0) return 0;
  return loanAmount / propertyValue;
}

export function calculateLTC(loanAmount, totalCost) {
  if (!totalCost || totalCost <= 0) return 0;
  return loanAmount / totalCost;
}

export function calculateMonthlyPayment(principal, annualRate, termMonths, interestOnly) {
  if (!principal || !annualRate || !termMonths) return 0;
  const monthlyRate = annualRate / 100 / 12;

  if (interestOnly) {
    return principal * monthlyRate;
  }

  // Amortizing (DSCR)
  const n = termMonths;
  const factor = Math.pow(1 + monthlyRate, n);
  return principal * (monthlyRate * factor) / (factor - 1);
}

export function estimateRate(loanType, leverage, experience) {
  const program = LOAN_PROGRAMS[loanType];
  if (!program) return 0;

  const { minRate, maxRate } = program;
  const range = maxRate - minRate;

  // leverage is how close to max (0 = low leverage, 1 = at max)
  const leverageRatio = Math.min(Math.max(leverage, 0), 1);

  // experience penalty: first-time = 1.0, 1-5 deals = 0.7, 5+ = 0.4
  const experienceMap = { first: 1.0, '1-5': 0.7, '5+': 0.4 };
  const expFactor = experienceMap[experience] || 0.7;

  const blended = leverageRatio * 0.6 + expFactor * 0.4;
  return Math.round((minRate + range * blended) * 100) / 100;
}

export function estimateMaxLoan(loanType, purchasePrice, arv, rehabBudget) {
  const program = LOAN_PROGRAMS[loanType];
  if (!program) return 0;

  const candidates = [];

  if (program.maxLTV && arv > 0) {
    candidates.push(arv * program.maxLTV);
  }
  if (program.maxLTV && !program.usesRehab && purchasePrice > 0) {
    candidates.push(purchasePrice * program.maxLTV);
  }
  if (program.maxLTC) {
    const totalCost = purchasePrice + (rehabBudget || 0);
    if (totalCost > 0) candidates.push(totalCost * program.maxLTC);
  }

  if (candidates.length === 0) return 0;
  return Math.min(...candidates);
}

export function getQualificationResult(inputs) {
  const {
    loanType,
    purchasePrice: rawPurchase,
    rehabBudget: rawRehab,
    arv: rawArv,
    experience = '1-5',
  } = inputs;

  const program = LOAN_PROGRAMS[loanType];
  if (!program) return null;

  const purchasePrice = parseCurrency(rawPurchase);
  const rehabBudget = parseCurrency(rawRehab);
  const arv = parseCurrency(rawArv) || purchasePrice;

  if (purchasePrice <= 0) return null;

  const maxLoan = estimateMaxLoan(loanType, purchasePrice, arv, rehabBudget);
  const estimatedLoan = Math.round(maxLoan / 1000) * 1000;

  // Calculate leverage ratio for rate estimation
  let leverage = 0;
  if (program.maxLTV) {
    leverage = calculateLTV(estimatedLoan, arv || purchasePrice) / program.maxLTV;
  } else if (program.maxLTC) {
    const totalCost = purchasePrice + rehabBudget;
    leverage = calculateLTC(estimatedLoan, totalCost) / program.maxLTC;
  }

  const rate = estimateRate(loanType, leverage, experience);
  const defaultTerm = program.termMonths[program.termMonths.length - 1];
  const monthlyPayment = calculateMonthlyPayment(
    estimatedLoan,
    rate,
    defaultTerm,
    program.interestOnly
  );

  const ltv = arv > 0 ? calculateLTV(estimatedLoan, arv) : calculateLTV(estimatedLoan, purchasePrice);
  const ltc = program.usesRehab ? calculateLTC(estimatedLoan, purchasePrice + rehabBudget) : null;

  const avgPoints = (program.points[0] + program.points[1]) / 2;
  const originationFee = estimatedLoan * avgPoints / 100;

  // Qualification score (0-100)
  let score = 50;
  // Leverage: lower = better
  score += (1 - leverage) * 25;
  // Experience bonus
  const expBonus = { first: 0, '1-5': 10, '5+': 20 };
  score += expBonus[experience] || 10;
  // Loan size within sweet spot ($250K-$5M)
  if (estimatedLoan >= 250000 && estimatedLoan <= 5000000) score += 10;
  else if (estimatedLoan > 5000000) score += 5;
  score = Math.min(Math.max(Math.round(score), 0), 100);

  return {
    estimatedLoan,
    rate,
    rateRange: [program.minRate, program.maxRate],
    ltv,
    ltc,
    monthlyPayment,
    originationFee,
    pointsRange: program.points,
    avgPoints,
    termMonths: defaultTerm,
    interestOnly: program.interestOnly,
    matchedProgram: loanType,
    qualificationScore: score,
    maxLTV: program.maxLTV,
    maxLTC: program.maxLTC,
  };
}
