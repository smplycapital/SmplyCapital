import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

const differentiators = [
  'We shop 70+ lenders so you get the best rate',
  '$0 upfront fees — ever',
  'Term sheets within 24 hours',
  'SBA, commercial RE, bridge, DSCR & more',
  'Dedicated loan advisor on every deal',
  'Flexible underwriting for complex scenarios',
];

export default function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-navy-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div
            className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <span className="section-subheading">Why Simply Capital</span>
            <h2 className="section-heading text-white mt-3 mb-6">
              We Do the Shopping.
              <br />
              <span className="text-gradient-gold">You Get the Best Rate.</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-10">
              As a commercial loan broker, we work for you — not the bank. We submit your
              scenario to our network of 70+ lenders simultaneously and bring back the best
              terms available. One application, maximum competition, zero upfront cost.
            </p>
            <ul className="space-y-3 mb-10">
              {differentiators.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mt-0.5">
                    <RiCheckLine className="w-3 h-3 text-gold" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              <Link href="/get-started" className="btn-primary">
                Get Started
                <RiArrowRightLine className="w-4 h-4" />
              </Link>
              <Link href="/about" className="btn-ghost">
                Our Story
              </Link>
            </div>
          </div>

          {/* Right — Process Steps */}
          <div
            className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          >
            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Submit Your Scenario',
                  desc: 'Share deal details online, by phone, or email. No upfront fees, no obligation.',
                },
                {
                  step: '02',
                  title: 'We Shop the Market',
                  desc: 'We present your deal to 70+ lending partners and collect competing offers.',
                },
                {
                  step: '03',
                  title: 'Review Your Options',
                  desc: 'We deliver the best term sheets within 24 hours. You choose the lender.',
                },
                {
                  step: '04',
                  title: 'Close & Fund',
                  desc: 'We coordinate the process from underwriting through closing. You get funded.',
                },
              ].map((s, i) => (
                <div key={s.step} className="flex gap-5 card-dark hover:border-gold/30 transition-colors duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <span className="text-gold font-mono text-sm font-bold">{s.step}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">{s.title}</h4>
                    <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
