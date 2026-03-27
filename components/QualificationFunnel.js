import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiBuildingLine,
  RiToolsLine,
  RiBuilding3Line,
  RiBarChartBoxLine,
  RiShoppingBagLine,
  RiCheckDoubleLine,
  RiSearchLine,
} from 'react-icons/ri';
import {
  LOAN_PROGRAMS,
  parseCurrency,
  formatCurrency,
  getQualificationResult,
} from '../lib/loanCalculations';

const loanTypeCards = [
  { key: 'SBA 7(a)', icon: RiShoppingBagLine, title: 'SBA Loan', tagline: 'Government-backed, competitively priced.' },
  { key: 'Commercial Real Estate', icon: RiBuildingLine, title: 'Commercial RE', tagline: 'Finance the property, grow the business.' },
  { key: 'Business Acquisition', icon: RiBuilding3Line, title: 'Business Acquisition', tagline: 'Buy the business, keep your cash.' },
  { key: 'Construction & Development', icon: RiToolsLine, title: 'Construction', tagline: 'Build it. We fund it.' },
  { key: 'Bridge & Hard Money', icon: RiArrowRightLine, title: 'Bridge / Hard Money', tagline: 'Move fast. Close faster.' },
  { key: 'DSCR / No-Doc', icon: RiBarChartBoxLine, title: 'DSCR / No-Doc', tagline: 'Qualify on cash flow, not pay stubs.' },
];

const states = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const propertyTypes = ['Office / Retail', 'Multifamily', 'Industrial / Warehouse', 'Mixed-Use', 'Single Family', 'Business (No RE)'];

function CurrencyInput({ label, name, value, onChange, placeholder }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10);
    onChange(name, num ? formatCurrency(num) : '');
  };

  return (
    <div>
      <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">{label}</label>
      <input type="text" value={value} onChange={handleChange} placeholder={placeholder} className="input-field" />
    </div>
  );
}

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

