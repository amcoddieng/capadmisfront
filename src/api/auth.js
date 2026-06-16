const BASE = '/api';

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
