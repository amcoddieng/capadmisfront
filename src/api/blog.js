/* ── Blog API — consomme l'API FBA block-api ── */

const BLOG_API = import.meta.env.VITE_BLOG_API_URL ?? 'https://apiblog.francis-burton-academy.com/api';

/* ── Interfaces simplifiées (commentaires JSDoc) ──
  ApiPost = {
    slug, title, excerpt, category,
    image, imageAlt, readTime, date, dateLabel,
    content: ApiContentBlock[], seo?
  }
  ApiContentBlock = { type, text?, items?, question?, answer?, title?, url?, alt?, links? }
*/

function toPost(block) {
  const published = block.publishedAt ? new Date(block.publishedAt) : new Date(block.createdAt);
  return {
    slug:     block.slug,
    title:    block.title,
    excerpt:  block.excerpt,
    category: block.category ?? null,
    image:    block.cover?.url ?? '',
    imageAlt: block.cover?.alt ?? '',
    readTime: `${block.readTime} min`,
    date:     published.toISOString().split('T')[0],
    dateLabel: published.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    content:  block.content ?? [],
    seo:      block.seo ?? null,
  };
}

export async function fetchPublished() {
  const res = await fetch(`${BLOG_API}/blocks?status=published&project=capadmis`);
  if (!res.ok) throw new Error('Impossible de charger les articles');
  const blocks = await res.json();
  return blocks.map(toPost);
}

export async function fetchBySlug(slug) {
  const res = await fetch(`${BLOG_API}/blocks/slug/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Impossible de charger l\'article');
  const block = await res.json();
  return toPost(block);
}

export async function fetchFeatured() {
  const res = await fetch(`${BLOG_API}/blocks?status=published&featured=true`);
  if (!res.ok) throw new Error('Impossible de charger l\'article vedette');
  const blocks = await res.json();
  return blocks[0] ? toPost(blocks[0]) : null;
}
