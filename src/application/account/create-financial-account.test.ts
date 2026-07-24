import { describe, expect, it } from "vitest";
import type { PortfolioId } from "../../domain/portfolio/portfolio-id";
import type { AccountName } from "../../domain/account/account-name";
import type { FinancialAccount } from "../../domain/account/financial-account";
import {
  CreateFinancialAccount,
  FinancialAccountAlreadyExistsError,
  PortfolioNotFoundError,
} from "./create-financial-account";
import type { FinancialAccountRepository, PortfolioExistenceChecker } from "./financial-account-repository";

class MemoryAccountRepository implements FinancialAccountRepository {
  readonly accounts: FinancialAccount[] = [];

  async existsByPortfolioAndName(portfolioId: PortfolioId, name: AccountName): Promise<boolean> {
    return this.accounts.some((account) => account.portfolioId === portfolioId && account.name === name);
  }

  async save(account: FinancialAccount): Promise<void> {
    this.accounts.push(account);
  }
}

class MemoryPortfolioChecker implements PortfolioExistenceChecker {
  constructor(private readonly available: boolean) {}
  async exists(): Promise<boolean> {
    return this.available;
  }
}

const baseCommand = {
  id: "6fd9a40f-93c7-4e2e-a3e8-4979a34ae910",
  portfolioId: "97f871db-7791-46ce-bd18-b754a95b02df",
  institutionName: "Banque Exemple",
  name: "Livret A",
  accountType: "LIVRET_A",
  currency: "EUR",
  cashBalanceMinor: 15_000n,
  plannedMonthlyContributionMinor: 5_000n,
} as const;

describe("CreateFinancialAccount", () => {
  it("creates a financial account with deterministic values", async () => {
    const repository = new MemoryAccountRepository();
    const useCase = new CreateFinancialAccount(
      repository,
      new MemoryPortfolioChecker(true),
      () => new Date("2026-10-01T08:00:00.000Z"),
    );

    const account = await useCase.execute(baseCommand);

    expect(account.name).toBe("Livret A");
    expect(account.cashBalance.amountMinor).toBe(15_000n);
    expect(account.plannedMonthlyContribution.amountMinor).toBe(5_000n);
    expect(repository.accounts).toHaveLength(1);
  });

  it("rejects an unknown portfolio", async () => {
    const useCase = new CreateFinancialAccount(
      new MemoryAccountRepository(),
      new MemoryPortfolioChecker(false),
    );

    await expect(useCase.execute(baseCommand)).rejects.toBeInstanceOf(PortfolioNotFoundError);
  });

  it("rejects a duplicate account name inside the same portfolio", async () => {
    const repository = new MemoryAccountRepository();
    const useCase = new CreateFinancialAccount(repository, new MemoryPortfolioChecker(true));

    await useCase.execute(baseCommand);
    await expect(
      useCase.execute({ ...baseCommand, id: "b053ec6f-8a7f-4d30-8df5-f1e89157145b", name: "  Livret   A  " }),
    ).rejects.toBeInstanceOf(FinancialAccountAlreadyExistsError);
  });

  it("rejects negative amounts", async () => {
    const useCase = new CreateFinancialAccount(
      new MemoryAccountRepository(),
      new MemoryPortfolioChecker(true),
    );

    await expect(useCase.execute({ ...baseCommand, cashBalanceMinor: -1n })).rejects.toThrow(
      "Account balances and contributions cannot be negative.",
    );
  });
});
