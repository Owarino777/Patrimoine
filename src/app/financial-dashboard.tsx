"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  DEMO_ACCOUNTS_CHANGED_EVENT,
  DEMO_ACCOUNTS_STORAGE_KEY,
  type DemoAccount,
} from "./demo-account-storage";

const SETTINGS_KEY = "patrimoine.dashboard.settings.v1";
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

const denominations = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01] as const;
const notes = denominations.filter((value) => value >= 5);
const coins = denominations.filter((value) => value < 5);

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
  if (value.includes("pea") || value.includes("cto") || value.includes("bourse")) return "Investissements";
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

export function FinancialDashboard() {
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
  const [cashOpen, setCashOpen] = useState(true);

  const denominationTotal = (values: readonly number[]) => values.reduce(
    (sum, denomination) => sum + denomination * (cashCounts[String(denomination)] ?? 0),
    0,
  );
  const notesTotal = denominationTotal(notes);
  const coinsTotal = denominationTotal(coins);
  const cashTotal = notesTotal + coinsTotal;
  const accountTotal = accounts.reduce((sum, account) => sum + account.amount, 0);
  const netWorth = accountTotal + cashTotal;
  const monthlyContribution = accounts.reduce((sum, account) => sum + account.monthlyContribution, 0);
  const savingsBalance = accounts
    .filter((account) => normaliseType(account) === "Épargne")
    .reduce((sum, account) => sum + account.amount, 0);
  const goalPercent = settings.emergencyTarget > 0 ? Math.min(100, Math.round((savingsBalance / settings.emergencyTarget) * 100)) : 0;

  const allocation = useMemo(() => {
    const values = new Map<string, number>();
    for (const account of accounts) {
      const key = normaliseType(account);
      values.set(key, (values.get(key) ?? 0) + account.amount);
    }
    if (cashTotal > 0) values.set("Espèces", cashTotal);
    return [...values.entries()]
      .map(([label, amount]) => ({ label, amount, percent: netWorth > 0 ? (amount / netWorth) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);
  }, [accounts, cashTotal, netWorth]);

  const projection = accounts.reduce(
    (sum, account) => sum + futureValue(
      account.amount,
      account.monthlyContribution,
      account.annualReturnPercent ?? 0,
      settings.horizonYears,
    ),
    cashTotal,
  );

  const tasks = [
    accounts.length === 0 ? "Ajouter ton premier compte pour commencer le suivi." : null,
    savingsBalance < settings.emergencyTarget ? `Compléter l’épargne de sécurité : ${euro.format(Math.max(0, settings.emergencyTarget - savingsBalance))} restant.` : null,
    monthlyContribution === 0 ? "Renseigner les versements mensuels pour obtenir une projection fiable." : null,
    cashTotal === 0 ? "Compter les espèces détenues pour avoir un patrimoine complet." : null,
  ].filter((task): task is string => task !== null);

  function saveSettings(next: DashboardSettings): void {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }

  function updateCash(denomination: number, count: number): void {
    const next = { ...cashCounts, [String(denomination)]: Math.max(0, Math.floor(count)) };
    window.localStorage.setItem(CASH_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }

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
            <li><a className="cash-nav-link" href="#cash-account">💶 Compte espèces</a></li>
            <li><a href="#accounts">Comptes</a></li>
            <li><a href="#allocation">Répartition</a></li>
            <li><a href="#projection">Projection</a></li>
            <li><a href="#actions">À faire</a></li>
          </ul>
        </nav>
        <div className="sidebar-note">
          <span className="eyebrow">Mode local</span>
          <p>Les données restent dans ce navigateur en attendant la synchronisation sécurisée.</p>
        </div>
      </aside>

      <main id="main-content" className="dashboard" tabIndex={-1}>
        <header className="topbar">
          <div><p className="eyebrow">Tableau de bord</p><h1>Mes finances</h1></div>
          <div className="topbar-actions">
            <a className="cash-quick-button" href="#cash-account">💶 Compter mes espèces</a>
            <button className="secondary-link" type="button" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen} aria-controls="dashboard-settings">Réglages</button>
            <Link className="primary-button" href="/accounts/new">Ajouter un compte</Link>
          </div>
        </header>

        {settingsOpen ? (
          <section id="dashboard-settings" className="section-card settings-panel" aria-labelledby="settings-title">
            <div className="section-heading"><div><p className="eyebrow">Personnalisation</p><h2 id="settings-title">Mes objectifs</h2></div></div>
            <div className="form-grid dashboard-settings-grid">
              <label className="form-field"><span>Objectif épargne de sécurité</span><input type="number" min="0" step="100" value={settings.emergencyTarget} onChange={(event) => saveSettings({ ...settings, emergencyTarget: Number(event.target.value) || 0 })} /></label>
              <label className="form-field"><span>Horizon d’investissement</span><input type="number" min="1" max="60" value={settings.horizonYears} onChange={(event) => saveSettings({ ...settings, horizonYears: Math.max(1, Number(event.target.value) || 1) })} /></label>
            </div>
          </section>
        ) : null}

        <section id="overview" aria-labelledby="overview-title" className="hero-card finance-hero">
          <div><p className="eyebrow">Patrimoine net suivi</p><h2 id="overview-title">{euro.format(netWorth)}</h2><p className="hero-copy">{euro.format(accountTotal)} sur les comptes + {euro.format(cashTotal)} en espèces.</p></div>
          <div className="hero-stat"><strong>{euro.format(monthlyContribution)}</strong><span>épargnés ou investis chaque mois</span></div>
        </section>

        <section id="cash-account" className="cash-spotlight" aria-labelledby="cash-spotlight-title">
          <div className="cash-spotlight-main">
            <div className="cash-icon" aria-hidden="true">💶</div>
            <div>
              <p className="eyebrow">Compte dédié</p>
              <h2 id="cash-spotlight-title">Mes espèces</h2>
              <p>Renseigne le nombre de billets et de pièces. Le total est ajouté automatiquement au patrimoine général.</p>
            </div>
          </div>
          <div className="cash-spotlight-totals" aria-label="Résumé des espèces">
            <div><span>Billets</span><strong>{euro.format(notesTotal)}</strong></div>
            <div><span>Pièces</span><strong>{euro.format(coinsTotal)}</strong></div>
            <div className="cash-grand-total"><span>Total espèces</span><strong>{euro.format(cashTotal)}</strong></div>
          </div>
          <button className="cash-main-button" type="button" onClick={() => setCashOpen((open) => !open)} aria-expanded={cashOpen} aria-controls="cash-counter">
            {cashOpen ? "Masquer le compteur" : "Ouvrir le compteur billets et pièces"}
          </button>
        </section>

        {cashOpen ? (
          <section id="cash-counter" className="section-card cash-counter-panel" aria-labelledby="cash-title">
            <div className="section-heading"><div><p className="eyebrow">Saisie détaillée</p><h2 id="cash-title">Compteur de billets et pièces</h2></div><strong className="cash-total">{euro.format(cashTotal)}</strong></div>
            <div className="cash-grid">
              {denominations.map((denomination) => (
                <label className="cash-field" key={denomination}>
                  <span>{denomination >= 1 ? `${denomination} €` : `${Math.round(denomination * 100)} c`}</span>
                  <input aria-label={`Nombre de ${denomination >= 1 ? `${denomination} euros` : `${Math.round(denomination * 100)} centimes`}`} type="number" inputMode="numeric" min="0" step="1" value={cashCounts[String(denomination)] ?? 0} onChange={(event) => updateCash(denomination, Number(event.target.value) || 0)} />
                  <strong>{euro.format(denomination * (cashCounts[String(denomination)] ?? 0))}</strong>
                </label>
              ))}
            </div>
          </section>
        ) : null}

        <section className="metrics-grid" aria-label="Indicateurs principaux">
          <article className="metric-card"><span className="eyebrow">Comptes</span><strong>{accounts.length}</strong><p>{accounts.length === 0 ? "Aucun compte renseigné" : "enveloppes suivies"}</p></article>
          <article className="metric-card"><span className="eyebrow">Épargne de sécurité</span><strong>{goalPercent} %</strong><p>{euro.format(savingsBalance)} sur {euro.format(settings.emergencyTarget)}</p></article>
          <article className="metric-card cash-metric-card"><span className="eyebrow">Espèces incluses</span><strong>{euro.format(cashTotal)}</strong><p>Déjà ajoutées au total général</p></article>
        </section>

        <section id="accounts" aria-labelledby="accounts-title" className="section-card">
          <div className="section-heading"><div><p className="eyebrow">Comptes</p><h2 id="accounts-title">Mes enveloppes</h2></div><Link className="secondary-link" href="/accounts/new">Ajouter</Link></div>
          {accounts.length === 0 ? (
            <div className="empty-state"><h3>Commence par ajouter un compte</h3><p>Compte courant, Livret A, PEA, CTO, PER, crypto ou autre actif.</p><Link className="primary-button" href="/accounts/new">Ajouter mon premier compte</Link></div>
          ) : (
            <div className="account-grid">
              {accounts.map((account) => (
                <Link className="account-card account-card-link" href={`/accounts/${account.id}`} key={account.id}>
                  <div className="account-card-header"><span className="account-icon" aria-hidden="true">{account.name.slice(0, 1)}</span><span className="status-pill status-active">Actif</span></div>
                  <h3>{account.name}</h3>
                  <p>{account.institutionName || normaliseType(account)}</p>
                  <dl>
                    <div><dt>Valeur</dt><dd>{euro.format(account.amount)}</dd></div>
                    <div><dt>Mensuel</dt><dd>{euro.format(account.monthlyContribution)}</dd></div>
                    <div><dt>Rendement</dt><dd>{account.annualReturnPercent ?? 0} % / an</dd></div>
                  </dl>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="two-column-grid">
          <section id="allocation" aria-labelledby="allocation-title" className="section-card">
            <div className="section-heading"><div><p className="eyebrow">Répartition actuelle</p><h2 id="allocation-title">Allocation</h2></div></div>
            {allocation.length === 0 ? <p className="muted-copy">Ajoute des comptes pour afficher la répartition.</p> : (
              <>
                <div className="allocation-bar" role="img" aria-label={allocation.map((item) => `${item.label} ${Math.round(item.percent)} pour cent`).join(", ")}>
                  {allocation.map((item, index) => <span className={`allocation-segment allocation-${index % 5}`} key={item.label} style={{ width: `${item.percent}%` }} />)}
                </div>
                <ul className="legend-list">{allocation.map((item, index) => <li key={item.label}><span><span className={`legend-dot allocation-${index % 5}`} aria-hidden="true" />{item.label}</span><strong>{euro.format(item.amount)} · {Math.round(item.percent)} %</strong></li>)}</ul>
              </>
            )}
          </section>

          <section aria-labelledby="goal-title" className="section-card">
            <div className="section-heading"><div><p className="eyebrow">Objectif prioritaire</p><h2 id="goal-title">Épargne de sécurité</h2></div></div>
            <div className="goal-amount"><strong>{euro.format(savingsBalance)}</strong><span>/ {euro.format(settings.emergencyTarget)}</span></div>
            <progress value={Math.min(savingsBalance, settings.emergencyTarget)} max={Math.max(settings.emergencyTarget, 1)}>{goalPercent} %</progress>
            <p className="muted-copy">{goalPercent >= 100 ? "Objectif atteint. Pense à le reconstituer après utilisation." : `${euro.format(Math.max(0, settings.emergencyTarget - savingsBalance))} restent à constituer.`}</p>
          </section>
        </div>

        <section id="projection" aria-labelledby="projection-title" className="section-card projection-card">
          <div><p className="eyebrow">Projection indicative</p><h2 id="projection-title">Dans {settings.horizonYears} ans</h2><p className="muted-copy">Chaque compte utilise son propre rendement annuel. Les espèces restent à 0 %.</p></div>
          <div className="projection-value"><strong>{compactEuro.format(projection)}</strong><span>capital estimé</span></div>
        </section>

        <section id="actions" aria-labelledby="actions-title" className="section-card">
          <div className="section-heading"><div><p className="eyebrow">Priorités automatiques</p><h2 id="actions-title">À faire</h2></div></div>
          {tasks.length === 0 ? <p className="success-message">Les informations essentielles sont renseignées.</p> : <ol className="action-list">{tasks.map((task, index) => <li key={task}><span aria-hidden="true">{index + 1}</span><p>{task}</p>{index === 0 && accounts.length === 0 ? <Link href="/accounts/new">Ouvrir</Link> : null}</li>)}</ol>}
        </section>
      </main>
    </div>
  );
}
