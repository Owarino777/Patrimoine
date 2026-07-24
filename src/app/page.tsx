import Link from "next/link";

export default function HomePage() {
  return (
    <main id="main-content" className="form-page landing-page" tabIndex={-1}>
      <header className="form-page-header">
        <Link className="brand" href="/" aria-label="Patrimoine, accueil">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Patrimoine</span>
        </Link>
        <Link className="secondary-link" href="/dashboard">Ouvrir le tableau de bord</Link>
      </header>

      <section className="hero-card landing-hero" aria-labelledby="landing-title">
        <div>
          <p className="eyebrow">Gestion patrimoniale simple</p>
          <h1 id="landing-title">Suivez vos comptes, vos objectifs et votre progression.</h1>
          <p className="hero-copy">Ajoutez uniquement les éléments utiles à votre situation. Vos données locales restent dans votre navigateur tant qu’aucun compte cloud n’est connecté.</p>
          <div className="form-actions landing-actions">
            <Link className="primary-button" href="/dashboard">Commencer en local</Link>
            <span className="field-help">Compte utilisateur et synchronisation cloud : prochaine étape.</span>
          </div>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Fonctionnalités principales">
        <article className="metric-card"><span className="eyebrow">Comptes</span><strong>Centraliser</strong></article>
        <article className="metric-card"><span className="eyebrow">Objectifs</span><strong>Planifier</strong></article>
        <article className="metric-card"><span className="eyebrow">Décisions</span><strong>Suivre</strong></article>
      </section>
    </main>
  );
}
