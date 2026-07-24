"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
  DEMO_ACCOUNTS_CHANGED_EVENT,
  DEMO_ACCOUNTS_STORAGE_KEY,
  type DemoAccount,
} from "../demo-account-storage";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(DEMO_ACCOUNTS_CHANGED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(DEMO_ACCOUNTS_CHANGED_EVENT, onStoreChange);
  };
}

function getSnapshot(): string {
  return window.localStorage.getItem(DEMO_ACCOUNTS_STORAGE_KEY) ?? "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

function parseAccounts(snapshot: string): DemoAccount[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? (parsed as DemoAccount[]) : [];
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const accounts = useMemo(() => parseAccounts(snapshot), [snapshot]);
  const totalValue = accounts.reduce((sum, account) => sum + account.amount, 0);
  const monthlyTotal = accounts.reduce((sum, account) => sum + account.monthlyContribution, 0);
  const livretA = accounts.find((account) => account.accountType === "LIVRET_A");
  const safetyTarget = 5000;
  const safetyValue = livretA?.amount ?? 0;

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <Link className="brand" href="/" aria-label="Patrimoine, accueil">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Patrimoine</span>
        </Link>
        <nav>
          <ul className="nav-list">
            <li><a aria-current="page" href="#overview">Vue d’ensemble</a></li>
            <li><a href="#accounts">Comptes</a></li>
            <li><a href="#allocation">Répartition</a></li>
          </ul>
        </nav>
        <div className="sidebar-note">
          <span className="eyebrow">Mode local</span>
          <p>Données conservées dans ce navigateur uniquement.</p>
        </div>
      </aside>

      <main id="main-content" className="dashboard" tabIndex={-1}>
        <header id="top" className="topbar">
          <div><p className="eyebrow">Tableau de bord</p><h1>Mon patrimoine</h1></div>
          <Link className="primary-button" href="/accounts/new">Ajouter un compte</Link>
        </header>

        <section id="overview" aria-labelledby="overview-title" className="hero-card">
          <div><p className="eyebrow">Total suivi</p><h2 id="overview-title">{euro.format(totalValue)}</h2></div>
          <div className="hero-stat"><strong>{euro.format(monthlyTotal)}</strong><span>prévus par mois</span></div>
        </section>

        <section className="metrics-grid" aria-label="Indicateurs principaux">
          <article className="metric-card"><span className="eyebrow">Comptes</span><strong>{accounts.length}</strong></article>
          <article className="metric-card"><span className="eyebrow">Valeur totale</span><strong>{euro.format(totalValue)}</strong></article>
          <article className="metric-card"><span className="eyebrow">Versements mensuels</span><strong>{euro.format(monthlyTotal)}</strong></article>
        </section>

        <section id="accounts" aria-labelledby="accounts-title" className="section-card">
          <div className="section-heading">
            <div><p className="eyebrow">Comptes</p><h2 id="accounts-title">Mes comptes</h2></div>
            <span className="demo-badge">Local</span>
          </div>
          {accounts.length === 0 ? (
            <div className="empty-state">
              <p>Aucun compte enregistré.</p>
              <Link className="primary-button" href="/accounts/new">Ajouter mon premier compte</Link>
            </div>
          ) : (
            <div className="account-grid">
              {accounts.map((account) => (
                <Link className="account-card account-card-link" href={`/accounts/${account.id}`} key={account.id}>
                  <div className="account-card-header">
                    <span className="account-icon" aria-hidden="true">{account.name.slice(0, 1)}</span>
                    <span className="status-pill status-active">Actif</span>
                  </div>
                  <h3>{account.name}</h3>
                  <dl>
                    <div><dt>Valeur</dt><dd>{euro.format(account.amount)}</dd></div>
                    <div><dt>Mensuel</dt><dd>{euro.format(account.monthlyContribution)}</dd></div>
                  </dl>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="two-column-grid">
          <section id="allocation" aria-labelledby="allocation-title" className="section-card">
            <div className="section-heading"><div><p className="eyebrow">Répartition mensuelle</p><h2 id="allocation-title">{euro.format(monthlyTotal)} / mois</h2></div></div>
            {monthlyTotal > 0 ? (
              <>
                <div className="allocation-bar" role="img" aria-label="Répartition des versements mensuels par compte">
                  {accounts.filter((account) => account.monthlyContribution > 0).map((account, index) => (
                    <span
                      className="allocation-segment"
                      key={account.id}
                      style={{ width: `${(account.monthlyContribution / monthlyTotal) * 100}%`, background: `hsl(${150 + index * 47} 48% 45%)` }}
                    />
                  ))}
                </div>
                <ul className="legend-list">
                  {accounts.filter((account) => account.monthlyContribution > 0).map((account) => (
                    <li key={account.id}><span>{account.name}</span><strong>{euro.format(account.monthlyContribution)}</strong></li>
                  ))}
                </ul>
              </>
            ) : <p className="muted-copy">Aucun versement mensuel renseigné.</p>}
          </section>

          <section aria-labelledby="goal-title" className="section-card">
            <div className="section-heading"><div><p className="eyebrow">Épargne de sécurité</p><h2 id="goal-title">Livret A</h2></div></div>
            <div className="goal-amount"><strong>{euro.format(safetyValue)}</strong><span>/ {euro.format(safetyTarget)}</span></div>
            <progress value={Math.min(safetyValue, safetyTarget)} max={safetyTarget}>{Math.round((safetyValue / safetyTarget) * 100)} %</progress>
            {!livretA ? <p className="muted-copy">Ajoute un Livret A pour suivre cet objectif.</p> : null}
          </section>
        </div>
      </main>
    </div>
  );
}
