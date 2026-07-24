"use client";

import { useMemo, useSyncExternalStore } from "react";
import { dashboardAccounts } from "./dashboard-demo";
import { DEMO_ACCOUNTS_STORAGE_KEY, type DemoAccount } from "./demo-account-storage";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function subscribeToStorage(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getStorageSnapshot(): string {
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

export function DemoAccountGrid() {
  const storageSnapshot = useSyncExternalStore(subscribeToStorage, getStorageSnapshot, getServerSnapshot);
  const savedAccounts = useMemo(() => parseAccounts(storageSnapshot), [storageSnapshot]);

  const accounts = savedAccounts.length > 0
    ? savedAccounts.map((account) => ({
        id: account.id,
        name: account.name,
        amount: account.amount,
        monthlyContribution: account.monthlyContribution,
        status: "active" as const,
      }))
    : dashboardAccounts;

  return (
    <>
      {savedAccounts.length > 0 ? (
        <p className="form-success" role="status">Compte enregistré sur cet appareil.</p>
      ) : null}
      <div className="account-grid">
        {accounts.map((account) => (
          <article className="account-card" key={account.id}>
            <div className="account-card-header">
              <span className="account-icon" aria-hidden="true">{account.name.slice(0, 1)}</span>
              <span className={`status-pill status-${account.status}`}>
                {account.status === "active" ? "Actif" : "À configurer"}
              </span>
            </div>
            <h3>{account.name}</h3>
            <dl>
              <div><dt>Valeur</dt><dd>{euro.format(account.amount)}</dd></div>
              <div><dt>Mensuel</dt><dd>{euro.format(account.monthlyContribution)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
