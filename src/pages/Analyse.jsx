import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BarChart3, CheckCircle, AlertTriangle, TrendingUp, Star, Info } from 'lucide-react';
import { getStartPath } from '../api/auth';
import useAdvancedScroll from '../hooks/useAdvancedScroll';

const filieres = [
  'Droit', 'Sciences économiques', 'Gestion / Management', 'Informatique / Numérique',
  'Génie civil / BTP', 'Médecine / Santé', 'Sciences de l\'éducation', 'Langues & LEA',
  'Communication / Journalisme', 'Sciences politiques', 'Psychologie', 'Autre',
];

const pays = ['France','Allemagne'];

const niveaux = ['Terminale (en cours)', 'Baccalauréat obtenu', 'Bac+1', 'Bac+2', 'Bac+3 et plus'];

const langues = ['Débutant', 'Intermédiaire (B1)', 'Avancé (B2)', 'Courant (C1/C2)'];

function ScoreCard({ score, label, color }) {
  const colors = {
    green: 'bg-green-100 border-green-300 text-green-800',
    amber: 'bg-amber-100 border-amber-300 text-amber-800',
    orange: 'bg-orange-100 border-orange-300 text-orange-800',
    red: 'bg-red-100 border-red-300 text-red-800',
  };
  return (
    <div className={`rounded-2xl border-2 px-6 py-4 text-center font-bold text-lg ${colors[color]}`}>
      {label}
    </div>
  );
}

function getScoreInfo(moyenne, filiere, niveau) {
  if (moyenne >= 16) return { label: 'Admission très probable', color: 'green', score: 92 };
  if (moyenne >= 13) return { label: 'Admission possible', color: 'amber', score: 68 };
  if (moyenne >= 10) return { label: 'Admission risquée', color: 'orange', score: 42 };
  return { label: 'Admission très faible', color: 'red', score: 22 };
}

