import { Bell, CheckCheck, Loader, AlertCircle } from 'lucide-react';

const TYPE_LABELS = {
  assignation_conseiller_admission: 'Conseiller admission assigné',
  assignation_conseiller_visa:      'Conseiller visa assigné',
  assignation_dossier:              'Nouveau dossier assigné',
  validation_dossier:               'Dossier validé',
  change_status:                    'Statut mis à jour',
  demande_changement_document:      'Document à modifier',
  message_recu:                     'Message reçu',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min  = Math.floor(diff / 60000);
  const h    = Math.floor(min / 60);
  const d    = Math.floor(h / 24);
  if (d > 0)  return `il y a ${d} jour${d > 1 ? 's' : ''}`;
  if (h > 0)  return `il y a ${h} h`;
  if (min > 0) return `il y a ${min} min`;
  return "à l'instant";
}

export default function NotificationsPanel({ notifications, loading, unread, markRead, markAllRead }) {
  return (
    <div className="notif-panel">
      <div className="notif-panel__header">
        <div className="notif-panel__title">
          <Bell size={18} />
          Notifications
          {unread > 0 && <span className="notif-badge">{unread}</span>}
        </div>
        {unread > 0 && (
          <button className="notif-mark-all" onClick={markAllRead}>
            <CheckCheck size={14} /> Tout marquer comme lu
          </button>
        )}
      </div>

      {loading && (
        <div className="notif-loading">
          <Loader size={16} className="auth-spinner" /> Chargement…
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="notif-empty">
          <Bell size={40} strokeWidth={1.2} />
          <p>Aucune notification pour le moment.</p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <ul className="notif-list">
          {notifications.map(n => (
            <li
              key={n.id}
              className={`notif-item${n.lu ? '' : ' notif-item--unread'}`}
              onClick={() => !n.lu && markRead(n.id)}
              role={n.lu ? undefined : 'button'}
              tabIndex={n.lu ? undefined : 0}
              onKeyDown={e => !n.lu && e.key === 'Enter' && markRead(n.id)}
            >
              <div className="notif-item__dot" />
              <div className="notif-item__content">
                <span className="notif-item__type">{TYPE_LABELS[n.type] || n.type}</span>
                <p className="notif-item__message">{n.message}</p>
                <span className="notif-item__time">{timeAgo(n.date_creation)}</span>
              </div>
              {!n.lu && <span className="notif-item__new">Nouveau</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
