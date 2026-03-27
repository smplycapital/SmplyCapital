export const LOAN_PROGRAMS = {
  'SBA 7(a)': {
    minRate: 7.5,
    maxRate: 10.5,
    maxLTV: 0.90,
    maxLTC: null,
    points: [0, 1],
    termMonths: [120, 300],
    interestOnly: false,
    downPayment: '10%',
    note: 'Prime + spread',
  },
  'Commercial Real Estate': {
    minRate: 5.5,
    maxRate: 7.5,
    maxLTV: 0.80,
    maxLTC: null,
    points: [0.5, 1.5],
    termMonths: [240, 360],
    interestOnly: false,
    downPayment: '20%',
    note: '10Y Treasury + spread',
  },
  'Business Acquisition': {
    minRate: 8.0,
    maxRate: 11.0,
    maxLTV: null,
    maxLTC: null,
    points: [0, 1],
    termMonths: [60, 120],
    interestOnly: false,
    downPayment: '10–30%',
    note: 'SBA-backed preferred',
  },
  'Construction & Development': {
    minRate: 9.0,
    maxRate: 12.5,
    maxLTV: null,
    maxLTC: 0.80,
    points: [1, 2.5],
    termMonths: [12, 24],
    interestOnly: true,
    usesRehab: true,
    note: 'SOFR + spread, draw schedule',
  },
  'Bridge & Hard Money': {
    minRate: 9.0,
    maxRate: 13.0,
    maxLTV: 0.75,
    maxLTC: null,
    points: [1.5, 3],
    termMonths: [6, 24],
    interestOnly: true,
    note: 'Asset-based, fast close',
  },
  'DSCR / No-Doc': {
    minRate: 6.5,
    maxRate: 9.5,
    maxLTV: 0.80,
    maxLTC: null,
    points: [0.5, 2],
    termMonths: [360],
    interestOnly: false,
    note: 'SOFR + spread, no income docs',
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
  if (interestOnly) return principal * monthlyRate;
  const n = termMonths;
  const factor = Math.pow(1 + monthlyRate, n);
  return principal * (monthlyRate * factor) / (factor - 1);
}

export function estimateRate(loanType, leverage, experience) {
  const program = LOAN_PROGRAMS[loanType];
  if (!program) return 0;
  const { minRate, maxRate } = program;
  const range = maxRate - minRate;
  const leverageRatio = Math.min(Math.max(leverage || 0, 0), 1);
  const experienceMap = { first: 1.0, '1-5': 0.7, '5+': 0.4 };
  const expFactor = experienceMap[experience] || 0.7;
  const blended = leverageRatio * 0.6 + expFactor * 0.4;
  return Math.round((minRate + range * blended) * 100) / 100;
}

export function estimateMaxLoan(loanType, purchasePrice, arv, rehabBudget) {
  const program = LOAN_PROGRAMS[loanType];
  if (!program) return 0;
  const candidates = [];
  if (program.maxLTV && purchasePrice > 0) {
    candidates.push((arv || purchasePrice) * program.maxLTV);
  }
  if (program.maxLTC) {
    const totalCost = purchasePrice + (rehabBudget || 0);
    if (totalCost > 0) candidates.push(totalCost * program.maxLTC);
  }
  if (candidates.length === 0 && purchasePrice > 0) {
    return purchasePrice * 0.75;
  }
  return candidates.length ? Math.min(...candidates) : 0;
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

  let leverage = 0;
  if (program.maxLTV) {
    leverage = calculateLTV(estimatedLoan, arv || purchasePrice) / program.maxLTV;
  } else if (program.maxLTC) {
    const totalCost = purchasePrice + rehabBudget;
    leverage = calculateLTC(estimatedLoan, totalCost) / program.maxLTC;
  }

  const rate = estimateRate(loanType, leverage, experience);
  const defaultTerm = program.termMonths[program.termMonths.length - 1];
  const monthlyPayment = calculateMonthlyPayment(estimatedLoan, rate, defaultTerm, program.interestOnly);

  const ltv = program.maxLTV ? calculateLTV(estimatedLoan, arv || purchasePrice) : null;
  const ltc = program.maxLTC ? calculateLTC(estimatedLoan, purchasePrice + rehabBudget) : null;

  const avgPoints = (program.points[0] + program.points[1]) / 2;
  const originationFee = estimatedLoan * avgPoints / 100;

  let score = 50;
  score += (1 - Math.min(leverage, 1)) * 25;
  const expBonus = { first: 0, '1-5': 10, '5+': 20 };
  score += expBonus[experience] || 10;
  if (estimatedLoan >= 200000 && estimatedLoan <= 5000000) score += 10;
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
