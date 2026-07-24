"use client";

import Link from "next/link";
import { Plus, WalletCards } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import { MobileBottomNav } from "../mobile-bottom-nav";
import { DEMO_ACCOUNTS_CHANGED_EVENT, DEMO_ACCOUNTS_STORAGE_KEY, type DemoAccount } from "../demo-account-storage";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
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

export default function AccountsPage() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const accounts = useMemo(() => parseAccounts(snapshot), [snapshot]);
  const total = accounts.reduce((sum, account) => sum + account.amount, 0);
  const monthly = accounts.reduce((sum, account) => sum + account.monthlyContribution, 0);

  return (
    <>
      <main className="form-page accounts-list-page" id="main-content" tabIndex={-1}>
        <header className="form-page-header">
          <div><p className="eyebrow">Patrimoine</p><h1>Mes comptes</h1></div>
          <Link className="primary-button icon-button" href="/accounts/new"><Plus aria-hidden="true" size={18} />Ajouter</Link>
        </header>

        <section className="account-list-summary" aria-label="Synthèse des comptes">
          <article><span>Valeur totale</span><strong>{euro.format(total)}</strong></article>
          <article><span>Versements mensuels</span><strong>{euro.format(monthly)}</strong></article>
          <article><span>Comptes suivis</span><strong>{accounts.length}</strong></article>
        </section>

        {accounts.length === 0 ? (
          <section className="empty-state">
            <WalletCards aria-hidden="true" size={32} />
            <h2>Aucun compte enregistré</h2>
            <p>Ajoute un Livret A, un PEA, un CTO, un PER, de la crypto ou un autre compte.</p>
            <Link className="primary-button" href="/accounts/new">Ajouter mon premier compte</Link>
          </section>
        ) : (
          <section className="accounts-list" aria-label="Liste des comptes">
            {accounts.map((account) => {
              const investedCapital = account.investedCapital ?? account.amount;
              const pnl = account.amount - investedCapital;
              return (
                <Link className="account-list-row" href={`/accounts/${account.id}`} key={account.id}>
                  <span className="account-list-icon" aria-hidden="true"><WalletCards /></span>
                  <span className="account-list-copy"><strong>{account.name}</strong><small>{account.institutionName}</small></span>
                  <span className="account-list-value"><strong>{euro.format(account.amount)}</strong><small className={pnl >= 0 ? "positive-text" : "negative-text"}>{pnl >= 0 ? "+" : ""}{euro.format(pnl)}</small></span>
                </Link>
              );
            })}
          </section>
        )}
      </main>
      <MobileBottomNav current="accounts" />
    </>
  );
}
