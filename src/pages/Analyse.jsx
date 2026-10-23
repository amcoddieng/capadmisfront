import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BarChart3, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { getStartPath } from '../api/auth';
import useAdvancedScroll from '../hooks/useAdvancedScroll';

const INITIAL_PROFILE = {
  prenom: '', niveau: '', bacAnnee: '', tentatives: '', bacArabe: '', francaisB2: '',
  cycle: '', validation: '', senegal: '', accreditation: '', cycleSuperieur: '',
  mobiliteCredits: '', mobiliteAmbassade: '',
};
const INITIAL_GRADES = { seconde: '', premiere: '', terminale: '', bac: '', meilleure: '', pire: '' };
const DISCLAIMER = 'La recevabilité du dossier sur Études en France ne garantit ni l’admission par les établissements français dans les formations et programmes choisis, ni la délivrance du visa pour études, qui reste de la compétence exclusive du Consulat Général.';

function isEligible(profile) {
  const bac = ['2026', '2027'].includes(profile.bacAnnee)
    && ['1', '2'].includes(profile.tentatives)
    && (profile.bacArabe === 'non' || (profile.bacArabe === 'oui' && profile.francaisB2 === 'oui'));
  const cycle = ['BTS', 'DUT', 'DISEP', 'Licence', 'Master'].includes(profile.cycle)
    && ['valide', '2027'].includes(profile.validation)
    && profile.senegal === 'oui' && profile.accreditation === 'oui' && profile.cycleSuperieur === 'oui';
  return bac || cycle || profile.mobiliteCredits === 'oui' || profile.mobiliteAmbassade === 'oui';
}

function getScoreInfo(moyenne, prenom) {
  if (moyenne >= 16) return { score: 97, message: `Wow ! 97% de chances ? C’est vraiment très élevé, ${prenom}. Vous ne devez pas hésiter. Profitez de cette opportunité. La France vous attend !` };
  if (moyenne >= 14) return { score: 94, message: `Bravo ${prenom}, vos chances d’avoir une admission sont vraiment très élevées avec un taux estimé à 94%. Nous vous encourageons vivement à faire la procédure. Profitez de cette opportunité.` };
  if (moyenne >= 12) return { score: 81, message: `Félicitations ${prenom}, vous avez un profil solide avec plus de 80% de chances d’avoir une admission. Une grande partie des étudiants qui ont réussi leur procédure grâce à l’accompagnement de nos agents ont des profils similaires.` };
  if (moyenne >= 10) return { score: 72, message: 'Votre profil, en plus d’être éligible garde environ 72% de chances car étant dans le lot des 10-12. Un nombre important de candidats avec un profil similaire ont déjà été accompagnés par notre équipe.' };
  return { score: 51, message: 'Avec ces notes, vos chances ne sont pas les meilleures. Toutefois, cela ne veut pas dire que vous n’aurez pas d’admission. Grâce à l’accompagnement de notre équipe de traitement, des étudiants avec des notes similaires ont déjà été acceptés.' };
}

function SelectField({ name, label, value, onChange, options }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <select id={name} required className="form-select" value={value} onChange={e => onChange(e.target.value)}>
        <option value="" disabled>Sélectionner</option>
        {options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}
      </select>
    </div>
  );
}

