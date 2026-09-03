import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, BarChart3, Check, CheckCircle, GraduationCap, Landmark, MapPin, Plane, Shield, TrendingUp, Zap } from 'lucide-react';
import { getStartPath } from '../api/auth';
import useAdvancedScroll from '../hooks/useAdvancedScroll';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'Cap sur la France',
    title: 'Votre projet d’études en France commence ici',
    description: 'Orientation, candidatures, Campus France et visa : un expert vous accompagne jusqu’à votre arrivée.',
    location: 'Paris · Lyon · Bordeaux · Lille',
    credit: 'Photo libre — Unsplash',
  },
  {
    image: 'https://unsplash.com/photos/nsHO6mtOsc4/download?force=true&w=2200',
    eyebrow: 'L’excellence académique française',
    title: 'Intégrez la formation qui révèle votre potentiel',
    description: 'Nous construisons une stratégie de candidature cohérente avec votre parcours, vos ambitions et votre budget.',
    location: 'Universités · Écoles · Instituts',
    credit: 'La Sorbonne — Robin Benzrihem / Unsplash',
  },
  {
    image: 'https://unsplash.com/photos/-JonPZiIhII/download?force=true&w=2200',
    eyebrow: 'De Dakar à votre campus',
    title: 'Chaque étape maîtrisée, jusqu’à votre départ',
    description: 'Votre dossier avance dans un espace digital clair, avec des conseils personnalisés et un suivi humain.',
    location: 'Accompagnement depuis Dakar',
    credit: 'Paris-Sorbonne — Chepe Nicoli / Unsplash',
  },
  {
    image: 'https://images.unsplash.com/photo-1562774053-70193937158a?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'Vie étudiante en France',
    title: 'Intégrez une communauté internationale dynamique',
    description: 'Plus de 370 000 étudiants étrangers choisissent la France chaque année. Devenez l’un d’entre eux.',
    location: 'Campus · Résidences étudiantes · Vie associative',
    credit: 'Campus universitaire — Unsplash',
  },
  {
    image: 'https://images.unsplash.com/photo-1523240795612-9770540121d8?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'Excellence académique',
    title: 'Des campus d’exception pour votre formation',
    description: 'Universités historiques, laboratoires de pointe, bibliothèques riches : la France investit dans votre réussite.',
    location: 'Sorbonne · Sciences Po · Polytechnique',
    credit: 'Campus français — Unsplash',
  },
  {
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'Étudiants du monde entier',
    title: 'La France, 1ère destination d’études non anglophone',
    description: 'Rejoignez une communauté d’étudiants venus du monde entier dans un pays reconnu pour sa qualité de vie et ses diplômes.',
    location: 'Lyon · Toulouse · Montpellier · Strasbourg',
    credit: 'Étudiants internationaux — Unsplash',
  },
  {
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'Bibliothèques & recherche',
    title: 'Un environnement d’apprentissage d’exception',
    description: 'Accédez à des bibliothèques universitaires centenaires, des centres de recherche et un accompagnement pédagogique reconnu.',
    location: 'Bibliothèque Sainte-Geneviève · BnF · SCD',
    credit: 'Bibliothèque universitaire — Unsplash',
  },
  {
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'Diplômes reconnus',
    title: 'Un diplôme français, un passeport pour le monde',
    description: 'Les diplômes français sont reconnus dans toute l’Europe et au-delà. Votre investissement ouvre des portes internationales.',
    location: 'LMD · Diplômes nationaux · ECTS',
    credit: 'Sorbonne — Unsplash',
  },
];

const franceHighlights = [
  { icon: GraduationCap, value: '3 500+', label: 'établissements d’enseignement supérieur' },
  { icon: Landmark, value: 'Des diplômes', label: 'reconnus dans le monde entier' },
  { icon: Plane, value: 'Une expérience', label: 'académique et culturelle unique' },
];

const steps = [
  { title: 'Analyse du profil', desc: 'Évaluation complète de votre parcours académique et de vos objectifs.' },
  { title: 'Orientation stratégique', desc: 'Recommandation personnalisée des filières et universités adaptées.' },
  { title: 'Constitution du dossier', desc: 'Préparation et vérification de tous vos documents académiques.' },
  { title: 'Candidatures', desc: 'Dépôt de vos candidatures aux universités sélectionnées.' },
  { title: 'Préparation visa', desc: 'Accompagnement complet pour l\'entretien et le dossier consulaire.' },
  { title: 'Départ réussi', desc: 'Vous partez étudier avec toutes les assurances nécessaires.' },
];

