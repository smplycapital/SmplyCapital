import Head from 'next/head';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import SubmitScenarioForm from '../components/SubmitScenarioForm';
import { RiPhoneLine, RiMailLine, RiMapPinLine, RiTimeLine, RiArrowRightLine } from 'react-icons/ri';

const contactMethods = [
  {
    icon: RiPhoneLine,
    title: 'Call Us',
    value: '(516) 397-2280',
    sub: 'Mon–Fri, 9am–6pm EST',
    href: 'tel:+15163972280',
  },
  {
    icon: RiMailLine,
    title: 'Email Us',
    value: 'info@smplycapital.com',
    sub: 'Response within 1 business day',
    href: 'mailto:info@smplycapital.com',
  },
  {
    icon: RiTimeLine,
    title: 'Term Sheet',
    value: '< 24 Hours',
    sub: 'For all new submissions',
    href: null,
  },
  {
    icon: RiMapPinLine,
    title: 'Coverage',
    value: 'Nationwide',
    sub: '70+ lending partners',
    href: null,
  },
];

const faqs = [
  {
    q: 'What does it cost to work with Smply Capital?',
    a: '$0 upfront — ever. We are compensated by the lender at closing, not by you. There are no application fees, retainers, or consulting fees to explore your options.',
  },
  {
    q: 'How is a broker different from going directly to a bank?',
    a: 'When you go to one bank, you get one set of terms. When you work with us, your deal goes to 70+ lenders simultaneously. More competition means better rates, better terms, and a higher chance of approval.',
  },
  {
    q: 'What loan types do you broker?',
    a: 'SBA 7(a), SBA 504, Commercial Real Estate, Business Acquisition, Construction & Development, Bridge & Hard Money, and DSCR / No-Doc loans up to $20M.',
  },
  {
    q: 'How quickly can I get a term sheet?',
    a: 'Most clients receive preliminary term sheets within 24 hours of submitting a complete scenario. No obligation, no credit pull at this stage.',
  },
  {
    q: 'Do you handle owner-occupied commercial properties?',
    a: 'Yes. We work with both owner-occupied commercial real estate and investment properties. SBA programs are specifically designed for owner-occupied business properties.',
  },
  {
    q: 'What information do I need to get started?',
    a: 'Just the basics: loan purpose, requested amount, property or business details, and a brief overview of your financials. We will guide you through anything else we need.',
  },
];

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us — Smply Capital Commercial Loan Broker</title>
        <meta
          name="description"
          content="Contact Smply Capital to submit a loan scenario. We shop 70+ lenders to find you the best commercial financing terms. $0 upfront fees, term sheets in 24 hours."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <NavBar />

      {/* Page Hero */}
      <section className="pt-32 pb-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="container-custom relative text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="section-subheading text-xs">Get In Touch</span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h1 className="section-heading text-white mb-6">
            Start a
            <span className="text-gradient-gold"> Conversation</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Submit your scenario, ask a question, or just pick up the phone.
            Our team is ready to review your deal and provide clarity fast.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 bg-navy-900 border-b border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((m) => {
              const Icon = m.icon;
              const Wrapper = m.href ? 'a' : 'div';
              const props = m.href ? { href: m.href } : {};
              return (
                <Wrapper
                  key={m.title}
                  {...props}
                  className="card-dark text-center hover:border-gold/30 transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-200">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <div className="text-white/40 text-[10px] uppercase tracking-wide mb-1">{m.title}</div>
                  <div className="text-white font-semibold text-sm">{m.value}</div>
                  <div className="text-white/30 text-xs mt-1">{m.sub}</div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section id="scenario" className="py-24 bg-navy-950 scroll-mt-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Form — wider */}
            <div className="lg:col-span-3">
              <span className="section-subheading">Submit a Scenario</span>
              <h2 className="font-display text-3xl font-bold text-white mt-3 mb-2">Tell Us About Your Deal</h2>
              <p className="text-white/40 text-sm mb-8">
                We&apos;ll review and respond within one business day with preliminary terms.
              </p>
              <div className="card-dark p-8">
                <SubmitScenarioForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Why Contact */}
              <div className="card-dark">
                <h3 className="text-white font-semibold text-sm mb-4">What Happens Next?</h3>
                <ol className="space-y-4">
                  {[
                    { n: '1', t: 'Same-Day Acknowledgment', d: 'We confirm receipt of your scenario.' },
                    { n: '2', t: 'Team Review', d: 'A loan officer reviews your deal details.' },
                    { n: '3', t: '24hr Term Sheet', d: 'Preliminary loan terms, no obligation.' },
                    { n: '4', t: 'Loan Processing', d: 'Appraisal, underwriting, and close.' },
                  ].map((item) => (
                    <li key={item.n} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold">
                        {item.n}
                      </span>
                      <div>
                        <div className="text-white text-xs font-semibold">{item.t}</div>
                        <div className="text-white/40 text-xs mt-0.5">{item.d}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Direct Contact */}
              <div className="card-dark">
                <h3 className="text-white font-semibold text-sm mb-4">Prefer to Call?</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-4">
                  Our loan officers are available Monday through Friday, 8am–6pm EST.
                  We welcome calls about any deal type or size.
                </p>
                <a href="tel:+15163972280" className="btn-primary w-full text-center text-xs justify-center">
                  <RiPhoneLine className="w-3.5 h-3.5" />
                  (516) 397-2280
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-navy-900">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-14">
            <span className="section-subheading">Common Questions</span>
            <h2 className="font-display text-3xl font-bold text-white mt-3">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="card-dark group open:border-gold/20 transition-colors duration-200"
              >
                <summary className="flex items-center justify-between cursor-pointer py-1 list-none">
                  <span className="text-white font-semibold text-sm pr-6">{faq.q}</span>
                  <span className="flex-shrink-0 w-5 h-5 border border-white/20 rounded-sm flex items-center justify-center text-white/40 group-open:border-gold/40 group-open:text-gold transition-all duration-200">
                    <RiArrowRightLine className="w-3 h-3 group-open:rotate-90 transition-transform duration-200" />
                  </span>
                </summary>
                <p className="text-white/50 text-sm leading-relaxed mt-3 pt-3 border-t border-white/5">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