function GradeField({ name, label, value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label} (/20)</label>
      <input id={name} required type="number" min="0" max="20" step="0.01" className="form-input" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export default function Analyse() {
  useAdvancedScroll();
  const [step, setStep] = useState('eligibilite');
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [grades, setGrades] = useState(INITIAL_GRADES);
  const [subjects, setSubjects] = useState({ meilleures: ['', '', ''], pires: ['', '', ''], notesMeilleures: ['', '', ''], notesPires: ['', '', ''] });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const set = (field, value) => setProfile(prev => ({ ...prev, [field]: value }));
  const setGrade = (field, value) => setGrades(prev => ({ ...prev, [field]: value }));
  const yesNo = [['oui', 'Oui'], ['non', 'Non']];
  const select = (name, label, options = yesNo) => <SelectField name={name} label={label} value={profile[name]} onChange={value => set(name, value)} options={options} />;
  const grade = (name, label) => <GradeField name={name} label={label} value={grades[name]} onChange={value => setGrade(name, value)} />;
  const eligible = isEligible(profile);
  const terminale = profile.niveau === 'terminale';
  const bachelier = profile.niveau === 'bachelier';

  const navigateStep = (next) => {
    setError('');
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleAnalyse = (e) => {
    e.preventDefault();
    if (!eligible) return;
    const keys = terminale ? ['premiere', 'seconde'] : bachelier ? ['bac', 'terminale', 'premiere', 'seconde'] : ['bac'];
    const values = keys.map(key => grades[key] === '' ? NaN : Number(grades[key]));
    if (values.some(value => !Number.isFinite(value) || value < 0 || value > 20)) {
      setError('Veuillez saisir des moyennes valides entre 0 et 20.');
      return;
    }
    if ((terminale || bachelier) && Number(grades.meilleure) < Number(grades.pire)) {
      setError('La meilleure note doit être supérieure ou égale à la pire note.');
      return;
    }
    if (!terminale && !bachelier && Math.min(...subjects.notesMeilleures.map(Number)) < Math.max(...subjects.notesPires.map(Number))) {
      setError('Les trois meilleures notes doivent être supérieures ou égales aux trois pires notes.');
      return;
    }
    const moyenne = values.reduce((sum, value) => sum + value, 0) / values.length;
    setResult({ ...getScoreInfo(moyenne, profile.prenom.trim()), moyenne });
    navigateStep('resultat');
  };

  return (
    <main>
      <Helmet>
        <title>Éligibilité et analyse des chances 2027 — CapAdmis</title>
        <meta name="description" content="Vérifiez votre éligibilité à la campagne Études en France pour la rentrée 2027, puis estimez vos chances d’admission." />
        <link rel="canonical" href="https://capadmis.com/analyse" />
      </Helmet>

      {/* Hero */}
      <section className="page-hero--gradient page-hero--center">
        <div className="container">
          <span className="page-hero__badge">Campagne 2027 · Sénégal</span>
          <h1 className="page-hero__title">Éligibilité et analyse des chances</h1>
          <p className="page-hero__desc">Vérifiez d’abord votre éligibilité à Études en France, puis analysez vos chances d’admission.</p>
        </div>
      </section>

      {/* Stepper + forms */}
      <section className="page-section--gray">
        <div className="container--tight" style={{ maxWidth: '40rem', margin: '0 auto', padding: '0 1rem' }}>
          {/* Progress */}
          <div className="stepper__labels"><span>1. Vérification de l’éligibilité</span><span>2. Analyse des chances</span></div>

          {/* Step 1 */}
          {step === 'eligibilite' && (
            <form className="analyse-form" onSubmit={e => { e.preventDefault(); navigateStep('profil'); }}>
              <h2 className="analyse-form__title">Vérification de l’éligibilité</h2>
              <div className="analyse-form__body">
                <div className="form-group">
                  <label className="form-label" htmlFor="prenom">Prénom</label>
                  <input id="prenom" required pattern=".*\S.*" className="form-input" value={profile.prenom} onChange={e => set('prenom', e.target.value)} />
                </div>
                {select('niveau', 'Votre niveau actuel', [['terminale', 'Terminale'], ['bachelier', 'Bachelier'], ['autre', 'Autres niveaux']])}
                <h3>Critère A — Baccalauréat</h3>
                {select('bacAnnee', 'Année d’obtention du bac (obtenu ou prévu)', [['2026', 'Bac obtenu en 2026'], ['2027', 'Bac prévu en 2027'], ['autre', 'Autre année / pas de bac prévu']])}
                {['2026', '2027'].includes(profile.bacAnnee) && <>
                  {select('tentatives', 'Nombre de passages au bac (y compris celui prévu)', [['1', '1 passage (sans reprise)'], ['2', '2 passages (une reprise)'], ['3', '3 passages ou plus']])}
                  {select('bacArabe', 'Votre bac est-il un Bac Arabe L-AR ?')}
                  {profile.bacArabe === 'oui' && select('francaisB2', 'Disposez-vous d’un test de français attestant au moins le niveau B2 ?')}
                </>}
                <h3>Critère B — Poursuite dans un cycle supérieur</h3>
                {select('cycle', 'Cycle validé ou qui sera validé en 2027', [['BTS', 'BTS'], ['DUT', 'DUT'], ['DISEP', 'DISEP'], ['Licence', 'Licence'], ['Master', 'Master'], ['aucun', 'Aucun de ces cycles']])}
                {profile.cycle && profile.cycle !== 'aucun' && <>
                  {select('validation', 'Situation du diplôme', [['valide', 'Déjà validé'], ['2027', 'Sera validé en 2027'], ['autre', 'Ne sera pas validé pour cette campagne']])}
                  {select('senegal', 'Ce cycle est-il suivi ou a-t-il été validé au Sénégal ?')}
                  {select('accreditation', 'Le diplôme est-il accrédité par l’ANAQ-Sup ?')}
                  {select('cycleSuperieur', 'Souhaitez-vous poursuivre dans un cycle supérieur en France ?')}
                </>}
                <h3>Critères C et D — Mobilités encadrées</h3>
                {select('mobiliteCredits', 'Bénéficiez-vous d’une mobilité encadrée d’au moins un semestre, avec un accord inter-établissements prévoyant une validation de crédits dans l’établissement d’origine ?')}
                {select('mobiliteAmbassade', 'Votre mobilité relève-t-elle d’un accord inter-établissements visé par l’Ambassade ?')}
                <div className="form-info"><Info size={18} style={{ flexShrink: 0 }} /><span>Un seul des critères A, B, C ou D suffit. Cette vérification repose sur vos déclarations et ne remplace pas le contrôle des justificatifs. {DISCLAIMER}</span></div>
                <button type="submit" className="form-submit">Vérifier mon éligibilité <ArrowRight size={16} /></button>
              </div>
            </form>
          )}

          {step === 'profil' && (
            <div className="result-card" role="status">
              {eligible ? <CheckCircle size={36} color="#166534" /> : <AlertTriangle size={36} color="#9a3412" />}
              <h2 className="result-card__title">{eligible ? 'Profil éligible' : 'Profil inéligible'}</h2>
              <p>{eligible ? 'Votre profil est éligible pour la campagne 2027 de Campus France.' : 'Votre profil n’est pas éligible pour la procédure, selon les nouveaux critères d’éligibilités publiés sur la page officielle de Campus France.'}</p>
              <p className="result-note">Résultat indicatif fondé sur les informations déclarées et les critères de la rentrée 2027 au Sénégal. {DISCLAIMER}</p>
              <div className="result-actions">
                {eligible && <button className="result-action-primary" onClick={() => navigateStep('notes')}>Analyse des chances <ArrowRight size={16} /></button>}
                <button className="result-action-secondary" onClick={() => navigateStep('eligibilite')}>Modifier mes réponses</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 'notes' && eligible && (
            <form onSubmit={handleAnalyse} className="analyse-form">
              <h2 className="analyse-form__title">Analyse des chances — {terminale ? 'Terminale' : bachelier ? 'Bachelier' : 'Autres niveaux'}</h2>
              <div className="analyse-form__body">
                <div className="form-info"><Info size={18} style={{ flexShrink: 0 }} /><span>Notes sur 20. Seules les moyennes générales sont utilisées pour le score, avec le même poids. Pour les autres niveaux, seule la moyenne au bac est utilisée. Les notes par matière ne modifient pas le score.</span></div>
                {!terminale && grade('bac', 'Moyenne au bac')}
                {bachelier && grade('terminale', 'Moyenne générale en terminale')}
                {(terminale || bachelier) && <>
                  {grade('premiere', 'Moyenne générale en première')}
                  {grade('seconde', 'Moyenne générale en seconde')}
                  {grade('meilleure', 'Meilleure note')}
                  {grade('pire', 'Pire note')}
                </>}
                {!terminale && !bachelier && ['meilleures', 'pires'].map(group => (
                  <fieldset key={group} style={{ border: '1px solid #e2e8f0', borderRadius: '.75rem', padding: '1rem' }}>
                    <legend>Vos 3 {group === 'meilleures' ? 'meilleures' : 'pires'} notes</legend>
                    {[0, 1, 2].map(index => {
                      const notesKey = group === 'meilleures' ? 'notesMeilleures' : 'notesPires';
                      const update = (key, value) => setSubjects(prev => ({ ...prev, [key]: prev[key].map((item, i) => i === index ? value : item) }));
                      return (
                        <div className="form-row" key={index}>
                          <div className="form-group">
                            <label className="form-label" htmlFor={`${group}-matiere-${index}`}>Matière {index + 1}</label>
                            <input id={`${group}-matiere-${index}`} required pattern=".*\S.*" className="form-input" value={subjects[group][index]} onChange={e => update(group, e.target.value)} />
                          </div>
                          <GradeField name={`${group}-note-${index}`} label={`Note ${index + 1}`} value={subjects[notesKey][index]} onChange={value => update(notesKey, value)} />
                        </div>
                      );
                    })}
                  </fieldset>
                ))}
                {error && <p role="alert" className="auth-error">{error}</p>}
                <div className="form-actions">
                  <button type="button" className="form-back" onClick={() => navigateStep('profil')}>Retour</button>
                  <button type="submit" className="form-submit">Analyser mes chances <BarChart3 size={16} /></button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3 — Results */}
          {step === 'resultat' && result && eligible && (
            <div className="result-card" role="status">
              <h2 className="result-card__title">Résultat de votre analyse</h2>
              <p className="result-score-label">Estimation indicative CapAdmis</p>
              <div className="result-bar-wrap"><div className="result-bar" style={{ width: `${result.score}%` }} /></div>
              <p className="result-bar-pct">{result.score}% de chances estimées</p>
              <p>Moyenne utilisée : {result.moyenne.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}/20</p>
              <p>{result.message}</p>
              <div className="result-actions">
                <Link to={getStartPath()} className="result-action-primary">Lancer ma procédure <ArrowRight size={16} /></Link>
                <Link to="/procedure" className="result-action-secondary">Je veux connaître les démarches</Link>
                <button className="result-action-secondary" onClick={() => navigateStep('notes')}>Modifier mes notes</button>
              </div>
              <div className="result-note">Ces taux correspondent au barème indicatif CapAdmis, pas à des statistiques officielles Campus France ni à une garantie d’admission. {DISCLAIMER}</div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
