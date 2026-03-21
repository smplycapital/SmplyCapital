import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

const differentiators = [
  'Direct lender — no broker middleman',
  'Fast approvals: term sheets in 24 hours',
  'Dedicated loan officer on every deal',
  'Flexible underwriting for complex scenarios',
  'Competitive rates with no hidden fees',
  'Nationwide lending across 30+ states',
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
              A Lender That
              <br />
              <span className="text-gradient-gold">Moves With You</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-10">
              We built Simply Capital for the investor who needs answers fast and capital
              faster. No bureaucracy. No committee. Just direct decision-making from a team
              that understands your deal.
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
              <Link href="/contact-us" className="btn-primary">
                Start a Conversation
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
                  desc: 'Share deal details online, by phone, or email. We respond same business day.',
                },
                {
                  step: '02',
                  title: 'Receive Term Sheet',
                  desc: 'Preliminary terms delivered within 24 hours. No obligation, no credit pull.',
                },
                {
                  step: '03',
                  title: 'Underwriting & Appraisal',
                  desc: 'Our team works fast. Most deals complete underwriting within 3–5 business days.',
                },
                {
                  step: '04',
                  title: 'Close & Fund',
                  desc: 'Wire hits your account at closing. Average close time: 5–10 business days.',
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
