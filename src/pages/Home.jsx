import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle, Star, BarChart3, Shield, Award, Globe, Zap, TrendingUp } from 'lucide-react';
import { getStartPath } from '../api/auth';
import heroImage from '../assets/hero.png';

const steps = [
  { title: 'Analyse du profil', desc: 'Évaluation complète de votre parcours académique et de vos objectifs.' },
  { title: 'Orientation stratégique', desc: 'Recommandation personnalisée des filières et universités adaptées.' },
  { title: 'Constitution du dossier', desc: 'Préparation et vérification de tous vos documents académiques.' },
  { title: 'Candidatures', desc: 'Dépôt de vos candidatures aux universités sélectionnées.' },
  { title: 'Préparation visa', desc: 'Accompagnement complet pour l\'entretien et le dossier consulaire.' },
  { title: 'Départ réussi', desc: 'Vous partez étudier avec toutes les assurances nécessaires.' },
];

const features = [
  { icon: <Zap size={20} />, title: 'Processus digital', desc: 'Tout en ligne, sans déplacement' },
  { icon: <BarChart3 size={20} />, title: 'Suivi temps réel', desc: 'Dashboard personnel de votre avancement' },
  { icon: <Shield size={20} />, title: 'Accompagnement total', desc: "De l'orientation au visa" },
  { icon: <TrendingUp size={20} />, title: 'Tarif accessible', desc: "Jusqu'à 3x moins cher qu'une agence" },
];

const testimonials = [
  { name: 'Aminata D.', origin: 'Sénégal', text: 'Admission à Lyon 2 obtenue grâce à un suivi parfait.', school: 'Université Lyon 2' },
  { name: 'Moussa K.', origin: 'Guinée', text: "L'analyse m'a dirigé vers la bonne université. Visa en poche !", school: 'Université de Bordeaux' },
  { name: 'Fatou S.', origin: 'Sénégal', text: "Le dashboard m'a rassurée à chaque étape.", school: 'Université Paris-Saclay' },
];

const stats = [
  { value: '500+', label: 'Étudiants accompagnés' },
  { value: '95%',  label: 'Taux de satisfaction' },
  { value: '6',    label: 'Pays couverts' },
  { value: '39 900', label: 'FCFA pour démarrer' },
];

const dashboardItems = [
  { label: 'Analyse du profil',       done: true },
  { label: 'Orientation validée',     done: true },
  { label: 'Dossier soumis',          done: true },
  { label: 'Entretien Campus France', done: false },
  { label: 'Préparation visa',        done: false },
];

export default function Home() {
  return (
    <main>
      <Helmet>
        <title>Capadmis — Accompagnement études à l'étranger</title>
        <meta name="description" content="Capadmis : plateforme digitale d'accompagnement pour vos études en France, Canada, Belgique et plus. De l'orientation au visa." />
        <link rel="canonical" href="https://capadmis.com/" />
      </Helmet>

      {/* ── HERO ── */}
      <section className="hero">
        <img
          src={heroImage}
          alt="Étudiants africains préparant leur admission en France"
          className="hero__image"
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__actions">
            <Link to={getStartPath()} className="btn btn--hero-primary">
              Commencer ma procédure <ArrowRight size={18} />
            </Link>
            <Link to="/analyse" className="btn btn--hero-secondary">
              Analyser mes chances
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-section__grid">
            {stats.map((s) => (
              <div key={s.label} className="stats-section__item">
                <div className="stats-section__value">{s.value}</div>
                <div className="stats-section__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="container">
          <div className="features-section__header">
            <span className="section-label">Pourquoi nous choisir</span>
            <h2 className="section-title">Un accompagnement pensé pour vous</h2>
          </div>
          <div className="features-section__grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="steps-section">
        <div className="container--narrow">
          <div className="steps-section__header">
            <span className="section-label">Comment ça marche</span>
            <h2 className="section-title">Votre parcours en 6 étapes</h2>
          </div>
          <div className="steps-section__wrapper">
            <div className="steps-section__line" />
            <div className="steps-section__grid">
              {steps.map((step, i) => (
                <div key={step.title} className="step-card">
                  <div className="step-card__num">{i + 1}</div>
                  <h3 className="step-card__title">{step.title}</h3>
                  <p className="step-card__desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-section__header">
            <span className="section-label">Témoignages</span>
            <h2 className="section-title">Ils nous font confiance</h2>
          </div>
          <div className="testimonials-section__grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[1,2,3,4,5].map((s) => <Star key={s} size={18} fill="currentColor" />)}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__meta">{t.origin} · {t.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container--tight">
          <div className="cta-section__content">
            <h2 className="cta-section__title">Prêt à commencer votre procédure ?</h2>
            <p className="cta-section__desc">
              Rejoignez plus de 500 étudiants qui ont réussi leur admission avec notre accompagnement.
            </p>
            <div className="cta-section__actions">
              <Link to="/inscription" className="btn btn--cta-primary">
                Commencer ma procédure <ArrowRight size={20} />
              </Link>
              <Link to="/analyse" className="btn btn--cta-secondary">
                Analyser mes chances
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}