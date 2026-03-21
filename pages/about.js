import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import StatStrip from '../components/StatStrip';
import { RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

const values = [
  {
    title: 'Speed Without Compromise',
    desc: 'Every day matters in real estate. We built our process around fast decisions and faster funding — without cutting corners on diligence.',
  },
  {
    title: 'Direct Lending',
    desc: 'We are the bank. No brokers, no committees, no middlemen. Your loan officer has authority to make decisions.',
  },
  {
    title: 'Investor-First Mindset',
    desc: 'Our team is made up of investors and former real estate operators. We understand your deal because we\'ve been in your shoes.',
  },
  {
    title: 'Transparent Terms',
    desc: 'No surprises at closing. What we quote is what you get. Our term sheets reflect actual loan terms, not teaser rates.',
  },
];

const team = [
  {
    name: 'James Thornton',
    title: 'CEO & Co-Founder',
    bio: '15+ years in real estate finance. Former VP at a national private equity firm before co-founding Simply Capital.',
  },
  {
    name: 'Allison Reed',
    title: 'Chief Credit Officer',
    bio: 'Underwritten $1B+ in commercial and residential real estate loans. Brings institutional discipline to private lending.',
  },
  {
    name: 'Michael Chen',
    title: 'Head of Capital Markets',
    bio: 'Manages institutional funding relationships ensuring Simply Capital maintains competitive rates and ample loan capacity.',
  },
  {
    name: 'Sarah Nobile',
    title: 'Senior Loan Officer',
    bio: '10 years structuring complex bridge and construction loans. Known for creative deal structuring on challenging transactions.',
  },
];

const milestones = [
  { year: '2015', event: 'Simply Capital founded with focus on bridge lending in the Southeast.' },
  { year: '2017', event: 'Expanded nationally, reaching 15 states and $100M in cumulative originations.' },
  { year: '2019', event: 'Launched DSCR and construction lending programs. Surpassed $500M funded.' },
  { year: '2021', event: 'Secured institutional capital facility, enabling larger loan sizes up to $50M+.' },
  { year: '2023', event: 'Crossed $2B in total originations across 30+ states.' },
  { year: '2024', event: 'Expanded ground-up development lending and multifamily programs nationwide.' },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Simply Capital — Private Real Estate Lending</title>
        <meta
          name="description"
          content="Learn about Simply Capital — a direct private lender founded by investors, for investors. Our mission is to make private capital simple, fast, and transparent."
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
              Capital Built
              <br />
              <span className="text-gradient-gold">By Investors</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              Simply Capital was founded on a simple premise: real estate investors
              deserve a lending partner who moves at the speed of opportunity —
              one that speaks the language of deals.
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
                Making Private Capital
                <br />
                <span className="text-gradient-gold">Simply Accessible</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                We started Simply Capital because we lived the problem. As investors ourselves,
                we knew what it felt like to have the right deal, the right timeline, and the
                wrong lender. Bureaucratic delays. Hidden fees. Loan officers who didn&apos;t
                understand real estate.
              </p>
              <p className="text-white/50 leading-relaxed mb-8">
                So we built the lender we wished existed — one that operates with urgency,
                communicates clearly, and genuinely cares whether your deal closes.
              </p>
              <Link href="/contact-us" className="btn-primary">
                Work With Us
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
              A Decade of <span className="text-gradient-gold">Execution</span>
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

      {/* Team Section */}
      <section id="team" className="py-24 bg-navy-950 scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-subheading">The Team</span>
            <h2 className="section-heading text-white mt-3">
              Led by <span className="text-gradient-gold">Experienced Practitioners</span>
            </h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto mt-4">
              Our team brings decades of combined experience in real estate, lending,
              and capital markets — and we&apos;re all investors too.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member) => (
              <div
                key={member.name}
                className="card-dark text-center hover:border-gold/25 transition-colors duration-300 group"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-200">
                  <span className="font-display text-gold text-2xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm">{member.name}</h3>
                <p className="text-gold/70 text-[10px] uppercase tracking-wide mt-1 mb-3">{member.title}</p>
                <p className="text-white/40 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
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
                The Unfair Advantage<br />
                <span className="text-gradient-gold">for Your Portfolio</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Direct lender, not a broker',
                  'Term sheets in 24 hours',
                  'Close in 5–10 days',
                  'No income verification',
                  'Asset-based underwriting',
                  'No prepayment on most programs',
                  'Dedicated loan officer',
                  'Competitive institutional pricing',
                  'Up to 90% LTV/LTC',
                  '$2B+ funded track record',
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
                Join over 1,500 investors who trust Simply Capital for their
                private lending needs. Submit your first scenario today.
              </p>
              <Link href="/contact-us" className="btn-primary w-full justify-center">
                Start a Conversation
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
