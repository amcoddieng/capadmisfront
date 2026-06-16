import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Aminata D.', city: 'Dakar', flag: '🇸🇳', school: 'Université Lyon 2', filiere: 'Sciences du langage', text: "Grâce à Capadmis., j'ai obtenu mon admission à Lyon 2. Le suivi était parfait et les conseils très précis. Je savais exactement où en était mon dossier à chaque moment.", stars: 5, visa: true },
  { name: 'Moussa K.', city: 'Conakry', flag: '🇬🇳', school: 'Université de Bordeaux', filiere: 'Droit', text: "Je ne savais pas quelle filière choisir. L'analyse a tout changé : on m'a recommandé la bonne université selon mes notes. Visa obtenu après deux semaines d'attente seulement !", stars: 5, visa: true },
  { name: 'Fatou S.', city: 'Dakar', flag: '🇸🇳', school: 'Université Paris Saclay', filiere: 'Informatique', text: "Le tableau de bord m'a permis de voir en temps réel où en était mon dossier. Plus besoin d'appeler pour avoir des nouvelles. Je recommande Capadmis. à tous.", stars: 5, visa: true },
  { name: 'Ibrahima F.', city: 'Dakar', flag: '🇸🇳', school: 'Université de Toulouse', filiere: 'Gestion', text: "Avant Capadmis., j'avais contacté deux agences classiques. Je ne savais jamais où en était mon dossier. Avec Capadmis., j'ai tout suivi en temps réel.", stars: 5, visa: true },
  { name: 'Mariam T.', city: 'Bamako', flag: '🇲🇱', school: 'Université de Nantes', filiere: 'Sciences économiques', text: "L'équipe est très réactive. À chaque notification, j'avais une explication claire. J'ai eu mon admission en 6 semaines seulement. Merci Capadmis. !", stars: 5, visa: false },
  { name: 'Ousmane B.', city: 'Thiès', flag: '🇸🇳', school: 'IUT de Grenoble', filiere: 'Génie civil', text: "Le prix est imbattable par rapport aux agences. Pour 39 900 FCFA, j'ai eu un accompagnement de qualité professionnelle. Les conseillers connaissent vraiment le sujet.", stars: 5, visa: true },
  { name: 'Aïssatou C.', city: 'Abidjan', flag: '🇨🇮', school: 'Université de Rennes', filiere: 'Psychologie', text: "J'étais perdue entre plusieurs filières. L'analyse de Capadmis. m'a aidée à y voir clair. Mon projet est maintenant solide et cohérent.", stars: 5, visa: false },
  { name: 'Seydou N.', city: 'Dakar', flag: '🇸🇳', school: 'Université de Montpellier', filiere: 'Médecine (PASS)', text: "Procédure complexe pour la médecine, mais l'équipe Capadmis. m'a guidé à chaque étape. Très professionnel.", stars: 5, visa: true },
  { name: 'Rokhaya M.', city: 'Saint-Louis', flag: '🇸🇳', school: 'Université d\'Orléans', filiere: 'LEA', text: "Simple, rapide et efficace. J'ai tout fait depuis mon téléphone. Les documents uploadés en quelques minutes. Visa obtenu !", stars: 5, visa: true },
];

const stats = [
  { value: '500+', label: 'Étudiants accompagnés' },
  { value: '95%', label: 'Taux de satisfaction' },
  { value: '87%', label: 'Taux d\'admission' },
  { value: '80%', label: 'Taux de visa obtenu' },
];

export default function Temoignages() {
  return (
    <main>
      {/* Hero */}
      <section className="page-hero--gradient page-hero--center">
        <div className="container">
          <span className="page-hero__badge">Témoignages</span>
          <h1 className="page-hero__title">Ils ont réussi avec Capadmis.</h1>
          <p className="page-hero__desc">
            Des centaines d'étudiants ont fait confiance à Capadmis. pour leur procédure d'études à l'étranger. Voici leurs histoires.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="temoignages-stats">
        <div className="container--tight">
          <div className="temoignages-stats__grid">
            {stats.map(s => (
              <div key={s.label}>
                <div className="temoignages-stats__value">{s.value}</div>
                <div className="temoignages-stats__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials masonry */}
      <section className="page-section--gray">
        <div className="container">
          <div className="temoignages-masonry">
            {testimonials.map((t, i) => (
              <div key={i} className="temoignage-card">
                <div className="temoignage-card__quote-icon"><Quote size={32} /></div>
                <div className="temoignage-card__stars">
                  {Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={15} fill="currentColor" />)}
                </div>
                <p className="temoignage-card__text">"{t.text}"</p>
                <div className="temoignage-card__author">
                  <div className="temoignage-card__flag">{t.flag}</div>
                  <div>
                    <div className="temoignage-card__name">{t.name}</div>
                    <div className="temoignage-card__school">{t.city} · {t.school}</div>
                    <div className="temoignage-card__filiere">{t.filiere}</div>
                  </div>
                  {t.visa && <span className="temoignage-card__visa">Visa ✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section--blue">
        <div className="container--tight">
          <h2 className="page-cta__title">Votre success story commence ici</h2>
          <p className="page-cta__desc">Rejoignez des centaines d'étudiants qui ont réalisé leur rêve d'études à l'étranger.</p>
          <div className="page-cta__actions">
            <Link to="/inscription" className="btn btn--cta-white">
              Commencer ma procédure <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
