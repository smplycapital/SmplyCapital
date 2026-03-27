import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import {
  RiArrowRightLine,
  RiBuildingLine,
  RiBuilding3Line,
  RiBarChartBoxLine,
  RiShoppingBagLine,
  RiToolsLine,
  RiPercentLine,
} from 'react-icons/ri';

export const loanPrograms = [
  {
    id: 'sba',
    icon: RiShoppingBagLine,
    title: 'SBA Loans',
    tagline: 'Government-backed, competitively priced.',
    description:
      'SBA 7(a) and 504 programs for owner-operated businesses. Low down payments, long terms, and rates tied to Prime — we match you with the right SBA lender from our network.',
    highlights: ['SBA 7(a) & 504', 'As Low as 10% Down', 'Terms Up to 25 Years', 'Prime + Spread Pricing'],
    range: '$150K – $5M',
    href: '/loan-programs#sba',
  },
  {
    id: 'commercial-re',
    icon: RiBuildingLine,
    title: 'Commercial Real Estate',
    tagline: 'Finance the property, grow the business.',
    description:
      'Acquisition, refinance, or cash-out on owner-occupied and investment commercial properties. We work with 70+ lenders to find the best permanent financing available.',
    highlights: ['Up to 80% LTV', '20–30 Year Amortization', 'Fixed & Variable Rates', 'Mixed-Use & Office Welcome'],
    range: '$500K – $20M',
    href: '/loan-programs#commercial-re',
  },
  {
    id: 'business-acquisition',
    icon: RiBuilding3Line,
    title: 'Business Acquisition',
    tagline: 'Buy the business, keep your cash.',
    description:
      'Financing for business purchases, partner buyouts, and expansions. SBA-backed options preferred. We structure the deal and match you with the right lender.',
    highlights: ['SBA-Backed Preferred', '10–30% Down', 'Terms Up to 10 Years', 'Working Capital Included'],
    range: '$200K – $5M',
    href: '/loan-programs#business-acquisition',
  },
  {
    id: 'construction',
    icon: RiToolsLine,
    title: 'Construction & Development',
    tagline: 'Build it. We fund it.',
    description:
      'Ground-up and renovation construction loans with structured draw schedules. Interest-only during construction. We match you with lenders who understand your project timeline.',
    highlights: ['Up to 80% LTC', 'Interest-Only Draws', '12–24 Month Terms', 'Residential & Commercial'],
    range: '$500K – $20M',
    href: '/loan-programs#construction',
  },
  {
    id: 'bridge',
    icon: RiArrowRightLine,
    title: 'Bridge & Hard Money',
    tagline: 'Move fast. Close faster.',
    description:
      'Short-term bridge and hard money loans for time-sensitive acquisitions, refinances, and transitions. Asset-based underwriting — close in days, not months.',
    highlights: ['Up to 75% LTV', 'Asset-Based Approval', '6–24 Month Terms', 'Fast Close Available'],
    range: '$250K – $10M',
    href: '/loan-programs#bridge',
  },
  {
    id: 'dscr',
    icon: RiBarChartBoxLine,
    title: 'DSCR / No-Doc',
    tagline: 'Qualify on cash flow, not pay stubs.',
    description:
      'Long-term rental and investment property financing underwritten on property cash flow. No income verification, no tax returns — ideal for self-employed investors.',
    highlights: ['No Income Docs', '30-Year Terms Available', 'DSCR ≥ 1.0', 'Single or Portfolio'],
    range: '$150K – $10M',
    href: '/loan-programs#dscr',
  },
];

function ProgramCard({ program, index, inView }) {
  const Icon = program.icon;

  return (
    <div
      className={`group card-dark hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-400 flex flex-col ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
      id={program.id}
    >
      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300">
          <Icon className="w-5 h-5 text-gold" />
        </div>
        <span className="text-white/20 text-xs font-mono">0{index + 1}</span>
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-gold transition-colors duration-200">
        {program.title}
      </h3>
      <p className="text-gold/70 text-xs tracking-wide uppercase mb-3">{program.tagline}</p>
      <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">{program.description}</p>

      {/* Highlights */}
      <ul className="space-y-1.5 mb-5">
        {program.highlights.map((h) => (
          <li key={h} className="flex items-center gap-2 text-xs text-white/60">
            <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
            {h}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div>
          <div className="text-white/30 text-[10px] uppercase tracking-wide">Loan Range</div>
          <div className="text-white text-sm font-semibold">{program.range}</div>
        </div>
        <Link
          href={program.href}
          className="flex items-center gap-1.5 text-gold text-xs font-semibold hover:gap-2.5 transition-all duration-200 group"
        >
          Details
          <RiArrowRightLine className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function LoanProgramsGrid({ limit }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const programs = limit ? loanPrograms.slice(0, limit) : loanPrograms;

  return (
    <section ref={ref} className="py-24 bg-navy-950">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="section-subheading">Our Loan Programs</span>
            <h2 className="section-heading text-white mt-3">
              8+ Programs.
              <br />
              <span className="text-gradient-gold">70+ Lenders.</span>
            </h2>
          </div>
          {limit && (
            <Link href="/loan-programs" className="btn-outline self-start md:self-auto text-xs">
              View All Programs
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((program, i) => (
            <ProgramCard key={program.id} program={program} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