export default function Analyse() {
  useAdvancedScroll();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '',
    niveau: '', pays: '', filiere: '',
    moyenneG: '', moyenneMaths: '', moyenneFrancais: '',
    langue: '', budget: '',
  });
  const [result, setResult] = useState(null);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleAnalyse = (e) => {
    e.preventDefault();
    const moyenne = parseFloat(form.moyenneG) || 10;
    const info = getScoreInfo(moyenne, form.filiere, form.niveau);

    const recs = moyenne >= 14
      ? ['Université Paris 1 Panthéon-Sorbonne', 'Université de Lyon 2', 'Université de Bordeaux', 'Université de Nantes']
      : moyenne >= 11
      ? ['Université de Rouen', 'Université de Caen', 'Université d\'Angers', 'Université de Limoges']
      : ['Université de Pau', 'Université de La Rochelle', 'Université de Perpignan', 'IUT locaux'];

    setResult({
      ...info,
      moyenne,
      recs,
      strengths: moyenne >= 13 ? ['Bon niveau académique général', 'Projet cohérent avec la filière choisie'] : ['Motivation et projet d\'études clair'],
      weaknesses: moyenne < 13 ? ['Moyenne générale à renforcer', 'Lettre de motivation à travailler'] : ['Niveau de langue à certifier'],
      villes: moyenne >= 14 ? ['Paris', 'Lyon', 'Bordeaux'] : ['Rouen', 'Caen', 'Angers', 'Limoges'],
    });
    setStep(3);
  };

  return (
    <main>
      <Helmet>
        <title>Analyse gratuite — CapAdmis</title>
        <meta name="description" content="Analysez gratuitement vos chances d'admission en France. Évaluez votre profil académique et recevez des recommandations personnalisées d'universités." />
        <link rel="canonical" href="https://capadmis.com/analyse" />
      </Helmet>

      {/* Hero */}
      <section className="page-hero--gradient page-hero--center">
        <div className="container">
          <span className="page-hero__badge">Analyse gratuite</span>
          <h1 className="page-hero__title">Analysez vos chances d'admission</h1>
          <p className="page-hero__desc">
            En quelques minutes, obtenez une première estimation de vos chances d'admission et des recommandations personnalisées.
          </p>
        </div>
      </section>

      {/* Stepper + forms */}
      <section className="page-section--gray" data-reveal>
        <div className="container--tight" style={{ maxWidth: '40rem', margin: '0 auto', padding: '0 1rem' }}>
          {/* Progress */}
          <div className="stepper" data-reveal data-reveal-delay="100">
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div className={`stepper__step stepper__step--${step > s ? 'done' : step === s ? 'active' : 'pending'}`}>
                  {step > s ? <CheckCircle size={15} /> : s}
                </div>
                {s < 3 && <div className={`stepper__line stepper__line--${step > s ? 'done' : 'pending'}`} />}
              </div>
            ))}
          </div>
          <div className="stepper__labels"><span>Profil</span><span>Notes</span><span>Résultat</span></div>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="analyse-form">
              <h2 className="analyse-form__title">Votre profil</h2>
              <div className="analyse-form__body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <input required className="form-input" value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Ex: Aminata" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input required className="form-input" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Ex: Diallo" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input required type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="votre@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Niveau d'études actuel</label>
                  <select required className="form-select" value={form.niveau} onChange={e => set('niveau', e.target.value)}>
                    <option value="">Sélectionner</option>
                    {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pays d'étude souhaité</label>
                  <select required className="form-select" value={form.pays} onChange={e => set('pays', e.target.value)}>
                    <option value="">Sélectionner</option>
                    {pays.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Filière souhaitée</label>
                  <select required className="form-select" value={form.filiere} onChange={e => set('filiere', e.target.value)}>
                    <option value="">Sélectionner</option>
                    {filieres.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Niveau de français</label>
                  <select required className="form-select" value={form.langue} onChange={e => set('langue', e.target.value)}>
                    <option value="">Sélectionner</option>
                    {langues.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <button type="submit" className="form-submit">Continuer <ArrowRight size={16} /></button>
              </div>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleAnalyse} className="analyse-form">
              <h2 className="analyse-form__title">Vos résultats académiques</h2>
              <div className="analyse-form__body">
                <div className="form-info">
                  <Info size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                  Entrez vos moyennes sur 20. Ces informations sont confidentielles et uniquement utilisées pour l'analyse.
                </div>
                <div className="form-group">
                  <label className="form-label">Moyenne générale (/20)</label>
                  <input required type="number" min="0" max="20" step="0.01" className="form-input" value={form.moyenneG} onChange={e => set('moyenneG', e.target.value)} placeholder="Ex: 14.5" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Note en Maths (/20)</label>
                    <input type="number" min="0" max="20" step="0.01" className="form-input" value={form.moyenneMaths} onChange={e => set('moyenneMaths', e.target.value)} placeholder="Ex: 15" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Note en Français (/20)</label>
                    <input type="number" min="0" max="20" step="0.01" className="form-input" value={form.moyenneFrancais} onChange={e => set('moyenneFrancais', e.target.value)} placeholder="Ex: 13" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Budget disponible (FCFA)</label>
                  <select className="form-select" value={form.budget} onChange={e => set('budget', e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option value="min">Moins de 1 000 000 FCFA</option>
                    <option value="mid">1 000 000 – 3 000 000 FCFA</option>
                    <option value="high">Plus de 3 000 000 FCFA</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" className="form-back" onClick={() => setStep(1)}>Retour</button>
                  <button type="submit" className="form-submit">Analyser mon profil <BarChart3 size={16} /></button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3 — Results */}
          {step === 3 && result && (
            <div className="result-card">
              <h2 className="result-card__title">Résultat de votre analyse</h2>
              <p className="result-score-label">Estimation des chances d'admission</p>
              <div className={`result-badge result-badge--${result.color}`}>{result.label}</div>
              <div className="result-bar-wrap"><div className="result-bar" style={{ width: `${result.score}%` }} /></div>
              <p className="result-bar-pct">{result.score}% de probabilité</p>

              <div className="result-cols">
                <div className="result-col--good">
                  <div className="result-col__title"><CheckCircle size={15} /> Points forts</div>
                  <ul className="result-col__list">{result.strengths.map(s => <li key={s}>• {s}</li>)}</ul>
                </div>
                <div className="result-col--warn">
                  <div className="result-col__title"><AlertTriangle size={15} /> À améliorer</div>
                  <ul className="result-col__list">{result.weaknesses.map(w => <li key={w}>• {w}</li>)}</ul>
                </div>
              </div>

              <div className="result-recs">
                <div className="result-recs__title"><Star size={16} style={{ color: 'var(--blue-600)' }} /> Universités recommandées</div>
                <div className="result-recs__grid">
                  {result.recs.map(u => <div key={u} className="result-recs__item">{u}</div>)}
                </div>
              </div>

              <div className="result-villes">
                <div className="result-villes__title"><TrendingUp size={16} style={{ color: 'var(--blue-600)' }} /> Villes recommandées</div>
                <div className="result-villes__list">
                  {result.villes.map(v => <span key={v} className="result-villes__item">{v}</span>)}
                </div>
              </div>

              <div className="result-note">
                <strong>Note :</strong> Cette analyse est une estimation. Pour une analyse complète, créez votre compte et téléchargez vos documents.
              </div>

              <div className="result-actions">
                <Link to={getStartPath()} className="result-action-primary">
                  Lancer ma procédure <ArrowRight size={16} />
                </Link>
                <button
                  className="result-action-secondary"
                  onClick={() => { setStep(1); setResult(null); setForm({ prenom:'',nom:'',email:'',niveau:'',pays:'',filiere:'',moyenneG:'',moyenneMaths:'',moyenneFrancais:'',langue:'',budget:'' }); }}
                >
                  Refaire l'analyse
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
