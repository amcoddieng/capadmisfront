import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle, X, HelpCircle } from 'lucide-react';
import { getStartPath } from '../api/auth';

const plans = [
  {
    id: 'admission',
    badge: null,
    label: 'Étape 1 — Admission',
    price: '39 900',
    subtitle: 'Pour lancer votre procédure d\'admission',
    color: 'border-blue-200',
    headerColor: 'bg-blue-50',
    features: [
      { included: true, text: 'Analyse complète de votre profil' },
      { included: true, text: 'Recommandation de filières & universités' },
      { included: true, text: 'Téléchargement des documents (espace sécurisé)' },
      { included: true, text: 'Dépôt des candidatures par notre équipe' },
      { included: true, text: 'Suivi en temps réel via tableau de bord' },
      { included: true, text: 'Préparation entretien Campus France' },
      { included: true, text: 'Notifications à chaque étape' },
      { included: false, text: 'Préparation dossier visa' },
      { included: false, text: 'Préparation entretien visa' },
    ],
    cta: 'Lancer ma procédure',
    ctaPath: '/inscription',
    note: null,
  },
  {
    id: 'visa',
    badge: 'Après admission',
    label: 'Étape 2 — Visa',
    price: '49 900',
    subtitle: 'Après obtention de l\'admission universitaire',
    color: 'border-blue-600',
    headerColor: 'bg-blue-700',
    headerText: 'text-white',
    features: [
      { included: true, text: 'Tous les services Étape 1 inclus' },
      { included: true, text: 'Constitution du dossier visa complet' },
      { included: true, text: 'Justificatifs financiers (accompagnement)' },
      { included: true, text: 'Hébergement et prise en charge' },
      { included: true, text: 'Préparation entretien visa' },
      { included: true, text: 'Vérification finale du dossier' },
      { included: true, text: 'Suivi jusqu\'au résultat du visa' },
      { included: true, text: 'Accompagnement en cas de refus' },
    ],
    cta: 'Commencer la procédure',
    ctaPath: '/inscription',
    note: 'Payable uniquement après obtention de votre admission.',
  },
];

const compare = [
  { feature: 'Analyse du profil', capadmis: true, agence: true },
  { feature: 'Tableau de bord digital', capadmis: true, agence: false },
  { feature: 'Suivi en temps réel', capadmis: true, agence: false },
  { feature: 'Notifications automatiques', capadmis: true, agence: false },
  { feature: 'Documents sécurisés en ligne', capadmis: true, agence: false },
  { feature: 'Accompagnement visa', capadmis: true, agence: true },
  { feature: 'Tarif accessible', capadmis: true, agence: false },
  { feature: 'Disponibilité 7j/7', capadmis: true, agence: false },
];

const faqs = [
  { q: 'Quand dois-je payer l\'Étape 2 ?', a: "L'étape 2 (49 900 FCFA) n'est payable qu'après l'obtention d'une admission dans une université. Aucun paiement anticipé pour cette étape." },
  { q: 'Que sont les frais Campus France ?', a: "Les frais Campus France (environ 80 000 FCFA) sont des frais officiels payés directement à Campus France. Ils ne font pas partie de nos honoraires." },
  { q: 'Quels moyens de paiement acceptez-vous ?', a: "Nous acceptons Wave, Orange Money, carte bancaire et virement. Le paiement est sécurisé et visible sur votre tableau de bord." },
  { q: 'Y a-t-il un remboursement si je ne suis pas admis ?', a: "Nous mettons tout en œuvre pour maximiser vos chances. Consultez nos CGU pour les conditions de remboursement détaillées." },
];

