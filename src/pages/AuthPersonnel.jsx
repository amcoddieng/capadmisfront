import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader, AlertCircle, Mail, ArrowRight, Shield, Lock, Eye, EyeOff, CheckCircle, Users, Briefcase, Globe } from 'lucide-react';
import { apiPersonnelLogin, savePersonnelSession } from '../api/auth';
import logoAuth from '../assets/les images du site/logo-horizontal-white-bg - Copie.png';

const personnelSlides = [
  {
    image: 'https://images.unsplash.com/photo-1521737604892-d5ccfc61149f?auto=format&fit=crop&w=1600&q=85',
    eyebrow: 'Espace équipe',
    title: 'Gérez vos dossiers avec précision',
    location: 'Plateforme CapAdmis — Back-office',
    credit: 'Photo libre — Unsplash',
  },
  {
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1600&q=85',
    eyebrow: 'Collaboration',
    title: 'Un outil de suivi pour chaque conseiller',
    location: 'Admission · Visa · Super Admin',
    credit: 'Photo libre — Unsplash',
  },
  {
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=85',
    eyebrow: 'Performance',
    title: 'Pilotez l\'accompagnement de A à Z',
    location: 'Tableau de bord temps réel',
    credit: 'Photo libre — Unsplash',
  },
];

function getRoleRoute(role) {
  const r = (role || '').toLowerCase();
  if (r === 'superadmin')             return '/dashboard/superadmin';
  if (r === 'admin')                  return '/dashboard/admin';
  if (r.includes('admission'))        return '/dashboard/conseiller-admission';
  if (r.includes('visa'))             return '/dashboard/conseiller-visa';
  return '/dashboard/admin';
}

export default function AuthPersonnel() {
  const navigate = useNavigate();
  const [email, setEmail]         = useState('');
  const [mdp, setMdp]             = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((c) => (c + 1) % personnelSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { accessToken, personnel } = await apiPersonnelLogin(email, mdp);
      savePersonnelSession(accessToken, personnel);
      navigate(getRoleRoute(personnel.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--personnel">
      <Helmet>
        <title>Espace équipe — CapAdmis</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* ── Carrousel gauche ── */}
      <div className="auth-carousel">
        {personnelSlides.map((slide, i) => (
          <div key={i} className={`auth-carousel__slide${i === activeSlide ? ' auth-carousel__slide--active' : ''}`}>
            <img src={slide.image} alt={slide.title} className="auth-carousel__image" loading="lazy" />
            <div className="auth-carousel__overlay" />
            <div className="auth-carousel__content">
              <div className="auth-carousel__copy" key={activeSlide}>
                <span className="auth-carousel__eyebrow">
                  <Shield size={14} /> {slide.eyebrow}
                </span>
                <h2>{slide.title}</h2>
                <p><Briefcase size={14} /> {slide.location}</p>
                <div className="auth-carousel__dots">
                  {personnelSlides.map((_, idx) => (
                    <button
                      key={idx}
                      className={`auth-carousel__dot${idx === activeSlide ? ' auth-carousel__dot--active' : ''}`}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <a className="auth-carousel__credit" href="https://unsplash.com" target="_blank" rel="noreferrer noopener">
              {slide.credit}
            </a>
          </div>
        ))}
      </div>

      {/* ── Panneau formulaire droite ── */}
      <div className="auth-panel">
        <div className="auth-wrapper">
          {/* Logo */}
          <div className="auth-logo">
            <Link to="/" className="auth-logo__link">
              <img src={logoAuth} alt="Capadmis" style={{ height: 44, width: 'auto', display: 'block' }} />
            </Link>
          </div>

          <div className="auth-card auth-card--personnel">
            <div className="auth-body">
              <div className="auth-form-header">
                <div className="personnel-shield">
                  <Shield size={26} color="#fff" />
                </div>
                <h1 className="auth-form-title">Espace équipe</h1>
                <p className="auth-form-sub">Accès réservé au personnel CapAdmis</p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {error && (
                  <div className="auth-error auth-error--inline">
                    <AlertCircle size={15} /> {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Email professionnel</label>
                  <div className="auth-input-wrap">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      type="email" required className="form-input auth-input-field"
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="admin@capadmis.com"
                      autoComplete="email" name="email" autoFocus
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mot de passe</label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showPwd ? 'text' : 'password'} required
                      className="form-input auth-input-field auth-input-field--pwd"
                      value={mdp} onChange={e => setMdp(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password" name="password"
                    />
                    <button
                      type="button"
                      className="auth-pwd-toggle"
                      onClick={() => setShowPwd(s => !s)}
                      aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="form-submit personnel-submit" disabled={loading}>
                  {loading ? <Loader size={18} className="auth-spinner" /> : <ArrowRight size={18} />}
                  {loading ? 'Connexion en cours…' : 'Se connecter'}
                </button>
              </form>
            </div>
          </div>

          {/* Trust badges */}
          <div className="auth-trust">
            <span><CheckCircle size={14} /> Données chiffrées</span>
            <span><Shield size={14} /> Accès sécurisé</span>
          </div>

          <p className="auth-footer">
            Accès non autorisé ? <Link to="/contact">Contactez un administrateur</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
