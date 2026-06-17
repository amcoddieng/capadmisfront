import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { apiLogin, apiRegister, apiGetDossier, saveSession } from '../api/auth';
import logoAuth from '../assets/les images du site/logo-horizontal-white-bg - Copie.png';

const paysOrigine = ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Guinée', 'Cameroun', 'Maroc', 'Burkina Faso', 'Togo', 'Bénin', 'Niger', 'Autre'];

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode]       = useState('login');
  const [showPwd, setShowPwd] = useState(false);
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', mdp: '',
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
      const dossier = await apiGetDossier(data.token);
      saveSession(data.token, data.etudiant, dossier.code_dossier);
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
        sexe:              form.sexe,
        ville:             form.ville,
        payes:             form.payes,
        date_de_naissance: form.date_de_naissance,
        lieu_de_naissance: form.lieu_de_naissance,
      });
      saveSession(data.token, data.etudiant, data.dossier?.code_dossier);
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
      <div className="auth-wrapper">
        {/* Logo */}
        <div className="auth-logo">
          <Link to="/" className="auth-logo__link" style={{ padding: '0 .5rem' }}>
            <img src={logoAuth} alt="Capadmis" style={{ height: 44, width: 'auto', display: 'block', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.3))' }} />
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
                  />
                </div>

                <div className="form-group">
                  <div className="auth-forgot">
                    <label className="form-label">Mot de passe</label>
                    <a href="#" className="auth-forgot-link">Mot de passe oublié ?</a>
                  </div>
                  <div className="auth-pwd-field">
                    <input
                      required type={showPwd ? 'text' : 'password'} className="form-input"
                      value={form.mdp} onChange={e => set('mdp', e.target.value)}
                      placeholder="••••••••"
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
                      <input required type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="votre@email.com" />
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
          <a href="#">CGU</a> et notre{' '}
          <a href="#">politique de confidentialité</a>.
        </p>
      </div>
    </div>
  );
}
