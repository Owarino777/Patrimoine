import { dashboardAccounts, monthlyPlan, nextActions } from "./dashboard-demo";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default function HomePage() {
  const monthlyTotal = monthlyPlan.reduce((total, item) => total + item.amount, 0);
  const patrimoineMonthly = dashboardAccounts.reduce((total, account) => total + account.monthlyContribution, 0);

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <a className="brand" href="#top" aria-label="Patrimoine, accueil">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Patrimoine</span>
        </a>

        <nav>
          <ul className="nav-list">
            <li><a aria-current="page" href="#overview">Vue d’ensemble</a></li>
            <li><a href="#accounts">Comptes</a></li>
            <li><a href="#allocation">Allocation</a></li>
            <li><a href="#goals">Objectifs</a></li>
            <li><a href="#actions">Décisions</a></li>
          </ul>
        </nav>

        <div className="sidebar-note">
          <span className="eyebrow">Mode démonstration</span>
          <p>Aucune donnée bancaire réelle n’est connectée.</p>
        </div>
      </aside>

      <main id="main-content" className="dashboard" tabIndex={-1}>
        <header id="top" className="topbar">
          <div>
            <p className="eyebrow">Vendredi 24 juillet</p>
            <h1>Bonjour Malik, construisons ton patrimoine.</h1>
          </div>
          <button className="primary-button" type="button">Ajouter un compte</button>
        </header>

        <section id="overview" aria-labelledby="overview-title" className="hero-card">
          <div>
            <p className="eyebrow">Patrimoine suivi</p>
            <h2 id="overview-title">0 € renseigné pour le moment</h2>
            <p className="hero-copy">
              Commence par ton Livret A, ton PEA et ta position crypto. Le tableau de bord calculera ensuite ta répartition et tes objectifs.
            </p>
          </div>
          <div className="hero-stat" aria-label={`${patrimoineMonthly} euros prévus chaque mois pour le patrimoine`}>
            <strong>{euro.format(patrimoineMonthly)}</strong>
            <span>par mois vers le patrimoine</span>
          </div>
        </section>

        <section className="metrics-grid" aria-label="Indicateurs principaux">
          <article className="metric-card">
            <span className="eyebrow">Budget mensuel</span>
            <strong>{euro.format(monthlyTotal)}</strong>
            <p>100 € vacances et 100 € patrimoine.</p>
          </article>
          <article className="metric-card">
            <span className="eyebrow">Sécurité</span>
            <strong>0 / 5 000 €</strong>
            <p>Objectif initial conseillé pour le Livret A.</p>
          </article>
          <article className="metric-card">
            <span className="eyebrow">Horizon principal</span>
            <strong>30 ans</strong>
            <p>Capitalisation long terme via le PEA.</p>
          </article>
        </section>

        <section id="accounts" aria-labelledby="accounts-title" className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Enveloppes</p>
              <h2 id="accounts-title">Tes comptes patrimoniaux</h2>
            </div>
            <span className="demo-badge">Données de démonstration</span>
          </div>

          <div className="account-grid">
            {dashboardAccounts.map((account) => (
              <article className="account-card" key={account.id}>
                <div className="account-card-header">
                  <span className="account-icon" aria-hidden="true">{account.name.slice(0, 1)}</span>
                  <span className={`status-pill status-${account.status}`}>
                    {account.status === "active" ? "Existant" : "À configurer"}
                  </span>
                </div>
                <h3>{account.name}</h3>
                <p>{account.type}</p>
                <dl>
                  <div><dt>Valeur</dt><dd>{euro.format(account.amount)}</dd></div>
                  <div><dt>Versement</dt><dd>{euro.format(account.monthlyContribution)}/mois</dd></div>
                  <div><dt>Établissement</dt><dd>{account.institution}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <div className="two-column-grid">
          <section id="allocation" aria-labelledby="allocation-title" className="section-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Répartition mensuelle</p>
                <h2 id="allocation-title">Plan de 200 €</h2>
              </div>
            </div>

            <div className="allocation-bar" role="img" aria-label="50 pour cent vacances, 25 pour cent Livret A, 25 pour cent PEA">
              <span className="allocation-segment segment-vacances" style={{ width: "50%" }} />
              <span className="allocation-segment segment-livret" style={{ width: "25%" }} />
              <span className="allocation-segment segment-pea" style={{ width: "25%" }} />
            </div>

            <ul className="legend-list">
              {monthlyPlan.map((item) => (
                <li key={item.label}>
                  <span><span className={`legend-dot legend-${item.label.toLowerCase().replace(" ", "-")}`} aria-hidden="true" />{item.label}</span>
                  <strong>{euro.format(item.amount)}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section id="goals" aria-labelledby="goals-title" className="section-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Objectif prioritaire</p>
                <h2 id="goals-title">Épargne de sécurité</h2>
              </div>
            </div>
            <div className="goal-amount"><strong>0 €</strong><span>sur 5 000 €</span></div>
            <progress value="0" max="5000">0 %</progress>
            <p className="muted-copy">À 50 € par mois, l’objectif serait atteint en 100 mois sans versement exceptionnel.</p>
          </section>
        </div>

        <section id="actions" aria-labelledby="actions-title" className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Mise en route</p>
              <h2 id="actions-title">Prochaines actions</h2>
            </div>
          </div>
          <ol className="action-list">
            {nextActions.map((action, index) => (
              <li key={action}>
                <span aria-hidden="true">{index + 1}</span>
                <p>{action}</p>
                <button type="button">Commencer</button>
              </li>
            ))}
          </ol>
        </section>

        <footer className="dashboard-footer">
          <p>Les projections ne constituent pas une garantie de performance ni un conseil financier personnalisé.</p>
        </footer>
      </main>
    </div>
  );
}
