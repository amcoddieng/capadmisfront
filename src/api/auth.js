const BASE = import.meta.env.PROD ? 'https://capadmis.onrender.com/api' : '/api';

export async function apiLogin(email, mdp) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, mdp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Email ou mot de passe incorrect');
  return data;
}

export async function apiRegister(payload) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");
  return data;
}

export async function apiGetDossier(token) {
  const res = await fetch(`${BASE}/dossiers/moi`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Impossible de récupérer le dossier');
  return data.dossier;
}

export async function apiGetMe(token) {
  const res = await fetch(`${BASE}/etudiants/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Impossible de récupérer le profil');
  return data.etudiant;
}

export async function apiUpdateMe(token, payload) {
  const res = await fetch(`${BASE}/etudiants/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour');
  return data.etudiant;
}

export async function apiListPiecesJointes(token, codeDossier) {
  const res = await fetch(`${BASE}/pieces-jointes/dossier/${codeDossier}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Impossible de récupérer les pièces jointes');
  return data.pieces;
}

export async function apiGetPieceJointeUrl(token, id) {
  const res = await fetch(`${BASE}/pieces-jointes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Impossible d\'obtenir l\'URL');
  return data;
}

export async function apiAddPieceJointe(token, formData) {
  const res = await fetch(`${BASE}/pieces-jointes/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'ajout');
  return data.piece;
}

export async function apiReplacePieceJointe(token, id, formData) {
  const res = await fetch(`${BASE}/pieces-jointes/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors du remplacement');
  return data.piece;
}

export async function apiDeletePieceJointe(token, id) {
  const res = await fetch(`${BASE}/pieces-jointes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression');
  return data;
}

export async function apiUpdatePieceJointeStatus(token, id, status) {
  const res = await fetch(`${BASE}/pieces-jointes/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.piece;
}

export async function apiGetInfosDossier(token, codeDossier) {
  const res = await fetch(`${BASE}/infos-dossier/${codeDossier}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Impossible de récupérer les infos dossier');
  return data.infos;
}

export async function apiPostInfosDossier(token, payload) {
  const res = await fetch(`${BASE}/infos-dossier/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la création des infos dossier');
  return data.infos;
}

export async function apiPutInfosDossier(token, codeDossier, payload) {
  const res = await fetch(`${BASE}/infos-dossier/${codeDossier}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour des infos dossier');
  return data.infos;
}

export async function apiGenererCode(email, type) {
  const res = await fetch(`${BASE}/codes-temporaires/generer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, type }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'envoi du code");
  return data;
}

export async function apiModifierInfosCode(payload) {
  const res = await fetch(`${BASE}/codes-temporaires/modifier-infos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Code invalide ou expiré');
  return data;
}

export async function apiModifierMdpCode(email, code, nouveau_mdp) {
  const res = await fetch(`${BASE}/codes-temporaires/modifier-mot-de-passe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, nouveau_mdp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Code invalide ou expiré');
  return data;
}

export function saveSession(token, etudiant, codeDossier) {
  localStorage.setItem('cap_token', token);
  localStorage.setItem('cap_etudiant', JSON.stringify(etudiant));
  localStorage.setItem('cap_code_dossier', codeDossier || '');
}

export function clearSession() {
  localStorage.removeItem('cap_token');
  localStorage.removeItem('cap_etudiant');
  localStorage.removeItem('cap_code_dossier');
}

export function getSession() {
  const token = localStorage.getItem('cap_token');
  const etudiant = JSON.parse(localStorage.getItem('cap_etudiant') || 'null');
  const codeDossier = localStorage.getItem('cap_code_dossier') || '';
  return { token, etudiant, codeDossier };
}

/* ── Personnel ── */
export async function apiPersonnelLogin(email, mdp) {
  const res = await fetch(`${BASE}/personnel/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, mdp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Email ou mot de passe incorrect');
  return data;
}

export function savePersonnelSession(token, personnel) {
  localStorage.setItem('cap_personnel_token', token);
  localStorage.setItem('cap_personnel', JSON.stringify(personnel));
}

export function clearPersonnelSession() {
  localStorage.removeItem('cap_personnel_token');
  localStorage.removeItem('cap_personnel');
}

export function getPersonnelSession() {
  const token = localStorage.getItem('cap_personnel_token');
  const personnel = JSON.parse(localStorage.getItem('cap_personnel') || 'null');
  return { token, personnel };
}

/* ── Gestion Personnel ── */
export async function apiListPersonnel(token) {
  const res = await fetch(`${BASE}/personnel/liste`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.personnel;
}

export async function apiListConseillers(token) {
  const res = await fetch(`${BASE}/personnel/conseillers`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.conseillers;
}

export async function apiCreatePersonnel(token, payload) {
  const res = await fetch(`${BASE}/personnel/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.personnel;
}

export async function apiUpdatePersonnel(token, id, payload) {
  const res = await fetch(`${BASE}/personnel/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.personnel;
}

export async function apiDeletePersonnel(token, id) {
  const res = await fetch(`${BASE}/personnel/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data;
}

export async function apiToggleBlockPersonnel(token, id) {
  const res = await fetch(`${BASE}/personnel/${id}/bloquer`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.personnel;
}

/* ── Gestion Étudiants ── */
export async function apiListEtudiants(token) {
  const res = await fetch(`${BASE}/etudiants/`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.etudiants;
}

export async function apiCreateEtudiant(token, payload) {
  const res = await fetch(`${BASE}/etudiants/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data;
}

export async function apiUpdateEtudiant(token, id, payload) {
  const res = await fetch(`${BASE}/etudiants/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.etudiant;
}

export async function apiDeleteEtudiant(token, id) {
  const res = await fetch(`${BASE}/etudiants/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data;
}

export async function apiToggleBlockEtudiant(token, id) {
  const res = await fetch(`${BASE}/etudiants/${id}/bloquer`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.etudiant;
}

/* ── Gestion Dossiers (conseiller) ── */
export async function apiGetMesDossiers(token) {
  const res = await fetch(`${BASE}/dossiers/mes-dossiers`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.dossiers;
}

/* ── Gestion Dossiers (admin) ── */
export async function apiListDossiers(token) {
  const res = await fetch(`${BASE}/dossiers/`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.dossiers;
}

export async function apiAssignConseiller(token, id, type, conseiller_id) {
  const res = await fetch(`${BASE}/dossiers/${id}/conseiller`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ type, conseiller_id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.dossier;
}

export async function apiUpdateDossierStatus(token, id, payload) {
  const res = await fetch(`${BASE}/dossiers/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.dossier;
}

/* ── Notifications ── */
export async function apiGetNotifications(token) {
  const res = await fetch(`${BASE}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.notifications;
}

export async function apiMarkNotifRead(token, id) {
  const res = await fetch(`${BASE}/notifications/${id}/lu`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.notification;
}

export async function apiMarkAllNotifsRead(token) {
  const res = await fetch(`${BASE}/notifications/tout-lire`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data;
}

/* ── Messagerie ── */
export async function apiSendMessage(token, destinataire, contenu) {
  const res = await fetch(`${BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ destinataire, contenu }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.data;
}

export async function apiGetConversations(token) {
  const res = await fetch(`${BASE}/messages`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.conversations;
}

export async function apiGetMessages(token, interlocuteur) {
  const enc = encodeURIComponent(interlocuteur);
  const res = await fetch(`${BASE}/messages/${enc}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.messages;
}

export async function apiGetUnreadMessages(token) {
  const res = await fetch(`${BASE}/messages/non-lus`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur');
  return data.non_lus;
}

/* ── Dossiers Université ── */
export async function apiCreateDossierUniversite(token, payload) {
  const res = await fetch(`${BASE}/dossiers-universite/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la création');
  return data;
}

export async function apiListDossiersUniversite(token) {
  const res = await fetch(`${BASE}/dossiers-universite/`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement');
  return data.dossiersUniversite || [];
}

export async function apiListDossiersUniversiteByDossier(token, codeDossier) {
  const res = await fetch(`${BASE}/dossiers-universite/dossier/${encodeURIComponent(codeDossier)}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement');
  return data.dossiersUniversite || [];
}

export async function apiGetDossierUniversite(token, id) {
  const res = await fetch(`${BASE}/dossiers-universite/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Introuvable');
  return data.dossierUniversite;
}

export async function apiUpdateDossierUniversite(token, id, payload) {
  const res = await fetch(`${BASE}/dossiers-universite/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour');
  return data;
}

export async function apiDeleteDossierUniversite(token, id) {
  const res = await fetch(`${BASE}/dossiers-universite/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression');
  return data;
}
