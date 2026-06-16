import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'À propos', path: '/a-propos' },
  { label: 'Procédure', path: '/procedure' },
  { label: 'Tarifs', path: '/tarifs' },
  { label: 'Pourquoi Capadmis.', path: '/pourquoi' },
  { label: 'Témoignages', path: '/temoignages' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <GraduationCap size={18} />
          </div>
          <span>Capadmis<span className="navbar__logo-dot">.</span></span>
        </Link>

        <nav>
          <ul className="navbar__nav">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`navbar__nav-link${location.pathname === link.path ? ' navbar__nav-link--active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <Link to="/analyse" className="btn btn--outline-sm">Analyser mes chances</Link>
          <Link to="/inscription" className="btn btn--primary-sm">Commencer</Link>
        </div>

        <button className="navbar__toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="navbar__mobile">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`navbar__mobile-link${location.pathname === link.path ? ' navbar__mobile-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="navbar__mobile-ctas">
            <Link to="/analyse" onClick={() => setOpen(false)} className="navbar__mobile-cta navbar__mobile-cta--outline">
              Analyser mes chances
            </Link>
            <Link to="/inscription" onClick={() => setOpen(false)} className="navbar__mobile-cta navbar__mobile-cta--filled">
              Commencer ma procédure
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
