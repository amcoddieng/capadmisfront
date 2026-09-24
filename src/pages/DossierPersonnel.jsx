import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import DossierDetailConseiller from '../components/DossierDetailConseiller';
import { apiGetMesDossiers, apiListDossiers, getPersonnelSession } from '../api/auth';

function getBackPath(role) {
  if (role === 'superadmin') return '/dashboard/superadmin/dossiers';
  if (role === 'admin') return '/dashboard/admin';
  if (role === 'conseiller_admission') return '/dashboard/conseiller-admission';
  return '/dashboard/conseiller-visa';
}

export default function DossierPersonnel() {
  const { code_dossier } = useParams();
  const navigate = useNavigate();
  const [session] = useState(() => getPersonnelSession());
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const role = session.personnel?.role;
        const dossiers = role === 'admin' || role === 'superadmin'
          ? await apiListDossiers(session.token)
          : await apiGetMesDossiers(session.token);
        const found = dossiers.find(item => item.code_dossier === code_dossier);
        if (!found) throw new Error('Dossier introuvable ou accès refusé');
        if (active) setDossier(found);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [code_dossier, session.personnel?.role, session.token]);

  const backPath = getBackPath(session.personnel?.role);

  if (loading) {
    return <div className="dossier-page-state"><Loader className="auth-spinner" size={24} /> Chargement du dossier…</div>;
  }

  if (error || !dossier) {
    return (
      <div className="dossier-page-state dossier-page-state--error">
        <AlertCircle size={26} />
        <strong>{error || 'Dossier introuvable'}</strong>
        <button className="form-back" onClick={() => navigate(backPath)}><ArrowLeft size={15} /> Retour</button>
      </div>
    );
  }

  return (
    <DossierDetailConseiller
      token={session.token}
      personnel={session.personnel}
      dossier={dossier}
      asPage
      onClose={() => navigate(backPath)}
      onRefresh={updated => updated && setDossier(current => ({ ...current, ...updated }))}
    />
  );
}
