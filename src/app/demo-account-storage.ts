export const DEMO_ACCOUNTS_STORAGE_KEY = "patrimoine.demo.accounts.v1";
export const DEMO_ACCOUNTS_CHANGED_EVENT = "patrimoine:accounts-changed";

export type DemoAccount = Readonly<{
  id: string;
  name: string;
  accountType: string;
  institutionName: string;
  amount: number;
  monthlyContribution: number;
  annualReturnPercent?: number;
}>;

function notifyAccountsChanged(): void {
  window.dispatchEvent(new Event(DEMO_ACCOUNTS_CHANGED_EVENT));
}

export function readDemoAccounts(): DemoAccount[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(DEMO_ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DemoAccount[]) : [];
  } catch {
    return [];
  }
}

export function findDemoAccount(id: string): DemoAccount | null {
  return readDemoAccounts().find((account) => account.id === id) ?? null;
}

export function saveDemoAccount(account: DemoAccount): void {
  const accounts = readDemoAccounts();
  window.localStorage.setItem(DEMO_ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, account]));
  notifyAccountsChanged();
}

export function updateDemoAccount(account: DemoAccount): void {
  const accounts = readDemoAccounts();
  const next = accounts.map((current) => current.id === account.id ? account : current);
  window.localStorage.setItem(DEMO_ACCOUNTS_STORAGE_KEY, JSON.stringify(next));
  notifyAccountsChanged();
}

export function deleteDemoAccount(id: string): void {
  const next = readDemoAccounts().filter((account) => account.id !== id);
  window.localStorage.setItem(DEMO_ACCOUNTS_STORAGE_KEY, JSON.stringify(next));
  notifyAccountsChanged();
}
