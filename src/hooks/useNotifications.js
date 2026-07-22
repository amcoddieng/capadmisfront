import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { apiGetNotifications, apiMarkNotifRead, apiMarkAllNotifsRead } from '../api/auth';
import { playNotificationSound, registerAudioUnlock } from '../utils/sound';

const WS_URL = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL ?? 'https://capadmis.onrender.com';

export function useNotifications(token) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const unread = notifications.filter(n => !n.lu).length;

  const fetchNotifs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const list = await apiGetNotifications(token);
      setNotifications(prev => {
        const currentIds = new Set(prev.map(notification => notification.id));
        return [...list.filter(notification => !currentIds.has(notification.id)), ...prev];
      });
    } catch (_) {
      /* silencieux */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    registerAudioUnlock();
    fetchNotifs();
  }, [fetchNotifs]);

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
      console.error('[WS notifications] connexion impossible:', error.message);
    });
    socket.on('notification', (notif) => {
      setNotifications(prev => {
        if (prev.some(notification => notification.id === notif.id)) return prev;
        playNotificationSound();
        return [{ ...notif, lu: false }, ...prev];
      });
    });
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [token]);

  const markRead = useCallback(async (id) => {
    try {
      await apiMarkNotifRead(token, id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
    } catch (_) {}
  }, [token]);

  const markAllRead = useCallback(async () => {
    try {
      await apiMarkAllNotifsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
    } catch (_) {}
  }, [token]);

  return { notifications, loading, unread, fetchNotifs, markRead, markAllRead };
}
