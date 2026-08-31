import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRight } from 'lucide-react';
import { fetchPublished } from '../api/blog';
import useAdvancedScroll from '../hooks/useAdvancedScroll';

export default function Blog() {
  useAdvancedScroll();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublished()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="public-page public-page--blog">
      <Helmet>
        <title>Blog — CapAdmis</title>
        <meta name="description" content="Conseils, actualites et ressources pour reussir votre projet d'etudes en France. Articles rediges par l'equipe CapAdmis." />
        <link rel="canonical" href="https://capadmis.com/blog" />
      </Helmet>

      {/* Hero */}
      <section className="page-hero public-hero public-hero--blog">
        <div className="container">
          <div style={{ maxWidth: '48rem' }}>
            <span className="page-hero__badge">Blog</span>
            <h1 className="page-hero__title">Nos articles et conseils</h1>
            <p className="page-hero__desc">
              Orientation, Campus France, visa, universites : retrouvez tous nos articles pour preparer sereinement votre projet d'etudes.
            </p>
          </div>
        </div>
      </section>

      {/* Liste des articles */}
      <section className="page-section page-section--gray">
        <div className="container">
          {loading && (
            <div className="blog-loading">
              <div className="blog-loading__spinner" />
              <p>Chargement des articles…</p>
            </div>
          )}

          {error && (
            <div className="blog-message blog-message--error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="blog-message">
              <p>Aucun article pour le moment. Revenez bientot !</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="blog-grid">
              {posts.map((post) => (
                <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
                  {post.image && (
                    <div className="blog-card__media">
                      <img src={post.image} alt={post.imageAlt} loading="lazy" />
                    </div>
                  )}
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      {post.category && <span className="blog-card__tag">{post.category}</span>}
                      <span className="blog-card__date">{post.dateLabel}</span>
                    </div>
                    <h3 className="blog-card__title">{post.title}</h3>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <span className="blog-card__read">
                      <Clock size={13} />
                      {post.readTime} de lecture
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
