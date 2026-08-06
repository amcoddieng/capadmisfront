import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, FolderOpen, Users, UserCheck,
  History, MessageSquare, Bell, Menu, X, CreditCard, Plus, Pencil, Clock,
  Trash2, Lock, Unlock, Loader, AlertCircle, CheckCircle, Send, Eye, Award, Globe,
  AlertTriangle, Check, XCircle, School, Mail,
} from 'lucide-react';
import logoHeader from '../assets/les images du site/logo-horizontal-2x.png';
import DossierDetailConseiller from '../components/DossierDetailConseiller';
import {
  getPersonnelSession, clearPersonnelSession, apiLogout,
  apiListPersonnel, apiCreatePersonnel, apiUpdatePersonnel, apiDeletePersonnel, apiToggleBlockPersonnel,
  apiListEtudiants, apiCreateEtudiant, apiUpdateEtudiant, apiDeleteEtudiant, apiToggleBlockEtudiant,
  apiListDossiers, apiAssignConseiller, apiUpdateDossierStatus, apiListConseillers,
  apiGetDashboardAdmin, apiPatchPaiement,
  apiListContacts, apiUpdateContact, apiDeleteContact, apiToggleContactAppele,
} from '../api/auth';
import { useNotifications } from '../hooks/useNotifications';
import NotificationsPanel from '../components/NotificationsPanel';
import { useMessages } from '../hooks/useMessages';
import MessagesPanel from '../components/MessagesPanel';
import { useMessageModal } from '../context/MessageModalContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const CHART_COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6'];

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',           icon: LayoutDashboard },
  { id: 'dossiers',      label: 'Dossiers',            icon: FolderOpen },
  { id: 'etudiants',     label: 'Gestion étudiants',   icon: Users },
  { id: 'conseillers',   label: 'Gestion conseillers', icon: UserCheck },
  { id: 'paiement',      label: 'Paiement',            icon: CreditCard },
  { id: 'contacts',      label: 'Contacter-moi',       icon: Mail },
  { id: 'historique',    label: 'Historique',          icon: History },
  { id: 'messages',      label: 'Messages',            icon: MessageSquare },
  { id: 'notifications', label: 'Notifications',       icon: Bell },
];

const ROLES_PERSONNEL = [
  { value: 'admin',                label: 'Admin' },
  { value: 'conseiller_admission', label: 'Conseiller Admission' },
  { value: 'conseiller_visa',      label: 'Conseiller Visa' },
];
const ROLE_LABELS_PERS = { admin: 'Admin', conseiller_admission: 'Cons. Admission', conseiller_visa: 'Cons. Visa' };

