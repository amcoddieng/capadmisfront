import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import useAdvancedScroll from '../hooks/useAdvancedScroll';

const contactInfo = [
  { icon: <MapPin className="w-5 h-5 text-blue-600" />, label: 'Adresse', value: 'Dakar, Sénégal' },
  { icon: <Phone className="w-5 h-5 text-blue-600" />, label: 'Téléphone / WhatsApp', value: '+221 76 948 60 60' },
  { icon: <Mail className="w-5 h-5 text-blue-600" />, label: 'Email', value: 'contact@capadmis.com' },
  { icon: <Clock className="w-5 h-5 text-blue-600" />, label: 'Disponibilité', value: 'Lun–Sam, 8h–20h' },
];

export default function Contact() {
  useAdvancedScroll();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' });

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="public-page public-page--contact">
      <Helmet>
        <title>Contact — CapAdmis</title>
        <meta name="description" content="Contactez CapAdmis pour toute question sur votre procédure d'études à l'étranger. WhatsApp, email ou téléphone. Réponse rapide garantie." />
        <link rel="canonical" href="https://capadmis.com/contact" />
      </Helmet>

      {/* Hero */}
      <section className="page-hero--gradient page-hero--center public-hero public-hero--contact">
        <div className="container">
          <span className="page-hero__badge">Contact</span>
          <h1 className="page-hero__title">Parlons de votre projet d’études en France</h1>
          <p className="page-hero__desc">
            Une question sur votre orientation, votre dossier ou nos tarifs ? Échangez avec notre équipe et obtenez une réponse claire.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="page-section--gray" data-reveal>
        <div className="container">
          <div className="contact-layout">
            {/* Info */}
            <div data-reveal data-reveal-delay="100">
              <span className="section-label">Un conseiller à votre écoute</span>
              <h2 className="contact-info__title">Votre projet commence par une conversation</h2>
              <p className="contact-info__desc">
                Que vous soyez au début de votre réflexion ou prêt à lancer votre procédure, notre équipe est disponible pour répondre à toutes vos questions.
              </p>
              <div className="contact-info-cards">
                {contactInfo.map(info => (
                  <div key={info.label} className="contact-info-card" data-tilt>
                    <div className="contact-info-card__icon">{info.icon}</div>
                    <div>
                      <div className="contact-info-card__label">{info.label}</div>
                      <div className="contact-info-card__value">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="contact-promo">
                <div className="contact-promo__title">Réponse rapide garantie</div>
                <p className="contact-promo__text">
                  Nous nous engageons à répondre à toutes les demandes dans un délai de 24 heures ouvrables maximum.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card" data-reveal data-reveal-delay="200">
              {sent ? (
                <div className="contact-success">
                  <div className="contact-success__icon"><CheckCircle size={32} /></div>
                  <h3 className="contact-success__title">Message envoyé !</h3>
                  <p className="contact-success__desc">
                    Merci pour votre message. Notre équipe vous répondra dans les 24 heures ouvrables.
                  </p>
                  <button
                    className="contact-success__link"
                    onClick={() => { setSent(false); setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' }); }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form-body">
                  <h2 className="contact-form-card__title">Envoyez-nous un message</h2>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Nom complet *</label>
                      <input required className="form-input" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Votre nom" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input required type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="votre@email.com" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone / WhatsApp</label>
                    <input type="tel" className="form-input" value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="+221 77 000 00 00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sujet *</label>
                    <select required className="form-select" value={form.sujet} onChange={e => set('sujet', e.target.value)}>
                      <option value="">Sélectionner un sujet</option>
                      <option value="orientation">Conseil en orientation</option>
                      <option value="procedure">Question sur la procédure</option>
                      <option value="tarifs">Question sur les tarifs</option>
                      <option value="dossier">Suivi de dossier</option>
                      <option value="visa">Préparation visa</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea required rows={5} className="form-textarea" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Décrivez votre situation et votre question..." />
                  </div>
                  <button type="submit" className="form-submit">
                    <Send size={16} /> Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
