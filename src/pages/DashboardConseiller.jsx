import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, FolderOpen,
  MessageSquare, Bell, ChevronDown, Menu, X,
  Loader, AlertCircle, Eye, Send,
} from 'lucide-react';
import logoHeader from '../assets/les images du site/logo-horizontal-2x.png';
import { getPersonnelSession, clearPersonnelSession, apiLogout, apiGetMesDossiers } from '../api/auth';
import { useNotifications } from '../hooks/useNotifications';
import NotificationsPanel from '../components/NotificationsPanel';
import { useMessages } from '../hooks/useMessages';
import MessagesPanel from '../components/MessagesPanel';
import DossierDetailConseiller from '../components/DossierDetailConseiller';
import { useMessageModal } from '../context/MessageModalContext';

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
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiGetMesDossiers(token).then(list => {
      if (mounted) setDossiers(list);
    }).catch(() => {}).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [token]);

  const total       = dossiers.length;
  const enCours     = dossiers.filter(d => d.status === 'EN_COURS_D_ETUDE').length;
  const valides     = dossiers.filter(d => d.status === 'VALIDE').length;
  const aCompleter  = dossiers.filter(d => d.status === 'CHANGEMENT_A_APPORTER').length;
  const roleLabel   = getRoleLabel(personnel.role);

  return (
    <div className="cons-page">
      <h2 className="cons-page__title">Dashboard</h2>
      <p className="cons-page__sub">{roleLabel} — {personnel.prenom} {personnel.nom}</p>
      <div className="cons-stats">
        {[
          { label: 'Dossiers assignés',  value: total },
          { label: 'En cours d\'étude',  value: enCours },
          { label: 'Validés',            value: valides },
          { label: 'À compléter',        value: aCompleter },
        ].map(s => (
          <div key={s.label} className="cons-stat-card">
            <span className="cons-stat-card__value">{s.value}</span>
            <span className="cons-stat-card__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Liste des dossiers assignés ── */}
      <h3 style={{margin:'1.5rem 0 .75rem',fontSize:'1rem',color:'#1e293b'}}>Mes dossiers assignés</h3>
      {loading && (
        <div style={{display:'flex',gap:'.5rem',alignItems:'center',color:'#94a3b8',padding:'1rem 0'}}>
          <Loader size={16} className="auth-spinner"/> Chargement…
        </div>
      )}
      {!loading && dossiers.length === 0 && (
        <p style={{color:'#94a3b8',fontSize:'.875rem'}}>Aucun dossier assigné pour le moment.</p>
      )}
      {!loading && dossiers.length > 0 && (
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead><tr><th>Code</th><th>Étudiant</th><th>Statut global</th><th>Admission</th><th>Visa</th><th>Actions</th></tr></thead>
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
                      <button className="sa-btn sa-btn--blue" onClick={() => setSelected(d)} title="Voir détails"><Eye size={14}/></button>
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
      {selected && (
        <DossierDetailConseiller token={token} personnel={personnel} dossier={selected} onClose={() => setSelected(null)} onRefresh={() => {}} onOpenChat={onOpenChat} />
      )}
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
        onRefresh={() => {}} onOpenChat={handleOpenChat} />;
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
