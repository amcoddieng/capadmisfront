import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import useAdvancedScroll from '../hooks/useAdvancedScroll';

const sections = [
  {
    title: '1. Qui sommes-nous',
    content: (
      <>
        <p>
          CapAdmis accompagne les étudiants dans leurs démarches d'orientation, d'admission universitaire
          et de visa étudiant pour les études en France et à l'étranger.
        </p>
        <p>
          Pour toute question relative à cette politique de confidentialité, vous pouvez nous contacter via{' '}
          <Link to="/contact">capadmis.com/contact</Link>.
        </p>
      </>
    ),
  },
  {
    title: '2. Données que nous collectons',
    content: (
      <>
        <p>Dans le cadre de nos échanges, notamment via WhatsApp, nous pouvons collecter :</p>
        <ul>
          <li>Votre numéro de téléphone WhatsApp</li>
          <li>Votre prénom et, le cas échéant, votre nom</li>
          <li>
            Les informations que vous nous communiquez sur votre situation académique (BAC, filière, année
            d'obtention), votre projet d'études, votre domaine d'intérêt, votre pays de destination souhaité
            et votre niveau d'avancement dans vos démarches
          </li>
          <li>Le contenu de vos échanges avec notre assistante conversationnelle et/ou nos conseillers</li>
          <li>
            Les messages vocaux ou images que vous nous envoyez, le cas échéant transcrits ou analysés à des
            fins de compréhension de votre demande
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Pourquoi nous collectons ces données',
    content: (
      <>
        <p>Ces informations sont utilisées pour :</p>
        <ul>
          <li>Comprendre votre projet d'études et évaluer si un accompagnement CapAdmis peut vous correspondre</li>
          <li>Vous mettre en relation avec un conseiller CapAdmis si votre profil et votre intention le justifient</li>
          <li>Assurer le suivi de nos échanges et améliorer la qualité de notre accompagnement</li>
          <li>Vous recontacter dans le cadre de nos services, y compris pour des relances liées à une conversation en cours</li>
        </ul>
        <p>Nous ne vendons pas vos données personnelles à des tiers.</p>
      </>
    ),
  },
  {
    title: '4. Comment vos données sont stockées',
    content: (
      <p>
        Vos données sont conservées de manière sécurisée sur nos systèmes internes, pour la durée nécessaire
        au traitement de votre demande et au suivi de la relation commerciale, ou conformément aux durées
        imposées par la réglementation applicable.
      </p>
    ),
  },
  {
    title: '5. Partage des données',
    content: (
      <p>
        Vos données peuvent être partagées avec les membres de l'équipe commerciale CapAdmis en charge du
        suivi de votre dossier. Elles peuvent également être traitées par nos prestataires techniques
        (hébergement, messagerie WhatsApp Business via Meta, outils d'intelligence artificielle utilisés pour
        la compréhension et la rédaction des réponses), dans la stricte mesure nécessaire au fonctionnement
        de nos services.
      </p>
    ),
  },
  {
    title: '6. Vos droits',
    content: (
      <p>
        Vous pouvez à tout moment demander l'accès, la rectification ou la suppression des données vous
        concernant, en nous contactant via <Link to="/contact">capadmis.com/contact</Link>. Vous pouvez
        également, à tout moment, mettre fin à nos échanges sur WhatsApp.
      </p>
    ),
  },
  {
    title: '7. Modifications de cette politique',
    content: (
      <p>
        Cette politique de confidentialité peut être mise à jour. La date de dernière mise à jour figure en
        haut de cette page.
      </p>
    ),
  },
];

export default function Confidentialite() {
  useAdvancedScroll();

  return (
    <main>
      <Helmet>
        <title>Politique de confidentialité — CapAdmis</title>
        <meta
          name="description"
          content="Politique de confidentialité de CapAdmis : données collectées, finalités, partage, stockage et vos droits."
        />
        <link rel="canonical" href="https://capadmis.com/confidentialite" />
      </Helmet>

      {/* Hero */}
      <section className="page-hero--gradient page-hero--center">
        <div className="container">
          <span className="page-hero__badge">Légal</span>
          <h1 className="page-hero__title">Politique de confidentialité</h1>
          <p className="page-hero__desc">Dernière mise à jour : 17 août 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="page-section" data-reveal>
        <div className="container--tight legal-content">
          {sections.map((s) => (
            <div key={s.title} className="legal-section" data-reveal>
              <h2 className="legal-section__title">{s.title}</h2>
              <div className="legal-section__body">{s.content}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