const features = [
  { icon: <Zap size={20} />, title: 'Processus digital', desc: 'L\'étudiant ne se déplace qu\'en cas d\'urgence ou lorsqu\'il le souhaite personnellement.' },
  { icon: <BarChart3 size={20} />, title: 'Suivi temps réel', desc: 'Dashboard personnel de votre avancement' },
  { icon: <Shield size={20} />, title: 'Accompagnement total', desc: "De l'orientation au visa" },
  { icon: <TrendingUp size={20} />, title: 'Tarif accessible', desc: "Jusqu'à 3x moins cher qu'une agence" },
];

const homePlans = [
  {
    step: 'Étape 1',
    title: 'Admission',
    price: '39 900',
    description: 'Tout pour construire, déposer et suivre vos candidatures en France.',
    features: ['Analyse complète du profil', 'Choix des filières et universités', 'Dépôt et suivi des candidatures', 'Préparation Campus France'],
  },
  {
    step: 'Étape 2',
    title: 'Visa étudiant',
    price: '49 900',
    description: 'Payable uniquement après votre admission universitaire.',
    features: ['Constitution du dossier visa', 'Prise en charge et hébergement (accompagnement)', 'Préparation à l’entretien', 'Suivi jusqu’au résultat'],
  },
];

const stats = [
  // { value: '500+', label: 'Étudiants accompagnés' },
  { value: '100%',  label: 'Digital' },
  { value: 'Pays couvert',    label: 'France' },
  { value: '39 900', label: 'FCFA pour démarrer' },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  useAdvancedScroll();

  const showPreviousSlide = () => {
    setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const showNextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  return (
    <main className="home-page">
      <Helmet>
        <title>CapAdmis | Études en France, Campus France et études à l'étranger</title>
        <meta name="description" content="CapAdmis accompagne les étudiants dans leurs études en France et à l'étranger : orientation, admission universitaire, procédure Campus France, visa étudiant et suivi personnalisé. Commencez votre projet d'études en France dès aujourd'hui." />
        <meta name="keywords" content="études en France, etude en france, études à l'étranger, etude a l'etranger, Campus France, visa étudiant, admission université France, accompagnement étudiant, étudier en France, procédure Campus France" />
        <link rel="canonical" href="https://capadmis.com/" />
        <meta property="og:title" content="CapAdmis | Études en France et à l'étranger — Accompagnement complet" />
        <meta property="og:description" content="Orientation, admission universitaire, procédure Campus France et visa étudiant. Capadmis vous accompagne pour étudier en France et à l'étranger." />
      </Helmet>

      {/* ── HERO ── */}
      <section className="hero" aria-roledescription="carrousel" aria-label="Destinations et accompagnement CapAdmis">
        <div className="hero__slides">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.title}
              className={`hero__slide${index === activeSlide ? ' hero__slide--active' : ''}`}
              aria-hidden={index !== activeSlide}
            >
              <img src={slide.image} alt="" className="hero__image" />
            </div>
          ))}
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__copy" key={activeSlide}>
            <span className="hero__eyebrow"><span />{heroSlides[activeSlide].eyebrow}</span>
            <h1>{heroSlides[activeSlide].title}</h1>
            <p>{heroSlides[activeSlide].description}</p>
            <div className="hero__location"><MapPin size={16} /> {heroSlides[activeSlide].location}</div>
            <div className="hero__actions">
              <Link to={getStartPath()} className="btn btn--hero-primary">
                creer mon compte <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn--hero-secondary">
                poser une question
              </Link>
            </div>
            <div className="hero__reassurance">
              <span><Check size={15} /> Diagnostic personnalisé</span>
              <span><Check size={15} /> Conseiller dédié</span>
              <span><Check size={15} /> Suivi jusqu’au visa</span>
            </div>
          </div>
        </div>
        <a
          className="hero__credit"
          href="https://unsplash.com/license"
          target="_blank"
          rel="noreferrer"
        >
          {heroSlides[activeSlide].credit}
        </a>
        <div className="hero__navigation">
          <button type="button" className="hero__arrow" onClick={showPreviousSlide} aria-label="Image précédente">
            <ArrowLeft size={20} />
          </button>
          <div className="hero__dots">
            {heroSlides.map((slide, index) => (
              <button
                type="button"
                key={slide.title}
                className={`hero__dot${index === activeSlide ? ' hero__dot--active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Afficher l’image ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : undefined}
              />
            ))}
          </div>
          <button type="button" className="hero__arrow" onClick={showNextSlide} aria-label="Image suivante">
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section" data-reveal>
        <div className="container">
          <div className="stats-section__grid">
            {stats.map((s, i) => (
              <div key={s.label} className="stats-section__item" data-reveal data-reveal-delay={i * 100} data-tilt>
                <div className="stats-section__value">{s.value}</div>
                <div className="stats-section__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="france-section" data-reveal>
        <div className="container france-section__grid">
          <div className="france-section__visual" data-reveal data-reveal-delay="100" data-parallax="0.15">
            <img
              className="france-section__main-image"
              src="https://unsplash.com/photos/nsHO6mtOsc4/download?force=true&w=1400"
              alt="Façade de la Sorbonne à Paris"
              loading="lazy"
            />
            <img
              className="france-section__detail-image"
              src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=85"
              alt="Rue parisienne près de la Tour Eiffel"
              loading="lazy"
            />
            <span className="france-section__badge"><MapPin size={16} /> Étudier en France</span>
          </div>
          <div className="france-section__content" data-reveal data-reveal-delay="200">
            <span className="section-label">Votre destination, notre expertise</span>
            <h2 className="section-title">La France, bien plus qu’une destination d’études</h2>
            <p className="france-section__intro">
              Construisez un projet académique solide dans un pays reconnu pour la qualité de ses formations, sa recherche et son ouverture internationale.
            </p>
            <div className="france-section__highlights">
              {franceHighlights.map(({ icon: Icon, value, label }) => (
                <div className="france-highlight" key={value}>
                  <span className="france-highlight__icon"><Icon size={20} /></span>
                  <span><strong>{value}</strong>{label}</span>
                </div>
              ))}
            </div>
            <Link to="/procedure" className="france-section__link">
              Découvrir la procédure <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" data-reveal>
        <div className="container">
          <div className="features-section__header">
            <span className="section-label">L’expertise CapAdmis</span>
            <h2 className="section-title">Tout ce qu’il faut pour réussir votre projet France</h2>
            <p className="section-subtitle">Une méthode rigoureuse, des outils simples et un conseiller qui connaît réellement votre dossier.</p>
          </div>
          <div className="features-section__grid">
            {features.map((f, i) => (
              <div key={f.title} className="feature-card" data-reveal data-reveal-delay={i * 120} data-tilt>
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="steps-section" data-reveal>
        <div className="container--narrow">
          <div className="steps-section__header">
            <span className="section-label">Un chemin clair vers la France</span>
            <h2 className="section-title">Votre parcours, maîtrisé en 6 étapes</h2>
            <p className="section-subtitle">De la première analyse à l’embarquement, chaque décision est préparée avec vous.</p>
          </div>
          <div className="steps-section__wrapper">
            <div className="steps-section__line" />
            <div className="steps-section__grid">
              {steps.map((step, i) => (
                <div key={step.title} className="step-card" data-reveal data-reveal-delay={i * 80}>
                  <div className="step-card__num">{i + 1}</div>
                  <h3 className="step-card__title">{step.title}</h3>
                  <p className="step-card__desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-pricing" data-reveal>
        <div className="container">
          <div className="home-pricing__header">
            <div>
              <span className="section-label">Des tarifs sans surprise</span>
              <h2 className="section-title">Le meilleur accompagnement, au prix juste</h2>
            </div>
            <p>Deux paiements séparés, aucune dépense inutile : vous ne payez l’étape visa qu’après avoir obtenu votre admission.</p>
          </div>
          <div className="home-pricing__grid">
            {homePlans.map((plan, index) => (
              <article className={`home-price-card${index === 0 ? ' home-price-card--featured' : ''}`} key={plan.title} data-reveal data-reveal-delay={index * 150} data-tilt>
                <div className="home-price-card__top">
                  <span>{plan.step}</span>
                  {index === 0 && <strong>Pour commencer</strong>}
                </div>
                <h3>{plan.title}</h3>
                <div className="home-price-card__price">{plan.price}<small> FCFA</small></div>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}><CheckCircle size={17} /> {feature}</li>
                  ))}
                </ul>
                <Link to={index === 0 ? getStartPath() : '/tarifs'} className="home-price-card__cta">
                  {index === 0 ? 'Lancer mon projet' : 'Voir les conditions'} <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
          <div className="home-pricing__footer">
            <span><Check size={16} /> Jusqu’à 3 fois moins cher qu’une agence traditionnelle</span>
            <Link to="/tarifs">Comparer toutes les prestations <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" data-reveal>
        <div className="cta-section__image" />
        <div className="cta-section__overlay" />
        <div className="container--tight">
          <div className="cta-section__content" data-reveal data-reveal-delay="100">
            <span className="cta-section__eyebrow">Votre avenir n’attend pas</span>
            <h2 className="cta-section__title">Faites de la France votre prochain campus</h2>
            <p className="cta-section__desc">
              Recevez une première analyse de votre projet et avancez avec une stratégie adaptée à votre profil.
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