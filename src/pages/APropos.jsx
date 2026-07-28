import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Target, Cpu, BookOpen, Globe, Users, Shield, CheckCircle } from 'lucide-react';
import { getStartPath } from '../api/auth';
import useAdvancedScroll from '../hooks/useAdvancedScroll';

const services = [
  { icon: <BookOpen size={20} />, title: 'Conseil en orientation', desc: "Analyse de votre profil académique pour identifier les filières et universités adaptées." },
  { icon: <Target size={20} />, title: 'Optimisation des candidatures', desc: "Préparation et soumission des dossiers pour maximiser vos chances d'admission." },
  { icon: <Cpu size={20} />, title: 'Analyse intelligente', desc: "Notre moteur analyse vos notes, votre CV et votre projet pour vous faire des recommandations personnalisées." },
  { icon: <Globe size={20} />, title: 'Préparation Campus France', desc: "Accompagnement complet pour l'entretien Campus France, étape clé de votre procédure." },
  { icon: <Shield size={20} />, title: 'Préparation visa', desc: "Suivi de votre dossier visa : justificatifs, entretien, hébergement, financement." },
  { icon: <Users size={20} />, title: 'Suivi digital du dossier', desc: "Un tableau de bord personnel affiche chaque étape de votre procédure en temps réel." },
];

const values = [
  { emoji: '🎯', title: 'Accessibilité', desc: 'Des tarifs accessibles à tous les étudiants africains.' },
  { emoji: '🤝', title: 'Accompagnement', desc: 'Un suivi humain et personnalisé à chaque étape.' },
  { emoji: '💻', title: 'Technologie', desc: 'Une plateforme digitale moderne et intuitive.' },
  { emoji: '🔒', title: 'Confiance', desc: 'Sécurité des données et transparence totale.' },
];

const missionItems = [
  "Accompagnement de l'orientation jusqu'au visa",
  'Suivi digital avec tableau de bord personnel',
  'Recommandations personnalisées',
  'Tarifs accessibles',
];

const missionStats = [
  { value: '500+', label: 'Étudiants' },
  { value: '95%',  label: 'Satisfaction' },
  { value: '6',    label: 'Pays' },
  { value: '18',   label: 'Étapes' },
];

export default function APropos() {
  useAdvancedScroll();
  return (
    <main className="public-page public-page--about">
      <Helmet>
        <title>À propos — CapAdmis</title>
        <meta name="description" content="Découvrez CapAdmis, la plateforme digitale qui accompagne les étudiants africains dans leurs études à l'étranger. Notre mission, nos valeurs et notre équipe." />
        <link rel="canonical" href="https://capadmis.com/a-propos" />
      </Helmet>

      {/* Hero */}
      <section className="page-hero public-hero public-hero--about">
        <div className="container">
          <div style={{ maxWidth: '48rem' }}>
            <span className="page-hero__badge">À propos</span>
            <h1 className="page-hero__title">L’expertise qui donne un cap à votre projet France</h1>
            <p className="page-hero__desc">
              Une équipe engagée, une méthode claire et une plateforme digitale pour vous accompagner de l’orientation jusqu’au visa.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="page-section" data-reveal>
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text" data-reveal data-reveal-delay="100">
              <span className="section-label">Notre mission</span>
              <h2 className="mission-title">Rendre les études en France accessibles, claires et sereines</h2>
              <p className="mission-desc">
                Beaucoup d'étudiants abandonnent leur projet faute d'accompagnement adapté ou de moyens financiers.
                CapAdmis a été créé pour changer cela.
              </p>
              <ul className="mission-list">
                {missionItems.map(item => (
                  <li key={item} className="mission-list__item">
                    <CheckCircle size={18} className="mission-list__icon" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mission-stats-box" data-reveal data-reveal-delay="200" data-parallax="0.1">
              <div className="mission-stats-grid">
                {missionStats.map(s => (
                  <div key={s.label} className="mission-stat">
                    <div className="mission-stat__value">{s.value}</div>
                    <div className="mission-stat__label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="page-section--gray" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Nos services</span>
            <h2 className="section-title">Une plateforme tout-en-un</h2>
          </div>
          <div className="grid-3">
            {services.map((s, i) => (
              <div key={s.title} className="service-card" data-reveal data-reveal-delay={i * 100} data-tilt>
                <div className="service-card__icon">{s.icon}</div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="page-section" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Nos valeurs</span>
            <h2 className="section-title">Ce qui nous guide</h2>
          </div>
          <div className="grid-4">
            {values.map((v, i) => (
              <div key={v.title} className="value-card" data-reveal data-reveal-delay={i * 100} data-tilt>
                <div className="value-card__emoji">{v.emoji}</div>
                <div className="value-card__title">{v.title}</div>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section--dark" data-reveal>
        <div className="container--tight" data-reveal data-reveal-delay="100" style={{ textAlign: 'center' }}>
          <h2 className="page-cta__title">Votre projet mérite une stratégie solide</h2>
          <p className="page-cta__desc">Commencez aujourd’hui avec un accompagnement pensé pour votre profil et vos ambitions.</p>
          <div className="page-cta__actions">
            <Link to={getStartPath()} className="btn btn--cta-primary">
              Créer mon compte <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
