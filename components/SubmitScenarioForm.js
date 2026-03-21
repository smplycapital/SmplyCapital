import { useState } from 'react';
import { RiArrowRightLine, RiCheckDoubleLine } from 'react-icons/ri';

const loanTypes = [
  'Bridge Loan',
  'Fix & Flip',
  'New Construction',
  'DSCR / Rental',
  'Ground-Up Development',
  'Multifamily',
  'Other',
];

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export default function SubmitScenarioForm({ compact = false }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    loanType: '',
    loanAmount: '',
    propertyState: '',
    propertyType: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card-dark p-10 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
          <RiCheckDoubleLine className="w-7 h-7 text-gold" />
        </div>
        <h3 className="font-display text-2xl font-bold text-white">Scenario Received!</h3>
        <p className="text-white/50 text-sm max-w-sm leading-relaxed">
          Thank you for reaching out. A Simply Capital loan officer will review your
          scenario and contact you within one business day.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-outline text-xs mt-2"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1: Name + Email */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
        <div>
          <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="John Smith"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="input-field"
          />
        </div>
      </div>

      {/* Row 2: Phone + Loan Type */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
        <div>
          <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="(555) 000-0000"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Loan Type *</label>
          <select
            name="loanType"
            required
            value={form.loanType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select loan type...</option>
            {loanTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Amount + State */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
        <div>
          <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Loan Amount *</label>
          <input
            type="text"
            name="loanAmount"
            required
            value={form.loanAmount}
            onChange={handleChange}
            placeholder="e.g. $1,500,000"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Property State *</label>
          <select
            name="propertyState"
            required
            value={form.propertyState}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select state...</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Type */}
      {!compact && (
        <div>
          <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Property Type</label>
          <input
            type="text"
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            placeholder="e.g. Single Family, Multifamily, Mixed-Use..."
            className="input-field"
          />
        </div>
      )}

      {/* Message */}
      {!compact && (
        <div>
          <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Scenario Details</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your deal — purchase price, rehab budget, exit strategy, timeline..."
            className="input-field resize-none"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Submit Scenario
            <RiArrowRightLine className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-white/30 text-xs text-center leading-relaxed">
        No obligation. No credit pull. We respond within one business day.
      </p>
    </form>
  );
}
