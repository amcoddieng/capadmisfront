import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, ArrowRight, AlertCircle, Loader, ShieldCheck } from 'lucide-react';
import { apiPersonnelLogin, savePersonnelSession } from '../api/auth';

const ROLE_ROUTES = {
  admin:                '/dashboard-admin',
  superadmin:           '/dashboard-superadmin',
  conseiller_admission: '/dashboard-conseiller-admission',
  conseiller_visa:      '/dashboard-conseiller-visa',
};

export default function AuthPersonnel() {
  const navigate          = useNavigate();
  const [email, setEmail] = useState('');
  const [mdp, setMdp]     = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiPersonnelLogin(email, mdp);
      console.log('[AuthPersonnel] Réponse API:', data);
      const personnel = data.personnel;
      if (!personnel) throw new Error('Réponse inattendue du serveur (personnel manquant)');
      const route = ROLE_ROUTES[personnel.role];
      if (!route) throw new Error(`Rôle non reconnu : "${personnel.role}"`);
      savePersonnelSession(data.token, personnel);
      navigate(route);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-logo">
          <Link to="/" className="auth-logo__link">
            <div className="auth-logo__icon">
              <GraduationCap size={22} color="white" />
            </div>
            Capadmis<span className="auth-logo__dot">.</span>
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-card__personnel-badge">
            <ShieldCheck size={16} />
            Espace personnel
          </div>

          <div className="auth-body">
            {error && (
              <div className="auth-error">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-form-header">
                <h2 className="auth-form-title">Connexion</h2>
                <p className="auth-form-sub">Réservé au personnel Capadmis</p>
              </div>

              <div className="form-group">
                <label className="form-label">Adresse email</label>
                <input
                  required type="email" className="form-input"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@capadmis.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <div className="auth-pwd-field">
                  <input
                    required type={showPwd ? 'text' : 'password'} className="form-input"
                    value={mdp} onChange={e => setMdp(e.target.value)}
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
            </form>
          </div>
        </div>

        <p className="auth-footer" style={{ textAlign: 'center' }}>
          Accès étudiant ?{' '}
          <Link to="/connexion" style={{ color: 'var(--blue-600)', textDecoration: 'none', fontWeight: 500 }}>
            Espace étudiant
          </Link>
        </p>
      </div>
    </div>
  );
}
