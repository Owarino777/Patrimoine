const foundations = [
  "Données saisies manuellement et exportables",
  "Calculs financiers déterministes",
  "Isolation PostgreSQL RLS",
  "Aucun ordre d’achat ou de vente automatique",
];

export default function HomePage() {
  return (
    <main id="main-content" className="page-shell">
      <header className="page-header">
        <p className="product-name">Patrimoine</p>
        <h1>Construire et suivre son patrimoine à long terme</h1>
        <p className="intro">
          Le socle technique du MVP est en cours de construction. Les comptes, allocations, projections et décisions
          seront centralisés dans une application accessible et sécurisée.
        </p>
      </header>

      <section aria-labelledby="foundation-title" className="foundation-section">
        <h2 id="foundation-title">Fondations du produit</h2>
        <ul>
          {foundations.map((foundation) => (
            <li key={foundation}>{foundation}</li>
          ))}
        </ul>
      </section>

      <aside className="notice" aria-label="Limite du service">
        <strong>Information importante</strong>
        <p>Les projections ne constituent pas une garantie de performance ni un conseil financier personnalisé.</p>
      </aside>
    </main>
  );
}
