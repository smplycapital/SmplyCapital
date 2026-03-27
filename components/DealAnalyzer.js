import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiArrowRightLine,
  RiBuildingLine,
  RiBuilding3Line,
  RiBarChartBoxLine,
  RiShoppingBagLine,
  RiToolsLine,
  RiPercentLine,
} from 'react-icons/ri';
import {
  LOAN_PROGRAMS,
  parseCurrency,
  formatCurrency,
  getQualificationResult,
} from '../lib/loanCalculations';
import EmailGateModal from './EmailGateModal';

const loanTypeOptions = [
  { key: 'SBA 7(a)', icon: RiShoppingBagLine, label: 'SBA Loan' },
  { key: 'Commercial Real Estate', icon: RiBuildingLine, label: 'Commercial RE' },
  { key: 'Business Acquisition', icon: RiBuilding3Line, label: 'Business Acq.' },
  { key: 'Construction & Development', icon: RiToolsLine, label: 'Construction' },
  { key: 'Bridge & Hard Money', icon: RiArrowRightLine, label: 'Bridge / Hard Money' },
  { key: 'DSCR / No-Doc', icon: RiBarChartBoxLine, label: 'DSCR / No-Doc' },
];

const propertyTypes = ['Office / Retail', 'Multifamily', 'Industrial / Warehouse', 'Mixed-Use', 'Single Family', 'Business (No RE)'];
const experienceLevels = [
  { key: 'first', label: 'First Deal' },
  { key: '1-5', label: '1-5 Deals' },
  { key: '5+', label: '5+ Deals' },
];

const states = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

function CurrencyInput({ label, name, value, onChange, placeholder }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10);
    onChange(name, num ? formatCurrency(num) : '');
  };

  return (
    <div>
      <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder || '$0'}
        className="input-field"
      />
    </div>
  );
}

function ScoreCircle({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#22c55e' : score >= 50 ? '#c9a84c' : '#ef4444';

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#1e293b" strokeWidth="6" />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-2xl font-bold text-white">{score}</span>
      </div>
    </div>
  );
}

