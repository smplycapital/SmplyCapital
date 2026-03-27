import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import StatStrip from '../components/StatStrip';
import { RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

const values = [
  {
    title: 'We Work for You',
    desc: 'As a broker, our loyalty is to our clients — not the lender. We negotiate on your behalf and only win when you close.',
  },
  {
    title: '$0 Upfront Fees',
    desc: 'No application fees, no retainers. We are compensated by the lender at closing, so you never pay out of pocket to explore your options.',
  },
  {
    title: 'Maximum Market Exposure',
    desc: 'One application reaches 70+ lenders simultaneously. More competition means better rates, better terms, and more options for you.',
  },
  {
    title: 'Transparent Process',
    desc: 'We explain every offer, every term, and every fee — in plain language. No surprises, no hidden costs, no pressure.',
  },
];

const team = [];

const milestones = [
  { year: '2020', event: 'Smply Capital founded with a mission to make commercial lending simple and transparent.' },
  { year: '2021', event: 'Established lending partner network. Closed first SBA and commercial real estate transactions.' },
  { year: '2022', event: 'Expanded to bridge, DSCR, and business acquisition programs. Network grew to 40+ lenders.' },
  { year: '2023', event: 'Surpassed 70+ active lending partners. Added construction and hard money programs.' },
  { year: '2024', event: 'Achieved $20M max deal size. Now serving clients across all 50 states.' },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Smply Capital — Commercial Loan Broker</title>
        <meta
          name="description"
          content="Learn about Smply Capital — a commercial loan broker connecting businesses and investors with 70+ lending partners. $0 upfront fees, term sheets in 24 hours."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <NavBar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="container-custom relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="section-subheading text-xs">Our Story</span>
            </div>
            <h1 className="section-heading text-white mb-6">
              Commercial Lending
              <br />
              <span className="text-gradient-gold">Made Simple</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              Smply Capital was founded on one idea: borrowers deserve access to the full
              market — not just one lender's menu. We built a better way to find commercial
              financing.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatStrip />

      {/* Mission Section */}
      <section className="py-24 bg-navy-950">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-subheading">Our Mission</span>
              <h2 className="section-heading text-white mt-3 mb-6">
                One Application.
                <br />
                <span className="text-gradient-gold">Maximum Competition.</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                Getting a commercial loan the traditional way means walking into one bank,
                accepting their one set of terms, and hoping it works. We built Smply Capital
                to change that.
              </p>
              <p className="text-white/50 leading-relaxed mb-8">
                When you submit a scenario to us, we take it to our entire network of 70+ lending
                partners simultaneously. Banks, credit unions, SBA lenders, private lenders, and
                specialty finance companies — all competing for your business. You get the best
                rate available. We charge you nothing upfront, ever.
              </p>
              <Link href="/get-started" className="btn-primary">
                Get Started
                <RiArrowRightLine className="w-4 h-4" />
              </Link>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="why-us">
              {values.map((v) => (
                <div key={v.title} className="card-dark hover:border-gold/25 transition-colors duration-300">
                  <div className="w-5 h-0.5 bg-gold mb-4" />
                  <h3 className="text-white font-semibold text-sm mb-2">{v.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-navy-900">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-subheading">Our Journey</span>
            <h2 className="section-heading text-white mt-3">
              How We <span className="text-gradient-gold">Got Here</span>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-16 top-0 bottom-0 w-px bg-gold/20" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-8 items-start">
                  <div className="flex-shrink-0 w-32 text-right">
                    <span className="text-gold font-display font-bold text-lg">{m.year}</span>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="w-3 h-3 rounded-full border-2 border-gold bg-navy-900 mt-1.5 -ml-1.5" />
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-white/60 text-sm leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Why Simply Capital Checklist */}
      <section className="py-16 bg-navy-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-subheading">Why Simply Capital</span>
              <h2 className="font-display text-3xl font-bold text-white mt-3 mb-8">
                The Smply Capital<br />
                <span className="text-gradient-gold">Advantage</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  '$0 upfront fees, always',
                  '70+ competing lenders',
                  'Term sheets in 24 hours',
                  'SBA, CRE, bridge, DSCR & more',
                  'Dedicated loan advisor',
                  'Nationwide coverage',
                  'No income docs on DSCR',
                  'Up to $20M deal size',
                  'Transparent, no hidden fees',
                  'We work for you, not the bank',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <RiCheckLine className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="text-white/60 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-dark p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gold rounded-sm flex items-center justify-center">
                <span className="font-display font-bold text-navy-900 text-3xl">S</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Ready to Partner?
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Submit your scenario today and see competing offers from
                70+ lenders — at no cost to you.
              </p>
              <Link href="/get-started" className="btn-primary w-full justify-center">
                Get Started
              </Link>
              <p className="text-white/25 text-xs mt-4">No obligation. No credit pull.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
