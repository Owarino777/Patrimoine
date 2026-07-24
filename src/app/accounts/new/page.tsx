import Link from "next/link";
import { accountTypes } from "../../../domain/account/financial-account";

const accountLabels: Record<(typeof accountTypes)[number], string> = {
  LIVRET_A: "Livret A",
  LDDS: "LDDS",
  PEA: "PEA",
  CTO: "Compte-titres ordinaire",
  PER: "PER",
  CRYPTO_WALLET: "Portefeuille crypto",
  CASH: "Compte espèces",
  OTHER: "Autre compte",
};

export default function NewAccountPage() {
  return (
    <main id="main-content" className="form-page" tabIndex={-1}>
      <div className="form-page-header">
        <div>
          <p className="eyebrow">Mise en route</p>
          <h1>Ajouter un compte patrimonial</h1>
          <p className="form-intro">
            Renseigne uniquement les informations utiles au suivi. Aucune connexion bancaire ni aucun ordre financier ne sera effectué.
          </p>
        </div>
        <Link className="secondary-link" href="/">Retour au tableau de bord</Link>
      </div>

      <form className="account-form">
        <fieldset>
          <legend>Identification du compte</legend>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="account-type">Type de compte</label>
              <select id="account-type" name="accountType" defaultValue="LIVRET_A">
                {accountTypes.map((type) => (
                  <option key={type} value={type}>{accountLabels[type]}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="account-name">Nom du compte</label>
              <input id="account-name" name="name" type="text" maxLength={120} defaultValue="Livret A" required />
            </div>

            <div className="form-field form-field-wide">
              <label htmlFor="institution-name">Établissement</label>
              <input id="institution-name" name="institutionName" type="text" maxLength={160} placeholder="Ex. Crédit Mutuel, Trade Republic" required />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Montants de départ</legend>
          <p className="field-help">Les valeurs restent modifiables plus tard. Utilise 0 lorsque le compte n’est pas encore ouvert.</p>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="cash-balance">Valeur actuelle en euros</label>
              <input id="cash-balance" name="cashBalance" type="number" min="0" step="0.01" defaultValue="0" inputMode="decimal" />
            </div>

            <div className="form-field">
              <label htmlFor="monthly-contribution">Versement mensuel prévu</label>
              <input id="monthly-contribution" name="monthlyContribution" type="number" min="0" step="0.01" defaultValue="50" inputMode="decimal" />
            </div>
          </div>
        </fieldset>

        <div className="form-notice" role="note">
          <strong>Étape suivante</strong>
          <p>Le formulaire sera relié au cas d’usage métier puis à PostgreSQL après l’ajout de l’authentification.</p>
        </div>

        <div className="form-actions">
          <Link className="secondary-link" href="/">Annuler</Link>
          <button className="primary-button" type="button">Enregistrer en démonstration</button>
        </div>
      </form>
    </main>
  );
}
