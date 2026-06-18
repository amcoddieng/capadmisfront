import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { getPersonnelSession, clearPersonnelSession, apiLogout } from '../api/auth';
import logoHeader from '../assets/les images du site/logo-horizontal-2x.png';

const ROLE_LABELS = {
  admin:                'Administrateur',
  superadmin:           'Super Administrateur',
  conseiller_admission: 'Conseiller Admission',
  conseiller_visa:      'Conseiller Visa',
};

function getRoleLabel(role) {
  const r = (role || '').toLowerCase();
  return ROLE_LABELS[r]
    ?? (r.includes('admission') ? 'Conseiller Admission'
      : r.includes('visa')     ? 'Conseiller Visa'
      : role);
}

export default function DashboardPersonnel() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const s = getPersonnelSession();
    if (!s.token || !s.personnel) {
      navigate('/personnel');
      return;
    }
    setSession(s);
  }, [navigate]);

  const handleLogout = async () => {
    try { await apiLogout(); } catch (_) {}
    clearPersonnelSession();
    navigate('/personnel');
  };

  if (!session) return null;

  const { personnel } = session;
  const roleLabel = getRoleLabel(personnel.role);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--slate-50, #f8fafc)' }}>
      {/* Topbar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
        background: '#fff', borderBottom: '1px solid var(--slate-200, #e2e8f0)',
        boxShadow: '0 1px 4px rgba(0,0,0,.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoHeader} alt="Capadmis" style={{ height: 28, width: 'auto', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '.875rem', color: 'var(--slate-600, #475569)' }}>
            {personnel.prenom} {personnel.nom}
            <span style={{ marginLeft: '.4rem', fontSize: '.75rem', color: 'var(--slate-400, #94a3b8)' }}>
              ({personnel.code})
            </span>
          </span>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '.375rem',
              padding: '.375rem .75rem', border: 'none', borderRadius: '.5rem',
              background: '#fef2f2', color: '#b91c1c', fontSize: '.8rem',
              cursor: 'pointer', fontWeight: 600,
            }}
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </header>

      {/* Corps */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', padding: '.375rem 1rem', borderRadius: '2rem',
            background: '#f5f0e4', color: '#0c1c3f', fontSize: '.8rem', fontWeight: 700,
            letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '1.25rem',
          }}>
            {roleLabel}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--slate-800, #1e293b)', marginBottom: '.5rem' }}>
            Bienvenue, {personnel.prenom} !
          </h1>
          <p style={{ color: 'var(--slate-400, #94a3b8)', fontSize: '1rem' }}>
            Cette section est en cours de développement.
          </p>
        </div>
      </main>
    </div>
  );
}
