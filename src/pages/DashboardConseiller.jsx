import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, FolderOpen,
  MessageSquare, Bell, ChevronDown, Menu, X,
  Loader, AlertCircle, Eye, Send, School, Award, Globe,
} from 'lucide-react';
import logoHeader from '../assets/les images du site/logo-horizontal-2x.png';
import { getPersonnelSession, clearPersonnelSession, apiLogout, apiGetMesDossiers, apiGetDashboardConseiller } from '../api/auth';
import { useNotifications } from '../hooks/useNotifications';
import NotificationsPanel from '../components/NotificationsPanel';
import { useMessages } from '../hooks/useMessages';
import MessagesPanel from '../components/MessagesPanel';
import DossierDetailConseiller from '../components/DossierDetailConseiller';
import { useMessageModal } from '../context/MessageModalContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const CHART_COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6'];

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'dossiers',      label: 'Mes dossiers',   icon: FolderOpen },
  { id: 'messages',      label: 'Messages',        icon: MessageSquare },
  { id: 'notifications', label: 'Notifications',   icon: Bell },
];

const ROLE_LABELS = {
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

/* ── Pages placeholder ── */
function PageDashboard({ token, personnel, onOpenChat }) {
  const { openMessageModal } = useMessageModal();
  const [stats, setStats] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true); setError('');
    apiGetDashboardConseiller(token).then(data => {
      if (mounted) setStats(data);
    }).catch(e => {
      if (mounted) setError(e.message);
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [token]);

  const roleLabel   = getRoleLabel(personnel.role);

  const TINTS = {
    blue:   { bg: '#eff6ff', fg: '#2563eb' },
    indigo: { bg: '#eef2ff', fg: '#4f46e5' },
    green:  { bg: '#f0fdf4', fg: '#16a34a' },
    orange: { bg: '#fff7ed', fg: '#ea580c' },
  };
  const statCard = (label, value, color = 'blue', Icon) => {
    const tint = TINTS[color] || TINTS.blue;
    return (
      <div className="cons-stat-card" style={{ borderTop: `3px solid var(--${color}-600, #2563eb)` }}>
        {Icon && (
          <span className="cons-stat-card__icon" style={{ background: tint.bg, color: tint.fg }}>
            <Icon size={18}/>
          </span>
        )}
        <span className="cons-stat-card__value">{value}</span>
        <span className="cons-stat-card__label">{label}</span>
      </div>
    );
  };

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

  if (loading) return (
    <div className="cons-page">
      <h2 className="cons-page__title">Dashboard</h2>
      <p className="cons-page__sub">{roleLabel} — {personnel.prenom} {personnel.nom}</p>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', color: '#94a3b8', padding: '2rem 0' }}>
        <Loader size={16} className="auth-spinner"/> Chargement…
      </div>
    </div>
  );

  if (error) return (
    <div className="cons-page">
      <h2 className="cons-page__title">Dashboard</h2>
      <p className="cons-page__sub">{roleLabel} — {personnel.prenom} {personnel.nom}</p>
      <p style={{ color: '#dc2626', fontSize: '.875rem' }}><AlertCircle size={14} /> {error}</p>
    </div>
  );

  return (
    <div className="cons-page">
      <h2 className="cons-page__title">Dashboard</h2>
      <p className="cons-page__sub">{roleLabel} — {personnel.prenom} {personnel.nom}</p>
      <div className="cons-stats">
        {statCard('Dossiers assignés', stats?.totalDossiersAssignes ?? 0, 'blue', FolderOpen)}
        {statCard('Dossiers univ.', stats?.totalDossiersUniversite ?? 0, 'indigo', School)}
        {statCard('Messages non lus', stats?.messagesNonLus ?? 0, 'green', MessageSquare)}
        {statCard('Notifications', stats?.notificationsNonLues ?? 0, 'orange', Bell)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* BarChart — Dossiers par statut général */}
        <div className="cons-chart-card">
          <h4 className="cons-chart-card__title"><FolderOpen size={15} color="#64748b"/> Dossiers par statut général</h4>
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

        {/* PieChart — Dossiers par statut admission */}
        <div className="cons-chart-card">
          <h4 className="cons-chart-card__title"><Award size={15} color="#64748b"/> Dossiers par statut admission</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats?.dossiersParStatusAdmission || []}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ status, count }) => `${status}: ${count}`}
                labelLine={false}
              >
                {(stats?.dossiersParStatusAdmission || []).map((_, i) => (
                  <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BarChart — Dossiers par statut visa */}
        <div className="cons-chart-card">
          <h4 className="cons-chart-card__title"><Globe size={15} color="#64748b"/> Dossiers par statut visa</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.dossiersParStatusVisa || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Dossiers" radius={[4, 4, 0, 0]}>
                {(stats?.dossiersParStatusVisa || []).map((_, i) => (
                  <Cell key={`cell-${i}`} fill={CHART_COLORS[(i + 3) % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PieChart — Dossiers université par statut */}
        <div className="cons-chart-card">
          <h4 className="cons-chart-card__title"><School size={15} color="#64748b"/> Dossiers université par statut</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats?.dossiersUniversiteParStatut || []}
                dataKey="count"
                nameKey="statut"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ statut, count }) => `${statut}: ${count}`}
                labelLine={false}
              >
                {(stats?.dossiersUniversiteParStatut || []).map((_, i) => (
                  <Cell key={`cell-${i}`} fill={CHART_COLORS[(i + 5) % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const STATUS_LABELS = {
  EN_COURS_D_ETUDE:'En cours d\'étude', VALIDE:'Validé', INVALIDE:'Invalide',
  EN_ATTENTE:'En attente', CHANGEMENT_A_APPORTER:'Changement requis',
  ADMISSION_EN_COURS:'Admission en cours', ADMISSION_VALIDE:'Admission validée', ADMISSION_INVALIDE:'Admission invalidée',
  DEMANDE_VISA_EN_COURS:'Visa en cours', DEMANDE_VISA_VALIDE:'Visa validé', DEMANDE_VISA_INVALIDE:'Visa invalidé',
};
function StatusBadge({ value }) {
  if (!value) return <span style={{ color:'#94a3b8' }}>—</span>;
  const green=['VALIDE','ADMISSION_VALIDE','DEMANDE_VISA_VALIDE'];
  const red=['INVALIDE','ADMISSION_INVALIDE','DEMANDE_VISA_INVALIDE'];
  const orange=['EN_ATTENTE','CHANGEMENT_A_APPORTER'];
  const c = green.includes(value)?'green':red.includes(value)?'red':orange.includes(value)?'orange':'blue';
  return <span className={`status-badge status-badge--${c}`}>{STATUS_LABELS[value]||value}</span>;
}

function PageDossiers({ token, personnel, onOpenChat }) {
  const { openMessageModal } = useMessageModal();
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selected, setSelected] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const list = await apiGetMesDossiers(token);
      setDossiers(list);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div className="cons-page">
      <h2 className="cons-page__title">Mes dossiers</h2>
      <p className="cons-page__sub">{dossiers.length} dossier(s) assigné(s).</p>

      {loading && (
        <div style={{display:'flex',gap:'.5rem',alignItems:'center',color:'#94a3b8',padding:'2rem 0'}}>
          <Loader size={16} className="auth-spinner"/> Chargement…
        </div>
      )}
      {error && (
        <p style={{color:'#dc2626',fontSize:'.875rem'}}><AlertCircle size={14}/> {error}</p>
      )}
      {!loading && !error && dossiers.length === 0 && (
        <div className="cons-empty">
          <FolderOpen size={40} strokeWidth={1.2} />
          <p>Aucun dossier assigné pour le moment.</p>
        </div>
      )}
      {!loading && !error && dossiers.length > 0 && (
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead><tr><th>Code</th><th>Étudiant</th><th>Statut</th><th>Admission</th><th>Visa</th><th>Actions</th></tr></thead>
            <tbody>
              {dossiers.map(d => (
                <tr key={d.id}>
                  <td><code className="sa-code">{d.code_dossier}</code></td>
                  <td>{d.etudiant ? `${d.etudiant.prenom} ${d.etudiant.nom}` : '—'}</td>
                  <td><StatusBadge value={d.status}/></td>
                  <td><StatusBadge value={d.status_admission}/></td>
                  <td><StatusBadge value={d.status_visa}/></td>
                  <td>
                    <div className="sa-actions">
                      <button className="sa-btn sa-btn--blue" onClick={() => {
                        const rolePath = personnel.role?.includes('admission') ? 'conseiller-admission' : 'conseiller-visa';
                        window.open(`/dashboard/${rolePath}?dossier=${encodeURIComponent(d.code_dossier)}`, '_blank');
                      }} title="Voir détails"><Eye size={14}/></button>
                      {d.etudiant?.email && (
                        <button className="sa-btn sa-btn--green" onClick={() => openMessageModal(token, d.etudiant.email, `${d.etudiant.prenom} ${d.etudiant.nom}`)} title="Envoyer message"><Send size={14}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

function PageMessages(props) {
  return (
    <div className="cons-page">
      <MessagesPanel {...props} />
    </div>
  );
}

function PageNotifications(props) {
  return (
    <div className="cons-page">
      <NotificationsPanel {...props} />
    </div>
  );
}

/* ── Composant principal ── */
export default function DashboardConseiller() {
  const navigate    = useNavigate();
  const [session, setSession]       = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileNav, setMobileNav]   = useState(false);
  const [viewDossier, setViewDossier] = useState(null);

  useEffect(() => {
    const s = getPersonnelSession();
    if (!s.token || !s.personnel) { navigate('/personnel'); return; }
    setSession(s);

    const params = new URLSearchParams(window.location.search);
    const code = params.get('dossier');
    if (code) {
      apiGetMesDossiers(s.token).then(list => {
        const d = list.find(x => x.code_dossier === code);
        if (d) setViewDossier(d);
      }).catch(() => {});
    }
  }, [navigate]);

  const handleLogout = async () => {
    try { await apiLogout(); } catch (_) {}
    clearPersonnelSession();
    navigate('/personnel');
  };

  const { notifications, loading: notifLoading, unread, markRead, markAllRead } = useNotifications(session?.token);
  const msg = useMessages(session?.token);

  if (!session) return null;

  const { personnel, token } = session;
  const roleLabel = getRoleLabel(personnel.role);

  const ActiveIcon = NAV_ITEMS.find(n => n.id === activePage)?.icon || LayoutDashboard;

  const handleOpenChat = (email) => {
    msg.loadConversation(email);
    setActivePage('messages');
  };

  const renderPage = () => {
    if (viewDossier) {
      return <DossierDetailConseiller token={token} personnel={personnel} dossier={viewDossier} asPage={true}
        onRefresh={updated => updated && setViewDossier(prev => ({ ...prev, ...updated }))} onOpenChat={handleOpenChat} />;
    }
    switch (activePage) {
      case 'dashboard':     return <PageDashboard token={token} personnel={personnel} onOpenChat={handleOpenChat} />;
      case 'dossiers':      return <PageDossiers token={token} personnel={personnel} onOpenChat={handleOpenChat} />;
      case 'messages':      return <PageMessages conversations={msg.conversations} messages={msg.messages} activeChat={msg.activeChat} unreadCount={msg.unreadCount} userEmail={personnel.email} onSelectChat={msg.loadConversation} onSend={msg.send} />;
      case 'notifications': return <PageNotifications notifications={notifications} loading={notifLoading} unread={unread} markRead={markRead} markAllRead={markAllRead} />;
      default:              return null;
    }
  };

  return (
    <div className="cons-layout">
      {/* ── Header ── */}
      <header className="cons-header">
        <div className="cons-header__brand">
          <img src={logoHeader} alt="Capadmis" style={{ height: 28, width: 'auto', display: 'block' }} />
          <span className="cons-header__role-badge">{roleLabel}</span>
        </div>

        {/* Nav desktop */}
        <nav className="cons-header__nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`cons-nav-btn${activePage === id ? ' cons-nav-btn--active' : ''}`} onClick={() => setActivePage(id)}>
              <span style={{position:'relative',display:'inline-flex'}}>
                <Icon size={16} />
                {id === 'notifications' && unread > 0 && <span className="notif-dot">{unread > 9 ? '9+' : unread}</span>}
                {id === 'messages' && msg.unreadCount > 0 && <span className="notif-dot">{msg.unreadCount > 9 ? '9+' : msg.unreadCount}</span>}
              </span>
              <span className="cons-nav-label">{label}</span>
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="cons-header__user">
          <span className="cons-header__user-name">
            {personnel.prenom} {personnel.nom}
            <span className="cons-header__user-code">({personnel.code})</span>
          </span>
          <button className="cons-logout-btn" onClick={handleLogout}>
            <LogOut size={14} />
            <span>Déconnexion</span>
          </button>
          <button className="cons-mobile-toggle" onClick={() => setMobileNav(v => !v)}>
            {mobileNav ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Nav mobile (dropdown) */}
      {mobileNav && (
        <div className="cons-mobile-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`cons-mobile-nav__item${activePage === id ? ' cons-mobile-nav__item--active' : ''}`}
              onClick={() => { setActivePage(id); setMobileNav(false); }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Contenu ── */}
      <main className="cons-main">
        {renderPage()}
      </main>
    </div>
  );
}