const STATUS_OPTIONS      = ['EN_COURS_D_ETUDE','VALIDE','INVALIDE','EN_ATTENTE','CHANGEMENT_A_APPORTER'];
const STATUS_ADM_OPTIONS  = ['ADMISSION_EN_COURS','ADMISSION_VALIDE','ADMISSION_INVALIDE'];
const STATUS_VISA_OPTIONS = ['DEMANDE_VISA_EN_COURS','DEMANDE_VISA_VALIDE','DEMANDE_VISA_INVALIDE'];
const STATUS_LABELS = {
  EN_COURS_D_ETUDE:'En cours d’étude', VALIDE:'Validé', INVALIDE:'Invalide',
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
function TableWrap({ loading, error, children }) {
  if (loading) return <div style={{display:'flex',gap:'.5rem',alignItems:'center',color:'#94a3b8',padding:'2rem 0'}}><Loader size={16} className="auth-spinner"/>Chargement…</div>;
  if (error) return <p style={{color:'#dc2626',fontSize:'.875rem'}}>{error}</p>;
  return children;
}

/* ── Modal assign conseiller ── */
function ModalAssignConseiller({ token, dossier, defaultType = 'admission', onClose, onSuccess }) {
  const [type, setType] = useState(defaultType);
  const [conseillers, setConseillers] = useState([]);
  const [conseillerId, setConseillerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    apiListConseillers(token).then(l => { setConseillers(l); setLoading(false); }).catch(e => { setError(e.message); setLoading(false); });
  }, [token]);
  const filtered = conseillers.filter(c => c.role?.includes(type));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!conseillerId) { setError('Sélectionnez un conseiller.'); return; }
    setSaving(true); setError('');
    try { await apiAssignConseiller(token, dossier.id, type, Number(conseillerId)); await onSuccess(); onClose(); }
    catch (e) { setError(e.message); } finally { setSaving(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Assigner un conseiller — {dossier.code_dossier}</h3>
          <button className="modal__close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal__body">
          {error && <div className="auth-error" style={{margin:0}}><AlertCircle size={15}/> {error}</div>}
          {loading ? <div style={{color:'#94a3b8'}}><Loader size={14} className="auth-spinner"/> Chargement…</div> : (
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={type} onChange={e => { setType(e.target.value); setConseillerId(''); }}>
                  <option value="admission">Admission</option>
                  <option value="visa">Visa</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Conseiller</label>
                <select className="form-select" required value={conseillerId} onChange={e => setConseillerId(e.target.value)}>
                  <option value="">Sélectionner</option>
                  {filtered.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom} ({c.code})</option>)}
                </select>
              </div>
              <div className="modal__footer" style={{marginTop:0}}>
                <button type="button" className="form-back" onClick={onClose}>Annuler</button>
                <button type="submit" className="form-submit" disabled={saving}>
                  {saving ? <Loader size={14} className="auth-spinner"/> : <CheckCircle size={14}/>}
                  {saving ? 'Assignation…' : 'Assigner'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Modal statut dossier (single field) ── */
const STATUS_FIELD_CONFIG = {
  status:           { label: 'Statut global',   options: STATUS_OPTIONS },
  status_admission: { label: 'Statut admission', options: STATUS_ADM_OPTIONS },
  status_visa:      { label: 'Statut visa',      options: STATUS_VISA_OPTIONS },
};

function ModalSingleStatus({ token, dossier, field, onClose, onSuccess }) {
  const cfg = STATUS_FIELD_CONFIG[field];
  const [value, setValue] = useState(dossier[field] || cfg.options[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await apiUpdateDossierStatus(token, dossier.id, { [field]: value });
      await onSuccess(); onClose();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{cfg.label} — {dossier.code_dossier}</h3>
          <button className="modal__close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal__body">
          {error && <div className="auth-error" style={{margin:'0 0 1rem'}}><AlertCircle size={15}/> {error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div className="form-group">
              <label className="form-label">{cfg.label}</label>
              <select className="form-select" value={value} onChange={e => setValue(e.target.value)}>
                {cfg.options.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              {field === 'status_admission' && value === 'ADMISSION_EN_COURS' && (
                <p style={{ margin: '.4rem 0 0', color: '#166534', fontSize: '.78rem' }}>
                  Le statut global sera automatiquement défini sur « Validé ».
                </p>
              )}
            </div>
            <div className="modal__footer" style={{marginTop:0}}>
              <button type="button" className="form-back" onClick={onClose}>Annuler</button>
              <button type="submit" className="form-submit" disabled={saving}>
                {saving ? <Loader size={14} className="auth-spinner"/> : <CheckCircle size={14}/>}
                {saving ? 'Mise à jour…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Page Dossiers ── */
function PageDossiers({ token, personnel }) {
  const { openMessageModal } = useMessageModal();
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [assignModal, setAssignModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [statusField, setStatusField] = useState('status');
  const [detailDossier, setDetailDossier] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAdmission, setFilterAdmission] = useState('');
  const [filterVisa, setFilterVisa] = useState('');
  const [filterSansConseiller, setFilterSansConseiller] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { setDossiers(await apiListDossiers(token)); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { fetch(); }, [fetch]);

  const filtered = dossiers.filter(d => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      d.code_dossier?.toLowerCase().includes(q) ||
      d.etudiant?.prenom?.toLowerCase().includes(q) ||
      d.etudiant?.nom?.toLowerCase().includes(q) ||
      d.etudiant?.email?.toLowerCase().includes(q) ||
      (d.conseiller_admission?.prenom + ' ' + d.conseiller_admission?.nom).toLowerCase().includes(q) ||
      (d.conseiller_visa?.prenom + ' ' + d.conseiller_visa?.nom).toLowerCase().includes(q);
    const matchStatus = !filterStatus || d.status === filterStatus;
    const matchAdm    = !filterAdmission || d.status_admission === filterAdmission;
    const matchVisa   = !filterVisa || d.status_visa === filterVisa;
    const matchSansConseiller = !filterSansConseiller || (!d.conseiller_admission && !d.conseiller_visa);
    return matchSearch && matchStatus && matchAdm && matchVisa && matchSansConseiller;
  });

  return (
    <div className="cons-page">
      <h2 className="cons-page__title">Dossiers</h2>
      <p className="cons-page__sub">{filtered.length} dossier(s) sur {dossiers.length} au total.</p>

      {/* ── Barre de recherche et filtres ── */}
      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem', background: '#fff', padding: '.75rem 1rem', borderRadius: '.5rem', border: '1px solid #e2e8f0' }}>
        <input
          type="text"
          placeholder="Rechercher (code, nom, email...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}>
          <option value="">Tous statuts</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select value={filterAdmission} onChange={e => setFilterAdmission(e.target.value)} style={{ padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}>
          <option value="">Tous admissions</option>
          {STATUS_ADM_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select value={filterVisa} onChange={e => setFilterVisa(e.target.value)} style={{ padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}>
          <option value="">Tous visas</option>
          {STATUS_VISA_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '.35rem', fontSize: '.8rem', color: '#475569', cursor: 'pointer' }}>
          <input type="checkbox" checked={filterSansConseiller} onChange={e => setFilterSansConseiller(e.target.checked)} />
          Sans conseiller
        </label>
      </div>

      <TableWrap loading={loading} error={error}>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead><tr><th>Code</th><th>Étudiant</th><th>Statut</th><th>Admission</th><th>Visa</th><th>Cons. Adm.</th><th>Cons. Visa</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={8} className="sa-empty">Aucun dossier trouvé</td></tr>}
              {filtered.map(d => (
                <tr key={d.id}>
                  <td><code className="sa-code">{d.code_dossier}</code></td>
                  <td>{d.etudiant ? `${d.etudiant.prenom} ${d.etudiant.nom}` : '—'}</td>
                  <td><StatusBadge value={d.status}/></td>
                  <td><StatusBadge value={d.status_admission}/></td>
                  <td><StatusBadge value={d.status_visa}/></td>
                  <td>
                    {d.conseiller_admission ? `${d.conseiller_admission.prenom} ${d.conseiller_admission.nom}` : (
                      <button className="sa-btn sa-btn--blue" style={{fontSize:'.75rem',padding:'.2rem .5rem'}} onClick={() => setAssignModal({ dossier: d, type: 'admission' })} title="Assigner conseiller admission">
                        <UserCheck size={12}/> Attribuer
                      </button>
                    )}
                  </td>
                  <td>
                    {d.conseiller_visa ? `${d.conseiller_visa.prenom} ${d.conseiller_visa.nom}` : (
                      <button className="sa-btn sa-btn--blue" style={{fontSize:'.75rem',padding:'.2rem .5rem'}} onClick={() => setAssignModal({ dossier: d, type: 'visa' })} title="Assigner conseiller visa">
                        <UserCheck size={12}/> Attribuer
                      </button>
                    )}
                  </td>
                  <td><div className="sa-actions">
                    <button className="sa-btn sa-btn--blue" onClick={() => setDetailDossier(d)} title="Voir le dossier"><Eye size={14}/></button>
                    <button className="sa-btn sa-btn--orange" onClick={() => { setStatusField('status'); setStatusModal(d); }} title="Changer statut global"><Pencil size={14}/></button>
                    <button className="sa-btn sa-btn--orange" onClick={() => { setStatusField('status_admission'); setStatusModal(d); }} title="Changer statut admission"><Award size={14}/></button>
                    <button className="sa-btn sa-btn--orange" onClick={() => { setStatusField('status_visa'); setStatusModal(d); }} title="Changer statut visa"><Globe size={14}/></button>
                    {d.etudiant?.email && <button className="sa-btn sa-btn--green" onClick={() => openMessageModal(token, d.etudiant.email, `${d.etudiant.prenom} ${d.etudiant.nom}`)} title="Envoyer message"><Send size={14}/></button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableWrap>
      {assignModal && <ModalAssignConseiller token={token} dossier={assignModal.dossier} defaultType={assignModal.type} onClose={() => setAssignModal(null)} onSuccess={fetch}/>}
      {statusModal && <ModalSingleStatus token={token} dossier={statusModal} field={statusField} onClose={() => setStatusModal(null)} onSuccess={fetch}/>}
      {detailDossier && (
        <DossierDetailConseiller
          token={token}
          personnel={personnel}
          dossier={detailDossier}
          onClose={() => setDetailDossier(null)}
          onRefresh={fetch}
        />
      )}
    </div>
  );
}

/* ── Modal étudiant ── */
function ModalEtudiant({ token, etudiant, onClose, onSuccess }) {
  const isEdit = !!etudiant;
  const [form, setForm] = useState({
    nom: etudiant?.nom||'', prenom: etudiant?.prenom||'', email: etudiant?.email||'', mdp: '', telephone: etudiant?.telephone||'',
    sexe: etudiant?.sexe||'M', ville: etudiant?.ville||'', payes: etudiant?.payes||'Sénégal',
    date_de_naissance: etudiant?.date_de_naissance?.slice(0,10)||'',
    lieu_de_naissance: etudiant?.lieu_de_naissance||'',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const p = { ...form }; if (isEdit && !p.mdp) delete p.mdp;
      if (isEdit) await apiUpdateEtudiant(token, etudiant.id, p);
      else await apiCreateEtudiant(token, p);
      await onSuccess(); onClose();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{isEdit ? 'Modifier' : 'Ajouter'} un étudiant</h3>
          <button className="modal__close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal__body">
          {error && <div className="auth-error" style={{margin:'0 0 1rem'}}><AlertCircle size={15}/> {error}</div>}
          <form onSubmit={handleSubmit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.875rem'}}>
            <div className="form-group"><label className="form-label">Prénom *</label><input className="form-input" required value={form.prenom} onChange={e=>set('prenom',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Nom *</label><input className="form-input" required value={form.nom} onChange={e=>set('nom',e.target.value)}/></div>
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.email} onChange={e=>set('email',e.target.value)}/></div>
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label className="form-label">Mot de passe {isEdit ? '(vide = inchangé)' : '*'}</label>
              <input className="form-input" type="password" required={!isEdit} value={form.mdp} onChange={e=>set('mdp',e.target.value)}/>
            </div>
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label className="form-label">Téléphone</label>
              <input className="form-input" type="tel" value={form.telephone} onChange={e=>set('telephone',e.target.value)} placeholder="Ex: +221 77 123 45 67"/>
            </div>
            <div className="form-group"><label className="form-label">Sexe</label>
              <select className="form-select" value={form.sexe} onChange={e=>set('sexe',e.target.value)}><option value="M">Homme</option><option value="F">Femme</option></select>
            </div>
            <div className="form-group"><label className="form-label">Ville</label><input className="form-input" value={form.ville} onChange={e=>set('ville',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Pays</label><input className="form-input" value={form.payes} onChange={e=>set('payes',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Date de naissance</label><input className="form-input" type="date" value={form.date_de_naissance} onChange={e=>set('date_de_naissance',e.target.value)}/></div>
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">Lieu de naissance</label><input className="form-input" value={form.lieu_de_naissance} onChange={e=>set('lieu_de_naissance',e.target.value)}/></div>
            <div className="modal__footer" style={{gridColumn:'span 2',marginTop:0}}>
              <button type="button" className="form-back" onClick={onClose}>Annuler</button>
              <button type="submit" className="form-submit" disabled={saving}>
                {saving ? <Loader size={14} className="auth-spinner"/> : <CheckCircle size={14}/>}
                {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Page Étudiants ── */
function PageEtudiants({ token, personnel }) {
  const { openMessageModal } = useMessageModal();
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [actionErr, setActionErr] = useState('');
  const [modal, setModal]         = useState(undefined);
  const [toggling, setToggling]   = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [detailDossier, setDetailDossier] = useState(null);
  const [loadingDossier, setLoadingDossier] = useState(false);
  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { setEtudiants(await apiListEtudiants(token)); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { fetch(); }, [fetch]);

  const handleVoir = async (etudiant) => {
    setLoadingDossier(true);
    try {
      const dossiers = await apiListDossiers(token);
      const d = dossiers.find(ds => ds.etudiant?.id === etudiant.id || ds.etudiant?.email === etudiant.email);
      if (d) { setDetailDossier(d); }
      else { alert('Cet étudiant n\'a pas encore de dossier.'); }
    } catch (e) { alert(e.message); } finally { setLoadingDossier(false); }
  };

  const filtered = etudiants.filter(e => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      e.prenom?.toLowerCase().includes(q) ||
      e.nom?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.telephone?.toLowerCase().includes(q) ||
      e.ville?.toLowerCase().includes(q) ||
      e.code_dossier?.toLowerCase().includes(q);
    const matchStatut = !filterStatut || (filterStatut === 'bloque' ? e.bloque : !e.bloque);
    return matchSearch && matchStatut;
  });
  const handleBlock = async (id) => {
    setToggling(id); setActionErr('');
    try { await apiToggleBlockEtudiant(token, id); await fetch(); } catch (e) { setActionErr(e.message); } finally { setToggling(null); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet étudiant ? Son dossier sera aussi supprimé.')) return;
    setDeleting(id); setActionErr('');
    try { await apiDeleteEtudiant(token, id); await fetch(); } catch (e) { setActionErr(e.message); } finally { setDeleting(null); }
  };
  return (
    <div className="cons-page">
      <div className="sa-page-header">
        <h2 className="cons-page__title" style={{margin:0}}>Gestion étudiants</h2>
        <button className="form-submit" style={{padding:'.4rem .875rem'}} onClick={() => setModal(null)}><Plus size={14}/> Ajouter</button>
      </div>
      <p className="cons-page__sub">{filtered.length} étudiant(s) sur {etudiants.length} enregistré(s).</p>

      {/* ── Recherche et filtres étudiants ── */}
      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem', background: '#fff', padding: '.75rem 1rem', borderRadius: '.5rem', border: '1px solid #e2e8f0' }}>
        <input
          type="text"
          placeholder="Rechercher (prénom, nom, email, téléphone, ville, code dossier...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}
        />
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={{ padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}>
          <option value="">Tous statuts</option>
          <option value="actif">Actif</option>
          <option value="bloque">Bloqué</option>
        </select>
      </div>

      {actionErr && <div className="auth-error" style={{margin:'0 0 .75rem'}}><AlertCircle size={15}/> {actionErr}</div>}
      <TableWrap loading={loading} error={error}>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead><tr><th>Prénom</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Ville</th><th>Pays</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={8} className="sa-empty">Aucun étudiant trouvé</td></tr>}
              {filtered.map(e => (
                <tr key={e.id}>
                  <td>{e.prenom}</td><td>{e.nom}</td>
                  <td style={{fontSize:'.8rem'}}>{e.email}</td>
                  <td style={{fontSize:'.8rem'}}>{e.telephone || '—'}</td>
                  <td>{e.ville||'—'}</td><td>{e.payes||'—'}</td>
                  <td><span className={`status-badge status-badge--${e.bloque?'red':'green'}`}>{e.bloque?'Bloqué':'Actif'}</span></td>
                  <td><div className="sa-actions">
                    <button className="sa-btn sa-btn--blue" onClick={() => handleVoir(e)} disabled={loadingDossier} title="Voir le dossier"><Eye size={14}/></button>
                    <button className="sa-btn sa-btn--blue" onClick={() => setModal(e)} title="Modifier"><Pencil size={14}/></button>
                    <button className={`sa-btn ${e.bloque?'sa-btn--green':'sa-btn--orange'}`} onClick={() => handleBlock(e.id)} disabled={toggling===e.id} title={e.bloque?'Débloquer':'Bloquer'}>
                      {toggling===e.id ? <Loader size={14} className="auth-spinner"/> : e.bloque ? <Unlock size={14}/> : <Lock size={14}/>}
                    </button>
                    <button className="sa-btn sa-btn--red" onClick={() => handleDelete(e.id)} disabled={deleting===e.id} title="Supprimer">
                      {deleting===e.id ? <Loader size={14} className="auth-spinner"/> : <Trash2 size={14}/>}
                    </button>
                    <button className="sa-btn sa-btn--green" onClick={() => openMessageModal(token, e.email, `${e.prenom} ${e.nom}`)} title="Envoyer message"><Send size={14}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableWrap>
      {modal !== undefined && <ModalEtudiant token={token} etudiant={modal} onClose={() => setModal(undefined)} onSuccess={fetch}/>}
      {detailDossier && (
        <DossierDetailConseiller
          token={token}
          personnel={personnel}
          dossier={detailDossier}
          onClose={() => setDetailDossier(null)}
          onRefresh={fetch}
        />
      )}
    </div>
  );
}

/* ── Modal personnel ── */
function ModalPersonnel({ token, membre, onClose, onSuccess }) {
  const isEdit = !!membre;
  const [form, setForm] = useState({ prenom: membre?.prenom||'', nom: membre?.nom||'', email: membre?.email||'', mdp: '', role: membre?.role||'conseiller_admission' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const p = { ...form }; if (isEdit && !p.mdp) delete p.mdp; if (isEdit) delete p.role;
      if (isEdit) await apiUpdatePersonnel(token, membre.id, p);
      else await apiCreatePersonnel(token, p);
      await onSuccess(); onClose();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{isEdit ? 'Modifier' : 'Ajouter'} un membre</h3>
          <button className="modal__close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal__body">
          {error && <div className="auth-error" style={{margin:'0 0 1rem'}}><AlertCircle size={15}/> {error}</div>}
          <form onSubmit={handleSubmit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.875rem'}}>
            <div className="form-group"><label className="form-label">Prénom *</label><input className="form-input" required value={form.prenom} onChange={e=>set('prenom',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Nom *</label><input className="form-input" required value={form.nom} onChange={e=>set('nom',e.target.value)}/></div>
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.email} onChange={e=>set('email',e.target.value)}/></div>
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label className="form-label">Mot de passe {isEdit ? '(vide = inchangé)' : '*'}</label>
              <input className="form-input" type="password" required={!isEdit} value={form.mdp} onChange={e=>set('mdp',e.target.value)}/>
            </div>
            {!isEdit && (
              <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">Rôle *</label>
                <select className="form-select" value={form.role} onChange={e=>set('role',e.target.value)}>
                  {ROLES_PERSONNEL.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            )}
            <div className="modal__footer" style={{gridColumn:'span 2',marginTop:0}}>
              <button type="button" className="form-back" onClick={onClose}>Annuler</button>
              <button type="submit" className="form-submit" disabled={saving}>
                {saving ? <Loader size={14} className="auth-spinner"/> : <CheckCircle size={14}/>}
                {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Page Conseillers ── */
function PageConseillers({ token }) {
  const { openMessageModal } = useMessageModal();
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [actionErr, setActionErr] = useState('');
  const [modal, setModal]         = useState(undefined);
  const [toggling, setToggling]   = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [dossiersModal, setDossiersModal] = useState(null);
  const [loadingDossiers, setLoadingDossiers] = useState(false);
  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { setPersonnel(await apiListPersonnel(token)); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { fetch(); }, [fetch]);

  const handleVoirDossiers = async (membre) => {
    setLoadingDossiers(true);
    try {
      const all = await apiListDossiers(token);
      const assigned = all.filter(d =>
        d.conseiller_admission?.id === membre.id ||
        d.conseiller_visa?.id === membre.id
      );
      setDossiersModal({ membre, dossiers: assigned });
    } catch (e) { alert(e.message); } finally { setLoadingDossiers(false); }
  };

  const filtered = personnel.filter(m => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      m.prenom?.toLowerCase().includes(q) ||
      m.nom?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.code?.toLowerCase().includes(q);
    const matchRole   = !filterRole   || m.role === filterRole;
    const matchStatut = !filterStatut || (filterStatut === 'bloque' ? m.bloque : !m.bloque);
    return matchSearch && matchRole && matchStatut;
  });
  const handleBlock = async (id) => {
    setToggling(id); setActionErr('');
    try { await apiToggleBlockPersonnel(token, id); await fetch(); } catch (e) { setActionErr(e.message); } finally { setToggling(null); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce membre du personnel ?')) return;
    setDeleting(id); setActionErr('');
    try { await apiDeletePersonnel(token, id); await fetch(); } catch (e) { setActionErr(e.message); } finally { setDeleting(null); }
  };
  return (
    <div className="cons-page">
      <div className="sa-page-header">
        <h2 className="cons-page__title" style={{margin:0}}>Gestion des conseillers</h2>
        <button className="form-submit" style={{padding:'.4rem .875rem'}} onClick={() => setModal(null)}><Plus size={14}/> Ajouter</button>
      </div>
      <p className="cons-page__sub">{filtered.length} membre(s) sur {personnel.length} au total.</p>

      {/* ── Recherche et filtres conseillers ── */}
      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem', background: '#fff', padding: '.75rem 1rem', borderRadius: '.5rem', border: '1px solid #e2e8f0' }}>
        <input
          type="text"
          placeholder="Rechercher (prénom, nom, email, code...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}
        />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}>
          <option value="">Tous rôles</option>
          {ROLES_PERSONNEL.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={{ padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}>
          <option value="">Tous statuts</option>
          <option value="actif">Actif</option>
          <option value="bloque">Bloqué</option>
        </select>
      </div>

      {actionErr && <div className="auth-error" style={{margin:'0 0 .75rem'}}><AlertCircle size={15}/> {actionErr}</div>}
      <TableWrap loading={loading} error={error}>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead><tr><th>Prénom</th><th>Nom</th><th>Email</th><th>Code</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} className="sa-empty">Aucun membre trouvé</td></tr>}
              {filtered.map(m => (
                <tr key={m.id}>
                  <td>{m.prenom}</td><td>{m.nom}</td>
                  <td style={{fontSize:'.8rem'}}>{m.email}</td>
                  <td><code className="sa-code">{m.code}</code></td>
                  <td><span className="status-badge status-badge--blue">{ROLE_LABELS_PERS[m.role]||m.role}</span></td>
                  <td><span className={`status-badge status-badge--${m.bloque?'red':'green'}`}>{m.bloque?'Bloqué':'Actif'}</span></td>
                  <td><div className="sa-actions">
                    <button className="sa-btn sa-btn--blue" onClick={() => handleVoirDossiers(m)} disabled={loadingDossiers} title="Voir les dossiers"><FolderOpen size={14}/></button>
                    <button className="sa-btn sa-btn--blue" onClick={() => setModal(m)} title="Modifier"><Pencil size={14}/></button>
                    <button className={`sa-btn ${m.bloque?'sa-btn--green':'sa-btn--orange'}`} onClick={() => handleBlock(m.id)} disabled={toggling===m.id} title={m.bloque?'Débloquer':'Bloquer'}>
                      {toggling===m.id ? <Loader size={14} className="auth-spinner"/> : m.bloque ? <Unlock size={14}/> : <Lock size={14}/>}
                    </button>
                    <button className="sa-btn sa-btn--red" onClick={() => handleDelete(m.id)} disabled={deleting===m.id} title="Supprimer">
                      {deleting===m.id ? <Loader size={14} className="auth-spinner"/> : <Trash2 size={14}/>}
                    </button>
                    <button className="sa-btn sa-btn--green" onClick={() => openMessageModal(token, m.email, `${m.prenom} ${m.nom}`)} title="Envoyer message"><Send size={14}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableWrap>
      {modal !== undefined && <ModalPersonnel token={token} membre={modal} onClose={() => setModal(undefined)} onSuccess={fetch}/>}

      {/* ── Modal dossiers du conseiller ── */}
      {dossiersModal && (
        <div className="modal-overlay" onClick={() => setDossiersModal(null)}>
          <div className="modal" style={{ maxWidth: 800, width: '92vw', maxHeight: '92vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Dossiers de {dossiersModal.membre.prenom} {dossiersModal.membre.nom}</h3>
              <button className="modal__close" onClick={() => setDossiersModal(null)}><X size={18}/></button>
            </div>
            <div className="modal__body">
              {dossiersModal.dossiers.length === 0 ? (
                <p style={{color:'#94a3b8',textAlign:'center',padding:'1rem'}}>Aucun dossier assigné à ce conseiller.</p>
              ) : (
                <div className="sa-table-wrap">
                  <table className="sa-table">
                    <thead><tr><th>Code</th><th>Étudiant</th><th>Statut global</th><th>Admission</th><th>Visa</th></tr></thead>
                    <tbody>
                      {dossiersModal.dossiers.map(d => (
                        <tr key={d.id}>
                          <td><code className="sa-code">{d.code_dossier}</code></td>
                          <td>{d.etudiant ? `${d.etudiant.prenom} ${d.etudiant.nom}` : '—'}</td>
                          <td><StatusBadge value={d.status}/></td>
                          <td><StatusBadge value={d.status_admission}/></td>
                          <td><StatusBadge value={d.status_visa}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page Dashboard ── */
function PageDashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true); setError('');
    apiGetDashboardAdmin(token).then(data => {
      if (mounted) setStats(data);
    }).catch(e => {
      if (mounted) setError(e.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [token]);

  const TINTS = {
    blue:   { bg: '#eff6ff', fg: '#2563eb' },
    indigo: { bg: '#eef2ff', fg: '#4f46e5' },
    amber:  { bg: '#fffbeb', fg: '#d97706' },
    violet: { bg: '#f5f3ff', fg: '#7c3aed' },
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
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', color: '#94a3b8', padding: '2rem 0' }}>
        <Loader size={16} className="auth-spinner" /> Chargement…
      </div>
    </div>
  );

  if (error) return (
    <div className="cons-page">
      <h2 className="cons-page__title">Dashboard</h2>
      <p style={{ color: '#dc2626', fontSize: '.875rem' }}><AlertCircle size={14} /> {error}</p>
    </div>
  );

  return (
    <div className="cons-page">
      <h2 className="cons-page__title">Dashboard</h2>
      <p className="cons-page__sub">Vue d'ensemble de la plateforme</p>

      <div className="cons-stats">
        {statCard('Étudiants', stats?.totalEtudiants ?? 0, 'blue', Users)}
        {statCard('Dossiers', stats?.totalDossiers ?? 0, 'indigo', FolderOpen)}
        {statCard('Personnel', stats?.totalPersonnel ?? 0, 'amber', UserCheck)}
        {statCard('Dossiers univ.', stats?.totalDossiersUniversite ?? 0, 'violet', School)}
        {statCard('Messages non lus', stats?.totalMessagesNonLus ?? 0, 'green', MessageSquare)}
        {statCard('Notifications', stats?.totalNotificationsNonLues ?? 0, 'orange', Bell)}
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

        {/* PieChart — Personnel par rôle */}
        <div className="cons-chart-card">
          <h4 className="cons-chart-card__title"><UserCheck size={15} color="#64748b"/> Personnel par rôle</h4>
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
        <div className="cons-chart-card">
          <h4 className="cons-chart-card__title"><Award size={15} color="#64748b"/> Dossiers par statut admission</h4>
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
        <div className="cons-chart-card">
          <h4 className="cons-chart-card__title"><Globe size={15} color="#64748b"/> Dossiers par statut visa</h4>
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
    </div>
  );
}

function PageHistorique()    { return <div className="cons-page"><h2 className="cons-page__title">Historique</h2><p className="cons-page__sub">Journal des actions.</p><div className="cons-empty"><History size={40} strokeWidth={1.2}/><p>Aucun événement enregistré.</p></div></div>; }
function PageMessages(props) {
  return (
    <div className="cons-page">
      <MessagesPanel {...props} />
    </div>
  );
}
function PagePaiement({ token }) {
  const [dossiers, setDossiers]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [search, setSearch]           = useState('');
  const [filterPaiement, setFilterPaiement] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);
  const [updating, setUpdating]       = useState(null);
  const [actionErr, setActionErr]     = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { setDossiers(await apiListDossiers(token)); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { fetch(); }, [fetch]);

  const filtered = dossiers.filter(d => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      d.code_dossier?.toLowerCase().includes(q) ||
      d.etudiant?.prenom?.toLowerCase().includes(q) ||
      d.etudiant?.nom?.toLowerCase().includes(q) ||
      d.etudiant?.email?.toLowerCase().includes(q);
    const p = d.infos_dossier?.paiement;
    const matchPaiement = !filterPaiement ||
      (filterPaiement === 'paye' && p === true) ||
      (filterPaiement === 'non_paye' && p !== true);
    return matchSearch && matchPaiement;
  });

  const handleConfirmPaiement = async (codeDossier, valeur) => {
    setUpdating(codeDossier);
    setActionErr('');
    try {
      await apiPatchPaiement(token, codeDossier, valeur);
      setDossiers(prev => prev.map(d =>
        d.code_dossier === codeDossier
          ? { ...d, infos_dossier: { ...d.infos_dossier, paiement: valeur } }
          : d
      ));
      setConfirmModal(null);
    } catch (e) {
      setActionErr(e.message);
    } finally {
      setUpdating(null);
    }
  };

  const nbPayes = dossiers.filter(d => d.infos_dossier?.paiement === true).length;
  const nbNonPayes = dossiers.length - nbPayes;

  return (
    <div className="cons-page">
      <h2 className="cons-page__title">Paiement</h2>
      <p className="cons-page__sub">Suivi des paiements des frais de dossier.</p>

      <div className="cons-stats" style={{ marginBottom:'1.25rem' }}>
        <div className="cons-stat-card" style={{ borderTop:'3px solid #64748b' }}>
          <span className="cons-stat-card__icon" style={{ background:'#f1f5f9', color:'#475569' }}><CreditCard size={18}/></span>
          <span className="cons-stat-card__value">{dossiers.length}</span>
          <span className="cons-stat-card__label">Total dossiers</span>
        </div>
        <div className="cons-stat-card" style={{ borderTop:'3px solid #16a34a' }}>
          <span className="cons-stat-card__icon" style={{ background:'#f0fdf4', color:'#16a34a' }}><Check size={18}/></span>
          <span className="cons-stat-card__value" style={{ color:'#16a34a' }}>{nbPayes}</span>
          <span className="cons-stat-card__label">Payés</span>
        </div>
        <div className="cons-stat-card" style={{ borderTop:'3px solid #dc2626' }}>
          <span className="cons-stat-card__icon" style={{ background:'#fef2f2', color:'#dc2626' }}><XCircle size={18}/></span>
          <span className="cons-stat-card__value" style={{ color:'#dc2626' }}>{nbNonPayes}</span>
          <span className="cons-stat-card__label">Non payés</span>
        </div>
      </div>

      <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', alignItems:'center', marginBottom:'1.25rem', background:'#fff', padding:'.75rem 1rem', borderRadius:'.5rem', border:'1px solid #e2e8f0' }}>
        <input
          type="text"
          placeholder="Rechercher (code, nom, email...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex:1, minWidth:200, padding:'.4rem .6rem', border:'1px solid #cbd5e1', borderRadius:'.4rem', fontSize:'.85rem' }}
        />
        <select value={filterPaiement} onChange={e => setFilterPaiement(e.target.value)} style={{ padding:'.4rem .6rem', border:'1px solid #cbd5e1', borderRadius:'.4rem', fontSize:'.85rem' }}>
          <option value="">Tous</option>
          <option value="paye">Payés</option>
          <option value="non_paye">Non payés</option>
        </select>
      </div>

      {loading && <div style={{ color:'#94a3b8', textAlign:'center', padding:'2rem' }}><Loader size={24} className="auth-spinner"/> Chargement…</div>}
      {error && <div className="auth-error" style={{ margin:0 }}><AlertCircle size={15}/> {error}</div>}

      {!loading && !error && (
        <TableWrap>
          <div style={{ overflowX:'auto' }}>
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Code dossier</th>
                  <th>Étudiant</th>
                  <th>Email</th>
                  <th>Niveau</th>
                  <th>Statut paiement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign:'center', color:'#94a3b8', padding:'2rem' }}>Aucun dossier trouvé.</td></tr>
                )}
                {filtered.map(d => (
                  <tr key={d.code_dossier}>
                    <td style={{ fontWeight:600 }}>{d.code_dossier}</td>
                    <td>{d.etudiant?.prenom} {d.etudiant?.nom}</td>
                    <td style={{ fontSize:'.8rem' }}>{d.etudiant?.email || '—'}</td>
                    <td style={{ fontSize:'.8rem' }}>{d.infos_dossier?.niveau_etude || '—'}</td>
                    <td>
                      {d.infos_dossier?.paiement === true
                        ? <span className="status-badge status-badge--green"><Check size={12} style={{ display:'inline', marginRight:'.25rem' }}/>Payé</span>
                        : <span className="status-badge status-badge--red"><XCircle size={12} style={{ display:'inline', marginRight:'.25rem' }}/>Non payé</span>}
                    </td>
                    <td>
                      <div className="sa-actions">
                        {d.infos_dossier?.paiement !== true && (
                          <button
                            className="sa-btn sa-btn--green"
                            onClick={() => { setConfirmModal({ dossier: d, action: 'valider' }); setActionErr(''); }}
                            disabled={updating === d.code_dossier}
                            title="Valider le paiement"
                          >
                            {updating === d.code_dossier ? <Loader size={14} className="auth-spinner"/> : <CheckCircle size={14}/>}
                          </button>
                        )}
                        {d.infos_dossier?.paiement === true && (
                          <button
                            className="sa-btn sa-btn--orange"
                            onClick={() => { setConfirmModal({ dossier: d, action: 'invalider' }); setActionErr(''); }}
                            disabled={updating === d.code_dossier}
                            title="Invalider le paiement"
                          >
                            {updating === d.code_dossier ? <Loader size={14} className="auth-spinner"/> : <XCircle size={14}/>}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableWrap>
      )}

      {confirmModal && (
        <div className="modal-overlay" onClick={() => !updating && setConfirmModal(null)}>
          <div className="modal modal--confirm" onClick={e => e.stopPropagation()}>
            <div className={`modal__header ${confirmModal.action === 'valider' ? 'modal__header--success' : 'modal__header--danger'}`}>
              <div className={`modal__header-icon ${confirmModal.action === 'valider' ? 'modal__header-icon--success' : ''}`}>
                {confirmModal.action === 'valider' ? <CheckCircle size={20}/> : <AlertTriangle size={20}/>}
              </div>
              <h3 className="modal__title">
                {confirmModal.action === 'valider' ? 'Valider le paiement' : 'Invalider le paiement'}
              </h3>
              <button className="modal__close" onClick={() => setConfirmModal(null)} disabled={!!updating}><X size={18}/></button>
            </div>
            <div className="modal__body">
              <div className={`confirm-icon ${confirmModal.action === 'valider' ? 'confirm-icon--success' : ''}`}>
                {confirmModal.action === 'valider' ? <CheckCircle size={36}/> : <AlertTriangle size={36}/>}
              </div>
              <p className="confirm-text">
                {confirmModal.action === 'valider'
                  ? 'Confirmer la validation du paiement pour ce dossier ?'
                  : 'Confirmer l\'invalidation du paiement pour ce dossier ?'}
              </p>
              <div className="confirm-doc">
                <strong>{confirmModal.dossier.code_dossier}</strong>
                <span>{confirmModal.dossier.etudiant?.prenom} {confirmModal.dossier.etudiant?.nom}</span>
                <span style={{ color: confirmModal.action === 'valider' ? '#16a34a' : '#dc2626', fontWeight:600 }}>
                  {confirmModal.action === 'valider' ? 'Sera marqué comme PAYÉ' : 'Sera marqué comme NON PAYÉ'}
                </span>
              </div>
              <p className="confirm-warning">
                {confirmModal.action === 'valider'
                  ? 'L\'étudiant pourra accéder aux étapes suivantes de sa procédure.'
                  : 'L\'étudiant ne pourra plus accéder aux étapes suivantes de sa procédure.'}
              </p>
              {actionErr && (
                <div className="auth-error auth-error--inline" style={{ marginTop:'.75rem', width:'100%' }}>
                  <AlertCircle size={15}/> {actionErr}
                </div>
              )}
            </div>
            <div className="modal__footer">
              <button
                className="btn btn--cancel"
                onClick={() => setConfirmModal(null)}
                disabled={!!updating}
              >
                Annuler
              </button>
              <button
                className={`btn ${confirmModal.action === 'valider' ? 'btn--success' : 'btn--delete'}`}
                onClick={() => handleConfirmPaiement(confirmModal.dossier.code_dossier, confirmModal.action === 'valider')}
                disabled={!!updating}
              >
                {updating === confirmModal.dossier.code_dossier
                  ? <><Loader size={16} className="auth-spinner"/> Traitement…</>
                  : confirmModal.action === 'valider'
                    ? <><CheckCircle size={16}/> Valider le paiement</>
                    : <><XCircle size={16}/> Invalider le paiement</>}
              </button>
            </div>
          </div>
        </div>
      )}
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

/* ── Page Contacts ── */
function PageContacts({ token }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterAppele, setFilterAppele] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [processing, setProcessing] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try { setContacts(await apiListContacts(token)); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleToggleAppele = async (id) => {
    setProcessing(`appele-${id}`); setError('');
    try {
      const updated = await apiToggleContactAppele(token, id);
      setContacts(prev => prev.map(c => c.id === id ? updated : c));
    } catch (e) { setError(e.message); } finally { setProcessing(null); }
  };

  const handleDelete = async (id) => {
    setProcessing(`delete-${id}`); setError('');
    try {
      await apiDeleteContact(token, id);
      setContacts(prev => prev.filter(c => c.id !== id));
      setDeleteModal(null);
    } catch (e) { setError(e.message); } finally { setProcessing(null); }
  };

  const handleUpdate = async (id, payload) => {
    setProcessing(`edit-${id}`); setError('');
    try {
      const updated = await apiUpdateContact(token, id, payload);
      setContacts(prev => prev.map(c => c.id === id ? updated : c));
      setEditModal(null);
    } catch (e) { setError(e.message); } finally { setProcessing(null); }
  };

  const filtered = contacts.filter(c => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      c.nom_complet?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.sujet?.toLowerCase().includes(q) ||
      c.telephone?.toLowerCase().includes(q);
    const matchAppele = !filterAppele ||
      (filterAppele === 'appele' && c.appele) ||
      (filterAppele === 'non_appele' && !c.appele);
    return matchSearch && matchAppele;
  });

  const total = contacts.length;
  const appeles = contacts.filter(c => c.appele).length;
  const nonAppeles = total - appeles;

  return (
    <div className="cons-page">
      <h2 className="cons-page__title">Messages de contact</h2>
      <p className="cons-page__sub">Gestion des demandes reçues via le formulaire de contact.</p>

      <div className="cons-stats" style={{ marginBottom: '1.25rem' }}>
        <div className="cons-stat-card" style={{ borderTop: '3px solid #64748b' }}>
          <span className="cons-stat-card__icon" style={{ background: '#f1f5f9', color: '#475569' }}><Mail size={18}/></span>
          <span className="cons-stat-card__value">{total}</span>
          <span className="cons-stat-card__label">Total messages</span>
        </div>
        <div className="cons-stat-card" style={{ borderTop: '3px solid #16a34a' }}>
          <span className="cons-stat-card__icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><CheckCircle size={18}/></span>
          <span className="cons-stat-card__value" style={{ color: '#16a34a' }}>{appeles}</span>
          <span className="cons-stat-card__label">Appelés</span>
        </div>
        <div className="cons-stat-card" style={{ borderTop: '3px solid #f59e0b' }}>
          <span className="cons-stat-card__icon" style={{ background: '#fffbeb', color: '#f59e0b' }}><Clock size={18}/></span>
          <span className="cons-stat-card__value" style={{ color: '#f59e0b' }}>{nonAppeles}</span>
          <span className="cons-stat-card__label">À appeler</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem', background: '#fff', padding: '.75rem 1rem', borderRadius: '.5rem', border: '1px solid #e2e8f0' }}>
        <input
          type="text"
          placeholder="Rechercher (nom, email, sujet...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}
        />
        <select value={filterAppele} onChange={e => setFilterAppele(e.target.value)} style={{ padding: '.4rem .6rem', border: '1px solid #cbd5e1', borderRadius: '.4rem', fontSize: '.85rem' }}>
          <option value="">Tous statuts</option>
          <option value="non_appele">À appeler</option>
          <option value="appele">Appelés</option>
        </select>
      </div>

      {error && <div className="auth-error" style={{ margin: '0 0 1rem' }}><AlertCircle size={15}/> {error}</div>}

      <TableWrap loading={loading} error={''}>
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Sujet</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Aucun message trouvé.</td></tr>}
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.id}</td>
                  <td>{c.nom_complet}</td>
                  <td style={{ fontSize: '.8rem' }}>{c.email}</td>
                  <td style={{ fontSize: '.8rem' }}>{c.telephone || '—'}</td>
                  <td style={{ fontSize: '.8rem' }}>{c.sujet}</td>
                  <td>
                    {c.appele
                      ? <span className="status-badge status-badge--green"><Check size={12} style={{ display: 'inline', marginRight: '.25rem' }}/>Appelé</span>
                      : <span className="status-badge status-badge--orange"><XCircle size={12} style={{ display: 'inline', marginRight: '.25rem' }}/>À appeler</span>}
                  </td>
                  <td style={{ fontSize: '.8rem' }}>{new Date(c.createdAt).toLocaleString('fr-FR')}</td>
                  <td>
                    <div className="sa-actions">
                      <button className="sa-btn sa-btn--blue" onClick={() => setViewModal(c)} title="Voir"><Eye size={14}/></button>
                      <button className="sa-btn sa-btn--green" onClick={() => handleToggleAppele(c.id)} disabled={processing === `appele-${c.id}`} title={c.appele ? 'Marquer non appelé' : 'Marquer appelé'}>
                        {processing === `appele-${c.id}` ? <Loader size={14} className="auth-spinner"/> : c.appele ? <XCircle size={14}/> : <CheckCircle size={14}/>}
                      </button>
                      <button className="sa-btn sa-btn--orange" onClick={() => setEditModal(c)} title="Modifier"><Pencil size={14}/></button>
                      <button className="sa-btn sa-btn--red" onClick={() => setDeleteModal(c)} title="Supprimer"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableWrap>

      {viewModal && (
        <div className="modal-overlay" onClick={() => setViewModal(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Message de {viewModal.nom_complet}</h3>
              <button className="modal__close" onClick={() => setViewModal(null)}><X size={18}/></button>
            </div>
            <div className="modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              <div><strong>Email :</strong> <a href={`mailto:${viewModal.email}`}>{viewModal.email}</a></div>
              <div><strong>Téléphone :</strong> {viewModal.telephone || '—'}</div>
              <div><strong>Sujet :</strong> {viewModal.sujet}</div>
              <div><strong>Statut :</strong> {viewModal.appele ? 'Appelé' : 'À appeler'}</div>
              <div><strong>Date :</strong> {new Date(viewModal.createdAt).toLocaleString('fr-FR')}</div>
              <div style={{ marginTop: '.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '.5rem' }}>
                <strong>Message :</strong>
                <p style={{ margin: '.5rem 0 0', whiteSpace: 'pre-wrap' }}>{viewModal.message}</p>
              </div>
            </div>
            <div className="modal__footer">
              <button className="form-back" onClick={() => setViewModal(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <ContactEditModal
          token={token}
          contact={editModal}
          onClose={() => setEditModal(null)}
          onSubmit={(payload) => handleUpdate(editModal.id, payload)}
          processing={processing === `edit-${editModal.id}`}
        />
      )}

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal modal--confirm" onClick={e => e.stopPropagation()}>
            <div className="modal__header modal__header--danger">
              <div className="modal__header-icon"><AlertTriangle size={20}/></div>
              <h3 className="modal__title">Supprimer le message</h3>
              <button className="modal__close" onClick={() => setDeleteModal(null)} disabled={processing === `delete-${deleteModal.id}`}><X size={18}/></button>
            </div>
            <div className="modal__body">
              <p>Êtes-vous sûr de vouloir supprimer le message de <strong>{deleteModal.nom_complet}</strong> ? Cette action est irréversible.</p>
            </div>
            <div className="modal__footer">
              <button className="form-back" onClick={() => setDeleteModal(null)} disabled={processing === `delete-${deleteModal.id}`}>Annuler</button>
              <button className="btn btn--delete" onClick={() => handleDelete(deleteModal.id)} disabled={processing === `delete-${deleteModal.id}`}>
                {processing === `delete-${deleteModal.id}` ? <><Loader size={16} className="auth-spinner"/> Suppression…</> : <><Trash2 size={16}/> Supprimer</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactEditModal({ contact, onClose, onSubmit, processing }) {
  const [form, setForm] = useState({
    nom_complet: contact.nom_complet || '',
    email: contact.email || '',
    telephone: contact.telephone || '',
    sujet: contact.sujet || '',
    message: contact.message || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom_complet.trim() || !form.email.trim() || !form.sujet.trim() || !form.message.trim()) {
      setError('Les champs nom, email, sujet et message sont requis.');
      return;
    }
    onSubmit({
      nom_complet: form.nom_complet.trim(),
      email: form.email.trim(),
      telephone: form.telephone.trim() || undefined,
      sujet: form.sujet.trim(),
      message: form.message.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Modifier le message</h3>
          <button className="modal__close" onClick={onClose} disabled={processing}><X size={18}/></button>
        </div>
        <div className="modal__body">
          {error && <div className="auth-error" style={{ margin: '0 0 1rem' }}><AlertCircle size={15}/> {error}</div>}
          <form id="edit-contact-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nom complet *</label>
              <input className="form-input" value={form.nom_complet} onChange={e => setForm(f => ({ ...f, nom_complet: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input className="form-input" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Sujet *</label>
              <input className="form-input" value={form.sujet} onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea rows={5} className="form-textarea" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
            </div>
          </form>
        </div>
        <div className="modal__footer">
          <button className="form-back" onClick={onClose} disabled={processing}>Annuler</button>
          <button type="submit" form="edit-contact-form" className="form-submit" disabled={processing}>
            {processing ? <><Loader size={14} className="auth-spinner"/> Enregistrement…</> : <><CheckCircle size={14}/> Enregistrer</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Composant principal ── */
export default function DashboardSuperAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession]       = useState(null);
  const [mobileNav, setMobileNav]   = useState(false);
  const section = location.pathname.split('/').filter(Boolean).at(-1);
  const activePage = NAV_ITEMS.some(item => item.id === section) ? section : 'dashboard';

  useEffect(() => {
    const s = getPersonnelSession();
    if (!s.token || !s.personnel) { navigate('/personnel'); return; }
    setSession(s);
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

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':     return <PageDashboard token={token} />;
      case 'dossiers':      return <PageDossiers token={token} personnel={personnel} />;
      case 'etudiants':     return <PageEtudiants token={token} personnel={personnel} />;
      case 'conseillers':   return <PageConseillers token={token} />;
      case 'paiement':      return <PagePaiement token={token} />;
      case 'contacts':      return <PageContacts token={token} />;
      case 'historique':    return <PageHistorique />;
      case 'messages':      return <PageMessages conversations={msg.conversations} messages={msg.messages} activeChat={msg.activeChat} unreadCount={msg.unreadCount} userEmail={personnel.email} onSelectChat={msg.loadConversation} onSend={msg.send} />;
      case 'notifications': return <PageNotifications notifications={notifications} loading={notifLoading} unread={unread} markRead={markRead} markAllRead={markAllRead} />;
      default:              return null;
    }
  };

  return (
    <div className="cons-layout">
      {/* ── Header ── */}
      <header className="cons-header sa-header">
        <div className="cons-header__brand">
          <img src={logoHeader} alt="Capadmis" style={{ height: 28, width: 'auto', display: 'block' }} />
          <span className="cons-header__role-badge sa-badge">Super Admin</span>
        </div>

        <nav className="cons-header__nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`cons-nav-btn${activePage === id ? ' cons-nav-btn--active' : ''}`} onClick={() => navigate(`/dashboard/superadmin/${id}`)}>
              <span style={{position:'relative',display:'inline-flex'}}>
                <Icon size={15} />
                {id === 'notifications' && unread > 0 && <span className="notif-dot">{unread > 9 ? '9+' : unread}</span>}
                {id === 'messages' && msg.unreadCount > 0 && <span className="notif-dot">{msg.unreadCount > 9 ? '9+' : msg.unreadCount}</span>}
              </span>
              <span className="cons-nav-label">{label}</span>
            </button>
          ))}
        </nav>

        <div className="cons-header__user">
          <span className="cons-header__user-name">
            {personnel.prenom} {personnel.nom}
            <span className="cons-header__user-code">({personnel.code})</span>
          </span>
          <button className="cons-logout-btn" onClick={handleLogout}>
            <LogOut size={14} /> Déconnexion
          </button>
          <button className="cons-mobile-toggle" onClick={() => setMobileNav(v => !v)}>
            {mobileNav ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Nav mobile */}
      {mobileNav && (
        <div className="cons-mobile-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`cons-mobile-nav__item${activePage === id ? ' cons-mobile-nav__item--active' : ''}`}
              onClick={() => { navigate(`/dashboard/superadmin/${id}`); setMobileNav(false); }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      )}

      <main className="cons-main">
        {renderPage()}
      </main>
    </div>
  );
}
