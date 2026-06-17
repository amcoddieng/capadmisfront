import { useState, useRef, useEffect } from 'react';
import { Send, Loader, MessageSquare, User, ChevronRight, AlertCircle } from 'lucide-react';
import { apiSendMessage } from '../api/auth';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min  = Math.floor(diff / 60000);
  const h    = Math.floor(min / 60);
  const d    = Math.floor(h / 24);
  if (d > 0)  return `${d}j`;
  if (h > 0)  return `${h}h`;
  if (min > 0) return `${min}min`;
  return "maintenant";
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
}

export default function MessagesPanel({ conversations, messages, activeChat, unreadCount, userEmail, onSelectChat, onSend }) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeChat) return;
    setSending(true);
    try {
      await onSend(activeChat, draft.trim());
      setDraft('');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="msg-layout">
      {/* Sidebar conversations */}
      <aside className="msg-sidebar">
        <div className="msg-sidebar__header">
          <MessageSquare size={18} />
          <span>Conversations</span>
          {unreadCount > 0 && <span className="msg-sidebar__badge">{unreadCount}</span>}
        </div>
        <div className="msg-sidebar__list">
          {conversations.length === 0 && (
            <div className="msg-sidebar__empty">Aucune conversation</div>
          )}
          {conversations.map(c => (
            <button
              key={c.interlocuteur}
              className={`msg-conv${activeChat === c.interlocuteur ? ' msg-conv--active' : ''}`}
              onClick={() => onSelectChat(c.interlocuteur)}
            >
              <div className="msg-conv__avatar"><User size={16} /></div>
              <div className="msg-conv__info">
                <div className="msg-conv__name">{c.interlocuteur}</div>
                <div className="msg-conv__preview">{c.dernier_message}</div>
              </div>
              <div className="msg-conv__meta">
                <span className="msg-conv__time">{timeAgo(c.date)}</span>
                {c.non_lus > 0 && <span className="msg-conv__count">{c.non_lus}</span>}
                <ChevronRight size={14} className="msg-conv__arrow" />
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Zone chat */}
      <div className="msg-chat">
        {!activeChat && (
          <div className="msg-chat__empty">
            <MessageSquare size={48} strokeWidth={1} />
            <p>Sélectionnez une conversation</p>
          </div>
        )}
        {activeChat && (
          <>
            <div className="msg-chat__header">
              <User size={16} />
              <span>{activeChat}</span>
            </div>
            <div className="msg-chat__scroll" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="msg-chat__start">Début de la conversation</div>
              )}
              {messages.map(m => {
                const isMe = m.expediteur === userEmail;
                return (
                  <div key={m.id} className={`msg-bubble${isMe ? ' msg-bubble--me' : ''}`}>
                    <div className="msg-bubble__content">{m.contenu}</div>
                    <div className="msg-bubble__time">
                      {formatDate(m.date_creation)}
                      {isMe && <span className="msg-bubble__status">{m.vu ? 'Vu' : 'Envoyé'}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="msg-chat__inputbar">
              <textarea
                rows={1}
                className="msg-chat__textarea"
                placeholder="Écrivez un message…"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />
              <button
                className="msg-chat__send"
                onClick={handleSend}
                disabled={sending || !draft.trim()}
              >
                {sending ? <Loader size={16} className="auth-spinner" /> : <Send size={16} />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
