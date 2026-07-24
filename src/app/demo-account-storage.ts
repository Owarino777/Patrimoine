export const DEMO_ACCOUNTS_STORAGE_KEY = "patrimoine.demo.accounts.v1";

export type DemoAccount = Readonly<{
  id: string;
  name: string;
  accountType: string;
  institutionName: string;
  amount: number;
  monthlyContribution: number;
}>;

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

export function saveDemoAccount(account: DemoAccount): void {
  const accounts = readDemoAccounts();
  window.localStorage.setItem(DEMO_ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, account]));
}
