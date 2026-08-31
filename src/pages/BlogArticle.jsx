import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { fetchBySlug } from '../api/blog';

const SITE_URL = 'https://capadmis.com';

function renderBlock(block, index) {
  switch (block.type) {
    case 'h2':
      return <h2 key={index}>{block.text ?? ''}</h2>;
    case 'p':
      return <p key={index}>{block.text ?? ''}</p>;
    case 'ul':
      return (
        <ul key={index}>
          {(block.items ?? []).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'ol':
      return (
        <ol key={index}>
          {(block.items ?? []).map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      );
    case 'faq':
      return (
        <div className="article-faq" key={index}>
          <h3>{block.question ?? ''}</h3>
          <p>{block.answer ?? ''}</p>
        </div>
      );
    case 'signature':
      return <p className="article-signature" key={index}>{block.text ?? ''}</p>;
    case 'img':
      return (
        <figure className="article-image" key={index}>
          <img src={block.url ?? ''} alt={block.alt ?? ''} loading="lazy" />
        </figure>
      );
    case 'sources':
      return (
        <div className="article-sources" key={index}>
          <h3>{block.title ?? 'Sources'}</h3>
          <ul>
            {(block.links ?? []).map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError('');
    fetchBySlug(slug)
      .then((p) => {
        if (!p) setError('Article introuvable.');
        setPost(p);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  /* --- Loading --- */
  if (loading) {
    return (
      <main className="public-page public-page--blog-article">
        <section className="page-hero public-hero">
          <div className="container">
            <div className="blog-loading">
              <div className="blog-loading__spinner" />
              <p>Chargement…</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* --- Erreur / introuvable --- */
  if (error || !post) {
    return (
      <main className="public-page public-page--blog-article">
        <section className="page-hero public-hero">
          <div className="container">
            <Link to="/blog" className="article-back">
              <ArrowLeft size={16} /> Tous les articles
            </Link>
            <h1 className="page-hero__title" style={{ marginTop: '1.5rem' }}>{error || 'Article introuvable'}</h1>
          </div>
        </section>
      </main>
    );
  }

  /* --- SEO --- */
  const seo = post.seo;
  const metaTitle = seo?.metaTitle || `${post.title} — CapAdmis`;
  const metaDescription = seo?.metaDescription || post.excerpt;
  const ogTitle = seo?.og?.title || metaTitle;
  const ogDescription = seo?.og?.description || metaDescription;
  const ogImage = seo?.og?.image || post.image;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;

  return (
    <main className="public-page public-page--blog-article">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {seo?.keywords?.length ? <meta name="keywords" content={seo.keywords.join(', ')} /> : null}
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Hero */}
      <section className="page-hero public-hero public-hero--article">
        <div className="container">
          <Link to="/blog" className="article-back">
            <ArrowLeft size={16} /> Tous les articles
          </Link>
          <div className="article-hero-meta">
            {post.category && <span className="blog-card__tag">{post.category}</span>}
            <span><Calendar size={13} /> {post.dateLabel}</span>
            <span><Clock size={13} /> {post.readTime} de lecture</span>
          </div>
          <h1 className="page-hero__title">{post.title}</h1>
        </div>
      </section>

      {/* Corps de l'article */}
      <section className="page-section">
        <div className="container--narrow">
          {post.image && (
            <div className="article-cover">
              <img src={post.image} alt={post.imageAlt} />
            </div>
          )}

          <div className="article-content">
            {post.content.map((block, i) => renderBlock(block, i))}
          </div>

          {/* CTA */}
          <div className="article-cta">
            <p>Une question sur votre projet d'etudes ? Notre equipe vous accompagne.</p>
            <Link to="/contact" className="btn btn--hero-primary">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
