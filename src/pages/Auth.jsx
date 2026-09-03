import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Loader, GraduationCap, MapPin, Shield } from 'lucide-react';
import { apiLogin, apiRegister, apiGetDossier, saveSession } from '../api/auth';
import logoAuth from '../assets/les images du site/logo-horizontal-white-bg - Copie.png';

const authSlides = [
  {
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85',
    title: 'Votre projet d\u2019\u00e9tudes en France commence ici',
    subtitle: 'Paris \u00b7 Lyon \u00b7 Bordeaux \u00b7 Lille',
    credit: 'Photo libre \u2014 Unsplash',
  },
  {
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=85',
    title: 'Rejoignez les universit\u00e9s fran\u00e7aises qui forment l\u2019avenir',
    subtitle: 'La Sorbonne \u00b7 Sciences Po \u00b7 Polytechnique',
    credit: 'Paris \u2014 Unsplash',
  },
  {
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=1600&q=85',
    title: 'De Dakar \u00e0 votre campus fran\u00e7ais',
    subtitle: 'Un accompagnement complet \u00e0 chaque \u00e9tape',
    credit: 'Campus \u2014 Unsplash',
  },
];

const paysOrigine = ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Guinée', 'Cameroun', 'Maroc', 'Burkina Faso', 'Togo', 'Bénin', 'Niger', 'Autre'];

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode]       = useState('login');
  const [showPwd, setShowPwd] = useState(false);
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % authSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', mdp: '', telephone: '', numero_tuteur: '',
    sexe: '', payes: '', ville: '',
    date_de_naissance: '', lieu_de_naissance: '',
  });

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiLogin(form.email, form.mdp);
      const dossier = await apiGetDossier(data.accessToken);
      saveSession(data.accessToken, data.etudiant, dossier.code_dossier);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    try {
      const data = await apiRegister({
        nom:               form.nom,
        prenom:            form.prenom,
        email:             form.email,
        mdp:               form.mdp,
        telephone:         form.telephone,
        numero_tuteur:     form.numero_tuteur,
        sexe:              form.sexe,
        ville:             form.ville,
        payes:             form.payes,
        date_de_naissance: form.date_de_naissance,
        lieu_de_naissance: form.lieu_de_naissance,
      });
      saveSession(data.accessToken, data.etudiant, data.dossier?.code_dossier);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => { setMode(m); setStep(1); setError(''); };

  return (
    <div className="auth-page">
      <Helmet>
        <title>Connexion / Inscription — CapAdmis</title>
        <meta name="description" content="Connectez-vous ou créez votre compte CapAdmis pour démarrer votre procédure d'études à l'étranger." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* ── Carrousel arrière-plan ── */}
      <div className="auth-carousel">
        {authSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`auth-carousel__slide${index === activeSlide ? ' auth-carousel__slide--active' : ''}`}
            aria-hidden={index !== activeSlide}
          >
            <img src={slide.image} alt="" className="auth-carousel__image" />
          </div>
        ))}
        <div className="auth-carousel__overlay" />
        <div className="auth-carousel__content">
          <div key={activeSlide} className="auth-carousel__copy">
            <span className="auth-carousel__eyebrow"><GraduationCap size={18} /> CapAdmis</span>
            <h2>{authSlides[activeSlide].title}</h2>
            <p><MapPin size={16} /> {authSlides[activeSlide].subtitle}</p>
          </div>
          <div className="auth-carousel__dots">
            {authSlides.map((slide, index) => (
              <button
                type="button"
                key={slide.title}
                className={`auth-carousel__dot${index === activeSlide ? ' auth-carousel__dot--active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
          <a
            className="auth-carousel__credit"
            href="https://unsplash.com/license"
            target="_blank"
            rel="noreferrer"
          >
            {authSlides[activeSlide].credit}
          </a>
        </div>
      </div>

      {/* ── Panneau formulaire ── */}
      <div className="auth-panel">
        <div className="auth-wrapper">
          {/* Logo */}
          <div className="auth-logo">
            <Link to="/" className="auth-logo__link" style={{ padding: '0 .5rem' }}>
              <img src={logoAuth} alt="Capadmis" style={{ height: 44, width: 'auto', display: 'block' }} />
            </Link>
          </div>

          {/* Card */}
          <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab auth-tab--${mode === 'login' ? 'active' : 'inactive'}`} onClick={() => switchMode('login')}>
              Connexion
            </button>
            <button className={`auth-tab auth-tab--${mode === 'register' ? 'active' : 'inactive'}`} onClick={() => switchMode('register')}>
              Inscription
            </button>
          </div>

          <div className="auth-body">
            {/* Message d'erreur global */}
            {error && (
              <div className="auth-error">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {/* ── LOGIN ─────────────────────────────────── */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="auth-form">
                <div className="auth-form-header">
                  <h2 className="auth-form-title">Bienvenue !</h2>
                  <p className="auth-form-sub">Connectez-vous à votre espace étudiant</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Adresse email</label>
                  <input
                    required type="email" className="form-input"
                    value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="votre@email.com"
                    autoComplete="email" name="email"
                  />
                </div>

                <div className="form-group">
                  <div className="auth-forgot">
                    <label className="form-label">Mot de passe</label>
                    <Link to="/contact" className="auth-forgot-link">Mot de passe oublié ?</Link>
                  </div>
                  <div className="auth-pwd-field">
                    <input
                      required type={showPwd ? 'text' : 'password'} className="form-input"
                      value={form.mdp} onChange={e => set('mdp', e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password" name="password"
                    />
                    <button type="button" className="auth-pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="form-submit" disabled={loading}>
                  {loading ? <Loader size={16} className="auth-spinner" /> : <ArrowRight size={16} />}
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>

                <p className="form-link-text">
                  Pas encore de compte ?{' '}
                  <button type="button" className="form-link" onClick={() => switchMode('register')}>
                    S'inscrire gratuitement
                  </button>
                </p>
              </form>
            )}

            {/* ── REGISTER ──────────────────────────────── */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="auth-form">
                <div className="auth-form-header">
                  <h2 className="auth-form-title">Créer mon compte</h2>
                  <p className="auth-form-sub">Étape {step} sur 2</p>
                  <div className="auth-steps">
                    <div className={`auth-step-bar auth-step-bar--${step >= 1 ? 'active' : 'pending'}`} />
                    <div className={`auth-step-bar auth-step-bar--${step >= 2 ? 'active' : 'pending'}`} />
                  </div>
                </div>

                {/* ── Étape 1 : identité ── */}
                {step === 1 && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Prénom *</label>
                        <input required className="form-input" value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Aminata" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nom *</label>
                        <input required className="form-input" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Diallo" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input required type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="votre@email.com" autoComplete="email" name="email" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Téléphone *</label>
                      <input
                        required type="tel" className="form-input"
                        value={form.telephone} onChange={e => set('telephone', e.target.value)}
                        placeholder="Ex: +221 77 123 45 67"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Numéro du tuteur</label>
                      <input
                        type="tel" className="form-input"
                        value={form.numero_tuteur} onChange={e => set('numero_tuteur', e.target.value)}
                        placeholder="Ex: +221 77 000 00 00"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sexe *</label>
                      <select required className="form-select" value={form.sexe} onChange={e => set('sexe', e.target.value)}>
                        <option value="">Sélectionner</option>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Pays d'origine *</label>
                        <select required className="form-select" value={form.payes} onChange={e => set('payes', e.target.value)}>
                          <option value="">Sélectionner</option>
                          {paysOrigine.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Ville *</label>
                        <input required className="form-input" value={form.ville} onChange={e => set('ville', e.target.value)} placeholder="Dakar" />
                      </div>
                    </div>

                    <button type="submit" className="form-submit">
                      Continuer <ArrowRight size={16} />
                    </button>
                  </>
                )}

                {/* ── Étape 2 : naissance + mot de passe ── */}
                {step === 2 && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Date de naissance *</label>
                      <input
                        required type="date" className="form-input"
                        value={form.date_de_naissance}
                        onChange={e => set('date_de_naissance', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Lieu de naissance *</label>
                      <input
                        required className="form-input"
                        value={form.lieu_de_naissance}
                        onChange={e => set('lieu_de_naissance', e.target.value)}
                        placeholder="Ex: Dakar"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mot de passe *</label>
                      <div className="auth-pwd-field">
                        <input
                          required type={showPwd ? 'text' : 'password'} className="form-input"
                          value={form.mdp} onChange={e => set('mdp', e.target.value)}
                          placeholder="Minimum 8 caractères"
                          minLength={8}
                          autoComplete="new-password" name="new-password"
                        />
                        <button type="button" className="auth-pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="form-back" onClick={() => setStep(1)}>Retour</button>
                      <button type="submit" className="form-submit" disabled={loading}>
                        {loading ? <Loader size={16} className="auth-spinner" /> : <CheckCircle size={16} />}
                        {loading ? 'Création...' : 'Créer mon compte'}
                      </button>
                    </div>
                  </>
                )}

                <p className="form-link-text">
                  Déjà un compte ?{' '}
                  <button type="button" className="form-link" onClick={() => switchMode('login')}>
                    Se connecter
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="auth-footer">
          En créant un compte, vous acceptez nos{' '}
          <Link to="/confidentialite">CGU</Link> et notre{' '}
          <Link to="/confidentialite">politique de confidentialité</Link>.
        </p>

        <div className="auth-trust">
          <span><Shield size={14} /> Données sécurisées</span>
          <span><CheckCircle size={14} /> Plateforme certifiée</span>
        </div>
        </div>
      </div>
      {location.pathname === '/inscription' && <WhatsAppFloat />}
    </div>
  );
}
