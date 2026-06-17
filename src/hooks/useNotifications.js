import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { apiGetNotifications, apiMarkNotifRead, apiMarkAllNotifsRead } from '../api/auth';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

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
      setNotifications(list);
    } catch (_) {
      /* silencieux */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);

  useEffect(() => {
    if (!token) return;
    const socket = io(WS_URL, { auth: { token }, reconnection: true });
    socketRef.current = socket;
    socket.on('notification', (notif) => {
      setNotifications(prev => [{ ...notif, lu: false }, ...prev]);
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
