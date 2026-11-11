const NAV_LINKS = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#assistant', label: 'Echo Assistant' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#about', label: 'About' },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a href="/" className="brand" aria-label="Echo Corp home">
          <img src="/echo-corp-logo-white.png" alt="Echo Corp" style={{ height: '40px', width: 'auto' }} />
        </a>
        <nav aria-label="Main">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#contact" className="btn btn-pill">
          Get a quote
        </a>
      </div>
    </header>
  );
}
