import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';
import { getStartPath } from '../api/auth';
import logoFooter from '../assets/les images du site/logo-horizontal-2x.png';

const navLinks = [
  { label: 'À propos', path: '/a-propos' },
  { label: 'Procédure Campus France', path: '/procedure' },
  { label: 'Tarifs', path: '/tarifs' },
  { label: 'Pourquoi CapAdmis.', path: '/pourquoi' },
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
          <Link to="/" className="footer__logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoFooter} alt="Capadmis" style={{ height: 32, width: 'auto', display: 'block' }} />
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
              <span className="footer__contact-text">Ouest Foire Cote marche serigne fallou - Dakar, Sénégal</span>
            </li>
            <li className="footer__contact-item">
              <Phone size={15} className="footer__contact-icon" />
              <a href="tel:+221000000000" className="footer__contact-link">+221 76 317 17 86</a>
            </li>
            <li className="footer__contact-item">
              <Mail size={15} className="footer__contact-icon" />
              <a href="mailto:contact@capadmis.com" className="footer__contact-link">contact@capadmis.com</a>
            </li>
            <li>
              {/* mettre un sticker haha */}
              le mode ne dort pas, nous non plus 🤩
              <br />
              <span style={{fontSize:'0.8rem', color:'#666'}}>Disponible 24h/24 - 7j/7</span>
            </li>
          </ul>
          <Link to={getStartPath()} className="footer__cta-btn">Commencer ma procédure</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} capAdmis. Tous droits réservés.</p>
        <div className="footer__bottom-links">
          <a href="#" className="footer__bottom-link">Mentions légales</a>
          <a href="#" className="footer__bottom-link">Confidentialité</a>
          <a href="#" className="footer__bottom-link">CGU</a>
        </div>
      </div>
    </footer>
  );
}
