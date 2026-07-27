import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowRight, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="public-page">
      <Helmet>
        <title>Page introuvable — Capadmis</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="notfound">
        <div className="notfound__content">
          <div className="notfound__code">404</div>
          <h1 className="notfound__title">Cette page n'existe pas</h1>
          <p className="notfound__desc">
            La page que vous recherchez a peut-être été déplacée, supprimée, ou n'a jamais existé.
          </p>
          <div className="notfound__actions">
            <Link to="/" className="btn btn--hero-primary">
              <Home size={18} /> Retour à l'accueil
            </Link>
            <Link to="/contact" className="btn btn--hero-secondary">
              <Search size={16} /> Nous contacter
            </Link>
          </div>
          <div className="notfound__links">
            <Link to="/procedure">Procédure</Link>
            <span>·</span>
            <Link to="/tarifs">Tarifs</Link>
            <span>·</span>
            <Link to="/a-propos">À propos</Link>
            <span>·</span>
            <Link to="/pourquoi">Pourquoi Capadmis</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
