import Head from 'next/head';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import TickerBar from '../components/TickerBar';
import StatStrip from '../components/StatStrip';
import LoanProgramsGrid from '../components/LoanProgramsGrid';
import CTASection from '../components/CTASection';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import Footer from '../components/Footer';
import SubmitScenarioForm from '../components/SubmitScenarioForm';
import PreQualWidget from '../components/PreQualWidget';

export default function Home() {
  return (
    <>
      <Head>
        <title>Simply Capital — Private Real Estate Lending</title>
        <meta
          name="description"
          content="Simply Capital is a direct private lender providing fast, flexible financing for real estate investors. Bridge loans, fix-and-flip, construction, DSCR, and more. Close in 5-10 days."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Simply Capital — Private Real Estate Lending" />
        <meta property="og:description" content="Fast, flexible private real estate financing for investors. $2B+ funded. Close in 5-10 days." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://simplycapital.com" />
      </Head>

      <NavBar />
      <HeroSection />
      <TickerBar />
      <StatStrip />
      <LoanProgramsGrid limit={6} />
      <CTASection />
      <TestimonialsCarousel />
      <PreQualWidget />

      {/* Submit Scenario Section */}
      <section id="submit-scenario" className="py-24 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gold/4 to-transparent pointer-events-none" />
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="section-subheading">Get Started</span>
              <h2 className="section-heading text-white mt-3 mb-6">
                Submit Your
                <br />
                <span className="text-gradient-gold">Scenario Today</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Tell us about your deal. We&apos;ll review your scenario and provide
                preliminary terms within 24 hours — no obligation, no credit pull.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Same-Day Response', desc: 'We acknowledge every inquiry the same business day.' },
                  { title: 'Term Sheet in 24hrs', desc: 'Preliminary loan terms delivered fast, no strings attached.' },
                  { title: 'Close in 5–10 Days', desc: 'Our record close time is 3 business days. We move quickly.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-1.5 flex-shrink-0 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{item.title}</div>
                      <div className="text-white/40 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-dark p-8">
              <h3 className="font-display text-xl font-bold text-white mb-2">Submit a Scenario</h3>
              <p className="text-white/40 text-sm mb-6">All fields marked * are required.</p>
              <SubmitScenarioForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
