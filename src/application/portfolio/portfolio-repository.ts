import type { Portfolio, UserId } from "../../domain/portfolio/portfolio";
import type { PortfolioName } from "../../domain/portfolio/portfolio-name";

export interface PortfolioRepository {
  existsByUserAndName(userId: UserId, name: PortfolioName): Promise<boolean>;
  save(portfolio: Portfolio): Promise<void>;
}
