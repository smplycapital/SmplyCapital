import { useState } from 'react';
import { RiArrowLeftLine, RiArrowRightLine, RiDoubleQuotesL } from 'react-icons/ri';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    quote:
      "Simply Capital funded our $4.2M bridge loan in 8 days. We've worked with conventional lenders and private lenders across the country — nobody moves like this team.",
    name: 'Marcus T.',
    title: 'Principal, Redwood Capital Group',
    deal: 'Bridge Loan — $4.2M',
  },
  {
    quote:
      "We had a 10-day close deadline on a distressed multifamily acquisition. Simply Capital delivered term sheet in a day and funded on time. Game-changing lender.",
    name: 'Sarah K.',
    title: 'Managing Partner, Keystone Real Estate',
    deal: 'Multifamily Bridge — $2.8M',
  },
  {
    quote:
      "I've closed over 40 fix-and-flip deals over my career. Simply Capital is now my go-to for rehab financing. No nonsense, honest terms, and a team that actually picks up the phone.",
    name: 'David R.',
    title: 'Real Estate Investor',
    deal: 'Fix & Flip — $875K',
  },
  {
    quote:
      "Our construction loan for a 24-unit ground-up project was approved within a week. The structured draw schedule worked perfectly with our GC's timeline.",
    name: 'Jennifer M.',
    title: 'Developer, Monarch Development Co.',
    deal: 'Construction Loan — $6.1M',
  },
  {
    quote:
      "DSCR loan closed without a single income document from me. If you're a portfolio landlord tired of conventional bank headaches, Simply Capital is your answer.",
    name: 'Robert L.',
    title: 'Portfolio Investor',
    deal: 'DSCR Loan — $1.4M',
  },
];

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  const t = testimonials[active];

  return (
    <section ref={ref} className="py-24 bg-navy-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-gold/4 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom">
        <div
          className={`text-center mb-16 transition-all duration-600 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="section-subheading">What Investors Say</span>
          <h2 className="section-heading text-white mt-3">
            Trusted by
            <span className="text-gradient-gold"> Investors Nationwide</span>
          </h2>
        </div>

        <div
          className={`max-w-3xl mx-auto transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="card-dark relative p-8 md:p-12">
            {/* Quote Icon */}
            <div className="absolute -top-5 left-10 w-10 h-10 bg-gold rounded-sm flex items-center justify-center">
              <RiDoubleQuotesL className="w-5 h-5 text-navy-900" />
            </div>

            {/* Quote */}
            <blockquote className="font-display text-xl md:text-2xl text-white/80 italic leading-relaxed mb-8 mt-4">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                  <span className="font-display font-bold text-gold text-lg">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.title}</div>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-sm">
                <span className="text-gold text-xs font-medium">{t.deal}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 border border-white/10 rounded-sm flex items-center justify-center text-white/50 hover:border-gold/40 hover:text-gold transition-all duration-200"
            >
              <RiArrowLeftLine className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-200 rounded-full ${
                    i === active ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 border border-white/10 rounded-sm flex items-center justify-center text-white/50 hover:border-gold/40 hover:text-gold transition-all duration-200"
            >
              <RiArrowRightLine className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
