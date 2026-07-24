"use client";

import Link from "next/link";
import {
  Banknote,
  Coins,
  Landmark,
  LayoutDashboard,
  ListChecks,
  PiggyBank,
  PieChart,
  Plus,
  Settings,
  TrendingUp,
  WalletCards,
} from "lucide-react";
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
  maximumFractionDigits: 0,
});

const preciseEuro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
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
  expectedReturnPercent: number;
}>;

type CashCounts = Record<string, number>;

const defaultSettings: DashboardSettings = {
  emergencyTarget: 5000,
  horizonYears: 30,
  expectedReturnPercent: 6,
};

const banknotes = [500, 200, 100, 50, 20, 10, 5] as const;
const coins = [2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01] as const;
const denominations = [...banknotes, ...coins] as const;

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

function denominationLabel(denomination: number): string {
  return denomination >= 1 ? `${denomination} €` : `${Math.round(denomination * 100)} c`;
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
  const [cashOpen, setCashOpen] = useState(false);

  const banknotesTotal = banknotes.reduce((sum, denomination) => sum + denomination * (cashCounts[String(denomination)] ?? 0), 0);
  const coinsTotal = coins.reduce((sum, denomination) => sum + denomination * (cashCounts[String(denomination)] ?? 0), 0);
  const cashTotal = banknotesTotal + coinsTotal;
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

  const projection = futureValue(netWorth, monthlyContribution, settings.expectedReturnPercent, settings.horizonYears);
  const tasks = [
    accounts.length === 0 ? "Ajouter ton premier compte pour commencer le suivi." : null,
    savingsBalance < settings.emergencyTarget ? `Compléter l’épargne de sécurité : ${euro.format(Math.max(0, settings.emergencyTarget - savingsBalance))} restant.` : null,
    monthlyContribution === 0 ? "Renseigner les versements mensuels pour obtenir une projection fiable." : null,
    cashTotal === 0 ? "Renseigner les billets et pièces conservés chez toi." : null,
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

  function openCashCounter(): void {
    setCashOpen(true);
    window.requestAnimationFrame(() => document.getElementById("cash-counter")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <Link className="brand" href="/" aria-label="Patrimoine, accueil">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Patrimoine</span>
        </Link>
        <nav>
          <ul className="nav-list icon-nav-list">
            <li><a aria-current="page" href="#overview"><LayoutDashboard aria-hidden="true" size={19} /><span>Vue d’ensemble</span></a></li>
            <li><a href="#accounts"><WalletCards aria-hidden="true" size={19} /><span>Comptes</span></a></li>
            <li><a href="#cash-account"><Banknote aria-hidden="true" size={19} /><span>Compte espèces</span></a></li>
            <li><a href="#allocation"><PieChart aria-hidden="true" size={19} /><span>Répartition</span></a></li>
            <li><a href="#projection"><TrendingUp aria-hidden="true" size={19} /><span>Projection</span></a></li>
            <li><a href="#actions"><ListChecks aria-hidden="true" size={19} /><span>À faire</span></a></li>
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
            <button className="secondary-link icon-button" type="button" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen} aria-controls="dashboard-settings"><Settings aria-hidden="true" size={18} />Réglages</button>
            <button className="cash-header-button" type="button" onClick={openCashCounter}><Banknote aria-hidden="true" size={19} />Mes espèces</button>
            <Link className="primary-button icon-button" href="/accounts/new"><Plus aria-hidden="true" size={18} />Ajouter un compte</Link>
          </div>
        </header>

        {settingsOpen ? (
          <section id="dashboard-settings" className="section-card settings-panel" aria-labelledby="settings-title">
            <div className="section-heading"><div><p className="eyebrow">Personnalisation</p><h2 id="settings-title">Mes objectifs</h2></div></div>
            <div className="form-grid dashboard-settings-grid">
              <label className="form-field"><span>Objectif épargne de sécurité</span><input type="number" min="0" step="100" value={settings.emergencyTarget} onChange={(event) => saveSettings({ ...settings, emergencyTarget: Number(event.target.value) || 0 })} /></label>
              <label className="form-field"><span>Horizon d’investissement</span><input type="number" min="1" max="60" value={settings.horizonYears} onChange={(event) => saveSettings({ ...settings, horizonYears: Math.max(1, Number(event.target.value) || 1) })} /></label>
              <label className="form-field"><span>Rendement annuel estimé (%)</span><input type="number" min="0" max="20" step="0.1" value={settings.expectedReturnPercent} onChange={(event) => saveSettings({ ...settings, expectedReturnPercent: Math.max(0, Number(event.target.value) || 0) })} /></label>
            </div>
          </section>
        ) : null}

        <section id="overview" aria-labelledby="overview-title" className="hero-card finance-hero">
          <div><p className="eyebrow">Patrimoine net suivi</p><h2 id="overview-title">{euro.format(netWorth)}</h2><p className="hero-copy">Comptes bancaires, investissements et espèces réunis dans une vue unique.</p></div>
          <div className="hero-stat"><strong>{euro.format(monthlyContribution)}</strong><span>épargnés ou investis chaque mois</span></div>
        </section>

        <section id="cash-account" className="cash-action-card" aria-labelledby="cash-action-title">
          <div className="cash-action-icon" aria-hidden="true"><Banknote size={36} strokeWidth={1.8} /></div>
          <div className="cash-action-copy">
            <p className="eyebrow">Compte espèces</p>
            <h2 id="cash-action-title">Billets et pièces détenus chez toi</h2>
            <p>Indique combien tu possèdes de chaque coupure. Le total sera ajouté automatiquement à ton patrimoine général.</p>
          </div>
          <div className="cash-action-summary" aria-label={`Total espèces ${preciseEuro.format(cashTotal)}`}>
            <strong>{preciseEuro.format(cashTotal)}</strong>
            <span>{cashTotal > 0 ? "déjà inclus dans le patrimoine" : "aucune espèce renseignée"}</span>
          </div>
          <button className="cash-primary-button" type="button" onClick={() => setCashOpen((open) => !open)} aria-expanded={cashOpen} aria-controls="cash-counter">
            {cashOpen ? "Masquer le compteur" : "Ajouter mes billets et pièces"}
          </button>
        </section>

        {cashOpen ? (
          <section id="cash-counter" className="section-card cash-counter-card" aria-labelledby="cash-title">
            <div className="section-heading cash-counter-heading">
              <div><p className="eyebrow">Inventaire d’espèces</p><h2 id="cash-title">Compteur de billets et pièces</h2></div>
              <div className="cash-counter-totals">
                <span><Banknote aria-hidden="true" size={18} />Billets <strong>{preciseEuro.format(banknotesTotal)}</strong></span>
                <span><Coins aria-hidden="true" size={18} />Pièces <strong>{preciseEuro.format(coinsTotal)}</strong></span>
                <span className="cash-grand-total">Total <strong>{preciseEuro.format(cashTotal)}</strong></span>
              </div>
            </div>
            <div className="cash-groups">
              <section aria-labelledby="banknotes-title">
                <h3 id="banknotes-title"><Banknote aria-hidden="true" size={21} />Billets</h3>
                <div className="cash-grid">
                  {banknotes.map((denomination) => (
                    <label className="cash-field" key={denomination}>
                      <span>{denominationLabel(denomination)}</span>
                      <input aria-label={`Nombre de billets de ${denominationLabel(denomination)}`} type="number" inputMode="numeric" min="0" step="1" value={cashCounts[String(denomination)] ?? 0} onChange={(event) => updateCash(denomination, Number(event.target.value) || 0)} />
                      <strong>{preciseEuro.format(denomination * (cashCounts[String(denomination)] ?? 0))}</strong>
                    </label>
                  ))}
                </div>
              </section>
              <section aria-labelledby="coins-title">
                <h3 id="coins-title"><Coins aria-hidden="true" size={21} />Pièces</h3>
                <div className="cash-grid">
                  {coins.map((denomination) => (
                    <label className="cash-field" key={denomination}>
                      <span>{denominationLabel(denomination)}</span>
                      <input aria-label={`Nombre de pièces de ${denominationLabel(denomination)}`} type="number" inputMode="numeric" min="0" step="1" value={cashCounts[String(denomination)] ?? 0} onChange={(event) => updateCash(denomination, Number(event.target.value) || 0)} />
                      <strong>{preciseEuro.format(denomination * (cashCounts[String(denomination)] ?? 0))}</strong>
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </section>
        ) : null}

        <section className="metrics-grid" aria-label="Indicateurs principaux">
          <article className="metric-card metric-with-icon"><span className="metric-icon"><Landmark aria-hidden="true" size={22} /></span><div><span className="eyebrow">Comptes</span><strong>{accounts.length}</strong><p>{accounts.length === 0 ? "Aucun compte renseigné" : "enveloppes suivies"}</p></div></article>
          <article className="metric-card metric-with-icon"><span className="metric-icon"><PiggyBank aria-hidden="true" size={22} /></span><div><span className="eyebrow">Épargne de sécurité</span><strong>{goalPercent} %</strong><p>{euro.format(savingsBalance)} sur {euro.format(settings.emergencyTarget)}</p></div></article>
          <article className="metric-card metric-with-icon"><span className="metric-icon metric-icon-cash"><Banknote aria-hidden="true" size={22} /></span><div><span className="eyebrow">Espèces incluses</span><strong>{preciseEuro.format(cashTotal)}</strong><p>Billets {preciseEuro.format(banknotesTotal)} · Pièces {preciseEuro.format(coinsTotal)}</p></div></article>
        </section>

        <section id="accounts" aria-labelledby="accounts-title" className="section-card">
          <div className="section-heading"><div><p className="eyebrow">Comptes</p><h2 id="accounts-title">Mes enveloppes</h2></div><Link className="secondary-link icon-button" href="/accounts/new"><Plus aria-hidden="true" size={18} />Ajouter</Link></div>
          {accounts.length === 0 ? (
            <div className="empty-state"><h3>Commence par ajouter un compte</h3><p>Compte courant, Livret A, PEA, CTO, PER, crypto ou autre actif.</p><Link className="primary-button icon-button" href="/accounts/new"><Plus aria-hidden="true" size={18} />Ajouter mon premier compte</Link></div>
          ) : (
            <div className="account-grid">
              {accounts.map((account) => (
                <Link className="account-card account-card-link" href={`/accounts/${account.id}`} key={account.id}>
                  <div className="account-card-header"><span className="account-icon" aria-hidden="true"><WalletCards size={18} /></span><span className="status-pill status-active">Actif</span></div>
                  <h3>{account.name}</h3>
                  <p>{account.institutionName || normaliseType(account)}</p>
                  <dl><div><dt>Valeur</dt><dd>{euro.format(account.amount)}</dd></div><div><dt>Mensuel</dt><dd>{euro.format(account.monthlyContribution)}</dd></div></dl>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="two-column-grid">
          <section id="allocation" aria-labelledby="allocation-title" className="section-card">
            <div className="section-heading"><div><p className="eyebrow">Répartition actuelle</p><h2 id="allocation-title">Allocation</h2></div></div>
            {allocation.length === 0 ? <p className="muted-copy">Ajoute des comptes ou des espèces pour afficher la répartition.</p> : (
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
          <div><p className="eyebrow">Projection indicative</p><h2 id="projection-title">Dans {settings.horizonYears} ans</h2><p className="muted-copy">Avec {euro.format(monthlyContribution)} par mois et une hypothèse de {settings.expectedReturnPercent} % par an.</p></div>
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
