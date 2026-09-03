# Integration du Blog dans eazy-visa.com (capadmisfront)

> Rapport technique — juin 2025

---

## Resume

Le blog a ete integre dans `capadmisfront`. Il consomme la **meme API** que le blog FBA (`block-api` sur MongoDB), filtree par `project=capadmis`. Aucune modification backend n'est necessaire si le filtre `project` est deja gere cote API. Sinon, voir la section "Prerequis backend".

---

## Architecture

```
capadmisfront/
  src/
    api/
      blog.js              <-- Service API (fetch articles)
    pages/
      Blog.jsx             <-- Page liste /blog
      BlogArticle.jsx      <-- Page article /blog/:slug
    components/
      Navbar.jsx           <-- Lien Blog (actuellement commente)
      Footer.jsx           <-- Lien Blog (actif)
    App.jsx                <-- Routes /blog et /blog/:slug
    index.css              <-- Styles blog (~260 lignes en fin de fichier)
```

---

## Fichiers crees / modifies

### 1. `src/api/blog.js` (NOUVEAU)

Service API qui appelle le backend FBA `block-api`.

**URL de base :**
```js
const BLOG_API = import.meta.env.VITE_BLOG_API_URL
  ?? 'https://apiblog.francis-burton-academy.com/api';
```

**Fonctions exportees :**

| Fonction | Endpoint | Description |
|---|---|---|
| `fetchPublished()` | `GET /blocks?status=published&project=capadmis` | Tous les articles publies pour capadmis |
| `fetchBySlug(slug)` | `GET /blocks/slug/:slug` | Un article par son slug |
| `fetchFeatured()` | `GET /blocks?status=published&featured=true` | L'article vedette |

**Transformation `toPost(block)` :**
- `block.cover.url` → `post.image`
- `block.readTime` (nombre) → `"5 min"` (string)
- `block.publishedAt` ou `block.createdAt` → `post.dateLabel` (ex: "16 juin 2025")
- `block.content[]` → tableau de blocs structures (pas du HTML)

---

### 2. `src/pages/Blog.jsx` (NOUVEAU)

Page liste des articles sur `/blog`.

**Fonctionnement :**
- Appelle `fetchPublished()` au montage
- Affiche un spinner pendant le chargement
- Affiche un message d'erreur si l'API echoue
- Affiche "Aucun article" si la liste est vide
- Sinon affiche une grille responsive de cartes cliquables

**SEO :**
```jsx
<Helmet>
  <title>Blog — CapAdmis</title>
  <meta name="description" content="..." />
  <link rel="canonical" href="https://capadmis.com/blog" />
</Helmet>
```

**Classes CSS utilisees :**
- `public-page`, `public-page--blog` — wrapper principal
- `page-hero`, `public-hero` — hero section
- `page-section--gray` — fond gris pour la liste
- `blog-grid` — grille responsive 2 colonnes
- `blog-card`, `blog-card__media`, `blog-card__body`, etc.

---

### 3. `src/pages/BlogArticle.jsx` (NOUVEAU)

Page detail d'un article sur `/blog/:slug`.

**Fonctionnement :**
- Recupere le `slug` via `useParams()`
- Appelle `fetchBySlug(slug)` au montage et a chaque changement de slug
- Affiche les blocs de contenu avec un `switch` sur `block.type`

**Types de blocs supportes :**

| Type | Rendu |
|---|---|
| `h2` | `<h2>` |
| `p` | `<p>` |
| `ul` | `<ul>` avec `<li>` |
| `ol` | `<ol>` avec `<li>` |
| `faq` | `<div>` avec question `<h3>` + reponse `<p>` |
| `signature` | `<p>` en italique accent |
| `img` | `<figure>` avec `<img>` |
| `sources` | `<div>` avec liens `<a>` |

**SEO complet :**
- `<title>`, `<meta description>`, `<link canonical>`
- Open Graph : `og:type`, `og:title`, `og:description`, `og:image`, `og:url`
- Twitter Card : `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Fallback : `seo.og.*` → `seo.*` → `post.title / post.excerpt / post.image`

**CTA en bas d'article :**
- Lien vers `/contact` avec le bouton "Nous contacter"

---

### 4. `src/App.jsx` (MODIFIE)

Ajout des imports et routes :

```jsx
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';

