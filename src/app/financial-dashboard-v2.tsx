"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  DEMO_ACCOUNTS_CHANGED_EVENT,
  DEMO_ACCOUNTS_STORAGE_KEY,
  type DemoAccount,
} from "./demo-account-storage";

const SETTINGS_KEY = "patrimoine.dashboard.settings.v2";
const CASH_KEY = "patrimoine.cash.v1";
const LOCAL_EVENT = "patrimoine:dashboard-changed";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const compactEuro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

type DashboardSettings = Readonly<{
  emergencyTarget: number;
  horizonYears: number;
}>;

type CashCounts = Record<string, number>;

const defaultSettings: DashboardSettings = {
  emergencyTarget: 5000,
  horizonYears: 30,
};

const notes = [500, 200, 100, 50, 20, 10, 5] as const;
const coins = [2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01] as const;
const denominations = [...notes, ...coins] as const;

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(DEMO_ACCOUNTS_CHANGED_EVENT, onStoreChange);
  window.addEventListener(LOCAL_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(DEMO_ACCOUNTS_CHANGED_EVENT, onStoreChange);
    window.removeEventListener(LOCAL_EVENT, onStoreChange);
  };
}

function getSnapshot(): string {
  return JSON.stringify({
    accounts: window.localStorage.getItem(DEMO_ACCOUNTS_STORAGE_KEY) ?? "[]",
    settings: window.localStorage.getItem(SETTINGS_KEY) ?? JSON.stringify(defaultSettings),
    cash: window.localStorage.getItem(CASH_KEY) ?? "{}",
  });
}

function getServerSnapshot(): string {
  return JSON.stringify({ accounts: "[]", settings: JSON.stringify(defaultSettings), cash: "{}" });
}

function safeParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function normaliseType(account: DemoAccount): string {
  const value = `${account.accountType} ${account.name}`.toLowerCase();
  if (value.includes("livret") || value.includes("épargne") || value.includes("epargne")) return "Épargne";
  if (value.includes("pea") || value.includes("cto") || value.includes("bourse") || value.includes("per")) return "Investissements";
  if (value.includes("crypto")) return "Crypto";
  if (value.includes("courant") || value.includes("banque")) return "Liquidités";
  return "Autres";
}

function futureValue(initial: number, monthly: number, annualRatePercent: number, years: number): number {
  const months = years * 12;
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return initial + monthly * months;
  return initial * ((1 + monthlyRate) ** months) + monthly * ((((1 + monthlyRate) ** months) - 1) / monthlyRate);
}

