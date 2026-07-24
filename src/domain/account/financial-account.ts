import type { PortfolioId } from "../portfolio/portfolio-id";
import { Money, type Currency } from "../shared/money";
import type { AccountId } from "./account-id";
import type { AccountName, InstitutionName } from "./account-name";

export const accountTypes = ["LIVRET_A", "LDDS", "PEA", "CTO", "PER", "CRYPTO_WALLET", "CASH", "OTHER"] as const;
export type AccountType = (typeof accountTypes)[number];

export type FinancialAccount = Readonly<{
  id: AccountId;
  portfolioId: PortfolioId;
  institutionName: InstitutionName;
  name: AccountName;
  accountType: AccountType;
  currency: Currency;
  cashBalance: Money;
  plannedMonthlyContribution: Money;
  createdAt: Date;
  updatedAt: Date;
}>;

export function financialAccount(input: Readonly<{
  id: AccountId;
  portfolioId: PortfolioId;
  institutionName: InstitutionName;
  name: AccountName;
  accountType: AccountType;
  currency: Currency;
  cashBalanceMinor?: bigint;
  plannedMonthlyContributionMinor?: bigint;
  now: Date;
}>): FinancialAccount {
  const cashBalance = Money.of(input.cashBalanceMinor ?? 0n, input.currency);
  const plannedMonthlyContribution = Money.of(input.plannedMonthlyContributionMinor ?? 0n, input.currency);

  if (cashBalance.isNegative() || plannedMonthlyContribution.isNegative()) {
    throw new Error("Account balances and contributions cannot be negative.");
  }

  return Object.freeze({
    id: input.id,
    portfolioId: input.portfolioId,
    institutionName: input.institutionName,
    name: input.name,
    accountType: input.accountType,
    currency: input.currency,
    cashBalance,
    plannedMonthlyContribution,
    createdAt: new Date(input.now),
    updatedAt: new Date(input.now),
  });
}
