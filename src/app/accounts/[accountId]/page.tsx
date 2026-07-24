"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Pencil, Save, Trash2, TrendingUp, WalletCards } from "lucide-react";
import {
  deleteDemoAccount,
  findDemoAccount,
  updateDemoAccount,
  type DemoAccount,
} from "../../demo-account-storage";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function AccountDetailPage() {
  const params = useParams<{ accountId: string }>();
  const router = useRouter();
  const [account, setAccount] = useState<DemoAccount | null>(() => findDemoAccount(params.accountId));
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(false);

  const metrics = useMemo(() => {
    if (!account) return null;
    const investedCapital = account.investedCapital ?? account.amount;
    const pnl = account.amount - investedCapital;
    const pnlPercent = investedCapital > 0 ? (pnl / investedCapital) * 100 : 0;
    return { investedCapital, pnl, pnlPercent };
  }, [account]);

  if (!account || !metrics) {
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
      investedCapital: Number(form.get("investedCapital") ?? 0),
      monthlyContribution: Number(form.get("monthlyContribution") ?? 0),
      annualReturnPercent: Number(form.get("annualReturnPercent") ?? 0),
    };

    if (
      !updated.name ||
      !updated.institutionName ||
      !Number.isFinite(updated.amount) ||
      !Number.isFinite(updated.investedCapital) ||
      !Number.isFinite(updated.monthlyContribution) ||
      !Number.isFinite(updated.annualReturnPercent) ||
      updated.amount < 0 ||
      (updated.investedCapital ?? 0) < 0 ||
      updated.monthlyContribution < 0 ||
      (updated.annualReturnPercent ?? 0) < -100 ||
      (updated.annualReturnPercent ?? 0) > 100
    ) {
      setStatus("Vérifie les informations saisies.");
      return;
    }

    updateDemoAccount(updated);
    setAccount(updated);
    setEditing(false);
    setStatus("Modifications enregistrées sur cet appareil.");
  }

  function handleDelete() {
    if (!window.confirm(`Supprimer le compte « ${currentAccount.name} » ?`)) return;
    deleteDemoAccount(currentAccount.id);
    router.push("/dashboard");
  }

  const pnlPositive = metrics.pnl >= 0;

  return (
    <main className="form-page account-detail-page" id="main-content" tabIndex={-1}>
      <header className="account-detail-header">
        <Link className="round-icon-button" href="/dashboard" aria-label="Retour au tableau de bord"><ArrowLeft aria-hidden="true" /></Link>
        <div className="account-detail-title">
          <p className="eyebrow">Compte</p>
          <h1>{currentAccount.name}</h1>
          <p>{currentAccount.institutionName}</p>
        </div>
        <button className="secondary-link icon-button" type="button" onClick={() => setEditing((value) => !value)} aria-expanded={editing}>
          <Pencil aria-hidden="true" size={18} />{editing ? "Fermer" : "Modifier"}
        </button>
      </header>

      <section className="account-summary-card" aria-label="Synthèse du compte">
        <article><span>Valeur actuelle</span><strong>{euro.format(currentAccount.amount)}</strong></article>
        <article><span>Capital investi</span><strong>{euro.format(metrics.investedCapital)}</strong></article>
        <article className={pnlPositive ? "positive-metric" : "negative-metric"}>
          <span>PNL</span><strong>{pnlPositive ? "+" : ""}{euro.format(metrics.pnl)}</strong><small>{pnlPositive ? "+" : ""}{metrics.pnlPercent.toFixed(2)} %</small>
        </article>
        <article><span>Versement mensuel</span><strong>{euro.format(currentAccount.monthlyContribution)}</strong></article>
      </section>

      <section className="account-insight-card">
        <div className="account-insight-icon"><TrendingUp aria-hidden="true" /></div>
        <div><p className="eyebrow">Projection</p><h2>Rendement annuel estimé</h2><strong>{currentAccount.annualReturnPercent ?? 0} %</strong></div>
      </section>

      {status ? <p className="form-success" role="status">{status}</p> : null}

      {editing ? (
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
            <legend>Montants et rendement</legend>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="amount">Valeur actuelle</label>
                <input id="amount" name="amount" type="number" min="0" step="0.01" defaultValue={currentAccount.amount} />
              </div>
              <div className="form-field">
                <label htmlFor="investedCapital">Capital investi</label>
                <input id="investedCapital" name="investedCapital" type="number" min="0" step="0.01" defaultValue={metrics.investedCapital} />
              </div>
              <div className="form-field">
                <label htmlFor="monthlyContribution">Versement mensuel</label>
                <input id="monthlyContribution" name="monthlyContribution" type="number" min="0" step="0.01" defaultValue={currentAccount.monthlyContribution} />
              </div>
              <div className="form-field">
                <label htmlFor="annualReturnPercent">Rendement annuel estimé (%)</label>
                <input id="annualReturnPercent" name="annualReturnPercent" type="number" min="-100" max="100" step="0.1" defaultValue={currentAccount.annualReturnPercent ?? 0} />
              </div>
            </div>
          </fieldset>

          <div className="form-actions form-actions-between">
            <button className="danger-button icon-button" type="button" onClick={handleDelete}><Trash2 aria-hidden="true" size={18} />Supprimer</button>
            <button className="primary-button icon-button" type="submit"><Save aria-hidden="true" size={18} />Enregistrer</button>
          </div>
        </form>
      ) : (
        <section className="section-card account-actions-card">
          <div><WalletCards aria-hidden="true" /><div><h2>Gestion du compte</h2><p>Modifie les montants, le capital investi ou le versement mensuel.</p></div></div>
          <button className="primary-button icon-button" type="button" onClick={() => setEditing(true)}><Pencil aria-hidden="true" size={18} />Modifier le compte</button>
        </section>
      )}
    </main>
  );
}
