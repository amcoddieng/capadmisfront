import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, X, Zap, BarChart3, Shield, Users, Bell, TrendingUp, Award, Clock } from 'lucide-react';

const differentiators = [
  {
    icon: <Zap className="w-7 h-7 text-blue-600" />,
    title: 'Processus 100% digital et rapide',
    capadmis: 'Tout se fait en ligne : dépôt de documents, suivi, communication. Pas de déplacement en agence.',
    agence: 'Rendez-vous physiques, paperasse, délais importants.',
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-blue-600" />,
    title: 'Suivi transparent et en temps réel',
    capadmis: 'Un tableau de bord personnel affiche l\'état exact de chaque étape de votre procédure.',
    agence: 'Suivi opaque, difficile de savoir où en est son dossier.',
  },
  {
    icon: <Award className="w-7 h-7 text-blue-600" />,
    title: 'Analyse intelligente du profil',
    capadmis: 'Notre moteur analyse vos notes, votre CV et votre projet pour recommander les meilleures options.',
    agence: 'Recommandations génériques, peu personnalisées.',
  },
  {
    icon: <Users className="w-7 h-7 text-blue-600" />,
    title: 'Chaque dossier traité avec soin',
    capadmis: 'Contrairement aux agences surchargées, nos conseillers gèrent un nombre limité de dossiers pour garantir la qualité.',
    agence: 'Un conseiller peut gérer des dizaines de dossiers à la fois, entraînant des erreurs et des oublis.',
  },
  {
    icon: <Bell className="w-7 h-7 text-blue-600" />,
    title: 'Notifications à chaque étape',
    capadmis: 'Email, notifications en temps réel pour chaque avancement de votre dossier.',
    agence: 'Vous devez rappeler vous-même pour avoir des nouvelles.',
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-blue-600" />,
    title: 'Tarif accessible, sans compromis',
    capadmis: '39 900 FCFA pour démarrer. Un tarif transparent, sans frais cachés.',
    agence: 'Honoraires souvent opaques et élevés, parfois sans garantie de qualité.',
  },
  {
    icon: <Shield className="w-7 h-7 text-blue-600" />,
    title: 'Accompagnement jusqu\'au visa',
    capadmis: 'De l\'orientation jusqu\'au visa étudiant, un accompagnement continu et structuré.',
    agence: 'Souvent limité à la partie admission, peu de suivi pour le visa.',
  },
  {
    icon: <Clock className="w-7 h-7 text-blue-600" />,
    title: 'Disponible 7j/7',
    capadmis: 'Notre plateforme est accessible à toute heure. Les messages sont répondus rapidement.',
    agence: 'Horaires d\'ouverture limités, difficile à joindre le week-end.',
  },
];

const testimonialHighlight = {
  text: "Avant Capadmis., j'avais contacté deux agences classiques. Je ne savais jamais où en était mon dossier. Avec Capadmis., j'ai tout suivi en temps réel et j'ai été admis à Toulouse.",
  name: "Ibrahima F.",
  city: "Dakar",
  school: "Université de Toulouse",
};

export default function Pourquoi() {
  return (
    <main>
      {/* Hero */}
      <section className="page-hero--gradient">
        <div className="container">
          <div style={{ maxWidth: '48rem' }}>
            <span className="page-hero__badge">Pourquoi Capadmis. ?</span>
            <h1 className="page-hero__title">Une approche radicalement différente des agences traditionnelles</h1>
            <p className="page-hero__desc">
              Capadmis. structure le traitement de chaque dossier avec un suivi digital et des étapes clairement visibles. Une transparence totale, un coût accessible, une qualité irréprochable.
            </p>
          </div>
        </div>
      </section>

      {/* Key message */}
      <section className="page-section--blue-light">
        <div className="container--tight">
          <p className="key-message">
            "Contrairement aux agences où un conseiller peut gérer trop de dossiers à la fois,{' '}
            <strong>Capadmis. structure le traitement de chaque dossier</strong> avec un suivi digital et des étapes clairement visibles par l'étudiant."
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="page-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Nos différences</span>
            <h2 className="section-title">Ce qui nous distingue</h2>
          </div>
          <div className="grid-2">
            {differentiators.map(d => (
              <div key={d.title} className="diff-card">
                <div className="diff-card__header">
                  <div className="diff-card__icon">{d.icon}</div>
                  <h3 className="diff-card__title">{d.title}</h3>
                </div>
                <div className="diff-card__cols">
                  <div className="diff-col diff-col--good">
                    <div className="diff-col__badge">
                      <CheckCircle size={13} className="diff-col__badge-icon" />
                      <span>Capadmis.</span>
                    </div>
                    <p className="diff-col__text">{d.capadmis}</p>
                  </div>
                  <div className="diff-col diff-col--bad diff-col-divider">
                    <div className="diff-col__badge">
                      <X size={13} className="diff-col__badge-icon" />
                      <span>Agence classique</span>
                    </div>
                    <p className="diff-col__text">{d.agence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="page-section--gray">
        <div className="container--tight">
          <div className="quote-card">
            <div className="quote-card__emoji">💬</div>
            <blockquote className="quote-card__text">"{testimonialHighlight.text}"</blockquote>
            <div className="quote-card__author">
              <div className="quote-card__avatar">🇸🇳</div>
              <div>
                <div className="quote-card__name">{testimonialHighlight.name}</div>
                <div className="quote-card__meta">{testimonialHighlight.city} · {testimonialHighlight.school}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section--blue">
        <div className="container--tight">
          <h2 className="page-cta__title">Faites l'expérience Capadmis.</h2>
          <p className="page-cta__desc">Rejoignez une plateforme pensée pour vous simplifier la vie.</p>
          <div className="page-cta__actions">
            <Link to="/inscription" className="btn btn--cta-white">
              Commencer ma procédure <ArrowRight size={18} />
            </Link>
            <Link to="/analyse" className="btn btn--hero-secondary">
              Analyser mes chances
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