export default function QualificationFunnel() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    loanType: '',
    purchasePrice: '',
    rehabBudget: '',
    arv: '',
    propertyState: '',
    propertyType: '',
    experience: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
  });

  const program = LOAN_PROGRAMS[data.loanType];
  const showRehab = program?.usesRehab;

  const results = useMemo(() => {
    if (step < 3) return null;
    return getQualificationResult(data);
  }, [step, data]);

  const updateField = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const selectLoanType = (type) => {
    updateField('loanType', type);
    setTimeout(() => {
      setDirection(1);
      setStep(1);
    }, 300);
  };

  const handleSubmitFinal = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const stepLabels = ['Strategy', 'Deal Details', 'About You', 'Results'];
  const progressPct = ((step) / 3) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {stepLabels.map((label, i) => (
            <span
              key={label}
              className={`text-xs font-medium tracking-wide transition-colors duration-300 ${
                i <= step ? 'text-gold' : 'text-white/25'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait" custom={direction}>
        {/* Step 0: Strategy */}
        {step === 0 && (
          <motion.div
            key="step-0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold text-white mb-3">
                What&apos;s Your <span className="text-gradient-gold">Strategy?</span>
              </h2>
              <p className="text-white/50 text-sm">Select the loan type that fits your deal.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loanTypeCards.map(({ key, icon: Icon, title, tagline }) => (
                <button
                  key={key}
                  onClick={() => selectLoanType(key)}
                  className={`card-dark text-left flex items-start gap-4 hover:border-gold/40 transition-all duration-200 ${
                    data.loanType === key ? 'border-gold bg-gold/5' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{title}</div>
                    <div className="text-white/40 text-xs mt-0.5">{tagline}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Deal Details */}
        {step === 1 && (
          <motion.div
            key="step-1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <button onClick={goBack} className="btn-ghost text-xs mb-4 -ml-3">
              <RiArrowLeftLine className="w-3.5 h-3.5" />
              Back
            </button>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-white mb-3">
                Tell Us About the <span className="text-gradient-gold">Deal</span>
              </h2>
              <p className="text-white/50 text-sm">
                We&apos;ll use these details to estimate your loan terms.
              </p>
            </div>
            <div className="card-dark p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <CurrencyInput
                  label="Purchase Price *"
                  name="purchasePrice"
                  value={data.purchasePrice}
                  onChange={updateField}
                  placeholder="$500,000"
                />
                <div>
                  <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                    Property State *
                  </label>
                  <select
                    value={data.propertyState}
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

              {showRehab && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <CurrencyInput
                    label="Rehab / Construction Budget"
                    name="rehabBudget"
                    value={data.rehabBudget}
                    onChange={updateField}
                    placeholder="$150,000"
                  />
                  <CurrencyInput
                    label="After Repair Value (ARV)"
                    name="arv"
                    value={data.arv}
                    onChange={updateField}
                    placeholder="$750,000"
                  />
                </div>
              )}

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
                        data.propertyType === t
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-white/10 text-white/50 hover:border-gold/30'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={goNext}
                disabled={!parseCurrency(data.purchasePrice) || !data.propertyState}
                className="btn-primary w-full justify-center mt-4 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue
                <RiArrowRightLine className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: About You */}
        {step === 2 && (
          <motion.div
            key="step-2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <button onClick={goBack} className="btn-ghost text-xs mb-4 -ml-3">
              <RiArrowLeftLine className="w-3.5 h-3.5" />
              Back
            </button>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-white mb-3">
                About <span className="text-gradient-gold">You</span>
              </h2>
              <p className="text-white/50 text-sm">
                Help us tailor your results and connect you with the right loan officer.
              </p>
            </div>
            <div className="card-dark p-6 space-y-5">
              {/* Experience */}
              <div>
                <label className="block text-white/50 text-xs mb-2 uppercase tracking-wide">
                  Investment Experience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'first', label: 'First Deal', desc: 'New to investing' },
                    { key: '1-5', label: '1-5 Deals', desc: 'Some experience' },
                    { key: '5+', label: '5+ Deals', desc: 'Experienced investor' },
                  ].map(({ key, label, desc }) => (
                    <button
                      key={key}
                      onClick={() => updateField('experience', key)}
                      className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                        data.experience === key
                          ? 'border-gold bg-gold/10'
                          : 'border-white/10 hover:border-gold/30'
                      }`}
                    >
                      <div className={`text-xs font-semibold ${data.experience === key ? 'text-gold' : 'text-white'}`}>
                        {label}
                      </div>
                      <div className="text-white/30 text-[10px] mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-white/50 text-xs mb-2 uppercase tracking-wide">
                  Timeline
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'asap', label: 'ASAP', desc: 'Under contract' },
                    { key: '1-3mo', label: '1-3 Months', desc: 'Shopping deals' },
                    { key: 'exploring', label: 'Exploring', desc: 'Just looking' },
                  ].map(({ key, label, desc }) => (
                    <button
                      key={key}
                      onClick={() => updateField('timeline', key)}
                      className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                        data.timeline === key
                          ? 'border-gold bg-gold/10'
                          : 'border-white/10 hover:border-gold/30'
                      }`}
                    >
                      <div className={`text-xs font-semibold ${data.timeline === key ? 'text-gold' : 'text-white'}`}>
                        {label}
                      </div>
                      <div className="text-white/30 text-[10px] mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Smith"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Email *</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john@example.com"
                    className="input-field"
                  />
                </div>
              </div>
              <div className="max-w-xs">
                <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Phone</label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(555) 000-0000"
                  className="input-field"
                />
              </div>

              <button
                onClick={goNext}
                disabled={!data.name || !data.email || !data.experience}
                className="btn-primary w-full justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                See My Results
                <RiArrowRightLine className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <motion.div
            key="step-3"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-dark p-10 text-center flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                    <RiCheckDoubleLine className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Term Sheet Requested!
                  </h3>
                  <p className="text-white/50 text-sm max-w-sm leading-relaxed">
                    A Simply Capital loan officer will review your deal and contact you within 24 hours
                    with your personalized term sheet.
                  </p>
                  <Link href="/deal-analyzer" className="btn-outline text-xs mt-2">
                    Try the Deal Analyzer
                  </Link>
                </motion.div>
              ) : results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4 ${
                      results.qualificationScore >= 60
                        ? 'border-green-500/30 bg-green-500/10 text-green-400'
                        : 'border-gold/30 bg-gold/10 text-gold'
                    }`}>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        results.qualificationScore >= 60 ? 'bg-green-400' : 'bg-gold'
                      }`} />
                      <span className="text-sm font-semibold">
                        {results.qualificationScore >= 60 ? 'You Pre-Qualify!' : 'Let\'s Talk About Your Deal'}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl font-bold text-white mb-2">
                      Your <span className="text-gradient-gold">Results</span>
                    </h2>
                    <p className="text-white/50 text-sm">
                      Based on your {results.matchedProgram} scenario
                    </p>
                  </div>

                  <div className="card-dark p-6 space-y-5 mb-6">
                    {/* Loan Amount */}
                    <div className="text-center pb-4 border-b border-white/5">
                      <div className="text-white/40 text-xs uppercase tracking-wide mb-1">
                        Estimated Loan Amount
                      </div>
                      <div className="font-display text-4xl font-bold text-gold">
                        {formatCurrency(results.estimatedLoan)}
                      </div>
                    </div>

                    {/* Terms Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <div className="text-white/40 text-xs mb-0.5">Est. Rate</div>
                        <div className="text-white font-semibold text-sm">{results.rate}%</div>
                      </div>
                      <div>
                        <div className="text-white/40 text-xs mb-0.5">Monthly</div>
                        <div className="text-white font-semibold text-sm">
                          {formatCurrency(Math.round(results.monthlyPayment))}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/40 text-xs mb-0.5">
                          {results.ltc !== null ? 'LTC' : 'LTV'}
                        </div>
                        <div className="text-white font-semibold text-sm">
                          {((results.ltc !== null ? results.ltc : results.ltv) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-white/40 text-xs mb-0.5">Term</div>
                        <div className="text-white font-semibold text-sm">
                          {results.termMonths >= 360 ? '30 Years' : `${results.termMonths}mo`}
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-center pt-3 border-t border-white/5">
                      <span className="text-white/40 text-xs">Qualification Score: </span>
                      <span className={`font-bold text-sm ${
                        results.qualificationScore >= 70 ? 'text-green-400' :
                        results.qualificationScore >= 50 ? 'text-gold' : 'text-red-400'
                      }`}>
                        {results.qualificationScore}/100
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitFinal}
                    disabled={loading}
                    className="btn-primary w-full justify-center mb-3"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request Official Term Sheet
                        <RiArrowRightLine className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <div className="text-center">
                    <Link
                      href="/deal-analyzer"
                      className="text-gold text-xs hover:underline inline-flex items-center gap-1"
                    >
                      <RiSearchLine className="w-3 h-3" />
                      Try the Deal Analyzer for more detail
                    </Link>
                  </div>
                  <p className="text-white/20 text-[10px] text-center mt-4 leading-relaxed">
                    Estimates only. Subject to credit approval. Not a commitment to lend.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
