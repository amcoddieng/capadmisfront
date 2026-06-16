import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPersonnelSession, clearPersonnelSession } from '../api/auth';

export default function DashboardConseillerVisa() {
  const navigate = useNavigate();
  const { token, personnel } = getPersonnelSession();

  useEffect(() => {
    if (!token || !personnel || personnel.role !== 'conseiller_visa') {
      navigate('/espace-pro');
    }
  }, [navigate]);

  if (!token || !personnel) return null;

  const handleLogout = () => {
    clearPersonnelSession();
    navigate('/espace-pro');
  };

  return (
    <div className="stub-page">
      <div className="stub-page__card">
        <p className="stub-page__role">conseiller_visa</p>
        <h1 className="stub-page__name">{personnel.prenom} {personnel.nom}</h1>
        <span className="stub-page__code">{personnel.code}</span>
        <button className="stub-page__logout" onClick={handleLogout}>Déconnexion</button>
      </div>
    </div>
  );
}
