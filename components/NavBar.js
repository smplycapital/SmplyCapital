import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiMenuLine, RiCloseLine, RiArrowDownSLine, RiPhoneLine } from 'react-icons/ri';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Loan Programs',
    href: '/loan-programs',
    children: [
      { label: 'Bridge Loans', href: '/loan-programs#bridge' },
      { label: 'Fix & Flip', href: '/loan-programs#fix-flip' },
      { label: 'New Construction', href: '/loan-programs#construction' },
      { label: 'DSCR / Rental', href: '/loan-programs#dscr' },
      { label: 'Ground-Up Development', href: '/loan-programs#ground-up' },
      { label: 'Multifamily', href: '/loan-programs#multifamily' },
    ],
  },
  { label: 'Deal Analyzer', href: '/deal-analyzer' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact-us' },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [router.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/');

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-navy-950/95 backdrop-blur-md shadow-2xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gold rounded-sm flex items-center justify-center group-hover:bg-gold-400 transition-colors duration-200">
                  <span className="font-display font-bold text-navy-900 text-lg leading-none">S</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-gold/60 group-hover:border-gold transition-colors duration-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-lg leading-tight tracking-tight">
                  Simply Capital
                </span>
                <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-medium leading-tight">
                  Private Lending
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-sm ${
                      isActive(link.href)
                        ? 'text-gold'
                        : 'text-white/80 hover:text-gold'
                    }`}
                  >
                    {link.label}
                    {link.children && (
                      <RiArrowDownSLine
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {link.children && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-navy-900 border border-white/10 rounded-sm shadow-2xl py-2 animate-fade-in">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-5 py-2.5 text-sm text-white/70 hover:text-gold hover:bg-white/5 transition-all duration-150"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-4">
              <a
                href="tel:+18005551234"
                className="hidden md:flex items-center gap-2 text-white/70 hover:text-gold transition-colors duration-200 text-sm"
              >
                <RiPhoneLine className="w-4 h-4" />
                <span className="font-medium">(800) 555-1234</span>
              </a>
              <Link href="/get-started" className="hidden lg:inline-flex btn-primary text-xs py-2.5 px-5">
                Get Started
              </Link>
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:text-gold transition-colors duration-200"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <RiCloseLine className="w-6 h-6" /> : <RiMenuLine className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-full bg-navy-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <div className="w-8 h-8 bg-gold rounded-sm flex items-center justify-center">
                <span className="font-display font-bold text-navy-900 text-base">S</span>
              </div>
              <span className="font-display font-bold text-white">Simply Capital</span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <RiCloseLine className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="flex-1 overflow-y-auto py-6">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between px-6 py-3.5 text-sm font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-gold bg-gold/5'
                      : 'text-white/80 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="bg-navy-950/50">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex items-center pl-10 pr-6 py-2.5 text-xs text-white/50 hover:text-gold hover:bg-white/5 transition-all duration-150"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mr-3 flex-shrink-0" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-white/10 space-y-3">
            <Link
              href="/get-started"
              className="btn-primary w-full text-center text-xs"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
            <a
              href="tel:+18005551234"
              className="flex items-center justify-center gap-2 text-white/60 hover:text-gold transition-colors text-sm py-2"
            >
              <RiPhoneLine className="w-4 h-4" />
              (800) 555-1234
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
