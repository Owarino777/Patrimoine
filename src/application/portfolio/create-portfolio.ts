import { currency } from "../../domain/shared/money";
import { createPortfolioEntity, type Portfolio, type UserId } from "../../domain/portfolio/portfolio";
import { portfolioId } from "../../domain/portfolio/portfolio-id";
import { portfolioName } from "../../domain/portfolio/portfolio-name";
import type { PortfolioRepository } from "./portfolio-repository";

export class PortfolioAlreadyExistsError extends Error {
  constructor() {
    super("A portfolio with this name already exists for this user.");
    this.name = "PortfolioAlreadyExistsError";
  }
}

export type CreatePortfolioCommand = Readonly<{
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  baseCurrency: string;
}>;

export class CreatePortfolio {
  constructor(
    private readonly repository: PortfolioRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async execute(command: CreatePortfolioCommand): Promise<Portfolio> {
    const name = portfolioName(command.name);
    const userId = command.userId.trim() as UserId;

    if (userId.length === 0) {
      throw new Error("User id is required.");
    }

    if (await this.repository.existsByUserAndName(userId, name)) {
      throw new PortfolioAlreadyExistsError();
    }

    const portfolio = createPortfolioEntity({
      id: portfolioId(command.id),
      userId,
      name,
      description: command.description,
      baseCurrency: currency(command.baseCurrency),
      now: this.now(),
    });

    await this.repository.save(portfolio);
    return portfolio;
  }
}
