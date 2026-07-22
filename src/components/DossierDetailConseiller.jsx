import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Loader, AlertCircle, Send, Pencil, Eye, User, FolderOpen, CheckCircle, Upload, MessageSquare, Mail, MapPin, Globe, BookOpen, FileText, Calendar, Shield, Award, School, Trash2, Plus, Download } from 'lucide-react';
import { apiGetInfosDossier, apiListPiecesJointes, apiGetPieceJointeUrl, apiUpdateDossierStatus, apiAddPieceJointe, apiUpdatePieceJointeStatus, apiPutInfosDossier, apiPatchPaiement, apiListDossiersUniversite, apiListDossiersUniversiteByDossier, apiCreateDossierUniversite, apiUpdateDossierUniversite, apiDeleteDossierUniversite } from '../api/auth';
import { useMessageModal } from '../context/MessageModalContext';

const STATUS_OPTIONS      = ['EN_COURS_D_ETUDE','VALIDE','INVALIDE','EN_ATTENTE','CHANGEMENT_A_APPORTER'];
const STATUS_ADM_OPTIONS  = ['ADMISSION_EN_COURS','ADMISSION_VALIDE','ADMISSION_INVALIDE'];
const STATUS_VISA_OPTIONS = ['DEMANDE_VISA_EN_COURS','DEMANDE_VISA_VALIDE','DEMANDE_VISA_INVALIDE'];

const STATUS_LABELS = {
  EN_COURS_D_ETUDE:'En cours d\'étude', VALIDE:'Validé', INVALIDE:'Invalide',
  EN_ATTENTE:'En attente', CHANGEMENT_A_APPORTER:'Changement requis',
  ADMISSION_EN_COURS:'Admission en cours', ADMISSION_VALIDE:'Admission validée', ADMISSION_INVALIDE:'Admission invalidée',
  DEMANDE_VISA_EN_COURS:'Visa en cours', DEMANDE_VISA_VALIDE:'Visa validé', DEMANDE_VISA_INVALIDE:'Visa invalidé',
};

