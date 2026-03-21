import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import {
  RiArrowRightLine,
  RiBuildingLine,
  RiToolsLine,
  RiHomeLine,
  RiBuilding3Line,
  RiBarChartBoxLine,
  RiMapPinLine,
} from 'react-icons/ri';

export const loanPrograms = [
  {
    id: 'bridge',
    icon: RiArrowRightLine,
    title: 'Bridge Loans',
    tagline: 'Short-term leverage, long-term vision.',
    description:
      'Acquire, stabilize, or reposition assets fast. Our bridge loans give investors the speed and flexibility needed to capitalize on time-sensitive opportunities.',
    highlights: ['Up to 80% LTV', '12–24 Month Terms', 'Close in 5–10 Days', 'No Income Verification'],
    range: '$250K – $25M+',
    href: '/loan-programs#bridge',
  },
  {
    id: 'fix-flip',
    icon: RiToolsLine,
    title: 'Fix & Flip',
    tagline: 'Renovation capital, built for speed.',
    description:
      'From single-family to small multifamily, we fund purchase plus renovation costs so you can focus on the project — not the paperwork.',
    highlights: ['Up to 90% LTC', '100% Rehab Funded', 'Draw Schedule Flexibility', 'Experienced Investors Preferred'],
    range: '$100K – $5M',
    href: '/loan-programs#fix-flip',
  },
  {
    id: 'construction',
    icon: RiBuildingLine,
    title: 'New Construction',
    tagline: 'Ground-up confidence.',
    description:
      'Build with confidence. Our construction loans cover vertical development projects with structured draw schedules and dedicated support from start to certificate of occupancy.',
    highlights: ['Up to 85% LTC', 'Interest Reserve Included', 'Structured Draws', '12–24 Month Terms'],
    range: '$500K – $20M+',
    href: '/loan-programs#construction',
  },
  {
    id: 'dscr',
    icon: RiBarChartBoxLine,
    title: 'DSCR / Rental Loans',
    tagline: 'Qualify on the property, not the person.',
    description:
      'Designed for long-term investors building rental portfolios. DSCR loans underwrite based on property cash flow — not your personal income.',
    highlights: ['DSCR ≥ 1.0', '30-Year Fixed Available', 'No Tax Returns', 'Single or Portfolio'],
    range: '$150K – $10M',
    href: '/loan-programs#dscr',
  },
  {
    id: 'ground-up',
    icon: RiMapPinLine,
    title: 'Ground-Up Development',
    tagline: 'Vision backed by capital.',
    description:
      'Larger-scale residential and mixed-use development projects deserve a lender who understands entitlements, phasing, and complex capital structures.',
    highlights: ['Up to 70% LTC', 'Horizontal & Vertical', 'Pre-development Considered', 'Experienced Sponsors'],
    range: '$1M – $50M+',
    href: '/loan-programs#ground-up',
  },
  {
    id: 'multifamily',
    icon: RiBuilding3Line,
    title: 'Multifamily',
    tagline: 'Scale your portfolio.',
    description:
      'Acquisition, value-add, or cash-out on 5+ unit properties. We understand multifamily underwriting and move with the urgency the market demands.',
    highlights: ['5+ Units', 'Value-Add & Stabilized', 'Cash-Out Options', 'Bridge or Perm'],
    range: '$500K – $25M+',
    href: '/loan-programs#multifamily',
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
            <span className="section-subheading">What We Lend On</span>
            <h2 className="section-heading text-white mt-3">
              Loan Programs
              <br />
              <span className="text-gradient-gold">Built for Investors</span>
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
