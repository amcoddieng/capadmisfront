import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader, AlertCircle } from 'lucide-react';
import { getPersonnelSession, clearPersonnelSession, apiLogout, apiGetDashboardAdmin } from '../api/auth';
import logoHeader from '../assets/les images du site/logo-horizontal-2x.png';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const CHART_COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6'];

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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const s = getPersonnelSession();
    if (!s.token || !s.personnel) {
      navigate('/personnel');
      return;
    }
    setSession(s);

    let mounted = true;
    apiGetDashboardAdmin(s.token).then(data => {
      if (mounted) setStats(data);
    }).catch(e => {
      if (mounted) setError(e.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [navigate]);

  const handleLogout = async () => {
    try { await apiLogout(); } catch (_) {}
    clearPersonnelSession();
    navigate('/personnel');
  };

  const statCard = (label, value, color = 'blue') => (
    <div style={{
      background: '#fff', borderRadius: '.5rem', border: '1px solid #e2e8f0',
      borderTop: `3px solid var(--${color}-600, #2563eb)`,
      padding: '1.25rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{value}</div>
      <div style={{ fontSize: '.8rem', color: '#64748b', marginTop: '.25rem' }}>{label}</div>
    </div>
  );

  const listBlock = (title, items, keyField, countField) => (
    <div style={{ background: '#fff', borderRadius: '.5rem', border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 .75rem', fontSize: '.9rem', color: '#1e293b' }}>{title}</h4>
      {items?.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '.8rem' }}>Aucune donnée</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '.35rem' }}>
          {items?.map(item => (
            <li key={item[keyField]} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: '#475569' }}>
              <span>{item[keyField]}</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{item[countField]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (!session) return null;
  const { personnel } = session;
  const roleLabel = getRoleLabel(personnel.role);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Topbar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoHeader} alt="Capadmis" style={{ height: 28, width: 'auto', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '.875rem', color: '#475569' }}>
            {personnel.prenom} {personnel.nom}
            <span style={{ marginLeft: '.4rem', fontSize: '.75rem', color: '#94a3b8' }}>
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
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', padding: '.375rem 1rem', borderRadius: '2rem',
            background: '#f5f0e4', color: '#0c1c3f', fontSize: '.8rem', fontWeight: 700,
            letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '1.25rem',
          }}>
            {roleLabel}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>
            Dashboard
          </h1>

          {loading && (
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', color: '#94a3b8', padding: '2rem 0' }}>
              <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Chargement…
            </div>
          )}
          {error && (
            <p style={{ color: '#dc2626', fontSize: '.875rem' }}><AlertCircle size={14} /> {error}</p>
          )}

          {!loading && !error && stats && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {statCard('Étudiants', stats?.totalEtudiants ?? 0, 'blue')}
                {statCard('Dossiers', stats?.totalDossiers ?? 0, 'indigo')}
                {statCard('Personnel', stats?.totalPersonnel ?? 0, 'amber')}
                {statCard('Dossiers univ.', stats?.totalDossiersUniversite ?? 0, 'violet')}
                {statCard('Messages non lus', stats?.totalMessagesNonLus ?? 0, 'green')}
                {statCard('Notifications', stats?.totalNotificationsNonLues ?? 0, 'orange')}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                {/* BarChart — Dossiers par statut général */}
                <div style={{ background: '#fff', borderRadius: '.5rem', border: '1px solid #e2e8f0', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 .75rem', fontSize: '.9rem', color: '#1e293b' }}>Dossiers par statut général</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats?.dossiersParStatus || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="status" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" name="Dossiers" radius={[4, 4, 0, 0]}>
                        {(stats?.dossiersParStatus || []).map((_, i) => (
                          <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* PieChart — Personnel par rôle */}
                <div style={{ background: '#fff', borderRadius: '.5rem', border: '1px solid #e2e8f0', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 .75rem', fontSize: '.9rem', color: '#1e293b' }}>Personnel par rôle</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={stats?.personnelParRole || []}
                        dataKey="count"
                        nameKey="role"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ role, count }) => `${role}: ${count}`}
                        labelLine={false}
                      >
                        {(stats?.personnelParRole || []).map((_, i) => (
                          <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* BarChart — Dossiers par statut admission */}
                <div style={{ background: '#fff', borderRadius: '.5rem', border: '1px solid #e2e8f0', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 .75rem', fontSize: '.9rem', color: '#1e293b' }}>Dossiers par statut admission</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats?.dossiersParStatusAdmission || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="status" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" name="Dossiers" radius={[4, 4, 0, 0]}>
                        {(stats?.dossiersParStatusAdmission || []).map((_, i) => (
                          <Cell key={`cell-${i}`} fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* PieChart — Dossiers par statut visa */}
                <div style={{ background: '#fff', borderRadius: '.5rem', border: '1px solid #e2e8f0', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 .75rem', fontSize: '.9rem', color: '#1e293b' }}>Dossiers par statut visa</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={stats?.dossiersParStatusVisa || []}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ status, count }) => `${status}: ${count}`}
                        labelLine={false}
                      >
                        {(stats?.dossiersParStatusVisa || []).map((_, i) => (
                          <Cell key={`cell-${i}`} fill={CHART_COLORS[(i + 4) % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
