const FOOTER_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#assistant', label: 'Echo Assistant' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <a href="/" className="brand" aria-label="Echo Corp home">
            <img src="/echo-corp-logo-white.png" alt="Echo Corp" style={{ height: '40px', width: 'auto' }} />
          </a>
          <p className="footer-copy footer-copy-line">
            © 2026 Echo Corp (Pty) Ltd · Johannesburg
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer-links">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
