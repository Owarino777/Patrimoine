"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteDemoAccount,
  findDemoAccount,
  updateDemoAccount,
  type DemoAccount,
} from "../../demo-account-storage";

export default function AccountDetailPage() {
  const params = useParams<{ accountId: string }>();
  const router = useRouter();
  const [account, setAccount] = useState<DemoAccount | null>(() => findDemoAccount(params.accountId));
  const [status, setStatus] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!account) {
    return (
      <main className="form-page" id="main-content">
        <h1>Compte introuvable</h1>
        <p>Ce compte n’existe pas sur cet appareil.</p>
        <Link className="primary-button" href="/dashboard">Retour au tableau de bord</Link>
      </main>
    );
  }

  const currentAccount = account;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updated: DemoAccount = {
      id: currentAccount.id,
      accountType: currentAccount.accountType,
      name: String(form.get("name") ?? "").trim(),
      institutionName: String(form.get("institutionName") ?? "").trim(),
      amount: Number(form.get("amount") ?? 0),
      monthlyContribution: Number(form.get("monthlyContribution") ?? 0),
    };

    if (
      !updated.name ||
      !updated.institutionName ||
      !Number.isFinite(updated.amount) ||
      !Number.isFinite(updated.monthlyContribution) ||
      updated.amount < 0 ||
      updated.monthlyContribution < 0
    ) {
      setStatus("Vérifie les informations saisies.");
      return;
    }

    updateDemoAccount(updated);
    setAccount(updated);
    setStatus("Modifications enregistrées sur cet appareil.");
  }

  function handleDelete() {
    deleteDemoAccount(currentAccount.id);
    router.push("/dashboard");
  }

  return (
    <main className="form-page" id="main-content" tabIndex={-1}>
      <div className="form-page-header">
        <div>
          <p className="eyebrow">Compte</p>
          <h1>{currentAccount.name}</h1>
        </div>
        <Link className="secondary-link" href="/dashboard">Retour</Link>
      </div>

      <form className="account-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Informations</legend>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Nom</label>
              <input id="name" name="name" defaultValue={currentAccount.name} required />
            </div>
            <div className="form-field">
              <label htmlFor="institutionName">Établissement</label>
              <input id="institutionName" name="institutionName" defaultValue={currentAccount.institutionName} required />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Montants</legend>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="amount">Valeur actuelle</label>
              <input id="amount" name="amount" type="number" min="0" step="0.01" defaultValue={currentAccount.amount} />
            </div>
            <div className="form-field">
              <label htmlFor="monthlyContribution">Versement mensuel</label>
              <input id="monthlyContribution" name="monthlyContribution" type="number" min="0" step="0.01" defaultValue={currentAccount.monthlyContribution} />
            </div>
          </div>
        </fieldset>

        {status ? <p className="form-success" role="status">{status}</p> : null}

        {isConfirmingDelete ? (
          <div className="delete-confirmation" role="group" aria-labelledby="delete-confirmation-title">
            <p id="delete-confirmation-title">Supprimer définitivement « {currentAccount.name} » ?</p>
            <div>
              <button className="secondary-link" type="button" onClick={() => setIsConfirmingDelete(false)}>Annuler</button>
              <button className="danger-button" type="button" onClick={handleDelete}>Confirmer la suppression</button>
            </div>
          </div>
        ) : null}

        <div className="form-actions form-actions-between">
          <button className="danger-button" type="button" onClick={() => setIsConfirmingDelete(true)}>Supprimer</button>
          <button className="primary-button" type="submit">Enregistrer</button>
        </div>
      </form>
    </main>
  );
}
