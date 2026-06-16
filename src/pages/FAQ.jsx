import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const faqCategories = [
  {
    category: 'Général',
    items: [
      { q: "Qu'est-ce que Capadmis. ?", a: "Capadmis. est une plateforme digitale d'accompagnement pour les étudiants souhaitant poursuivre leurs études à l'étranger, principalement en France. Nous combinons conseil en orientation, optimisation des candidatures, suivi digital du dossier et préparation au visa." },
      { q: "Dans quels pays Capadmis. accompagne-t-il les étudiants ?", a: "Actuellement, Capadmis. se concentre principalement sur la France. Nous étendrons progressivement nos services à l'Allemagne, l'Autriche, les Pays-Bas et le Canada." },
      { q: "Capadmis. est-il réservé aux étudiants sénégalais ?", a: "Non, Capadmis. est ouvert à tous les étudiants africains souhaitant étudier à l'étranger, quel que soit leur pays d'origine." },
      { q: "Combien de temps dure la procédure ?", a: "La durée varie selon les dossiers, mais comptez en général 3 à 6 mois de la première orientation jusqu'à l'obtention du visa." },
    ],
  },
  {
    category: 'Procédure & Dossier',
    items: [
      { q: "Quels documents dois-je préparer ?", a: "Les documents principaux sont : relevés de notes (seconde, première, terminale), bulletins scolaires, diplôme ou attestation du bac, CV, lettre de motivation, passeport en cours de validité, et une photo. Des documents supplémentaires peuvent être demandés selon la filière." },
      { q: "Que se passe-t-il si ma candidature est refusée ?", a: "En cas de refus, notre équipe analyse les motifs et vous propose des alternatives : autres universités, autres filières ou stratégie pour la prochaine campagne. Nous ne vous abandonnons pas en cas de refus." },
      { q: "Comment fonctionne le suivi de mon dossier ?", a: "Vous avez accès à un tableau de bord personnel disponible 24h/24. Il affiche l'état exact de votre dossier à chaque étape, les documents manquants, les notifications et les messages de votre conseiller." },
      { q: "Puis-je suivre ma procédure depuis mon téléphone ?", a: "Oui, la plateforme Capadmis. est totalement responsive et accessible depuis n'importe quel appareil (téléphone, tablette, ordinateur)." },
    ],
  },
  {
    category: 'Tarifs & Paiement',
    items: [
      { q: "Combien coûte l'accompagnement Capadmis. ?", a: "L'accompagnement est structuré en deux étapes : 39 900 FCFA pour lancer la procédure d'admission, et 49 900 FCFA après obtention de l'admission pour la préparation du visa. Les frais Campus France (~80 000 FCFA) sont payés séparément directement à Campus France." },
      { q: "Comment puis-je payer ?", a: "Nous acceptons Wave, Orange Money, carte bancaire et virement bancaire. Le paiement est sécurisé et son statut est visible dans votre tableau de bord." },
      { q: "Dois-je payer l'étape 2 si je n'obtiens pas d'admission ?", a: "Non. Le paiement de l'étape 2 (49 900 FCFA) n'intervient qu'après l'obtention d'une admission universitaire. Si vous n'obtenez pas d'admission, seule l'étape 1 est facturée." },
      { q: "Y a-t-il des frais cachés ?", a: "Non. Nos tarifs sont 100% transparents. Les seuls frais supplémentaires sont les frais Campus France (officiels, payés directement à Campus France) et éventuellement des services additionnels spécifiques." },
    ],
  },
  {
    category: 'Campus France & Visa',
    items: [
      { q: "Qu'est-ce que Campus France ?", a: "Campus France est l'agence française chargée de la promotion de l'enseignement supérieur français à l'étranger. La majorité des étudiants africains doivent passer par Campus France pour obtenir un visa étudiant pour la France." },
      { q: "Capadmis. m'aide-t-il à préparer l'entretien Campus France ?", a: "Oui, c'est une partie intégrante de notre accompagnement. Nous vous préparons à comprendre et articuler votre projet d'études, à répondre aux questions fréquentes et à éviter les erreurs classiques lors de l'entretien." },
      { q: "Que se passe-t-il si mon visa est refusé ?", a: "En cas de refus de visa, notre équipe analyse les motifs du refus et vous propose des recommandations pour maximiser vos chances lors d'une nouvelle tentative." },
      { q: "Combien de temps faut-il pour obtenir un visa étudiant ?", a: "Généralement, le traitement d'une demande de visa étudiant prend entre 2 et 8 semaines après le dépôt du dossier complet. Capadmis. vous aide à anticiper et à déposer votre dossier dans les meilleurs délais." },
    ],
  },
  {
    category: 'Compte & Plateforme',
    items: [
      { q: "Comment créer mon compte ?", a: "Cliquez sur 'Commencer ma procédure' ou 'Inscription' sur n'importe quelle page. Remplissez le formulaire avec vos informations personnelles et académiques. Votre compte est créé instantanément." },
      { q: "Mes données personnelles sont-elles sécurisées ?", a: "Oui. Toutes vos données et documents sont stockés de manière sécurisée. Nous utilisons un chiffrement SSL et des accès limités selon les rôles. Vos documents ne sont consultables que par vous et votre conseiller assigné." },
      { q: "Puis-je communiquer directement avec mon conseiller ?", a: "Oui, via la messagerie intégrée à votre tableau de bord. Vous recevez également des notifications par email à chaque étape importante de votre procédure." },
    ],
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-item__btn" onClick={() => setOpen(!open)}>
        <span className="faq-item__question">{item.q}</span>
        {open
          ? <ChevronUp size={16} className="faq-item__icon faq-item__icon--open" />
          : <ChevronDown size={16} className="faq-item__icon faq-item__icon--closed" />}
      </button>
      {open && <div className="faq-item__answer">{item.a}</div>}
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('Général');

  return (
    <main>
      {/* Hero */}
      <section className="page-hero--gradient page-hero--center">
        <div className="container">
          <span className="page-hero__badge">FAQ</span>
          <h1 className="page-hero__title">Questions fréquentes</h1>
          <p className="page-hero__desc">
            Tout ce que vous devez savoir sur Capadmis., la procédure d'admission et le visa étudiant.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="page-section--gray">
        <div className="container--tight">
          <div className="faq-tabs">
            {faqCategories.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`faq-tab${activeCategory === cat.category ? ' faq-tab--active' : ''}`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {faqCategories
            .filter(cat => cat.category === activeCategory)
            .map(cat => (
              <div key={cat.category}>
                <h2 className="faq-category-title">{cat.category}</h2>
                <div className="faq-list">
                  {cat.items.map(item => <FAQItem key={item.q} item={item} />)}
                </div>
              </div>
            ))}

          <div className="faq-contact-box">
            <h3 className="faq-contact-box__title">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="faq-contact-box__desc">Contactez-nous directement, notre équipe vous répond rapidement.</p>
            <Link to="/contact" className="btn btn--primary-sm">
              Nous contacter <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
