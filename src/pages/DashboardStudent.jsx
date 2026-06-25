import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, User, FolderOpen,
  Bell, MessageSquare, ChevronDown, Pencil, X,
  Loader, AlertCircle, CheckCircle, FolderSearch, Lock,
  Download, Trash2, Upload, RefreshCw, Eye, School,
} from 'lucide-react';
import logoHeader from '../assets/les images du site/logo-horizontal-2x.png';
import {
  getSession, clearSession, apiLogout, apiGetMe, apiUpdateMe,
  apiGetDossier, apiGetInfosDossier, apiPostInfosDossier, apiPutInfosDossier,
  apiListPiecesJointes, apiGetPieceJointeUrl, apiAddPieceJointe, apiReplacePieceJointe, apiDeletePieceJointe,
  apiListDossiersUniversiteByDossier,
} from '../api/auth';
import { useNotifications } from '../hooks/useNotifications';
import NotificationsPanel from '../components/NotificationsPanel';
import { useMessages } from '../hooks/useMessages';
import MessagesPanel from '../components/MessagesPanel';
import { useMessageModal } from '../context/MessageModalContext';

const NAV_ITEMS = [
  { id: 'infos',         label: 'Mes informations', icon: User },
  { id: 'dossier',       label: 'Mon dossier',      icon: FolderOpen },
  { id: 'notifications', label: 'Notifications',    icon: Bell },
  { id: 'messages',      label: 'Messages',         icon: MessageSquare },
];

const PAYS_LISTE       = ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Guinée', 'Cameroun', 'Maroc', 'Burkina Faso', 'Togo', 'Bénin', 'Niger', 'Autre'];
const NIVEAUX_LISTE    = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat', 'BTS', 'DUT', 'Prépa', 'Autre'];
const PAYS_CIBLE_LISTE = ['France', 'Canada', 'Belgique', 'Suisse', 'Espagne', 'Allemagne', 'Royaume-Uni', 'Italie', 'Portugal', 'Maroc', 'Autre'];

const TYPES_PJ = {
  PHOTO_PROFIL:                'Photo de profil',
  ATTESTATION:                 'Attestation',
  DIPLOME_BAC:                 'Diplôme du Bac',
  RELEVE_NOTES_BAC:            'Relevé de notes du Bac',
  DIPLOME_LICENCE:             'Diplôme de Licence',
  DIPLOME_MASTER:              'Diplôme de Master',
  DIPLOME_DOCTORAT:            'Diplôme de Doctorat',
  PASSEPORT:                   'Passeport',
  CARTE_IDENTITE:              'Carte d\'identité',
  BULLETIN_NOTES_LICENCE_1:    'Bulletin L1',
  BULLETIN_NOTES_LICENCE_2:    'Bulletin L2',
  BULLETIN_NOTES_LICENCE_3:    'Bulletin L3',
  BULLETIN_NOTES_MASTER_1:     'Bulletin M1',
  BULLETIN_NOTES_MASTER_2:     'Bulletin M2',
  BULLETIN_NOTES_DOCTORAT:     'Bulletin Doctorat',
  LETTRE_MOTIVATION:           'Lettre de motivation',
  CV:                          'CV',
  BULLETIN_NOTES_SECONDE:      'Bulletin Seconde',
  BULLETIN_NOTES_PREMIERE:     'Bulletin Première',
  BULLETIN_NOTES_TERMINALE:    'Bulletin Terminale',
  AUTRE:                       'Autre document',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

/* ── Composant "Mes informations" ─────────────────── */
function PageInfos({ token, onVoirDossier }) {
  const [profil, setProfil]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [mdpOpen, setMdpOpen]     = useState(false);


  const fetchProfil = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGetMe(token);
      setProfil(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchProfil(); }, [fetchProfil]);

  if (loading) return (
    <div className="db-page__empty">
      <Loader size={32} className="auth-spinner db-page__empty-icon" />
      <p>Chargement…</p>
    </div>
  );

  if (error) return (
    <div className="db-page__empty">
      <AlertCircle size={36} className="db-page__empty-icon" style={{ color: '#dc2626' }} />
      <p style={{ color: '#dc2626' }}>{error}</p>
    </div>
  );

  const dossier = profil.dossier;

  return (
    <>
      {/* ── Code dossier ── */}
      {dossier && (
        <div className="info-dossier-banner">
          <FolderSearch size={20} />
          <div>
            <span className="info-dossier-banner__label">Code dossier</span>
            <span className="info-dossier-banner__code">{dossier.code_dossier}</span>
          </div>
          {onVoirDossier && (
            <button
              className="info-card__edit-btn"
              style={{ marginLeft: 'auto', fontSize: '.8rem', padding: '.3rem .7rem' }}
              onClick={onVoirDossier}
            >
              <Eye size={14} /> Voir mon dossier
            </button>
          )}
        </div>
      )}

      {/* ── Carte infos ── */}
      <div className="info-card">
        <div className="info-card__header">
          <h2 className="info-card__title">Informations personnelles</h2>
          <button className="info-card__edit-btn" onClick={() => setModalOpen(true)}>
            <Pencil size={14} /> Modifier
          </button>
        </div>

        <div className="info-grid">
          <div className="info-field">
            <span className="info-field__label">Prénom</span>
            <span className="info-field__value">{profil.prenom}</span>
          </div>
          <div className="info-field">
            <span className="info-field__label">Nom</span>
            <span className="info-field__value">{profil.nom}</span>
          </div>
          <div className="info-field">
            <span className="info-field__label">Sexe</span>
            <span className="info-field__value">{profil.sexe === 'M' ? 'Masculin' : profil.sexe === 'F' ? 'Féminin' : '—'}</span>
          </div>
          <div className="info-field">
            <span className="info-field__label">Pays d'origine</span>
            <span className="info-field__value">{profil.payes || '—'}</span>
          </div>
          <div className="info-field">
            <span className="info-field__label">Ville</span>
            <span className="info-field__value">{profil.ville || '—'}</span>
          </div>
          <div className="info-field">
            <span className="info-field__label">Téléphone</span>
            <span className="info-field__value">{profil.telephone || '—'}</span>
          </div>
          <div className="info-field">
            <span className="info-field__label">Date de naissance</span>
            <span className="info-field__value">{formatDate(profil.date_de_naissance)}</span>
          </div>
          <div className="info-field">
            <span className="info-field__label">Lieu de naissance</span>
            <span className="info-field__value">{profil.lieu_de_naissance || '—'}</span>
          </div>
        </div>
      </div>

      {/* ── Modal modification infos ── */}
      {modalOpen && (
        <ModalInfos
          token={token}
          profil={profil}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchProfil}
        />
      )}
      {/* ── Carte Sécurité ── */}
      <div className="info-card" style={{ marginTop: '1.25rem' }}>
        <div className="info-card__header">
          <div>
            <h2 className="info-card__title">Sécurité</h2>
            <p style={{ fontSize: '.8125rem', color: 'var(--slate-400)', marginTop: '.125rem' }}>Saisissez votre mot de passe actuel pour en définir un nouveau.</p>
          </div>
          <button className="info-card__edit-btn" onClick={() => setMdpOpen(true)}>
            <Lock size={14} /> Changer le mot de passe
          </button>
        </div>
      </div>

      {/* ── Modal Mot de passe ── */}
      {mdpOpen && (
        <ModalPassword token={token} onClose={() => setMdpOpen(false)} />
      )}
    </>
  );
}

