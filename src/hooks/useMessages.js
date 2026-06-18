import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { apiGetConversations, apiGetMessages, apiSendMessage, apiGetUnreadMessages } from '../api/auth';

const WS_URL = import.meta.env.VITE_WS_URL || 'https://capadmis.onrender.com';

export function useMessages(token) {
  const [conversations, setConversations]   = useState([]);
  const [activeChat, setActiveChat]         = useState(null);
  const [messages, setMessages]             = useState([]);
  const [unreadCount, setUnreadCount]       = useState(0);
  const [loading, setLoading]               = useState(false);
  const socketRef = useRef(null);

  const refreshConversations = useCallback(async () => {
    if (!token) return;
    try {
      const list = await apiGetConversations(token);
      setConversations(list);
    } catch (_) {}
  }, [token]);

  const refreshUnread = useCallback(async () => {
    if (!token) return;
    try {
      const count = await apiGetUnreadMessages(token);
      setUnreadCount(count);
    } catch (_) {}
  }, [token]);

  const loadConversation = useCallback(async (interlocuteur) => {
    if (!token || !interlocuteur) return;
    setActiveChat(interlocuteur);
    try {
      const msgs = await apiGetMessages(token, interlocuteur);
      setMessages(msgs);
    } catch (_) {}
  }, [token]);

  const send = useCallback(async (destinataire, contenu) => {
    if (!token || !contenu.trim()) return null;
    const msg = await apiSendMessage(token, destinataire, contenu.trim());
    setMessages(prev => [...prev, msg]);
    await refreshConversations();
    return msg;
  }, [token, refreshConversations]);

  useEffect(() => {
    refreshConversations();
    refreshUnread();
  }, [refreshConversations, refreshUnread]);

  useEffect(() => {
    if (!token) return;
    const socket = io(WS_URL, { auth: { token }, reconnection: true });
    socketRef.current = socket;

    socket.on('message', (msg) => {
      if (activeChat && (msg.expediteur === activeChat || msg.destinataire === activeChat)) {
        setMessages(prev => [...prev, msg]);
      }
      refreshConversations();
      refreshUnread();
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [token, activeChat, refreshConversations, refreshUnread]);

  return {
    conversations,
    activeChat,
    messages,
    unreadCount,
    loading,
    setActiveChat,
    loadConversation,
    send,
    refreshConversations,
    refreshUnread,
  };
}
