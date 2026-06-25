import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle, FileText, Users, BookOpen, Trophy, Plane, Stamp, Star } from 'lucide-react';
import { getStartPath } from '../api/auth';

const steps = [
  {
    number: '01',
    icon: <Users className="w-7 h-7 text-white" />,
    title: 'Conseil & orientation',
    color: 'bg-blue-600',
    duration: 'Semaine 1',
    description: "Première étape clé : nous analysons votre profil académique pour vous orienter vers les meilleures options.",
    items: [
      'Choix de la filière adaptée à votre profil',
      'Sélection des universités les plus accessibles',
      'Choix des villes selon vos préférences',
      'Cohérence du projet d\'études',
      'Estimation des chances d\'admission selon vos notes',
    ],
  },
  {
    number: '02',
    icon: <FileText className="w-7 h-7 text-white" />,
    title: 'Constitution du dossier',
    color: 'bg-indigo-600',
    duration: 'Semaines 2-3',
    description: 'Vous préparez et téléchargez tous vos documents académiques sur votre espace sécurisé.',
    items: [
      'Relevés de notes (seconde, première, terminale)',
      'Bulletins scolaires',
      'Diplôme ou attestation du baccalauréat',
      'CV mis à jour',
      'Lettre de motivation',
      'Passeport valide',
      'Autres documents requis',
    ],
  },
  {
    number: '03',
    icon: <BookOpen className="w-7 h-7 text-white" />,
    title: 'Dépôt des candidatures',
    color: 'bg-violet-600',
    duration: 'Semaines 3-5',
    description: "L'équipe Capadmis. prépare et soumet vos demandes d'admission auprès des universités ciblées.",
    items: [
      'Universités ciblées sélectionnées',
      'Filières ciblées validées',
      'Suivi du statut de chaque candidature',
      'Documents manquants identifiés',
      'Dates importantes communiquées',
    ],
  },
  {
    number: '04',
    icon: <Users className="w-7 h-7 text-white" />,
    title: 'Préparation entretien Campus France',
    color: 'bg-purple-600',
    duration: 'Semaines 5-7',
    description: "Après les candidatures, nous vous accompagnons pour préparer votre entretien Campus France.",
    items: [
      'Compréhension et articulation du projet d\'études',
      'Préparation des réponses aux questions fréquentes',
      'Explication de la cohérence du parcours',
      'Éviter les erreurs fréquentes',
      'Simulation d\'entretien',
    ],
  },
  {
    number: '05',
    icon: <Trophy className="w-7 h-7 text-white" />,
    title: 'Suivi des admissions',
    color: 'bg-amber-500',
    duration: 'Semaines 7-12',
    description: 'Votre tableau de bord affiche en temps réel les réponses des universités.',
    items: [
      'Admission obtenue : félicitations !',
      'Admission refusée : motif et alternatives',
      'Universités en attente',
      'Prochaines étapes recommandées',
      'Notifications automatiques à chaque réponse',
    ],
  },
  {
    number: '06',
    icon: <Plane className="w-7 h-7 text-white" />,
    title: 'Préparation du dossier visa',
    color: 'bg-teal-600',
    duration: 'Après admission',
    description: 'Une fois l\'admission obtenue, nous vous aidons à constituer votre dossier visa.',
    items: [
      'Constitution du dossier visa complet',
      'Prise en charge et hébergement',
      'Justificatifs financiers',
      'Préparation à l\'entretien visa',
      'Vérification finale du dossier',
    ],
  },
  {
    number: '07',
    icon: <Stamp className="w-7 h-7 text-white" />,
    title: 'Dépôt de la demande de visa',
    color: 'bg-cyan-600',
    duration: 'J-30 avant départ',
    description: 'Nous suivons votre rendez-vous visa et vous préparons à chaque détail.',
    items: [
      'Date du rendez-vous visa',
      'Documents à apporter le jour J',
      'Statut de la demande en temps réel',
      'Notification avant le rendez-vous',
    ],
  },
  {
    number: '08',
    icon: <Star className="w-7 h-7 text-white" />,
    title: 'Résultat du visa',
    color: 'bg-green-600',
    duration: 'Résultat final',
    description: 'Le résultat final de votre visa est affiché sur votre tableau de bord.',
    items: [
      'Visa obtenu : bon voyage !',
      'Visa refusé : motif et recommandations',
      'Stratégie en cas de refus',
      'Accompagnement pour la prochaine tentative',
    ],
  },
];

export default function Procedure() {
  return (
    <main>
      <Helmet>
        <title>Procédure Campus France — Capadmis</title>
        <meta name="description" content="Découvrez les 8 étapes clés pour réussir votre admission et obtenir votre visa étudiant. Capadmis vous accompagne de l'orientation au départ." />
        <link rel="canonical" href="https://capadmis.com/procedure" />
      </Helmet>

      {/* Hero */}
      <section className="page-hero--gradient">
        <div className="container">
          <div style={{ maxWidth: '48rem' }}>
            <span className="page-hero__badge">Procédure Campus France</span>
            <h1 className="page-hero__title">8 étapes pour réussir votre admission</h1>
            <p className="page-hero__desc">
              De l'orientation jusqu'au visa, Capadmis. vous accompagne à chaque étape avec un suivi digital transparent et des experts dédiés.
            </p>
            <div className="page-hero__actions">
              <Link to="/inscription" className="btn btn--hero-primary">
                Commencer ma procédure <ArrowRight size={18} />
              </Link>
              <Link to="/analyse" className="btn btn--hero-secondary">
                Analyser mes chances
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="page-section">
        <div className="container--narrow">
          <div className="section-header">
            <span className="section-label">Les étapes</span>
            <h2 className="section-title">La procédure en détail</h2>
            <p style={{ color: 'var(--slate-500)', maxWidth: '36rem', margin: '.5rem auto 0' }}>
              Chaque étape est suivie par notre équipe et visible dans votre tableau de bord personnel.
            </p>
          </div>
          <div className="timeline">
            {steps.map((step, idx) => (
              <div key={step.number} className="timeline__item">
                <div className="timeline__connector">
                  <div className={`timeline__icon ${step.color}`}>{step.icon}</div>
                  {idx < steps.length - 1 && <div className="timeline__line" />}
                </div>
                <div className="timeline__content">
                  <div className="timeline__header">
                    <div className="timeline__num-title">
                      <span className="timeline__num">{step.number}</span>
                      <h3 className="timeline__title">{step.title}</h3>
                    </div>
                    <span className="timeline__duration">{step.duration}</span>
                  </div>
                  <p className="timeline__desc">{step.description}</p>
                  <div className="timeline__items-grid">
                    {step.items.map(item => (
                      <div key={item} className="timeline__list-item">
                        <CheckCircle size={15} className="timeline__list-icon" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section--blue">
        <div className="container--tight">
          <h2 className="page-cta__title">Prêt à démarrer votre procédure ?</h2>
          <p className="page-cta__desc">Rejoignez des centaines d'étudiants qui ont réussi leurs études à l'étranger grâce à Capadmis.</p>
          <div className="page-cta__actions">
            <Link to={getStartPath()} className="btn btn--cta-white">
              Commencer maintenant <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
