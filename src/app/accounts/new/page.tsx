"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { accountTypes } from "../../../domain/account/financial-account";
import { saveDemoAccount } from "../../demo-account-storage";

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
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const institutionName = String(form.get("institutionName") ?? "").trim();
    const accountType = String(form.get("accountType") ?? "OTHER");
    const amount = Number(form.get("cashBalance") ?? 0);
    const monthlyContribution = Number(form.get("monthlyContribution") ?? 0);

    if (!name || !institutionName || !Number.isFinite(amount) || !Number.isFinite(monthlyContribution) || amount < 0 || monthlyContribution < 0) {
      return;
    }

    saveDemoAccount({
      id: crypto.randomUUID(),
      name,
      institutionName,
      accountType,
      amount,
      monthlyContribution,
    });

    router.push("/dashboard#accounts");
  }

  return (
    <main id="main-content" className="form-page" tabIndex={-1}>
      <div className="form-page-header">
        <div><p className="eyebrow">Compte</p><h1>Ajouter un compte</h1></div>
        <Link className="secondary-link" href="/dashboard">Retour</Link>
      </div>

      <form className="account-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Informations</legend>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="account-type">Type</label>
              <select id="account-type" name="accountType" defaultValue="LIVRET_A">
                {accountTypes.map((type) => <option key={type} value={type}>{accountLabels[type]}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="account-name">Nom</label>
              <input id="account-name" name="name" type="text" maxLength={120} defaultValue="Livret A" required />
            </div>
            <div className="form-field form-field-wide">
              <label htmlFor="institution-name">Établissement</label>
              <input id="institution-name" name="institutionName" type="text" maxLength={160} placeholder="Ex. Crédit Mutuel" required />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Montants</legend>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="cash-balance">Valeur actuelle</label>
              <input id="cash-balance" name="cashBalance" type="number" min="0" step="0.01" defaultValue="0" inputMode="decimal" />
            </div>
            <div className="form-field">
              <label htmlFor="monthly-contribution">Versement mensuel</label>
              <input id="monthly-contribution" name="monthlyContribution" type="number" min="0" step="0.01" defaultValue="0" inputMode="decimal" />
            </div>
          </div>
        </fieldset>

        <p className="field-help">Enregistrement local sur cet appareil uniquement.</p>
        <div className="form-actions">
          <Link className="secondary-link" href="/dashboard">Annuler</Link>
          <button className="primary-button" type="submit">Enregistrer</button>
        </div>
      </form>
    </main>
  );
}
