import { createContext, useContext, useState, useCallback } from 'react';
import ModalMessage from '../components/ModalMessage';

const MessageModalContext = createContext(null);

export function MessageModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState({ token: '', email: '', label: '', onSent: null });

  const openMessageModal = useCallback((token, email, label, onSent) => {
    setPayload({ token, email, label, onSent });
    setIsOpen(true);
  }, []);

  const closeMessageModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <MessageModalContext.Provider value={{ openMessageModal, closeMessageModal }}>
      {children}
      {isOpen && (
        <ModalMessage
          token={payload.token}
          destinataireEmail={payload.email}
          destinataireLabel={payload.label}
          onClose={closeMessageModal}
          onSent={payload.onSent}
        />
      )}
    </MessageModalContext.Provider>
  );
}

export function useMessageModal() {
  const ctx = useContext(MessageModalContext);
  if (!ctx) throw new Error('useMessageModal must be used within MessageModalProvider');
  return ctx;
}
