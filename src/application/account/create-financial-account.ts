import { accountId } from "../../domain/account/account-id";
import { accountName, institutionName } from "../../domain/account/account-name";
import { accountTypes, financialAccount, type AccountType, type FinancialAccount } from "../../domain/account/financial-account";
import { portfolioId } from "../../domain/portfolio/portfolio-id";
import { currency } from "../../domain/shared/money";
import type { FinancialAccountRepository, PortfolioExistenceChecker } from "./financial-account-repository";

export class PortfolioNotFoundError extends Error {
  constructor() {
    super("The selected portfolio does not exist.");
    this.name = "PortfolioNotFoundError";
  }
}

export class FinancialAccountAlreadyExistsError extends Error {
  constructor() {
    super("An account with this name already exists in this portfolio.");
    this.name = "FinancialAccountAlreadyExistsError";
  }
}

export type CreateFinancialAccountCommand = Readonly<{
  id: string;
  portfolioId: string;
  institutionName: string;
  name: string;
  accountType: string;
  currency: string;
  cashBalanceMinor?: bigint;
  plannedMonthlyContributionMinor?: bigint;
}>;

function parseAccountType(value: string): AccountType {
  if (!accountTypes.includes(value as AccountType)) {
    throw new Error("Unsupported account type.");
  }
  return value as AccountType;
}

export class CreateFinancialAccount {
  constructor(
    private readonly repository: FinancialAccountRepository,
    private readonly portfolioChecker: PortfolioExistenceChecker,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async execute(command: CreateFinancialAccountCommand): Promise<FinancialAccount> {
    const targetPortfolioId = portfolioId(command.portfolioId);
    const normalizedName = accountName(command.name);

    if (!(await this.portfolioChecker.exists(targetPortfolioId))) {
      throw new PortfolioNotFoundError();
    }

    if (await this.repository.existsByPortfolioAndName(targetPortfolioId, normalizedName)) {
      throw new FinancialAccountAlreadyExistsError();
    }

    const account = financialAccount({
      id: accountId(command.id),
      portfolioId: targetPortfolioId,
      institutionName: institutionName(command.institutionName),
      name: normalizedName,
      accountType: parseAccountType(command.accountType),
      currency: currency(command.currency),
      ...(command.cashBalanceMinor !== undefined ? { cashBalanceMinor: command.cashBalanceMinor } : {}),
      ...(command.plannedMonthlyContributionMinor !== undefined
        ? { plannedMonthlyContributionMinor: command.plannedMonthlyContributionMinor }
        : {}),
      now: this.now(),
    });

    await this.repository.save(account);
    return account;
  }
}
