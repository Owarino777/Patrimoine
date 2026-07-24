import type { PortfolioRepository } from "../../application/portfolio/portfolio-repository";
import type { Portfolio, UserId } from "../../domain/portfolio/portfolio";
import type { PortfolioName } from "../../domain/portfolio/portfolio-name";

export class InMemoryPortfolioRepository implements PortfolioRepository {
  private readonly portfolios: Portfolio[] = [];

  async existsByUserAndName(userId: UserId, name: PortfolioName): Promise<boolean> {
    return this.portfolios.some(
      (portfolio) => portfolio.userId === userId && portfolio.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async save(portfolio: Portfolio): Promise<void> {
    this.portfolios.push(portfolio);
  }

  all(): readonly Portfolio[] {
    return this.portfolios;
  }
}
