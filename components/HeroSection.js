import Link from 'next/link';
import ScrollHint from './ScrollHint';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-noise opacity-50" />

      {/* Geometric Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/3 left-1/4 w-px h-64 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-1/4 right-1/3 w-px h-48 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />

      {/* Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Corner Bracket Top Left */}
      <div className="absolute top-28 left-8 md:left-16 w-12 h-12 border-t border-l border-gold/30" />
      <div className="absolute bottom-24 right-8 md:right-16 w-12 h-12 border-b border-r border-gold/30" />

      <div className="container-custom relative z-10 pt-24 pb-32">
        <div className="max-w-4xl">
          {/* Pre-headline */}
          <div className="flex items-center gap-3 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <div className="w-8 h-px bg-gold" />
            <span className="section-subheading text-xs">Commercial Lending. Made Simple.</span>
          </div>

          {/* Main Headline */}
          <h1
            className="section-heading text-white mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            One Application.
            <br />
            <span className="text-gradient-gold italic font-display">70+ Lenders.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 opacity-0 animate-fade-up"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Smply Capital is a commercial loan broker that shops your deal across 70+ lending
            partners to find you the best terms. SBA loans, commercial real estate, business
            acquisition, bridge, DSCR, and more — $0 upfront fees, always.
          </p>

          {/* Stats Row */}
          <div
            className="grid grid-cols-3 gap-6 max-w-lg mb-12 opacity-0 animate-fade-up"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            {[
              { value: '70+', label: 'Lenders' },
              { value: '$0', label: 'Upfront Fees' },
              { value: '24hr', label: 'Term Sheet' },
            ].map((s) => (
              <div key={s.label} className="border-l border-gold/30 pl-4">
                <div className="font-display text-2xl font-bold text-gold leading-tight">{s.value}</div>
                <div className="text-white/40 text-xs tracking-wide uppercase mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <Link href="/deal-analyzer" className="btn-primary">
              Analyze Your Deal
            </Link>
            <Link href="/get-started" className="btn-outline">
              Get Started
            </Link>
          </div>
        </div>

        {/* Right-side floating card */}
        <div
          className="hidden xl:block absolute right-16 top-1/2 -translate-y-1/2 w-72 opacity-0 animate-fade-up"
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <div className="card-dark p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/50 text-xs tracking-wide uppercase">Currently Lending</span>
            </div>
            {[
              { label: 'Loan Range', value: '$100K – $50M+' },
              { label: 'LTV', value: 'Up to 90%' },
              { label: 'Term', value: '12 – 36 Months' },
              { label: 'Rate', value: 'From 9.99%' },
              { label: 'Close', value: '5 – 10 Business Days' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-white/40 text-xs">{item.label}</span>
                <span className="text-white text-xs font-semibold">{item.value}</span>
              </div>
            ))}
            <Link href="/deal-analyzer" className="btn-primary w-full text-center text-xs mt-2">
              Analyze Your Deal
            </Link>
          </div>
        </div>
      </div>

      <ScrollHint />
    </section>
  );
}
