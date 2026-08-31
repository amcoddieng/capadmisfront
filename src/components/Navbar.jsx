import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Home, Info, FileText, CreditCard, Star,
  Mail, BarChart3, ArrowRight, Quote, HelpCircle, BookOpen,
} from 'lucide-react';
import { getStartPath } from '../api/auth';
import logoNavbar from '../assets/les images du site/logo-navbar-dark - Copie.png';

const navLinks = [
  { label: 'Accueil', path: '/', icon: Home },
  // { label: 'À propos', path: '/a-propos', icon: Info },
  { label: 'Procédure', path: '/procedure', icon: FileText },
  { label: 'Tarifs', path: '/tarifs', icon: CreditCard },
  { label: 'Pourquoi', path: '/pourquoi', icon: Star },
  // { label: 'Témoignages', path: '/temoignages', icon: Quote },
  // { label: 'FAQ', path: '/faq', icon: HelpCircle },
  { label: 'Blog', path: '/blog', icon: BookOpen },
  { label: 'Contact', path: '/contact', icon: Mail },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <img src={logoNavbar} alt="Capadmis" style={{ height: 36, width: 'auto', display: 'block' }} />
        </Link>

        <nav>
          <ul className="navbar__nav">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`navbar__nav-link${location.pathname === link.path ? ' navbar__nav-link--active' : ''}`}
                  >
                    <Icon size={14} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="navbar__actions">
          <Link to="/analyse" className="btn btn--outline-sm navbar__cta-compact">
            <BarChart3 size={14} />
            <span>Analyse</span>
          </Link>
          <Link to={getStartPath()} className="btn btn--primary-sm navbar__cta-compact">
            <span>Commencer</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <button className="navbar__toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="navbar__mobile">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`navbar__mobile-link${location.pathname === link.path ? ' navbar__mobile-link--active' : ''}`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="navbar__mobile-ctas">
            <Link to="/analyse" onClick={() => setOpen(false)} className="navbar__mobile-cta navbar__mobile-cta--outline">
              <BarChart3 size={14} /> Analyser mes chances
            </Link>
            <Link to="/inscription" onClick={() => setOpen(false)} className="navbar__mobile-cta navbar__mobile-cta--filled">
              Commencer ma procédure <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
