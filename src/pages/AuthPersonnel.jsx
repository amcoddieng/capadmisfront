import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader, AlertCircle, GraduationCap } from 'lucide-react';
import { apiPersonnelLogin, savePersonnelSession } from '../api/auth';

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
      const { token, personnel } = await apiPersonnelLogin(email, mdp);
      savePersonnelSession(token, personnel);
      navigate(getRoleRoute(personnel.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-logo">
            <GraduationCap size={28} />
          </div>
          <h1 className="auth-title">Espace équipe</h1>
          <p className="auth-sub">Accès réservé au personnel Capadmis.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email professionnel</label>
            <input
              type="email" required className="form-input"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@capadmis.com"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password" required className="form-input"
              value={mdp} onChange={e => setMdp(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="form-submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <Loader size={16} className="auth-spinner" /> : <Lock size={16} />}
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--slate-400)', marginTop: '1.5rem' }}>
          Accès non autorisé ? Contactez un administrateur.
        </p>
      </div>
    </div>
  );
}
