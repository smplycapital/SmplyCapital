import Head from 'next/head';
import NavBar from '../components/NavBar';
import DealAnalyzer from '../components/DealAnalyzer';
import Footer from '../components/Footer';

export default function DealAnalyzerPage() {
  return (
    <>
      <Head>
        <title>Deal Analyzer — Simply Capital Private Lending</title>
        <meta
          name="description"
          content="Instantly analyze your real estate deal. Get estimated loan terms, rates, and qualification results — free, no signup required."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <NavBar />

      <section className="pt-28 pb-24 bg-navy-950 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="container-custom relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="section-subheading text-xs">Free Tool</span>
          </div>
          <h1 className="section-heading text-white mb-4">
            Deal <span className="text-gradient-gold">Analyzer</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mb-12 leading-relaxed">
            Input your deal details and instantly see estimated loan terms, rates,
            and monthly payments. No signup required.
          </p>

          <DealAnalyzer />
        </div>
      </section>

      <Footer />
    </>
  );
}