// Dans <Routes> :
<Route path="/blog" element={<Layout><Blog /></Layout>} />
<Route path="/blog/:slug" element={<Layout><BlogArticle /></Layout>} />
```

Les deux pages sont wrappees dans `<Layout>` donc elles beneficient automatiquement de la **Navbar** et du **Footer**.

---

### 5. `src/components/Navbar.jsx` (MODIFIE)

- Import `BookOpen` ajoute depuis `lucide-react`
- Lien Blog ajoute mais **actuellement commente** (ligne 18) :
```js
// { label: 'Blog', path: '/blog', icon: BookOpen },
```

**Pour activer le lien dans la navbar :** decommenter cette ligne.

---

### 6. `src/components/Footer.jsx` (MODIFIE)

- Lien Blog **actif** dans la section Navigation :
```js
{ label: 'Blog', path: '/blog' },
```

---

### 7. `src/index.css` (MODIFIE)

~260 lignes de CSS ajoutees a la fin du fichier, apres le bloc `LEGAL PAGES`.

**Sections CSS ajoutees :**

| Section | Classes | Description |
|---|---|---|
| Loading | `.blog-loading`, `.blog-loading__spinner` | Spinner de chargement |
| Messages | `.blog-message`, `.blog-message--error` | Etats vide/erreur |
| Grille | `.blog-grid` | Grille responsive `auto-fill, minmax(340px, 1fr)` |
| Carte | `.blog-card`, `__media`, `__body`, `__meta`, `__tag`, `__date`, `__title`, `__excerpt`, `__read` | Carte article avec hover lift |
| Article | `.article-back`, `.article-hero-meta` | Navigation retour + meta hero |
| Couverture | `.article-cover` | Image de couverture arrondie |
| Contenu | `.article-content`, `h2`, `p`, `ul`, `ol`, `li` | Typographie de l'article |
| FAQ | `.article-faq` | Bloc question/reponse |
| Signature | `.article-signature` | Citation en accent italic |
| Image | `.article-image` | Figure inline dans l'article |
| Sources | `.article-sources` | Section de liens sources |
| CTA | `.article-cta` | Appel a l'action en bas d'article |
| Responsive | `@media (max-width: 768px)` | Adaptations mobile |

Les styles utilisent les variables CSS existantes (`--primary`, `--accent`, `--slate-*`, `--white`, etc.).

---

## Prerequis backend

Le blog consomme l'API FBA `block-api` a l'adresse :
```
https://apiblog.francis-burton-academy.com/api
```

### Filtre par projet

La requete de liste envoie `?project=capadmis` :
```
GET /blocks?status=published&project=capadmis
```

**Si le backend ne gere pas encore le parametre `project`**, il faut ajouter le filtre dans `block-api/src/routes/blocks.ts` :

```ts
// Dans le GET /blocks
const filter: any = {};
if (req.query.status)   filter.status = req.query.status;
if (req.query.featured) filter.featured = req.query.featured === 'true';
if (req.query.project)  filter.project = req.query.project;  // <-- AJOUTER
```

Et ajouter le champ `project` dans le schema Mongoose (`Block.ts`) :
```ts
project: { type: String, default: null },
```

Puis dans l'admin FBA, taguer les articles avec `project: 'capadmis'` ou `project: 'fba'`.

> **Si on ne veut pas filtrer par projet**, retirer `&project=capadmis` de la ligne 32 de `src/api/blog.js`.

---

## Variable d'environnement

| Variable | Defaut | Description |
|---|---|---|
| `VITE_BLOG_API_URL` | `https://apiblog.francis-burton-academy.com/api` | URL de l'API blog |

Ajouter dans `.env` ou `.env.production` si besoin de changer l'URL :
```env
VITE_BLOG_API_URL=https://apiblog.francis-burton-academy.com/api
```

---

## Deploiement

### 1. Verifier le backend
S'assurer que l'API `block-api` est accessible et que des articles publies existent.

### 2. Build le front
```bash
cd capadmisfront
npm run build
```

### 3. Deployer sur le VPS
Rebuild le container Docker :
```bash
docker compose up -d --build front
```

### 4. Nginx (si applicable)
Ajouter une regle de rewrite pour le SPA si pas deja fait :
```nginx
location /blog {
  try_files $uri /index.html;
}
```

### 5. Activer le lien Navbar (quand pret)
Decommenter la ligne 18 dans `src/components/Navbar.jsx` :
```js
{ label: 'Blog', path: '/blog', icon: BookOpen },
```

---

## Tester en local

```bash
cd capadmisfront
npm run dev
```

Puis ouvrir :
- `http://localhost:5173/blog` — liste des articles
- `http://localhost:5173/blog/<slug>` — un article

> Note : l'API est appelee directement sur le domaine FBA (pas via le proxy Vite), donc il faut une connexion internet.

---

## Resume des dependances

Aucune nouvelle dependance npm ajoutee. Le blog utilise :
- `react-router-dom` (deja installe)
- `react-helmet-async` (deja installe)
- `lucide-react` (deja installe) — icones `Clock`, `ArrowRight`, `ArrowLeft`, `Calendar`, `BookOpen`
- `fetch` natif (pas d'axios)

---

## Arborescence des modifications

```
M  src/App.jsx                    (+4 lignes)
M  src/components/Navbar.jsx      (+1 import, +1 lien commente)
M  src/components/Footer.jsx      (+1 lien)
M  src/index.css                  (+260 lignes CSS)
A  src/api/blog.js                (51 lignes)
A  src/pages/Blog.jsx             (94 lignes)
A  src/pages/BlogArticle.jsx      (177 lignes)
A  BLOG_INTEGRATION.md            (ce fichier)
```
