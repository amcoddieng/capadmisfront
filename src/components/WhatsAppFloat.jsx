import { useMemo, useState } from 'react';

const WhatsAppIcon = ({ size = 28 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 448 512"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M380.9 97.1C339.3 55.5 283.4 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3.5 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.4-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.1 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.9-138.8c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.8 1.4-14.9 6.9-5.1 5.6-19.5 19-19.5 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.1 31.6 11.7 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.4-26.5-1.1-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const WhatsAppFloat = ({
  phone = '221767675858',
  message: defaultMessage = "Bonjour CapAdmis, je souhaite obtenir des informations concernant vos services d'accompagnement aux études en France.",
  link = 'https://capadmis.com',
  linkLabel = 'capadmis.com',
  label = 'WhatsApp',
}) => {
  const [hovered, setHovered] = useState(false);

  const href = useMemo(() => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullMessage = link
      ? `${defaultMessage} ${linkLabel ? linkLabel + ' : ' : ''}${link}`
      : defaultMessage;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`;
  }, [phone, defaultMessage, link, linkLabel]);

  const buttonStyle = {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '.55rem',
    padding: hovered ? '.9rem 1.2rem .9rem 1rem' : '.9rem',
    borderRadius: '2rem',
    backgroundColor: '#25D366',
    color: '#fff',
    fontWeight: 600,
    fontSize: '.95rem',
    lineHeight: 1,
    boxShadow: hovered
      ? '0 8px 24px rgba(37, 211, 102, 0.45)'
      : '0 4px 14px rgba(37, 211, 102, 0.35)',
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'all .25s ease',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={buttonStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <WhatsAppIcon size={26} />
      <span
        style={{
          maxWidth: hovered ? '10rem' : 0,
          opacity: hovered ? 1 : 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transition: 'all .25s ease',
        }}
      >
        {label}
      </span>
    </a>
  );
};

export default WhatsAppFloat;