function StatusBadge({ value, size = 'sm' }) {
  if (!value) return <span style={{ color:'#94a3b8' }}>—</span>;
  const green=['VALIDE','ADMISSION_VALIDE','DEMANDE_VISA_VALIDE'];
  const red=['INVALIDE','ADMISSION_INVALIDE','DEMANDE_VISA_INVALIDE'];
  const orange=['EN_ATTENTE','CHANGEMENT_A_APPORTER'];
  const c = green.includes(value)?'green':red.includes(value)?'red':orange.includes(value)?'orange':'blue';
  const colors = {
    green: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
    red:   { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
    orange:{ bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
    blue:  { bg: '#f5f0e4', text: '#0c1c3f', border: '#efe3cb' },
  };
  const style = colors[c];
  const padding = size === 'lg' ? '.5rem 1rem' : '.2rem .55rem';
  const fontSize = size === 'lg' ? '.85rem' : '.75rem';
  return (
    <span style={{
      background: style.bg, color: style.text, border: `1px solid ${style.border}`,
      padding, borderRadius: '999px', fontSize, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '.3rem',
    }}>
      <span style={{width:6,height:6,borderRadius:'50%',background:style.text,display:'inline-block'}}></span>
      {STATUS_LABELS[value]||value}
    </span>
  );
}

/* ── Modal changer statut ── */
function ModalChangerStatut({ token, dossier, isAdmin, isAdmission, isVisa, onClose, onSuccess }) {
  const [status, setStatus] = useState(dossier.status);
  const [statusAdmission, setStatusAdmission] = useState(dossier.status_admission);
  const [statusVisa, setStatusVisa] = useState(dossier.status_visa);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isConseiller = isAdmin || isAdmission || isVisa;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {};
      if (!isConseiller) payload.status = status;
      if (isAdmin || isAdmission) payload.status_admission = statusAdmission;
      if (isAdmin || isVisa) payload.status_visa = statusVisa;
      const updated = await apiUpdateDossierStatus(token, dossier.id, payload);
      onSuccess(updated);
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={ev => ev.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Changer le statut — {dossier.code_dossier}</h3>
          <button className="modal__close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal__body">
          {error && <div className="auth-error" style={{margin:'0 0 1rem'}}><AlertCircle size={15}/> {error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {!isConseiller && (
              <div className="form-group">
                <label className="form-label">Statut global</label>
                <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
            )}
            {(isAdmin || isAdmission) && (
              <div className="form-group">
                <label className="form-label">Statut admission</label>
                <select className="form-select" value={statusAdmission} onChange={e => setStatusAdmission(e.target.value)}>
                  {STATUS_ADM_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                {statusAdmission === 'ADMISSION_EN_COURS' && (
                  <p style={{ margin: '.4rem 0 0', color: '#166534', fontSize: '.78rem' }}>
                    Le statut global sera automatiquement défini sur « Validé ».
                  </p>
                )}
              </div>
            )}
            {(isAdmin || isVisa) && (
              <div className="form-group">
                <label className="form-label">Statut visa</label>
                <select className="form-select" value={statusVisa} onChange={e => setStatusVisa(e.target.value)}>
                  {STATUS_VISA_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
            )}
            <div className="modal__footer" style={{marginTop:0}}>
              <button type="button" className="form-back" onClick={onClose}>Annuler</button>
              <button type="submit" className="form-submit" disabled={saving}>
                {saving ? <Loader size={14} className="auth-spinner"/> : <CheckCircle size={14}/>}
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Modal dossier université ── */
const UNIV_STATUS_OPTIONS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'accepte', label: 'Accepté' },
  { value: 'refuse', label: 'Refusé' },
];

function ModalDossierUniversite({ token, codeDossier, initial, onClose, onSuccess }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    filiere: initial?.filiere || '',
    universite: initial?.universite || '',
    pays: initial?.pays || '',
    ville: initial?.ville || '',
    region: initial?.region || '',
    statut: initial?.statut || 'en_attente',
    message_universite: initial?.message_universite || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = { code_dossier: codeDossier, ...form };
      if (isEdit) {
        await apiUpdateDossierUniversite(token, initial.id, payload);
      } else {
        await apiCreateDossierUniversite(token, payload);
      }
      onSuccess();
      onClose();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={ev => ev.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{isEdit ? 'Modifier' : 'Ajouter'} un dossier université</h3>
          <button className="modal__close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal__body">
          {error && <div className="auth-error" style={{margin:'0 0 1rem'}}><AlertCircle size={15}/> {error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'.875rem'}}>
            <div className="form-group">
              <label className="form-label">Université</label>
              <input className="form-input" value={form.universite} onChange={e => handleChange('universite', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Filière</label>
              <input className="form-input" value={form.filiere} onChange={e => handleChange('filiere', e.target.value)} required />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.875rem'}}>
              <div className="form-group">
                <label className="form-label">Pays</label>
                <input className="form-input" value={form.pays} onChange={e => handleChange('pays', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Ville</label>
                <input className="form-input" value={form.ville} onChange={e => handleChange('ville', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Région</label>
              <input className="form-input" value={form.region} onChange={e => handleChange('region', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Statut</label>
              <select className="form-select" value={form.statut} onChange={e => handleChange('statut', e.target.value)}>
                {UNIV_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Message de l'université</label>
              <textarea className="form-textarea" rows={3} value={form.message_universite} onChange={e => handleChange('message_universite', e.target.value)} placeholder="Réponse de l'université, bourse…"/>
            </div>
            <div className="modal__footer" style={{marginTop:0}}>
              <button type="button" className="form-back" onClick={onClose}>Annuler</button>
              <button type="submit" className="form-submit" disabled={saving}>
                {saving ? <Loader size={14} className="auth-spinner"/> : <CheckCircle size={14}/>}
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Modal prévisualisation pièce jointe ── */
function ModalPreviewPJ({ piece, url, onClose }) {
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(piece.nom || '');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--preview" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{piece.nom || piece.type}</h3>
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="info-card__edit-btn" style={{ textDecoration: 'none' }}>
              <Download size={14} /> Télécharger
            </a>
            <button className="modal__close" onClick={onClose}><X size={18} /></button>
          </div>
        </div>
        <div className="modal__body pj-preview__body">
          {isImage
            ? <img src={url} alt={piece.nom || piece.type} className="pj-preview__img" />
            : <iframe src={url} className="pj-preview__iframe" title={piece.nom || piece.type} />}
        </div>
      </div>
    </div>
  );
}

/* ── Labels statuts pièces jointes ── */
const PJ_STATUS_OPTIONS = ['EN_COURS_DE_VERIFICATION','A_CHANGER','VALIDE'];
const PJ_STATUS_LABELS = {
  EN_COURS_DE_VERIFICATION:'En cours de vérification', A_CHANGER:'À changer', VALIDE:'Validé',
};

/* ── Types de pièces jointes (TypePieceJointe) ── */
const PJ_TYPES = [
  { value: 'PHOTO_PROFIL', label: 'Photo d\'identité / profil' },
  { value: 'PASSEPORT', label: 'Passeport' },
  { value: 'CARTE_IDENTITE', label: 'Carte d\'identité nationale' },
  { value: 'DIPLOME_BAC', label: 'Diplôme du baccalauréat' },
  { value: 'DIPLOME_LICENCE', label: 'Diplôme de licence' },
  { value: 'DIPLOME_MASTER', label: 'Diplôme de master' },
  { value: 'DIPLOME_DOCTORAT', label: 'Diplôme de doctorat' },
  { value: 'ATTESTATION', label: 'Attestation diverse' },
  { value: 'RELEVE_NOTES_BAC', label: 'Relevé de notes — baccalauréat' },
  { value: 'BULLETIN_NOTES_SECONDE', label: 'Bulletin — Seconde' },
  { value: 'BULLETIN_NOTES_PREMIERE', label: 'Bulletin — Première' },
  { value: 'BULLETIN_NOTES_TERMINALE', label: 'Bulletin — Terminale' },
  { value: 'BULLETIN_NOTES_LICENCE_1', label: 'Bulletin — Licence 1' },
  { value: 'BULLETIN_NOTES_LICENCE_2', label: 'Bulletin — Licence 2' },
  { value: 'BULLETIN_NOTES_LICENCE_3', label: 'Bulletin — Licence 3' },
  { value: 'BULLETIN_NOTES_MASTER_1', label: 'Bulletin — Master 1' },
  { value: 'BULLETIN_NOTES_MASTER_2', label: 'Bulletin — Master 2' },
  { value: 'BULLETIN_NOTES_DOCTORAT', label: 'Bulletin — Doctorat' },
  { value: 'LETTRE_MOTIVATION', label: 'Lettre de motivation' },
  { value: 'CV', label: 'Curriculum vitae' },
  { value: 'AUTRE', label: 'Autre document' },
];

const NIVEAUX_LISTE    = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat', 'BTS', 'DUT', 'Prépa', 'Autre'];
const PAYS_CIBLE_LISTE = ['France', 'Canada', 'Belgique', 'Suisse', 'Espagne', 'Allemagne', 'Royaume-Uni', 'Italie', 'Portugal', 'Maroc', 'Autre'];

/* ── Modal infos académiques ── */
function ModalInfosAcademiques({ token, codeDossier, infos, onClose, onSuccess }) {
  const [form, setForm] = useState({
    niveau_etude:     infos?.niveau_etude || '',
    pays_souhaite:    infos?.pays_souhaite || '',
    filieres:         infos?.filieres?.join(', ') || '',
    nombre_fois_bac:  infos?.nombre_fois_bac ?? 1,
    serie_bac:        infos?.serie_bac || '',
    formation_en_cours: infos?.formation_en_cours || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const updated = await apiPutInfosDossier(token, codeDossier, {
        niveau_etude:     form.niveau_etude,
        pays_souhaite:    form.pays_souhaite,
        filieres:         form.filieres.split(',').map(s => s.trim()).filter(Boolean),
        nombre_fois_bac:  Number(form.nombre_fois_bac),
        serie_bac:        form.serie_bac,
        formation_en_cours: form.formation_en_cours,
      });
      onSuccess(updated);
      onClose();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={ev => ev.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Modifier les informations académiques</h3>
          <button className="modal__close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal__body">
          {error && <div className="auth-error" style={{margin:'0 0 1rem'}}><AlertCircle size={15}/> {error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div className="form-group">
              <label className="form-label">Niveau d'étude</label>
              <select className="form-select" value={form.niveau_etude} onChange={e => set('niveau_etude', e.target.value)} required>
                <option value="">Sélectionner</option>
                {NIVEAUX_LISTE.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Pays souhaité</label>
              <select className="form-select" value={form.pays_souhaite} onChange={e => set('pays_souhaite', e.target.value)} required>
                <option value="">Sélectionner</option>
                {PAYS_CIBLE_LISTE.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Filières souhaitées <span style={{ color: '#94a3b8', fontWeight: 400 }}>(séparées par des virgules)</span></label>
              <input className="form-input" value={form.filieres} onChange={e => set('filieres', e.target.value)} placeholder="Ex: Informatique, Génie logiciel" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Série bac</label>
                <input className="form-input" value={form.serie_bac} onChange={e => set('serie_bac', e.target.value)} placeholder="Ex: S2, L, SMS" required />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre de fois au bac</label>
                <input type="number" min={1} className="form-input" value={form.nombre_fois_bac} onChange={e => set('nombre_fois_bac', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Formation en cours</label>
              <input className="form-input" value={form.formation_en_cours} onChange={e => set('formation_en_cours', e.target.value)} placeholder="Ex: Licence Informatique" required />
            </div>
            <div className="modal__footer" style={{marginTop:0}}>
              <button type="button" className="form-back" onClick={onClose}>Annuler</button>
              <button type="submit" className="form-submit" disabled={saving}>
                {saving ? <Loader size={14} className="auth-spinner"/> : <CheckCircle size={14}/>}
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Composant principal ── */
export default function DossierDetailConseiller({ token, personnel, dossier, onClose, onRefresh, onOpenChat, asPage }) {
  const { openMessageModal } = useMessageModal();
  const [infos, setInfos] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusModal, setStatusModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updatingPj, setUpdatingPj] = useState(null);
  const [updatingInfos, setUpdatingInfos] = useState(false);
  const [updatingPaiement, setUpdatingPaiement] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [dossiersUniv, setDossiersUniv] = useState([]);
  const [univModal, setUnivModal] = useState(null);
  const [savingUniv, setSavingUniv] = useState(false);
  const [deletingUniv, setDeletingUniv] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(null);
  const [infosModal, setInfosModal] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const i = await apiGetInfosDossier(token, dossier.code_dossier);
      setInfos(i);
    } catch { setInfos(null); }
    try {
      const p = await apiListPiecesJointes(token, dossier.code_dossier);
      setPieces(p);
    } catch { setPieces([]); }
    try {
      const u = await apiListDossiersUniversiteByDossier(token, dossier.code_dossier);
      setDossiersUniv(u);
    } catch {
      try {
        const all = await apiListDossiersUniversite(token);
        setDossiersUniv(all.filter(u => u.code_dossier === dossier.code_dossier));
      } catch { setDossiersUniv([]); }
    }
    setLoading(false);
  }, [token, dossier.code_dossier]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const handlePreview = async (piece) => {
    setPreviewLoading(piece.id);
    try {
      const { url } = await apiGetPieceJointeUrl(token, piece.id);
      setPreview({ piece, url });
    } catch (e) { alert(e.message); }
    finally { setPreviewLoading(null); }
  };

  const isAdmin     = personnel.role?.includes('admin');
  const isAdmission = personnel.role?.includes('admission');
  const isVisa      = personnel.role?.includes('visa');

  const handleAddPieceJointe = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!uploadType) { alert('Veuillez sélectionner un type de document.'); if (fileInputRef.current) fileInputRef.current.value = ''; return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('fichier', file);
      formData.append('codeDossier', dossier.code_dossier);
      formData.append('type', uploadType);
      await apiAddPieceJointe(token, formData);
      setUploadType('');
      const p = await apiListPiecesJointes(token, dossier.code_dossier);
      setPieces(p);
    } catch (err) { alert(err.message); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleUpdatePjStatus = async (id, status) => {
    const oldStatus = pieces.find(p => p.id === id)?.status;
    setPieces(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    setUpdatingPj(id);
    try {
      await apiUpdatePieceJointeStatus(token, id, status);
    } catch (err) {
      setPieces(prev => prev.map(p => p.id === id ? { ...p, status: oldStatus } : p));
      alert(err.message);
    } finally { setUpdatingPj(null); }
  };

  const handleUpdateInfosStatus = async (newStatus) => {
    if (!infos) return;
    const oldStatus = infos.status;
    setInfos(prev => ({ ...prev, status: newStatus }));
    setUpdatingInfos(true);
    try {
      await apiPutInfosDossier(token, dossier.code_dossier, {
        niveau_etude: infos.niveau_etude,
        pays_souhaite: infos.pays_souhaite,
        filieres: infos.filieres,
        nombre_fois_bac: infos.nombre_fois_bac,
        serie_bac: infos.serie_bac,
        formation_en_cours: infos.formation_en_cours,
        status: newStatus,
      });
    } catch (err) {
      setInfos(prev => ({ ...prev, status: oldStatus }));
      alert(err.message);
    } finally { setUpdatingInfos(false); }
  };

  const handleTogglePaiement = async () => {
    if (!infos) return;
    const oldValue = infos.paiement;
    setInfos(prev => ({ ...prev, paiement: !oldValue }));
    setUpdatingPaiement(true);
    try {
      await apiPatchPaiement(token, dossier.code_dossier, !oldValue);
    } catch (err) {
      setInfos(prev => ({ ...prev, paiement: oldValue }));
      alert(err.message);
    } finally { setUpdatingPaiement(false); }
  };

  const cardStyle = { background:'#fff', borderRadius:'.75rem', boxShadow:'0 1px 3px rgba(0,0,0,.06)', border:'1px solid #eef2f7', overflow:'hidden' };
  const cardHeader = { padding:'.9rem 1.25rem', borderBottom:'1px solid #eef2f7', display:'flex', alignItems:'center', gap:'.5rem', fontWeight:700, fontSize:'.9rem', color:'#1e293b' };
  const cardBody = { padding:'1.25rem' };
  const infoRow = { display:'flex', alignItems:'center', gap:'.6rem', padding:'.4rem 0', fontSize:'.875rem', color:'#334155' };
  const labelStyle = { color:'#64748b', minWidth:110, fontSize:'.8rem', fontWeight:500 };
  const btnPrimary = { background:'#c5a150', color:'#fff', border:'none', borderRadius:'.5rem', padding:'.4rem .85rem', fontSize:'.8rem', fontWeight:500, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'.35rem' };
  const btnGhost = { background:'#f1f5f9', color:'#475569', border:'1px solid #e2e8f0', borderRadius:'.5rem', padding:'.4rem .85rem', fontSize:'.8rem', fontWeight:500, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'.35rem' };

  const SectionCard = ({ icon: Icon, title, children, action }) => (
    <section style={cardStyle}>
      <div style={cardHeader}>
        {Icon && <Icon size={16} color="#c5a150"/>}
        <span style={{flex:1}}>{title}</span>
        {action}
      </div>
      <div style={cardBody}>{children}</div>
    </section>
  );

  const content = (
    <>
      {loading ? (
        <div style={{display:'flex',gap:'.6rem',alignItems:'center',color:'#94a3b8',padding:'3rem 0',justifyContent:'center'}}>
          <Loader size={18} className="auth-spinner"/> Chargement…
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>

          {/* ── Header étudiant ── */}
          <div style={{display:'flex',alignItems:'center',gap:'1.25rem',background:'#0c1c3f',borderRadius:'.75rem',padding:'1.25rem 1.5rem',color:'#fff'}}>
            <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.25rem',fontWeight:700}}>
              {dossier.etudiant?.prenom?.charAt(0)}{dossier.etudiant?.nom?.charAt(0)}
            </div>
            {/* un console.log pour dossier */}
            {/* {console.log(dossier)} */}
            <div style={{flex:1}}>
              <div style={{fontSize:'1.1rem',fontWeight:700}}>{dossier.etudiant?.prenom} {dossier.etudiant?.nom}</div>
              <div style={{fontSize:'.8rem',opacity:.9,display:'flex',gap:'1rem',marginTop:'.25rem',flexWrap:'wrap'}}>
                <span style={{display:'flex',alignItems:'center',gap:'.25rem'}}><Mail size={12}/> {dossier.etudiant?.email}</span>
                <span style={{display:'flex',alignItems:'center',gap:'.25rem'}}><MapPin size={12}/> {dossier.etudiant?.ville || '—'} — {dossier.etudiant?.payes || '—'}</span>
                <span style={{display:'flex',alignItems:'center',gap:'.25rem'}}><User size={12}/> Lieu de naissance: {dossier.etudiant?.lieu_de_naissance || '—'}</span>
                {/* bien formater la date de naissance */}
                <span style={{display:'flex',alignItems:'center',gap:'.25rem'}}><Calendar size={12}/> Date de naissance: {dossier.etudiant?.date_de_naissance ? new Date(dossier.etudiant.date_de_naissance).toLocaleDateString('fr-FR') : '—'}</span>
              </div>
            </div>
            <StatusBadge value={dossier.etudiant?.bloque ? 'INVALIDE' : 'VALIDE'} size="lg"/>
          </div>

          {/* ── Statuts dossier ── */}
          <SectionCard icon={Shield} title="Statuts du dossier" action={
            <button style={btnPrimary} onClick={() => setStatusModal(true)}><Pencil size={12}/> Modifier</button>
          }>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'.75rem'}}>
              {[
                {label:'Statut global', val:dossier.status, icon:FileText},
                {label:'Admission', val:dossier.status_admission, icon:Award},
                {label:'Visa', val:dossier.status_visa, icon:Globe},
              ].map(s => (
                <div key={s.label} style={{background:'#f8fafc',borderRadius:'.5rem',padding:'.75rem',textAlign:'center'}}>
                  <div style={{fontSize:'.75rem',color:'#64748b',marginBottom:'.4rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'.25rem'}}>
                    <s.icon size={12} color="#64748b"/> {s.label}
                  </div>
                  <StatusBadge value={s.val} size="lg"/>
                </div>
              ))}
            </div>
            <div style={{marginTop:'1rem',display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
              {dossier.etudiant?.email && (
                <>
                  <button style={btnGhost} onClick={() => openMessageModal(token, dossier.etudiant.email, `${dossier.etudiant.prenom} ${dossier.etudiant.nom}`)}>
                    <Send size={12}/> Message
                  </button>
                  {onOpenChat && (
                    <button style={btnGhost} onClick={() => onOpenChat(dossier.etudiant.email)}>
                      <MessageSquare size={12}/> Conversation
                    </button>
                  )}
                </>
              )}
            </div>
          </SectionCard>

          {/* ── Infos académiques ── */}
          <SectionCard icon={BookOpen} title="Informations académiques" action={infos && (
            <div style={{display:'flex',alignItems:'center',gap:'.5rem',flexWrap:'wrap'}}>
              <button style={{...btnGhost,fontSize:'.75rem',padding:'.2rem .5rem'}} onClick={() => setInfosModal(true)} title="Modifier">
                <Pencil size={12}/> Modifier
              </button>
              <button
                style={{...btnGhost,fontSize:'.75rem',padding:'.2rem .5rem',background:infos.paiement?'#dcfce7':'#fee2e2',color:infos.paiement?'#166534':'#991b1b',borderColor:infos.paiement?'#bbf7d0':'#fecaca'}}
                onClick={() => handleTogglePaiement()}
                disabled={updatingPaiement}
              >
                {updatingPaiement ? <Loader size={12} className="auth-spinner"/> : <CheckCircle size={12}/>}
                {infos.paiement ? 'Payé' : 'Non payé'}
              </button>
              <span style={{fontSize:'.75rem',color:'#64748b'}}>Statut :</span>
              <select
                className="form-select"
                style={{fontSize:'.75rem',padding:'.2rem .5rem',minWidth:120,borderRadius:'.4rem'}}
                value={infos.status || 'EN_ATTENTE'}
                onChange={e => handleUpdateInfosStatus(e.target.value)}
                disabled={updatingInfos}
              >
                {['EN_ATTENTE','VALIDE','INVALIDE'].map(s => <option key={s} value={s}>{STATUS_LABELS[s]||s}</option>)}
              </select>
              {updatingInfos && <Loader size={14} className="auth-spinner"/>}
            </div>
          )}>
            {infos ? (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.35rem 1.5rem'}}>
                <div style={infoRow}><span style={labelStyle}><BookOpen size={13}/> Niveau actuel :</span> {infos.niveau_etude || '—'}</div>
                <div style={infoRow}><span style={labelStyle}><Globe size={13}/> Pays souhaité :</span> {infos.pays_souhaite || '—'}</div>
                <div style={{...infoRow,gridColumn:'span 2'}}><span style={labelStyle}><FolderOpen size={13}/> Filières souhaitées :</span> {infos.filieres?.join(', ') || '—'}</div>
                <div style={infoRow}><span style={labelStyle}><Calendar size={13}/> Série bac :</span> {infos.serie_bac || '—'}</div>
                <div style={infoRow}><span style={labelStyle}><Calendar size={13}/> Nombre de fois au bac :</span> {infos.nombre_fois_bac ?? '—'}</div>
                <div style={{...infoRow,gridColumn:'span 2'}}><span style={labelStyle}><BookOpen size={13}/> Formation en cours :</span> {infos.formation_en_cours || '—'}</div>
                <div style={infoRow}><span style={labelStyle}><Shield size={13}/> Statut :</span><StatusBadge value={infos.status}/></div>
                <div style={infoRow}><span style={labelStyle}><CheckCircle size={13}/> Paiement :</span><StatusBadge value={infos.paiement?'VALIDE':'INVALIDE'}/></div>
              </div>
            ) : (
              <p style={{color:'#94a3b8',fontSize:'.875rem',margin:0}}>Aucune information académique renseignée.</p>
            )}
          </SectionCard>

          {/* ── Pièces jointes ── */}
          <SectionCard icon={FileText} title={`Pièces jointes (${pieces.length})`} action={
            <div style={{display:'flex',alignItems:'center',gap:'.5rem',flexWrap:'wrap'}}>
              <select
                className="form-select"
                style={{fontSize:'.75rem',padding:'.25rem .5rem',borderRadius:'.4rem',minWidth:160}}
                value={uploadType}
                onChange={e => setUploadType(e.target.value)}
                disabled={uploading}
              >
                <option value="">Type de document…</option>
                {PJ_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <label style={{...btnPrimary,cursor:'pointer',opacity:uploadType?1:.6}}>
                <Upload size={12}/> Ajouter
                <input ref={fileInputRef} type="file" style={{display:'none'}} onChange={handleAddPieceJointe} disabled={uploading || !uploadType}/>
              </label>
            </div>
          }>
            {uploading && (
              <div style={{display:'flex',alignItems:'center',gap:'.5rem',color:'#64748b',fontSize:'.8rem',marginBottom:'.75rem'}}>
                <Loader size={14} className="auth-spinner"/> Upload en cours…
              </div>
            )}
            {pieces.length === 0 ? (
              <div style={{textAlign:'center',padding:'1.5rem',color:'#94a3b8',fontSize:'.875rem'}}>
                <FileText size={32} strokeWidth={1.2} style={{marginBottom:'.5rem',opacity:.5}}/>
                <p style={{margin:0}}>Aucune pièce jointe.</p>
              </div>  
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
                {pieces.map(p => (
                  <div key={p.id} style={{display:'flex',alignItems:'center',gap:'.75rem',background:'#f8fafc',borderRadius:'.5rem',padding:'.6rem .9rem',fontSize:'.85rem',border:'1px solid #eef2f7'}}>
                    <div style={{width:32,height:32,borderRadius:'.4rem',background:'#e0e7ff',display:'flex',alignItems:'center',justifyContent:'center',color:'#4338ca',flexShrink:0}}>
                      <FileText size={16}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:500,color:'#1e293b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.nom || p.type}</div>
                      <div style={{fontSize:'.75rem',color:'#64748b'}}>{p.type} • {new Date(p.date_creation||p.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <select
                      className="form-select"
                      style={{fontSize:'.75rem',padding:'.25rem .5rem',borderRadius:'.4rem',maxWidth:160}}
                      value={p.status || 'EN_COURS_DE_VERIFICATION'}
                      onChange={e => handleUpdatePjStatus(p.id, e.target.value)}
                      disabled={updatingPj === p.id}
                    >
                      {PJ_STATUS_OPTIONS.map(s => <option key={s} value={s}>{PJ_STATUS_LABELS[s]}</option>)}
                    </select>
                    <button style={{...btnPrimary,padding:'.35rem .6rem'}} onClick={() => handlePreview(p)} disabled={previewLoading === p.id} title="Voir">
                      {previewLoading === p.id ? <Loader size={14} className="auth-spinner"/> : <Eye size={14}/>}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* ── Dossiers université ── */}
          <SectionCard icon={School} title={`Dossiers université (${dossiersUniv.length})`} action={(isAdmin || isAdmission) ? (
            <button style={btnPrimary} onClick={() => setUnivModal({})}><Plus size={12}/> Ajouter</button>
          ) : null}>
            {dossiersUniv.length === 0 ? (
              <div style={{textAlign:'center',padding:'1.5rem',color:'#94a3b8',fontSize:'.875rem'}}>
                <School size={32} strokeWidth={1.2} style={{marginBottom:'.5rem',opacity:.5}} />
                <p style={{margin:0}}>Aucun dossier université déposé.</p>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
                {dossiersUniv.map(u => {
                  const stColor = u.statut === 'accepte' ? {bg:'#dcfce7',text:'#166534',border:'#bbf7d0'} :
                                  u.statut === 'refuse' ? {bg:'#fee2e2',text:'#991b1b',border:'#fecaca'} :
                                  {bg:'#ffedd5',text:'#9a3412',border:'#fed7aa'};
                  return (
                    <div key={u.id} style={{display:'flex',alignItems:'flex-start',gap:'.75rem',background:'#f8fafc',borderRadius:'.5rem',padding:'.75rem .9rem',fontSize:'.85rem',border:'1px solid #eef2f7'}}>
                      <div style={{width:32,height:32,borderRadius:'.4rem',background:'#e0e7ff',display:'flex',alignItems:'center',justifyContent:'center',color:'#4338ca',flexShrink:0}}>
                        <School size={16} />
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,color:'#1e293b',marginBottom:'.15rem'}}>{u.universite}</div>
                        <div style={{fontSize:'.78rem',color:'#64748b',display:'flex',gap:'.6rem',flexWrap:'wrap'}}>
                          <span>{u.filiere}</span>
                          <span>•</span>
                          <span>{u.ville}, {u.pays}</span>
                          {u.region && <><span>•</span><span>{u.region}</span></>}
                        </div>
                        {u.message_universite && (
                          <div style={{marginTop:'.4rem',fontSize:'.78rem',color:'#475569',fontStyle:'italic',background:'#fff',padding:'.4rem .6rem',borderRadius:'.4rem',border:'1px solid #e2e8f0'}}>
                            « {u.message_universite} »
                          </div>
                        )}
                      </div>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'.4rem',flexShrink:0}}>
                        <span style={{fontSize:'.72rem',fontWeight:600,background:stColor.bg,color:stColor.text,border:`1px solid ${stColor.border}`,padding:'.15rem .5rem',borderRadius:'999px'}}>
                          {UNIV_STATUS_OPTIONS.find(s => s.value === u.statut)?.label || u.statut}
                        </span>
                        {(isAdmin || isAdmission) && (
                          <div style={{display:'flex',gap:'.25rem'}}>
                            <button style={{...btnGhost,padding:'.25rem .4rem',fontSize:'.7rem'}} onClick={() => setUnivModal(u)} title="Modifier"><Pencil size={12}/></button>
                            <button style={{...btnGhost,padding:'.25rem .4rem',fontSize:'.7rem',color:'#dc2626'}} onClick={async () => {
                              if (!window.confirm('Supprimer ce dossier université ?')) return;
                              setDeletingUniv(u.id);
                              const oldList = dossiersUniv;
                              setDossiersUniv(prev => prev.filter(x => x.id !== u.id));
                              try { await apiDeleteDossierUniversite(token, u.id); } catch (e) { alert(e.message); setDossiersUniv(oldList); } finally { setDeletingUniv(null); }
                            }} disabled={deletingUniv === u.id} title="Supprimer">
                              {deletingUniv === u.id ? <Loader size={12} className="auth-spinner"/> : <Trash2 size={12}/>}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

        </div>
      )}
    </>
  );

  if (asPage) {
    return (
      <div className="cons-page" style={{padding:'1.5rem',maxWidth:960,margin:'0 auto',background:'#f8fafc',minHeight:'100vh'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
          <div>
            <div style={{fontSize:'.75rem',color:'#64748b',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'.25rem'}}>Dossier étudiant</div>
            <h1 style={{margin:0,fontSize:'1.5rem',color:'#1e293b',fontWeight:800}}>{dossier.code_dossier}</h1>
          </div>
          <button className="form-back" onClick={() => window.close()}>Fermer l'onglet</button>
        </div>
        {content}
        {statusModal && (
          <ModalChangerStatut token={token} dossier={dossier} isAdmin={isAdmin} isAdmission={isAdmission} isVisa={isVisa}
            onClose={() => setStatusModal(false)} onSuccess={updated => { setStatusModal(false); if (onRefresh) onRefresh(updated); }}/>
        )}
        {univModal !== null && (
          <ModalDossierUniversite token={token} codeDossier={dossier.code_dossier} initial={univModal.id ? univModal : undefined}
            onClose={() => setUnivModal(null)} onSuccess={() => {
              apiListDossiersUniversiteByDossier(token, dossier.code_dossier)
                .then(u => setDossiersUniv(u))
                .catch(() => setDossiersUniv([]));
            }} />
        )}
        {preview && (
          <ModalPreviewPJ piece={preview.piece} url={preview.url} onClose={() => setPreview(null)} />
        )}
        {infosModal && infos && (
          <ModalInfosAcademiques token={token} codeDossier={dossier.code_dossier} infos={infos} onClose={() => setInfosModal(false)} onSuccess={newInfos => setInfos(newInfos)} />
        )}
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 800, width: '92vw', maxHeight: '92vh', overflow: 'auto', borderRadius:'.75rem',padding:0 }} onClick={ev => ev.stopPropagation()}>
        <div className="modal__header" style={{background:'#f8fafc',borderBottom:'1px solid #e2e8f0',padding:'1rem 1.25rem'}}>
          <h3 className="modal__title" style={{fontSize:'1.05rem',display:'flex',alignItems:'center',gap:'.5rem'}}>
            <span style={{background:'#0c1c3f',color:'#fff',padding:'.15rem .6rem',borderRadius:'.4rem',fontSize:'.8rem'}}>{dossier.code_dossier}</span>
            Dossier étudiant
          </h3>
          <button className="modal__close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal__body" style={{padding:'1.25rem',background:'#f8fafc'}}>{content}</div>
        {statusModal && (
          <ModalChangerStatut token={token} dossier={dossier} isAdmin={isAdmin} isAdmission={isAdmission} isVisa={isVisa}
            onClose={() => setStatusModal(false)} onSuccess={() => { setStatusModal(false); onRefresh(); }}/>
        )}
        {univModal !== null && (
          <ModalDossierUniversite token={token} codeDossier={dossier.code_dossier} initial={univModal.id ? univModal : undefined}
            onClose={() => setUnivModal(null)} onSuccess={() => {
              apiListDossiersUniversiteByDossier(token, dossier.code_dossier)
                .then(u => setDossiersUniv(u))
                .catch(() => setDossiersUniv([]));
            }} />
        )}
        {preview && (
          <ModalPreviewPJ piece={preview.piece} url={preview.url} onClose={() => setPreview(null)} />
        )}
        {infosModal && infos && (
          <ModalInfosAcademiques token={token} codeDossier={dossier.code_dossier} infos={infos} onClose={() => setInfosModal(false)} onSuccess={newInfos => setInfos(newInfos)} />
        )}
      </div>
    </div>
  );
}
