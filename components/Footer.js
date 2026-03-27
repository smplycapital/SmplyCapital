import Link from 'next/link';
import { RiPhoneLine, RiMailLine, RiMapPinLine, RiLinkedinFill, RiInstagramLine, RiTwitterXLine } from 'react-icons/ri';

const footerLinks = {
  'Loan Programs': [
    { label: 'Bridge Loans', href: '/loan-programs#bridge' },
    { label: 'Fix & Flip', href: '/loan-programs#fix-flip' },
    { label: 'New Construction', href: '/loan-programs#construction' },
    { label: 'DSCR / Rental', href: '/loan-programs#dscr' },
    { label: 'Ground-Up Development', href: '/loan-programs#ground-up' },
    { label: 'Multifamily', href: '/loan-programs#multifamily' },
  ],
  'Tools': [
    { label: 'Deal Analyzer', href: '/deal-analyzer' },
    { label: 'Get Started', href: '/get-started' },
    { label: 'Pre-Qualification', href: '/#prequal' },
  ],
  'Company': [
    { label: 'About Simply Capital', href: '/about' },
    { label: 'Our Team', href: '/about#team' },
    { label: 'Why Us', href: '/about#why-us' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Submit a Scenario', href: '/contact-us#scenario' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 border-t border-white/5">
      {/* Top CTA Banner */}
      <div className="bg-gold py-6">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-navy-900 font-bold text-xl">Ready to move on your deal?</p>
            <p className="text-navy-900/60 text-sm">We provide term sheets within 24 hours.</p>
          </div>
          <Link href="/get-started" className="bg-navy-900 text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-navy-800 transition-colors duration-200 flex-shrink-0">
            Get Started →
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gold rounded-sm flex items-center justify-center">
                <span className="font-display font-bold text-navy-900 text-lg">S</span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg">Simply Capital</div>
                <div className="text-gold text-[10px] tracking-[0.2em] uppercase">Private Lending</div>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Direct private lender providing fast, flexible real estate financing
              for investors across the nation. Bridge, fix-and-flip, construction,
              DSCR, and more.
            </p>
            <div className="space-y-2.5">
              <a
                href="tel:+15163972280"
                className="flex items-center gap-3 text-white/40 hover:text-gold transition-colors text-sm"
              >
                <RiPhoneLine className="w-4 h-4 flex-shrink-0" />
                (516) 397-2280
              </a>
              <a
                href="mailto:info@smplycapital.com"
                className="flex items-center gap-3 text-white/40 hover:text-gold transition-colors text-sm"
              >
                <RiMailLine className="w-4 h-4 flex-shrink-0" />
                info@smplycapital.com
              </a>
              <div className="flex items-start gap-3 text-white/40 text-sm">
                <RiMapPinLine className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Lending Nationwide · Based in the United States</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: RiLinkedinFill, href: '#', label: 'LinkedIn' },
                { icon: RiInstagramLine, href: '#', label: 'Instagram' },
                { icon: RiTwitterXLine, href: '#', label: 'Twitter/X' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-white/10 rounded-sm flex items-center justify-center text-white/40 hover:border-gold/40 hover:text-gold transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-5">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-gold transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-5">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {year} Simply Capital. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'NMLS Disclosure'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-white/25 hover:text-white/50 transition-colors text-xs"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-navy-900/50 py-4">
        <div className="container-custom">
          <p className="text-white/20 text-[10px] leading-relaxed text-center">
            Smply Capital LLC is a commercial loan broker, not a direct lender. All financing subject to underwriting approval by the funding lender.
            Rates and terms may vary based on borrower qualifications and market conditions. This is not a commitment to lend. Equal Housing Lender.
          </p>
        </div>
      </div>
    </footer>
  );
}
