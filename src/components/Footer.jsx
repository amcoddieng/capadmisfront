import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';

const navLinks = [
  { label: 'À propos', path: '/a-propos' },
  { label: 'Procédure Campus France', path: '/procedure' },
  { label: 'Tarifs', path: '/tarifs' },
  { label: 'Pourquoi Capadmis.', path: '/pourquoi' },
  { label: 'Témoignages', path: '/temoignages' },
  { label: 'FAQ', path: '/faq' },
];

const services = [
  'Conseil en orientation',
  'Optimisation des candidatures',
  'Suivi digital du dossier',
  'Préparation Campus France',
  'Préparation visa étudiant',
  'Analyse intelligente du profil',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        {/* Brand */}
        <div>
          <Link to="/" className="footer__logo">
            <div className="footer__logo-icon"><GraduationCap size={18} /></div>
            <span>Capadmis<span className="footer__logo-dot">.</span></span>
          </Link>
          <p className="footer__desc">
            La plateforme digitale d'accompagnement pour vos études à l'étranger.
            Choisissez la bonne filière, la bonne université, et suivez votre procédure jusqu'au visa.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link"><span style={{fontSize:'.875rem',fontWeight:600}}>f</span></a>
            <a href="#" className="footer__social-link"><Share2 size={15} /></a>
            <a href="#" className="footer__social-link"><Globe size={15} /></a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="footer__col-title">Navigation</h4>
          <ul className="footer__links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="footer__link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="footer__col-title">Nos services</h4>
          <ul className="footer__links">
            {services.map((s) => (
              <li key={s} className="footer__link" style={{cursor:'default'}}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="footer__col-title">Contact</h4>
          <ul className="footer__contact-list">
            <li className="footer__contact-item">
              <MapPin size={15} className="footer__contact-icon" />
              <span className="footer__contact-text">Dakar, Sénégal</span>
            </li>
            <li className="footer__contact-item">
              <Phone size={15} className="footer__contact-icon" />
              <a href="tel:+221000000000" className="footer__contact-link">+221 00 000 00 00</a>
            </li>
            <li className="footer__contact-item">
              <Mail size={15} className="footer__contact-icon" />
              <a href="mailto:contact@capadmis.com" className="footer__contact-link">contact@capadmis.com</a>
            </li>
          </ul>
          <Link to="/inscription" className="footer__cta-btn">Commencer ma procédure</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Capadmis. Tous droits réservés.</p>
        <div className="footer__bottom-links">
          <a href="#" className="footer__bottom-link">Mentions légales</a>
          <a href="#" className="footer__bottom-link">Confidentialité</a>
          <a href="#" className="footer__bottom-link">CGU</a>
        </div>
      </div>
    </footer>
  );
}
