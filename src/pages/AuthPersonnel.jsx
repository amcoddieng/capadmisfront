import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, Mail, ArrowRight, Shield, Lock } from 'lucide-react';
import { apiPersonnelLogin, savePersonnelSession } from '../api/auth';
import logoAuth from '../assets/les images du site/logo-horizontal-white-bg - Copie.png';

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
  const [email, setEmail]     = useState('');
  const [mdp, setMdp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

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
    <div className="auth-page" style={{ position: 'relative', overflow: 'hidden' }}>

      <div className="auth-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__link" style={{ padding: '0 .5rem' }}>
            <img src={logoAuth} alt="Capadmis" style={{ height: 44, width: 'auto', display: 'block', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.3))' }} />
          </div>
        </div>

        <div className="auth-card" style={{ borderRadius: '1.25rem', boxShadow: '0 25px 80px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.05)' }}>
          <div className="auth-body">
            <div className="auth-form-header">
              <div style={{ width: 56, height: 56, borderRadius: '1rem', background: '#c5a150', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(197,161,80,.3)' }}>
                <Shield size={26} color="#fff" />
              </div>
              <h1 className="auth-form-title" style={{ fontSize: '1.35rem' }}>Espace équipe</h1>
              <p className="auth-form-sub">Accès réservé au personnel Capadmis</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="auth-error" style={{ margin: '0 0 .5rem' }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Email professionnel</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none' }} />
                  <input
                    type="email" required className="form-input"
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@capadmis.com"
                    autoFocus
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none' }} />
                  <input
                    type="password" required className="form-input"
                    value={mdp} onChange={e => setMdp(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="form-submit"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginTop: '.25rem', padding: '.75rem', fontSize: '.95rem', gap: '.5rem' }}
              >
                {loading ? <Loader size={18} className="auth-spinner" /> : <ArrowRight size={18} />}
                {loading ? 'Connexion en cours…' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>

        <p className="auth-footer">
          Accès non autorisé ? <a href="/contact" style={{ color: 'rgba(239,227,203,.8)' }}>Contactez un administrateur</a>
        </p>
      </div>
    </div>
  );
}