function GaugeBar({ value, max, label }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOver = value > max;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-white/50">{label}</span>
        <span className={`font-semibold ${isOver ? 'text-red-400' : 'text-gold'}`}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isOver ? 'bg-red-400' : 'bg-gold'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-end mt-0.5">
        <span className="text-white/30 text-[10px]">Max: {(max * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default function DealAnalyzer() {
  const [inputs, setInputs] = useState({
    loanType: '',
    purchasePrice: '',
    rehabBudget: '',
    arv: '',
    propertyState: '',
    propertyType: '',
    experience: '1-5',
  });
  const [showGate, setShowGate] = useState(false);

  const program = LOAN_PROGRAMS[inputs.loanType];
  const showRehab = program?.usesRehab;

  const results = useMemo(() => {
    if (!inputs.loanType || !parseCurrency(inputs.purchasePrice)) return null;
    return getQualificationResult(inputs);
  }, [inputs]);

  const updateField = (name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Left — Inputs */}
        <div className="lg:col-span-3 space-y-6">
          {/* Loan Type Selection */}
          <div className="card-dark p-6">
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              Select Loan Type
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {loanTypeOptions.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => updateField('loanType', key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 text-center ${
                    inputs.loanType === key
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-white/10 text-white/60 hover:border-gold/40 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Deal Details */}
          <div className="card-dark p-6">
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              Deal Details
            </h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <CurrencyInput
                  label="Purchase Price *"
                  name="purchasePrice"
                  value={inputs.purchasePrice}
                  onChange={updateField}
                  placeholder="$500,000"
                />
                <div>
                  <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                    Property State
                  </label>
                  <select
                    value={inputs.propertyState}
                    onChange={(e) => updateField('propertyState', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select state...</option>
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {showRehab && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 pt-1">
                      <CurrencyInput
                        label="Rehab / Construction Budget"
                        name="rehabBudget"
                        value={inputs.rehabBudget}
                        onChange={updateField}
                        placeholder="$150,000"
                      />
                      <CurrencyInput
                        label="After Repair Value (ARV)"
                        name="arv"
                        value={inputs.arv}
                        onChange={updateField}
                        placeholder="$750,000"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Property Type */}
              <div>
                <label className="block text-white/50 text-xs mb-2 uppercase tracking-wide">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => updateField('propertyType', t)}
                      className={`px-3 py-1.5 text-xs rounded-sm border transition-all duration-200 ${
                        inputs.propertyType === t
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-white/10 text-white/50 hover:border-gold/30'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-white/50 text-xs mb-2 uppercase tracking-wide">
                  Experience Level
                </label>
                <div className="flex gap-2">
                  {experienceLevels.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => updateField('experience', key)}
                      className={`flex-1 px-3 py-2 text-xs rounded-sm border transition-all duration-200 text-center ${
                        inputs.experience === key
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-white/10 text-white/50 hover:border-gold/30'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Results */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <div className="card-dark p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/50 text-xs tracking-wide uppercase">
                Estimated Terms
              </span>
            </div>

            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Estimated Loan */}
                  <div className="text-center pb-4 border-b border-white/5">
                    <div className="text-white/40 text-xs uppercase tracking-wide mb-1">
                      Estimated Loan Amount
                    </div>
                    <motion.div
                      key={results.estimatedLoan}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-4xl font-bold text-gold"
                    >
                      {formatCurrency(results.estimatedLoan)}
                    </motion.div>
                    <div className="text-white/30 text-xs mt-1">
                      {results.matchedProgram}
                    </div>
                  </div>

                  {/* Rate & Payment */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/40 text-xs mb-0.5">Est. Rate</div>
                      <div className="text-white font-semibold">{results.rate}%</div>
                      <div className="text-white/25 text-[10px]">
                        Range: {results.rateRange[0]}% – {results.rateRange[1]}%
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs mb-0.5">Monthly Payment</div>
                      <div className="text-white font-semibold">
                        {formatCurrency(Math.round(results.monthlyPayment))}
                      </div>
                      <div className="text-white/25 text-[10px]">
                        {results.interestOnly ? 'Interest Only' : 'Amortizing'}
                      </div>
                    </div>
                  </div>

                  {/* LTV / LTC Gauge */}
                  {results.ltc !== null ? (
                    <GaugeBar value={results.ltc} max={results.maxLTC} label="Loan-to-Cost (LTC)" />
                  ) : (
                    <GaugeBar value={results.ltv} max={results.maxLTV} label="Loan-to-Value (LTV)" />
                  )}

                  {/* Points & Term */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <div className="text-white/40 text-xs mb-0.5">Origination</div>
                      <div className="text-white text-sm font-semibold">
                        {formatCurrency(Math.round(results.originationFee))}
                      </div>
                      <div className="text-white/25 text-[10px]">
                        {results.pointsRange[0]}–{results.pointsRange[1]} pts
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs mb-0.5">Term</div>
                      <div className="text-white text-sm font-semibold">
                        {results.termMonths >= 360
                          ? '30 Years'
                          : `${results.termMonths} Months`}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="text-white/40 text-xs uppercase tracking-wide text-center mb-3">
                      Qualification Score
                    </div>
                    <ScoreCircle score={results.qualificationScore} />
                    <div className="text-center mt-2">
                      <span className={`text-xs font-semibold ${
                        results.qualificationScore >= 70 ? 'text-green-400' :
                        results.qualificationScore >= 50 ? 'text-gold' : 'text-red-400'
                      }`}>
                        {results.qualificationScore >= 70 ? 'Strong Candidate' :
                         results.qualificationScore >= 50 ? 'Likely Qualifies' : 'Let\'s Talk'}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setShowGate(true)}
                    className="btn-primary w-full justify-center mt-2"
                  >
                    Get Personalized Term Sheet
                    <RiArrowRightLine className="w-4 h-4" />
                  </button>

                  <p className="text-white/20 text-[10px] text-center leading-relaxed">
                    Estimates only. Subject to credit approval. Not a commitment to lend.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                    <RiBarChartBoxLine className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="text-white/30 text-sm">
                    Select a loan type and enter your purchase price to see estimated terms.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <EmailGateModal
        isOpen={showGate}
        onClose={() => setShowGate(false)}
        title="Get Your Personalized Term Sheet"
        subtitle="Our team will review your deal and send custom loan terms within 24 hours."
        dealData={results ? {
          loanType: inputs.loanType,
          purchasePrice: inputs.purchasePrice,
          rehabBudget: inputs.rehabBudget,
          arv: inputs.arv,
          propertyState: inputs.propertyState,
          propertyType: inputs.propertyType,
          experience: inputs.experience,
          estimatedLoan: results.estimatedLoan,
          estimatedRate: results.rate,
          qualificationScore: results.qualificationScore,
        } : {}}
      />
    </>
  );
}