/* ── Modal modification infos ── */
function ModalInfos({ token, profil, onClose, onSuccess }) {
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm]       = useState({
    prenom:            profil.prenom || '',
    nom:               profil.nom || '',
    telephone:         profil.telephone || '',
    sexe:              profil.sexe || '',
    payes:             profil.payes || '',
    ville:             profil.ville || '',
    date_de_naissance: profil.date_de_naissance ? profil.date_de_naissance.split('T')[0] : '',
    lieu_de_naissance: profil.lieu_de_naissance || '',
  });

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiUpdateMe(token, form);
      setSuccess(true);
      await onSuccess();
      setTimeout(onClose, 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Modifier mes informations</h3>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          {error && (
            <div className="auth-error" style={{ margin: 0 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}
          {success && (
            <div className="modal__success">
              <CheckCircle size={15} /> Informations mises à jour !
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input className="form-input" value={form.prenom} onChange={e => set('prenom', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input className="form-input" value={form.nom} onChange={e => set('nom', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel" className="form-input"
                  value={form.telephone} onChange={e => set('telephone', e.target.value)}
                  placeholder="Ex: +221 77 123 45 67"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sexe</label>
                <select className="form-select" value={form.sexe} onChange={e => set('sexe', e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pays d'origine</label>
                  <select className="form-select" value={form.payes} onChange={e => set('payes', e.target.value)}>
                    <option value="">Sélectionner</option>
                    {PAYS_LISTE.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ville</label>
                  <input className="form-input" value={form.ville} onChange={e => set('ville', e.target.value)} placeholder="Dakar" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date de naissance</label>
                  <input type="date" className="form-input" value={form.date_de_naissance} onChange={e => set('date_de_naissance', e.target.value)} max={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label className="form-label">Lieu de naissance</label>
                  <input className="form-input" value={form.lieu_de_naissance} onChange={e => set('lieu_de_naissance', e.target.value)} placeholder="Ex: Dakar" />
                </div>
              </div>

              <div className="modal__footer" style={{ marginTop: 0 }}>
                <button type="button" className="form-back" onClick={onClose}>Annuler</button>
                <button type="submit" className="form-submit" disabled={saving}>
                  {saving ? <Loader size={15} className="auth-spinner" /> : <CheckCircle size={15} />}
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Modal changement de mot de passe ── */
function ModalPassword({ token, onClose }) {
  const [mdpActuel, setMdpActuel] = useState('');
  const [mdpNew, setMdpNew]       = useState('');
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiUpdateMe(token, { mdp_actuel: mdpActuel, mdp: mdpNew });
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Changer le mot de passe</h3>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          {error && (
            <div className="auth-error" style={{ margin: 0 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}
          {success && (
            <div className="modal__success">
              <CheckCircle size={15} /> Mot de passe modifié avec succès !
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Mot de passe actuel *</label>
                <input
                  required type="password" className="form-input"
                  value={mdpActuel} onChange={e => setMdpActuel(e.target.value)}
                  placeholder="Votre mot de passe actuel"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nouveau mot de passe *</label>
                <input
                  required type="password" className="form-input"
                  value={mdpNew} onChange={e => setMdpNew(e.target.value)}
                  placeholder="Minimum 6 caractères" minLength={6}
                />
              </div>
              <div className="modal__footer" style={{ marginTop: 0 }}>
                <button type="button" className="form-back" onClick={onClose}>Annuler</button>
                <button type="submit" className="form-submit" disabled={saving}>
                  {saving ? <Loader size={15} className="auth-spinner" /> : <CheckCircle size={15} />}
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers statut ── */
const STATUS_LABELS = {
  EN_COURS_DE_VERIFICATION: { label: 'En vérification',           color: 'blue'   },
  A_CHANGER:                { label: 'À corriger',                 color: 'orange' },
  EN_COURS_D_ETUDE:         { label: 'En cours d’étude',           color: 'blue'   },
  VALIDE:                   { label: 'Validé',                   color: 'green'  },
  INVALIDE:                 { label: 'Invalide',                 color: 'red'    },
  EN_ATTENTE:               { label: 'En attente',               color: 'orange' },
  CHANGEMENT_A_APPORTER:    { label: 'Changement à apporter',    color: 'orange' },
  ADMISSION_EN_COURS:       { label: 'Admission en cours',       color: 'blue' },
  ADMISSION_VALIDE:         { label: 'Admission validée',        color: 'green' },
  ADMISSION_INVALIDE:       { label: 'Admission invalidée',      color: 'red' },
  DEMANDE_VISA_EN_COURS:    { label: 'Demande visa en cours',    color: 'blue' },
  DEMANDE_VISA_VALIDE:      { label: 'Visa validé',              color: 'green' },
  DEMANDE_VISA_INVALIDE:    { label: 'Visa invalidé',            color: 'red' },
};

function StatusBadge({ value }) {
  if (!value) return <span className="status-badge status-badge--grey">Non démarré</span>;
  const s = STATUS_LABELS[value] || { label: value, color: 'grey' };
  return <span className={`status-badge status-badge--${s.color}`}>{s.label}</span>;
}

/* ── Composant "Mon dossier" ─────────────────── */
function PageDossier({ token, email }) {
  const [dossier, setDossier]     = useState(null);
  const [infos, setInfos]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { openMessageModal } = useMessageModal();
  const [dossiersUniv, setDossiersUniv] = useState([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const d = await apiGetDossier(token);
      setDossier(d);
      try {
        const i = await apiGetInfosDossier(token, d.code_dossier);
        setInfos(i);
      } catch {
        setInfos(null);
      }
      try {
        const u = await apiListDossiersUniversiteByDossier(token, d.code_dossier);
        setDossiersUniv(u);
      } catch {
        setDossiersUniv([]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return (
    <div className="db-page__empty">
      <Loader size={32} className="auth-spinner db-page__empty-icon" />
      <p>Chargement…</p>
    </div>
  );
  if (error) return (
    <div className="db-page__empty">
      <AlertCircle size={36} className="db-page__empty-icon" style={{ color: '#dc2626' }} />
      <p>{error}</p>
    </div>
  );
  if (!dossier) return null;

  const conseiller_a = dossier.conseiller_admission;
  const conseiller_v = dossier.conseiller_visa;

  return (
    <>
      {/* Bannière code dossier */}
      <div className="info-dossier-banner">
        <FolderSearch size={28} />
        <div>
          <span className="info-dossier-banner__label">Code dossier</span>
          <span className="info-dossier-banner__code">{dossier.code_dossier}</span>
        </div>
      </div>

      {/* Carte statuts */}
      <div className="info-card">
        <div className="info-card__header">
          <h2 className="info-card__title">Suivi de la procédure</h2>
        </div>
        <div className="info-grid">
          <div className="info-field">
            <span className="info-field__label">Statut de mon dossier</span>
            <StatusBadge value={dossier.status} />
          </div>
          <div className="info-field">
            <span className="info-field__label">Admission</span>
            <StatusBadge value={dossier.status_admission} />
          </div>
          <div className="info-field">
            <span className="info-field__label">Visa</span>
            <StatusBadge value={dossier.status_visa} />
          </div>
          <div className="info-field">
            <span className="info-field__label">Dossier ouvert le</span>
            <span className="info-field__value">{formatDate(dossier.createdAt)}</span>
          </div>
          <div className="info-field">
            <span className="info-field__label">Dernière mise à jour</span>
            <span className="info-field__value">{formatDate(dossier.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Carte infos académiques */}
      <div className="info-card" style={{ marginTop: '1.25rem' }}>
        <div className="info-card__header">
          <h2 className="info-card__title">Informations académiques</h2>
          <button className="info-card__edit-btn" onClick={() => setModalOpen(true)}>
            <Pencil size={14} /> {infos ? 'Modifier' : 'Compléter'}
          </button>
        </div>
        {infos ? (
          <div className="info-grid">
            <div className="info-field">
              <span className="info-field__label">Niveau d’étude</span>
              <span className="info-field__value">{infos.niveau_etude || '—'}</span>
            </div>
            <div className="info-field">
              <span className="info-field__label">Pays souhaité</span>
              <span className="info-field__value">{infos.pays_souhaite || '—'}</span>
            </div>
            <div className="info-field">
              <span className="info-field__label">Filières</span>
              <span className="info-field__value">{infos.filieres?.length ? infos.filieres.join(', ') : '—'}</span>
            </div>
            <div className="info-field">
              <span className="info-field__label">Série bac</span>
              <span className="info-field__value">{infos.serie_bac || '—'}</span>
            </div>
            <div className="info-field">
              <span className="info-field__label">Fois au bac</span>
              <span className="info-field__value">{infos.nombre_fois_bac ?? '—'}</span>
            </div>
            <div className="info-field">
              <span className="info-field__label">Formation en cours</span>
              <span className="info-field__value">{infos.formation_en_cours || '—'}</span>
            </div>
            <div className="info-field">
              <span className="info-field__label">Paiement</span>
              <span className="info-field__value">{infos.paiement ? 'Payé' : 'Non payé'}</span>
            </div>
            <div className="info-field">
              <span className="info-field__label">Statut</span>
              <StatusBadge value={infos.status} />
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--slate-400)', fontSize: '.9rem', padding: '.25rem 0' }}>
            Aucune information académique renseignée. Cliquez sur « Compléter » pour les ajouter.
          </p>
        )}
      </div>

      {/* Carte conseillers */}
      <div className="info-card" style={{ marginTop: '1.25rem' }}>
        <div className="info-card__header">
          <h2 className="info-card__title">Conseillers assignés</h2>
        </div>
        <div className="info-grid">
          <div className="info-field">
            <span className="info-field__label">Conseiller admission</span>
            {conseiller_a ? (
              <span className="info-field__value" style={{display:'flex',alignItems:'center',gap:'.5rem',flexWrap:'wrap'}}>
                {conseiller_a.prenom} {conseiller_a.nom} <span style={{ color: 'var(--slate-400)', fontSize: '.8rem' }}>({conseiller_a.code})</span>
                {conseiller_a.email && (
                  <button className="info-card__edit-btn" style={{fontSize:'.75rem',padding:'.15rem .4rem'}} onClick={() => openMessageModal(token, conseiller_a.email, `${conseiller_a.prenom} ${conseiller_a.nom}`)}>
                    <Send size={12} /> Message
                  </button>
                )}
              </span>
            ) : <span className="info-field__value" style={{ color: 'var(--slate-400)' }}>Non assigné</span>}
          </div>
          <div className="info-field">
            <span className="info-field__label">Conseiller visa</span>
            {conseiller_v ? (
              <span className="info-field__value" style={{display:'flex',alignItems:'center',gap:'.5rem',flexWrap:'wrap'}}>
                {conseiller_v.prenom} {conseiller_v.nom} <span style={{ color: 'var(--slate-400)', fontSize: '.8rem' }}>({conseiller_v.code})</span>
                {conseiller_v.email && (
                  <button className="info-card__edit-btn" style={{fontSize:'.75rem',padding:'.15rem .4rem'}} onClick={() => openMessageModal(token, conseiller_v.email, `${conseiller_v.prenom} ${conseiller_v.nom}`)}>
                    <Send size={12} /> Message
                  </button>
                )}
              </span>
            ) : <span className="info-field__value" style={{ color: 'var(--slate-400)' }}>Non assigné</span>}
          </div>
        </div>
      </div>

      {/* Dossiers université */}
      <div className="info-card" style={{ marginTop: '1.25rem' }}>
        <div className="info-card__header">
          <h2 className="info-card__title">Dossiers déposés en université ({dossiersUniv.length})</h2>
        </div>
        {dossiersUniv.length === 0 ? (
          <p style={{ color: 'var(--slate-400)', fontSize: '.875rem', padding: '1rem 1.5rem' }}>
            Aucun dossier universitaire déposé pour le moment.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', padding: '1rem 1.5rem' }}>
            {dossiersUniv.map(u => {
              const stColor = u.statut === 'accepte' ? { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' } :
                              u.statut === 'refuse' ? { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' } :
                              { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' };
              const stLabel = u.statut === 'accepte' ? 'Accepté' : u.statut === 'refuse' ? 'Refusé' : 'En attente';
              return (
                <div key={u.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', background: '#f8fafc', borderRadius: '.5rem', padding: '.75rem .9rem', fontSize: '.85rem', border: '1px solid #eef2f7' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '.4rem', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', flexShrink: 0 }}>
                    <School size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '.15rem' }}>{u.universite}</div>
                    <div style={{ fontSize: '.78rem', color: '#64748b', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
                      <span>{u.filiere}</span>
                      <span>•</span>
                      <span>{u.ville}, {u.pays}</span>
                      {u.region && <><span>•</span><span>{u.region}</span></>}
                    </div>
                    {u.message_universite && (
                      <div style={{ marginTop: '.4rem', fontSize: '.78rem', color: '#475569', fontStyle: 'italic', background: '#fff', padding: '.4rem .6rem', borderRadius: '.4rem', border: '1px solid #e2e8f0' }}>
                        « {u.message_universite} »
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '.72rem', fontWeight: 600, background: stColor.bg, color: stColor.text, border: `1px solid ${stColor.border}`, padding: '.15rem .5rem', borderRadius: '999px', flexShrink: 0 }}>
                    {stLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section pièces jointes */}
      <SectionPiecesJointes token={token} codeDossier={dossier.code_dossier} />

      {/* Modal infos dossier */}
      {modalOpen && (
        <ModalInfosDossier
          token={token}
          codeDossier={dossier.code_dossier}
          infos={infos}
          onClose={() => setModalOpen(false)}
          onSuccess={newInfos => setInfos(newInfos)}
        />
      )}

    </>
  );
}

/* ── Modal infos dossier (création / modification) ── */
function ModalInfosDossier({ token, codeDossier, infos, onClose, onSuccess }) {
  const isCreating = !infos;
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm]       = useState({
    niveau_etude:     infos?.niveau_etude || '',
    pays_souhaite:    infos?.pays_souhaite || '',
    filieres:         infos?.filieres?.join(', ') || '',
    nombre_fois_bac:  infos?.nombre_fois_bac ?? 1,
    serie_bac:        infos?.serie_bac || '',
    formation_en_cours: infos?.formation_en_cours || '',
  });

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const buildPayload = () => ({
    niveau_etude:     form.niveau_etude,
    pays_souhaite:    form.pays_souhaite,
    filieres:         form.filieres.split(',').map(s => s.trim()).filter(Boolean),
    nombre_fois_bac:  Number(form.nombre_fois_bac),
    serie_bac:        form.serie_bac,
    formation_en_cours: form.formation_en_cours,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let newInfos;
      if (isCreating) {
        newInfos = await apiPostInfosDossier(token, { code_dossier: codeDossier, ...buildPayload() });
      } else {
        newInfos = await apiPutInfosDossier(token, codeDossier, buildPayload());
      }
      setSuccess(true);
      onSuccess(newInfos);
      setTimeout(onClose, 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">
            {isCreating ? 'Compléter mon dossier' : 'Modifier les infos académiques'}
          </h3>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          {error && (
            <div className="auth-error" style={{ margin: 0 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}
          {success && (
            <div className="modal__success">
              <CheckCircle size={15} /> {isCreating ? 'Informations créées !' : 'Informations mises à jour !'}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Niveau d’étude *</label>
                  <select required className="form-select" value={form.niveau_etude} onChange={e => set('niveau_etude', e.target.value)}>
                    <option value="">Sélectionner</option>
                    {NIVEAUX_LISTE.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pays souhaité *</label>
                  <select required className="form-select" value={form.pays_souhaite} onChange={e => set('pays_souhaite', e.target.value)}>
                    <option value="">Sélectionner</option>
                    {PAYS_CIBLE_LISTE.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Filières souhaitées * <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(séparées par des virgules)</span></label>
                <input
                  required className="form-input"
                  value={form.filieres} onChange={e => set('filieres', e.target.value)}
                  placeholder="Ex: Informatique, Génie logiciel"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Série bac *</label>
                  <input
                    required className="form-input"
                    value={form.serie_bac} onChange={e => set('serie_bac', e.target.value)}
                    placeholder="Ex: S2, L, SMS"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre de fois au bac *</label>
                  <input
                    required type="number" className="form-input" min={1}
                    value={form.nombre_fois_bac} onChange={e => set('nombre_fois_bac', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Formation en cours (facultatif) *</label>
                <input
                  required className="form-input"
                  value={form.formation_en_cours} onChange={e => set('formation_en_cours', e.target.value)}
                  placeholder="Ex: Licence Informatique"
                />
              </div>
              <div className="modal__footer" style={{ marginTop: 0 }}>
                <button type="button" className="form-back" onClick={onClose}>Annuler</button>
                <button type="submit" className="form-submit" disabled={saving}>
                  {saving ? <Loader size={15} className="auth-spinner" /> : <CheckCircle size={15} />}
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Modal upload pièce jointe ── */
function ModalUploadPJ({ token, codeDossier, piece, onClose, onSuccess }) {
  const isReplace     = !!piece;
  const [type, setType]     = useState(piece?.type || '');
  const [file, setFile]     = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Veuillez sélectionner un fichier.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Le fichier ne doit pas dépasser 10 Mo.'); return; }
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('fichier', file);
      if (isReplace) {
        await apiReplacePieceJointe(token, piece.id, fd);
      } else {
        fd.append('codeDossier', codeDossier);
        fd.append('type', type);
        await apiAddPieceJointe(token, fd);
      }
      setSuccess(true);
      await onSuccess();
      setTimeout(onClose, 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">
            {isReplace ? 'Remplacer le fichier' : 'Ajouter une pièce jointe'}
          </h3>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          {error && (
            <div className="auth-error" style={{ margin: 0 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}
          {success && (
            <div className="modal__success">
              <CheckCircle size={15} /> {isReplace ? 'Fichier remplacé !' : 'Pièce jointe ajoutée !'}
            </div>
          )}
          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!isReplace ? (
                <div className="form-group">
                  <label className="form-label">Type de document *</label>
                  <select required className="form-select" value={type} onChange={e => setType(e.target.value)}>
                    <option value="">Sélectionner</option>
                    {Object.entries(TYPES_PJ).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Type actuel</label>
                  <div className="form-input" style={{ background: 'var(--slate-50)', cursor: 'default', color: 'var(--slate-600)' }}>
                    {TYPES_PJ[piece.type] || piece.type}
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">
                  Fichier * <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(PDF ou image, max 10 Mo)</span>
                </label>
                <label className="pj-upload__label">
                  <Upload size={18} />
                  <span>{file ? file.name : 'Cliquer pour sélectionner'}</span>
                  <input
                    type="file"
                    className="pj-upload__input"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={e => { setFile(e.target.files[0] || null); setError(''); }}
                  />
                </label>
              </div>
              <div className="modal__footer" style={{ marginTop: 0 }}>
                <button type="button" className="form-back" onClick={onClose}>Annuler</button>
                <button type="submit" className="form-submit" disabled={saving}>
                  {saving ? <Loader size={15} className="auth-spinner" /> : <Upload size={15} />}
                  {saving ? 'Envoi…' : isReplace ? 'Remplacer' : 'Ajouter'}
                </button>
              </div>
            </form>
          )}
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
          <h3 className="modal__title">{TYPES_PJ[piece.type] || piece.type}</h3>
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            <a
              href={url} target="_blank" rel="noopener noreferrer"
              className="info-card__edit-btn" style={{ textDecoration: 'none' }}
            >
              <Download size={14} /> Télécharger
            </a>
            <button className="modal__close" onClick={onClose}><X size={18} /></button>
          </div>
        </div>
        <div className="modal__body pj-preview__body">
          {isImage
            ? <img src={url} alt={TYPES_PJ[piece.type] || piece.type} className="pj-preview__img" />
            : <iframe src={url} className="pj-preview__iframe" title={TYPES_PJ[piece.type] || piece.type} />}
        </div>
      </div>
    </div>
  );
}

/* ── Section pièces jointes ── */
function SectionPiecesJointes({ token, codeDossier }) {
  const [pieces, setPieces]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [listError, setListError]         = useState('');
  const [actionErr, setActionErr]         = useState('');
  const [addOpen, setAddOpen]             = useState(false);
  const [replacing, setReplacing]         = useState(null);
  const [dlLoading, setDlLoading]         = useState(null);
  const [deleting, setDeleting]           = useState(null);
  const [previewLoading, setPreviewLoading] = useState(null);
  const [preview, setPreview]             = useState(null);

  const fetchPieces = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const list = await apiListPiecesJointes(token, codeDossier);
      setPieces(list);
    } catch (e) {
      setListError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, codeDossier]);

  const refreshPieces = useCallback(async () => {
    try {
      const list = await apiListPiecesJointes(token, codeDossier);
      setPieces(list);
    } catch (e) {
      setActionErr(e.message);
    }
  }, [token, codeDossier]);

  useEffect(() => { fetchPieces(); }, [fetchPieces]);

  const handleDownload = async (id) => {
    setDlLoading(id);
    setActionErr('');
    try {
      const { url } = await apiGetPieceJointeUrl(token, id);
      window.open(url, '_blank', 'noopener');
    } catch (e) {
      setActionErr(e.message);
    } finally {
      setDlLoading(null);
    }
  };

  const handleDelete = async (id) => {
    const oldPieces = pieces;
    setDeleting(id);
    setActionErr('');
    try {
      await apiDeletePieceJointe(token, id);
      setPieces(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setActionErr(e.message);
      setPieces(oldPieces);
    } finally {
      setDeleting(null);
    }
  };

  const handlePreview = async (piece) => {
    setPreviewLoading(piece.id);
    setActionErr('');
    try {
      const { url } = await apiGetPieceJointeUrl(token, piece.id);
      setPreview({ piece, url });
    } catch (e) {
      setActionErr(e.message);
    } finally {
      setPreviewLoading(null);
    }
  };

  return (
    <div className="info-card" style={{ marginTop: '1.25rem' }}>
      <div className="info-card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h2 className="info-card__title">Pièces jointes requises</h2>
          <span style={{ fontSize: '.7rem', fontWeight: 600, background: '#f1f5f9', color: '#475569', padding: '.15rem .45rem', borderRadius: '999px' }}>5 documents</span>
        </div>
        <button className="info-card__edit-btn" onClick={() => setAddOpen(true)}>
          <Upload size={14} /> Ajouter
        </button>
      </div>

      <div style={{ padding: '1.25rem 1.5rem' }}>
        <p style={{ fontSize: '.85rem', color: '#64748b', marginBottom: '.75rem' }}>
          Veuillez ajouter les documents suivants pour valider votre dossier :
        </p>
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.35rem 1.5rem', fontSize: '.85rem', color: '#334155', listStyle: 'none', padding: 0, margin: '0 0 .75rem' }}>
          {[
            'Carte d\'identité ou Passeport',
            'Bulletins des trois dernières années (minimum)',
            'Diplômes obtenus (Bac, Licence, Master)',
            'Certifications obtenues',
            'CV à jour (facultatif)',
          ].map(doc => (
            <li key={doc} style={{ display: 'flex', alignItems: 'flex-start', gap: '.35rem' }}>
              <span style={{ color: '#c5a150', fontWeight: 700, fontSize: '.9rem', lineHeight: 1.2, flexShrink: 0 }}>•</span>
              <span style={{ lineHeight: 1.35 }}>{doc}</span>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: '.75rem', padding: '.6rem .75rem', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '.5rem', fontSize: '.78rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <span style={{ fontWeight: 700 }}>⚠️</span>
          Formats acceptés : PDF, JPG, PNG (Taille max : 5 Mo par fichier)
        </div>
      </div>

      {actionErr && (
        <div className="auth-error" style={{ margin: '0 0 .75rem' }}>
          <AlertCircle size={15} /> {actionErr}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'var(--slate-400)', fontSize: '.875rem' }}>
          <Loader size={16} className="auth-spinner" /> Chargement…
        </div>
      )}

      {!loading && listError && (
        <p style={{ color: '#dc2626', fontSize: '.875rem' }}>{listError}</p>
      )}

      {!loading && !listError && pieces.length === 0 && (
        <p style={{ color: 'var(--slate-400)', fontSize: '.9rem' }}>
          Aucune pièce jointe. Cliquez sur « Ajouter » pour déposer un document.
        </p>
      )}

      {!loading && pieces.length > 0 && (
        <ul className="pj-list">
          {pieces.map(p => (
            <li key={p.id} className="pj-item">
              <div
                className="pj-item__info pj-item__info--clickable"
                onClick={() => handlePreview(p)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handlePreview(p)}
              >
                {previewLoading === p.id
                  ? <Loader size={14} className="auth-spinner" style={{ flexShrink: 0 }} />
                  : null}
                <span className="pj-item__type">{TYPES_PJ[p.type] || p.type}</span>
                <StatusBadge value={p.status} />
              </div>
              <div className="pj-item__actions">
                <button
                  className="pj-action-btn pj-action-btn--download"
                  onClick={() => handleDownload(p.id)}
                  disabled={dlLoading === p.id}
                  title="Télécharger"
                >
                  {dlLoading === p.id ? <Loader size={14} className="auth-spinner" /> : <Download size={14} />}
                </button>
                {p.status !== 'VALIDE' && (
                  <>
                    <button
                      className="pj-action-btn pj-action-btn--replace"
                      onClick={() => { setReplacing(p); setActionErr(''); }}
                      title="Remplacer"
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      className="pj-action-btn pj-action-btn--delete"
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      title="Supprimer"
                    >
                      {deleting === p.id ? <Loader size={14} className="auth-spinner" /> : <Trash2 size={14} />}
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {addOpen && (
        <ModalUploadPJ
          token={token}
          codeDossier={codeDossier}
          piece={null}
          onClose={() => setAddOpen(false)}
          onSuccess={refreshPieces}
        />
      )}
      {replacing && (
        <ModalUploadPJ
          token={token}
          codeDossier={codeDossier}
          piece={replacing}
          onClose={() => setReplacing(null)}
          onSuccess={refreshPieces}
        />
      )}
      {preview && (
        <ModalPreviewPJ
          piece={preview.piece}
          url={preview.url}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

/* ── Composant principal ──────────────────────────── */
export default function DashboardStudent() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('infos');
  const [session, setSession]       = useState(null);
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s.token || !s.etudiant) { navigate('/connexion'); return; }
    setSession(s);
  }, [navigate]);

  const handleLogout = async () => {
    try { await apiLogout(); } catch (_) {}
    clearSession();
    navigate('/connexion');
  };

  const { notifications, loading: notifLoading, unread, markRead, markAllRead } = useNotifications(session?.token);
  const msg = useMessages(session?.token);

  if (!session) return null;

  const { token, etudiant, codeDossier } = session;

  return (
    <div className="db-layout">
      {/* ── Header ────────────────────────────────────── */}
      <header className="db-header">
        <div className="db-header__logo">
          <img src={logoHeader} alt="Capadmis" style={{ height: 28, width: 'auto', display: 'block' }} />
        </div>

        <nav className="db-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const unreadMsg = item.id === 'messages' ? msg.unreadCount : null;
            return (
              <button
                key={item.id}
                className={`db-nav__item${activePage === item.id ? ' db-nav__item--active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                <span style={{position:'relative',display:'inline-flex'}}>
                  <Icon size={16} />
                  {item.id === 'notifications' && unread > 0 && <span className="notif-dot">{unread > 9 ? '9+' : unread}</span>}
                  {item.id === 'messages' && unreadMsg > 0 && <span className="notif-dot">{unreadMsg > 9 ? '9+' : unreadMsg}</span>}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="db-header__user">
          <div className="db-header__user-info">
            <span className="db-header__user-name">{etudiant.prenom} {etudiant.nom}</span>
            {codeDossier && <span className="db-header__user-code">Dossier n° {codeDossier}</span>}
          </div>
          <button className="db-header__logout" onClick={handleLogout}>
            <LogOut size={16} /> <span>Déconnexion</span>
          </button>
        </div>

        <button className="db-header__mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <ChevronDown size={20} style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
      </header>

      {menuOpen && (
        <div className="db-mobile-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`db-mobile-nav__item${activePage === item.id ? ' db-mobile-nav__item--active' : ''}`}
                onClick={() => { setActivePage(item.id); setMenuOpen(false); }}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
          <button className="db-mobile-nav__logout" onClick={handleLogout}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      )}

      {/* ── Contenu ───────────────────────────────────── */}
      <main className="db-main">
        <div className="db-main__inner">

          {activePage === 'infos' && (
            <div className="db-page">
              <div className="db-page__header">
                <h1 className="db-page__title">Mes informations</h1>
                <p className="db-page__sub">Consultez et modifiez vos informations personnelles.</p>
              </div>
              <PageInfos token={token} onVoirDossier={() => setActivePage('dossier')} />
            </div>
          )}

          {activePage === 'dossier' && (
            <div className="db-page">
              <div className="db-page__header">
                <h1 className="db-page__title">Mon dossier</h1>
                <p className="db-page__sub">Suivez l'avancement de votre procédure Campus France.</p>
              </div>
              <PageDossier token={token} />
            </div>
          )}

          {activePage === 'notifications' && (
            <div className="db-page">
              <NotificationsPanel
                notifications={notifications}
                loading={notifLoading}
                unread={unread}
                markRead={markRead}
                markAllRead={markAllRead}
              />
            </div>
          )}

          {activePage === 'messages' && (
            <MessagesPanel
              conversations={msg.conversations}
              messages={msg.messages}
              activeChat={msg.activeChat}
              unreadCount={msg.unreadCount}
              userEmail={etudiant.email}
              onSelectChat={msg.loadConversation}
              onSend={msg.send}
            />
          )}

        </div>
      </main>
    </div>
  );
}
