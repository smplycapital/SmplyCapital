import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LoanProgramsGrid, { loanPrograms } from '../components/LoanProgramsGrid';
import SubmitScenarioForm from '../components/SubmitScenarioForm';
import { RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

const termDetails = [
  { label: 'Loan Amounts', value: '$150K – $20M' },
  { label: 'LTV', value: 'Up to 90%' },
  { label: 'Programs', value: '8+ Available' },
  { label: 'Lending Partners', value: '70+' },
  { label: 'Upfront Fees', value: '$0' },
  { label: 'Term Sheets', value: '< 24 Hours' },
  { label: 'SBA Programs', value: 'Available' },
  { label: 'Coverage', value: 'Nationwide' },
];

export default function LoanProgramsPage() {
  return (
    <>
      <Head>
        <title>Loan Programs — Smply Capital Commercial Loan Broker</title>
        <meta
          name="description"
          content="Smply Capital brokers SBA loans, commercial real estate, business acquisition, construction, bridge, and DSCR financing through 70+ lending partners. $0 upfront fees."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Loan Programs — Smply Capital" />
        <meta property="og:description" content="SBA, Commercial RE, Business Acquisition, Construction, Bridge, and DSCR financing through 70+ lending partners. $0 upfront fees." />
      </Head>

      <NavBar />

      {/* Page Hero */}
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
              <span className="section-subheading text-xs">Loan Programs</span>
            </div>
            <h1 className="section-heading text-white mb-6">
              Flexible Capital for
              <br />
              <span className="text-gradient-gold">Every Strategy</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
              From SBA business loans to short-term bridge financing, Smply Capital shops
              your scenario across 70+ lending partners to find you the best available terms.
              $0 upfront fees on every program.
            </p>
            <div className="flex flex-wrap gap-3">
              {loanPrograms.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="px-4 py-1.5 border border-white/15 text-white/60 text-xs font-medium hover:border-gold/40 hover:text-gold transition-all duration-200 rounded-sm"
                >
                  {p.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* General Terms Overview */}
      <section className="py-12 bg-navy-900 border-b border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {termDetails.map((t) => (
              <div key={t.label} className="text-center">
                <div className="text-white font-semibold text-sm">{t.value}</div>
                <div className="text-white/35 text-[10px] uppercase tracking-wide mt-1">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Programs Grid — Each program as its own section */}
      <section className="py-24 bg-navy-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="section-subheading">All Programs</span>
            <h2 className="section-heading text-white mt-3">
              What We <span className="text-gradient-gold">Lend On</span>
            </h2>
          </div>

          <div className="space-y-8">
            {loanPrograms.map((program, i) => {
              const Icon = program.icon;
              return (
                <div
                  key={program.id}
                  id={program.id}
                  className="card-dark p-8 grid md:grid-cols-3 gap-8 scroll-mt-24 hover:border-gold/20 transition-colors duration-300"
                >
                  {/* Col 1: Icon + Title */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gold" />
                      </div>
                      <span className="text-white/20 text-sm font-mono">0{i + 1}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">{program.title}</h3>
                    <p className="text-gold/70 text-xs uppercase tracking-wide mb-4">{program.tagline}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{program.description}</p>
                    <div className="mt-6">
                      <div className="text-white/30 text-[10px] uppercase tracking-wide mb-1">Loan Range</div>
                      <div className="text-gold font-display text-xl font-bold">{program.range}</div>
                    </div>
                  </div>

                  {/* Col 2: Highlights */}
                  <div>
                    <h4 className="text-white/50 text-xs uppercase tracking-wide mb-4">Program Highlights</h4>
                    <ul className="space-y-3">
                      {program.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mt-0.5">
                            <RiCheckLine className="w-3 h-3 text-gold" />
                          </span>
                          <span className="text-white/60 text-sm">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Col 3: CTA */}
                  <div className="flex flex-col justify-between">
                    <div className="bg-navy-950/60 border border-white/5 rounded-sm p-5 space-y-3">
                      <h4 className="text-white text-sm font-semibold mb-3">Quick Scenario</h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Upfront Fees', value: '$0' },
                          { label: 'Term Sheet', value: '< 24 Hours' },
                          { label: 'Lending Partners', value: '70+' },
                          { label: 'Coverage', value: 'Nationwide' },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between">
                            <span className="text-white/30 text-xs">{item.label}</span>
                            <span className="text-white text-xs font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/contact-us"
                      className="btn-primary mt-4 text-xs justify-center"
                    >
                      Get Started
                      <RiArrowRightLine className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Submit Form */}
      <section className="py-20 bg-navy-900">
        <div className="container-custom max-w-2xl text-center">
          <span className="section-subheading">Ready to Start?</span>
          <h2 className="section-heading text-white mt-3 mb-4">Submit Your Scenario</h2>
          <p className="text-white/50 mb-10">Term sheet in 24 hours. No obligation.</p>
          <div className="card-dark p-8">
            <SubmitScenarioForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
