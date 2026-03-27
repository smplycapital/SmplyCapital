import Head from 'next/head';
import NavBar from '../components/NavBar';
import QualificationFunnel from '../components/QualificationFunnel';
import Footer from '../components/Footer';

export default function GetStartedPage() {
  return (
    <>
      <Head>
        <title>Get Started — Simply Capital Private Lending</title>
        <meta
          name="description"
          content="Find out which loan program fits your deal in under 2 minutes. Pre-qualify instantly with Simply Capital."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <NavBar />

      <section className="pt-28 pb-24 bg-navy-950 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="container-custom relative">
          <QualificationFunnel />
        </div>
      </section>

      <Footer />
    </>
  );
}
