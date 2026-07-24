import type { PortfolioId } from "../../domain/portfolio/portfolio-id";
import type { AccountName } from "../../domain/account/account-name";
import type { FinancialAccount } from "../../domain/account/financial-account";

export interface FinancialAccountRepository {
  existsByPortfolioAndName(portfolioId: PortfolioId, name: AccountName): Promise<boolean>;
  save(account: FinancialAccount): Promise<void>;
}

export interface PortfolioExistenceChecker {
  exists(portfolioId: PortfolioId): Promise<boolean>;
}
