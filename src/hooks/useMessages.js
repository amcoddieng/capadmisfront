import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { apiGetConversations, apiGetMessages, apiSendMessage, apiGetUnreadMessages } from '../api/auth';
import { playMessageSound, registerAudioUnlock } from '../utils/sound';

const WS_URL = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL ?? 'https://capadmis.onrender.com';

export function useMessages(token) {
  const [conversations, setConversations]   = useState([]);
  const [activeChat, setActiveChat]         = useState(null);
  const [messages, setMessages]             = useState([]);
  const [unreadCount, setUnreadCount]       = useState(0);
  const [loading, setLoading]               = useState(false);
  const socketRef = useRef(null);
  const activeChatRef = useRef(activeChat);

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

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const send = useCallback(async (destinataire, contenu) => {
    if (!token || !contenu.trim()) return null;
    const msg = await apiSendMessage(token, destinataire, contenu.trim());
    setMessages(prev => [...prev, msg]);
    await refreshConversations();
    return msg;
  }, [token, refreshConversations]);

  useEffect(() => {
    registerAudioUnlock();
    refreshConversations();
    refreshUnread();
  }, [refreshConversations, refreshUnread]);

  useEffect(() => {
    if (!token) return;
    const socket = io(WS_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on('connect_error', (error) => {
      console.error('[WS messages] connexion impossible:', error.message);
    });

    socket.on('message', (msg) => {
      const chat = activeChatRef.current;
      playMessageSound();
      if (chat && (msg.expediteur === chat || msg.destinataire === chat)) {
        setMessages(prev => prev.some(message => message.id === msg.id) ? prev : [...prev, msg]);
      }
      refreshConversations();
      refreshUnread();
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [token, refreshConversations, refreshUnread]);

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