export function FinancialDashboardV2() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parsed = useMemo(() => safeParse<{ accounts: string; settings: string; cash: string }>(snapshot, {
    accounts: "[]",
    settings: JSON.stringify(defaultSettings),
    cash: "{}",
  }), [snapshot]);

  const accounts = useMemo(() => safeParse<DemoAccount[]>(parsed.accounts, []), [parsed.accounts]);
  const settings = useMemo(() => ({ ...defaultSettings, ...safeParse<Partial<DashboardSettings>>(parsed.settings, {}) }), [parsed.settings]);
  const cashCounts = useMemo(() => safeParse<CashCounts>(parsed.cash, {}), [parsed.cash]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const cashTotal = denominations.reduce((sum, denomination) => sum + denomination * (cashCounts[String(denomination)] ?? 0), 0);
  const notesTotal = notes.reduce((sum, denomination) => sum + denomination * (cashCounts[String(denomination)] ?? 0), 0);
  const coinsTotal = coins.reduce((sum, denomination) => sum + denomination * (cashCounts[String(denomination)] ?? 0), 0);
  const accountTotal = accounts.reduce((sum, account) => sum + account.amount, 0);
  const netWorth = accountTotal + cashTotal;
  const monthlyContribution = accounts.reduce((sum, account) => sum + account.monthlyContribution, 0);
  const savingsBalance = accounts.filter((account) => normaliseType(account) === "Épargne").reduce((sum, account) => sum + account.amount, 0);
  const goalPercent = settings.emergencyTarget > 0 ? Math.min(100, Math.round((savingsBalance / settings.emergencyTarget) * 100)) : 0;

  const projectedAccounts = accounts.map((account) => ({
    ...account,
    annualReturnPercent: account.annualReturnPercent ?? 0,
    projectedValue: futureValue(account.amount, account.monthlyContribution, account.annualReturnPercent ?? 0, settings.horizonYears),
  }));
  const projection = projectedAccounts.reduce((sum, account) => sum + account.projectedValue, cashTotal);
  const weightedReturn = accountTotal > 0
    ? accounts.reduce((sum, account) => sum + account.amount * (account.annualReturnPercent ?? 0), 0) / accountTotal
    : 0;

  const allocation = useMemo(() => {
    const values = new Map<string, number>();
    for (const account of accounts) {
      const key = normaliseType(account);
      values.set(key, (values.get(key) ?? 0) + account.amount);
    }
    if (cashTotal > 0) values.set("Espèces", cashTotal);
    return [...values.entries()].map(([label, amount]) => ({
      label,
      amount,
      percent: netWorth > 0 ? (amount / netWorth) * 100 : 0,
    })).sort((a, b) => b.amount - a.amount);
  }, [accounts, cashTotal, netWorth]);

  function saveSettings(next: DashboardSettings): void {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }

  function updateCash(denomination: number, count: number): void {
    const next = { ...cashCounts, [String(denomination)]: Math.max(0, Math.floor(count)) };
    window.localStorage.setItem(CASH_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }

  function renderCashGroup(title: string, values: readonly number[], total: number) {
    return (
      <section aria-labelledby={`cash-${title}`}>
        <div className="section-heading">
          <h3 id={`cash-${title}`}>{title}</h3>
          <strong>{euro.format(total)}</strong>
        </div>
        <div className="cash-grid">
          {values.map((denomination) => (
            <label className="cash-field" key={denomination}>
              <span>{denomination >= 1 ? `${denomination} €` : `${Math.round(denomination * 100)} c`}</span>
              <input type="number" inputMode="numeric" min="0" step="1" value={cashCounts[String(denomination)] ?? 0} onChange={(event) => updateCash(denomination, Number(event.target.value) || 0)} />
              <strong>{euro.format(denomination * (cashCounts[String(denomination)] ?? 0))}</strong>
            </label>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <Link className="brand" href="/" aria-label="Patrimoine, accueil"><span className="brand-mark" aria-hidden="true">P</span><span>Patrimoine</span></Link>
        <nav><ul className="nav-list"><li><a aria-current="page" href="#overview">Vue d’ensemble</a></li><li><a href="#accounts">Comptes</a></li><li><a href="#cash">Espèces</a></li><li><a href="#allocation">Répartition</a></li><li><a href="#projection">Projection</a></li></ul></nav>
        <div className="sidebar-note"><span className="eyebrow">Mode local</span><p>Données conservées dans ce navigateur.</p></div>
      </aside>

      <main id="main-content" className="dashboard" tabIndex={-1}>
        <header className="topbar">
          <div><p className="eyebrow">Tableau de bord</p><h1>Mes finances</h1></div>
          <div className="topbar-actions"><button className="secondary-link" type="button" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen}>Réglages</button><Link className="primary-button" href="/accounts/new">Ajouter un compte</Link></div>
        </header>

        {settingsOpen ? <section className="section-card" aria-labelledby="settings-title"><div className="section-heading"><div><p className="eyebrow">Personnalisation</p><h2 id="settings-title">Objectifs</h2></div></div><div className="form-grid"><label className="form-field"><span>Objectif épargne de sécurité</span><input type="number" min="0" step="100" value={settings.emergencyTarget} onChange={(event) => saveSettings({ ...settings, emergencyTarget: Number(event.target.value) || 0 })} /></label><label className="form-field"><span>Horizon de projection</span><input type="number" min="1" max="60" value={settings.horizonYears} onChange={(event) => saveSettings({ ...settings, horizonYears: Math.max(1, Number(event.target.value) || 1) })} /></label></div></section> : null}

        <section id="overview" className="hero-card finance-hero" aria-labelledby="overview-title"><div><p className="eyebrow">Patrimoine total</p><h2 id="overview-title">{euro.format(netWorth)}</h2><p className="hero-copy">{euro.format(accountTotal)} sur les comptes + {euro.format(cashTotal)} en espèces.</p></div><div className="hero-stat"><strong>{euro.format(monthlyContribution)}</strong><span>versés chaque mois</span></div></section>

        <section className="metrics-grid" aria-label="Indicateurs principaux"><article className="metric-card"><span className="eyebrow">Comptes</span><strong>{accounts.length}</strong><p>comptes financiers suivis</p></article><article className="metric-card"><span className="eyebrow">Rendement pondéré</span><strong>{weightedReturn.toFixed(2)} %</strong><p>selon les taux renseignés</p></article><article className="metric-card"><span className="eyebrow">Épargne de sécurité</span><strong>{goalPercent} %</strong><p>{euro.format(savingsBalance)} sur {euro.format(settings.emergencyTarget)}</p></article></section>

        <section id="accounts" className="section-card" aria-labelledby="accounts-title"><div className="section-heading"><div><p className="eyebrow">Comptes</p><h2 id="accounts-title">Mes comptes</h2></div><Link className="secondary-link" href="/accounts/new">Ajouter</Link></div><div className="account-grid">{accounts.map((account) => <Link className="account-card account-card-link" href={`/accounts/${account.id}`} key={account.id}><div className="account-card-header"><span className="account-icon" aria-hidden="true">{account.name.slice(0, 1)}</span><span className="status-pill status-active">{(account.annualReturnPercent ?? 0).toFixed(1)} %</span></div><h3>{account.name}</h3><p>{account.institutionName}</p><dl><div><dt>Valeur</dt><dd>{euro.format(account.amount)}</dd></div><div><dt>Mensuel</dt><dd>{euro.format(account.monthlyContribution)}</dd></div><div><dt>Dans {settings.horizonYears} ans</dt><dd>{compactEuro.format(futureValue(account.amount, account.monthlyContribution, account.annualReturnPercent ?? 0, settings.horizonYears))}</dd></div></dl></Link>)}<a className="account-card account-card-link" href="#cash"><div className="account-card-header"><span className="account-icon" aria-hidden="true">€</span><span className="status-pill status-active">0 %</span></div><h3>Espèces</h3><p>Billets et pièces</p><dl><div><dt>Valeur</dt><dd>{euro.format(cashTotal)}</dd></div><div><dt>Billets</dt><dd>{euro.format(notesTotal)}</dd></div><div><dt>Pièces</dt><dd>{euro.format(coinsTotal)}</dd></div></dl></a></div></section>

        <section id="cash" className="section-card" aria-labelledby="cash-title"><div className="section-heading"><div><p className="eyebrow">Compte espèces</p><h2 id="cash-title">Billets et pièces</h2></div><strong className="cash-total">{euro.format(cashTotal)}</strong></div>{renderCashGroup("Billets", notes, notesTotal)}{renderCashGroup("Pièces", coins, coinsTotal)}</section>

        <div className="two-column-grid"><section id="allocation" className="section-card" aria-labelledby="allocation-title"><div className="section-heading"><div><p className="eyebrow">Répartition</p><h2 id="allocation-title">Allocation</h2></div></div>{allocation.length === 0 ? <p className="muted-copy">Ajoute un compte ou des espèces.</p> : <><div className="allocation-bar" role="img" aria-label={allocation.map((item) => `${item.label} ${Math.round(item.percent)} pour cent`).join(", ")}>{allocation.map((item, index) => <span className={`allocation-segment allocation-${index % 5}`} key={item.label} style={{ width: `${item.percent}%` }} />)}</div><ul className="legend-list">{allocation.map((item, index) => <li key={item.label}><span><span className={`legend-dot allocation-${index % 5}`} aria-hidden="true" />{item.label}</span><strong>{euro.format(item.amount)} · {Math.round(item.percent)} %</strong></li>)}</ul></>}</section><section className="section-card" aria-labelledby="goal-title"><div className="section-heading"><div><p className="eyebrow">Objectif</p><h2 id="goal-title">Épargne de sécurité</h2></div></div><div className="goal-amount"><strong>{euro.format(savingsBalance)}</strong><span>/ {euro.format(settings.emergencyTarget)}</span></div><progress value={Math.min(savingsBalance, settings.emergencyTarget)} max={Math.max(settings.emergencyTarget, 1)}>{goalPercent} %</progress></section></div>

        <section id="projection" className="section-card projection-card" aria-labelledby="projection-title"><div><p className="eyebrow">Projection par compte</p><h2 id="projection-title">Dans {settings.horizonYears} ans</h2><p className="muted-copy">Chaque compte utilise son propre rendement annuel. Les espèces restent à 0 %.</p></div><div className="projection-value"><strong>{compactEuro.format(projection)}</strong><span>capital estimé</span></div></section>
      </main>
    </div>
  );
}
