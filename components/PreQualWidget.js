import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { RiArrowRightLine, RiRefreshLine } from 'react-icons/ri';
import { useInView } from 'react-intersection-observer';
import {
  LOAN_PROGRAMS,
  parseCurrency,
  formatCurrency,
  getQualificationResult,
} from '../lib/loanCalculations';

const loanTypes = Object.keys(LOAN_PROGRAMS);

const states = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

export default function PreQualWidget() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [form, setForm] = useState({ loanType: '', loanAmount: '', propertyState: '' });
  const [results, setResults] = useState(null);

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10);
    setForm((f) => ({ ...f, loanAmount: num ? formatCurrency(num) : '' }));
  };

  const handleCheck = (e) => {
    e.preventDefault();
    const res = getQualificationResult({
      loanType: form.loanType,
      purchasePrice: form.loanAmount,
      rehabBudget: '',
      arv: '',
      experience: '1-5',
    });
    setResults(res);
  };

  const reset = () => {
    setResults(null);
    setForm({ loanType: '', loanAmount: '', propertyState: '' });
  };

  return (
    <section
      ref={ref}
      id="prequal"
      className="py-24 bg-navy-900 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`container-custom relative transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-10">
          <span className="section-subheading">Instant Check</span>
          <h2 className="section-heading text-white mt-3">
            See If You <span className="text-gradient-gold">Qualify</span> in Seconds
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Enter a few details and get an instant estimate. No signup, no commitment.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!results ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleCheck}
                className="card-dark p-6"
              >
                <div className="grid sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                      Loan Type
                    </label>
                    <select
                      value={form.loanType}
                      onChange={(e) => setForm((f) => ({ ...f, loanType: e.target.value }))}
                      required
                      className="input-field"
                    >
                      <option value="">Select...</option>
                      {loanTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                      Loan Amount
                    </label>
                    <input
                      type="text"
                      value={form.loanAmount}
                      onChange={handleAmountChange}
                      required
                      placeholder="$500,000"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                      State
                    </label>
                    <select
                      value={form.propertyState}
                      onChange={(e) => setForm((f) => ({ ...f, propertyState: e.target.value }))}
                      required
                      className="input-field"
                    >
                      <option value="">Select...</option>
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn-primary justify-center h-[46px]">
                    Check Now
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
                className="card-dark p-6"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Status */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                      <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                        results.qualificationScore >= 60 ? 'bg-green-400' : 'bg-gold'
                      }`} />
                      <span className={`font-semibold text-sm ${
                        results.qualificationScore >= 60 ? 'text-green-400' : 'text-gold'
                      }`}>
                        {results.qualificationScore >= 60 ? 'You Likely Qualify' : 'Worth Exploring'}
                      </span>
                    </div>
                    <div className="text-white font-semibold mb-1">
                      {results.matchedProgram}
                    </div>
                    <div className="text-white/40 text-sm">
                      Est. rate: {results.rateRange[0]}% – {results.rateRange[1]}%
                      {' · '}
                      Up to {((results.maxLTV || results.maxLTC) * 100).toFixed(0)}% {results.maxLTC ? 'LTC' : 'LTV'}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-3 flex-shrink-0">
                    <Link href="/deal-analyzer" className="btn-primary text-xs">
                      Full Analysis
                      <RiArrowRightLine className="w-3.5 h-3.5" />
                    </Link>
                    <Link href="/get-started" className="btn-outline text-xs">
                      Get Started
                    </Link>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-center">
                  <button
                    onClick={reset}
                    className="text-white/30 text-xs hover:text-gold transition-colors inline-flex items-center gap-1"
                  >
                    <RiRefreshLine className="w-3 h-3" />
                    Try different numbers
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
