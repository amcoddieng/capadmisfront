import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Loader, MessageSquare, User, ChevronRight, Check, CheckCheck } from 'lucide-react';

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

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
}

function formatDateHeader(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(d, today)) return 'Aujourd\'hui';
  if (isSameDay(d, yesterday)) return 'Hier';
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return '?';
  const parts = nameOrEmail.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return nameOrEmail.slice(0, 2).toUpperCase();
}

function displayName(c) {
  return c.nom || c.interlocuteur;
}

function Avatar({ name, size = 36, color = '#c5a150' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}20`, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size > 40 ? '.9rem' : '.75rem', fontWeight: 700, flexShrink: 0,
      border: `1px solid ${color}40`, textTransform: 'uppercase'
    }}>
      {getInitials(name)}
    </div>
  );
}

export default function MessagesPanel({ conversations, messages, activeChat, unreadCount, userEmail, loading, onSelectChat, onSend }) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const activeConv = useMemo(() => conversations.find(c => c.interlocuteur === activeChat), [conversations, activeChat]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [draft]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, activeChat]);

  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDate = null;
    for (const m of messages) {
      const d = new Date(m.date_creation).toDateString();
      if (d !== currentDate) {
        currentDate = d;
        groups.push({ type: 'date', date: m.date_creation, id: `date-${m.id}` });
      }
      groups.push({ type: 'msg', message: m });
    }
    return groups;
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeChat) return;
    setSending(true);
    try {
      await onSend(activeChat, draft.trim());
      setDraft('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
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
      <aside className="msg-sidebar" style={{ minHeight: 0, overflow: 'hidden' }}>
        <div className="msg-sidebar__header">
          <MessageSquare size={18} />
          <span>Conversations</span>
          {unreadCount > 0 && <span className="msg-sidebar__badge">{unreadCount}</span>}
        </div>
        <div className="msg-sidebar__list" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
          {conversations.length === 0 && (
            <div className="msg-sidebar__empty">Aucune conversation</div>
          )}
          {conversations.map(c => (
            <button
              key={c.interlocuteur}
              className={`msg-conv${activeChat === c.interlocuteur ? ' msg-conv--active' : ''}`}
              onClick={() => onSelectChat(c.interlocuteur)}
            >
              <Avatar name={displayName(c)} size={40} />
              <div className="msg-conv__info">
                <div className="msg-conv__name">{displayName(c)}</div>
                <div className="msg-conv__preview">{c.dernier_message || 'Pas de message'}</div>
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
            <p>Sélectionnez une conversation pour commencer</p>
          </div>
        )}
        {activeChat && (
          <>
            <div className="msg-chat__header">
              <Avatar name={displayName(activeConv)} size={36} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.1rem' }}>
                <span style={{ fontWeight: 600, fontSize: '.9rem', color: '#1e293b' }}>{displayName(activeConv)}</span>
                <span style={{ fontSize: '.7rem', color: '#64748b' }}>{activeConv?.interlocuteur}</span>
              </div>
            </div>
            <div className="msg-chat__scroll" ref={scrollRef}>
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', padding: '2rem 0', color: '#64748b', fontSize: '.85rem' }}>
                  <Loader size={16} className="auth-spinner" /> Chargement…
                </div>
              )}
              {!loading && messages.length === 0 && (
                <div className="msg-chat__start">Début de la conversation</div>
              )}
              {!loading && groupedMessages.map(item => {
                if (item.type === 'date') {
                  return (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '1rem 0', position: 'relative'
                    }}>
                      <span style={{
                        background: '#f1f5f9', color: '#64748b', fontSize: '.7rem',
                        padding: '.2rem .75rem', borderRadius: '999px', fontWeight: 500, zIndex: 1
                      }}>
                        {formatDateHeader(item.date)}
                      </span>
                    </div>
                  );
                }
                const m = item.message;
                const isMe = m.expediteur === userEmail;
                return (
                  <div key={m.id} className={`msg-bubble${isMe ? ' msg-bubble--me' : ''}`}>
                    <div className="msg-bubble__content">{m.contenu}</div>
                    <div className="msg-bubble__time">
                      <span>{formatTime(m.date_creation)}</span>
                      {isMe && (
                        <span className="msg-bubble__status" title={m.vu ? 'Vu' : 'Envoyé'}>
                          {m.vu ? <CheckCheck size={12} /> : <Check size={12} />}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="msg-chat__inputbar">
              <textarea
                ref={textareaRef}
                rows={1}
                className="msg-chat__textarea"
                placeholder="Écrivez un message…"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
                style={{ minHeight: 44, maxHeight: 140, overflowY: 'auto' }}
              />
              <button
                className="msg-chat__send"
                onClick={handleSend}
                disabled={sending || !draft.trim()}
                title="Envoyer"
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