export default function Tarifs() {
  return (
    <main className="public-page public-page--pricing">
      <Helmet>
        <title>Nos tarifs — Capadmis</title>
        <meta name="description" content="Découvrez nos tarifs transparents pour l'accompagnement études à l'étranger. À partir de 39 900 FCFA. 3x moins cher qu'une agence classique." />
        <link rel="canonical" href="https://capadmis.com/tarifs" />
      </Helmet>

      {/* Hero */}
      <section className="page-hero page-hero--center public-hero public-hero--pricing">
        <div className="container">
          <span className="page-hero__badge">Tarifs</span>
          <h1 className="page-hero__title">Un accompagnement complet, au meilleur prix</h1>
          <p className="page-hero__desc">
            Commencez pour 39 900 FCFA. L’étape visa n’est payée qu’après votre admission : des tarifs clairs, sans surprise.
          </p>
          <div className="pricing-hero__proof">
            <span><CheckCircle size={16} /> Paiement sécurisé</span>
            <span><CheckCircle size={16} /> Aucun frais caché</span>
            <span><CheckCircle size={16} /> Jusqu’à 3× moins cher</span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="page-section">
        <div className="container--narrow">
          <div className="plans-grid">
            {plans.map(plan => (
              <div key={plan.id} className={`plan-card${plan.id === 'visa' ? ' plan-card--featured' : ''}`}>
                <div>
                  {plan.badge && <span className="plan-card__badge">{plan.badge}</span>}
                  <div className="plan-card__label">{plan.label}</div>
                  <div className="plan-card__price">
                    {plan.price} <span className="plan-card__currency">FCFA</span>
                  </div>
                  <p className="plan-card__subtitle">{plan.subtitle}</p>
                </div>
                <ul className="plan-card__features">
                  {plan.features.map(f => (
                    <li key={f.text} className="plan-card__feature">
                      {f.included
                        ? <CheckCircle size={15} className="plan-card__feature-icon--ok" />
                        : <X size={15} className="plan-card__feature-icon--no" />}
                      <span className={f.included ? 'plan-card__feature-text--ok' : 'plan-card__feature-text--no'}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {plan.note && <p className="plan-card__note">{plan.note}</p>}
                <Link
                  to={plan.ctaPath === '/inscription' ? getStartPath() : plan.ctaPath}
                  className={`plan-card__cta${plan.id === 'visa' ? ' plan-card__cta--featured' : ' plan-card__cta--default'}`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          <div className="notice-box">
            <HelpCircle size={18} className="notice-box__icon" />
            <div>
              <div className="notice-box__title">Frais Campus France (~80 000 FCFA)</div>
              <p className="notice-box__text">Frais officiels payés directement à Campus France, indépendants de notre accompagnement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="page-section--gray">
        <div className="container--tight">
          <div className="section-header">
            <span className="section-label">Comparaison</span>
            <h2 className="section-title">Capadmis vs Agences</h2>
          </div>
          <div className="compare-table">
            <div className="compare-table__head">
              <div className="compare-table__head-cell">Service</div>
              <div className="compare-table__head-cell compare-table__head-cell--cap">Capadmis</div>
              <div className="compare-table__head-cell compare-table__head-cell--age">Agence</div>
            </div>
            {compare.map(row => (
              <div key={row.feature} className="compare-table__row">
                <div className="compare-table__cell">{row.feature}</div>
                <div className="compare-table__cell compare-table__cell--center">
                  {row.capadmis ? <CheckCircle size={18} className="compare-check" /> : <X size={18} className="compare-cross" />}
                </div>
                <div className="compare-table__cell compare-table__cell--center">
                  {row.agence ? <CheckCircle size={18} className="compare-check" /> : <X size={18} className="compare-cross" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="page-section">
        <div className="container--tight">
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Questions fréquentes</h2>
          </div>
          <div className="tarifs-faq">
            {faqs.map(faq => (
              <div key={faq.q} className="tarifs-faq__item">
                <h3 className="tarifs-faq__q">{faq.q}</h3>
                <p className="tarifs-faq__a">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section--dark">
        <div className="container--tight" style={{ textAlign: 'center' }}>
          <h2 className="page-cta__title">Votre avenir commence à 39 900 FCFA</h2>
          <p className="page-cta__desc">Un prix accessible, un suivi complet et une équipe engagée à vos côtés.</p>
          <div className="page-cta__actions">
            <Link to="/inscription" className="btn btn--cta-primary">
              Lancer ma procédure <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
