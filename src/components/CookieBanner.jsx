import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('capadmis_cookie_consent');
      if (!consent) setVisible(true);
    } catch {
      // localStorage indisponible
    }
  }, []);

  const handleChoice = (accepted) => {
    try {
      localStorage.setItem('capadmis_cookie_consent', accepted ? 'accepted' : 'refused');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(12, 28, 63, 0.96)',
        color: '#fff',
        padding: '1rem 1.5rem',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.9rem',
      }}
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies"
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <p style={{ margin: 0, flex: 1, minWidth: 260, lineHeight: 1.6 }}>
          Nous utilisons des cookies techniques nécessaires au fonctionnement du site et à la sécurité de votre session.
          Vous pouvez accepter ou refuser les cookies optionnels. En continuant, vous acceptez notre{' '}
          <a href="/confidentialite" style={{ color: '#93c5fd', textDecoration: 'underline' }}>
            politique de confidentialité
          </a>.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleChoice(false)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Refuser
          </button>
          <button
            onClick={() => handleChoice(true)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 6,
              border: 'none',
              background: '#1d4ed8',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
