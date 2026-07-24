import { describe, expect, it } from "vitest";
import { CreatePortfolio, PortfolioAlreadyExistsError } from "./create-portfolio";
import { InMemoryPortfolioRepository } from "../../infrastructure/portfolio/in-memory-portfolio-repository";

const command = {
  id: "11111111-1111-4111-8111-111111111111",
  userId: "user-1",
  name: "  Patrimoine   principal  ",
  description: "Objectifs long terme",
  baseCurrency: "eur",
} as const;

describe("CreatePortfolio", () => {
  it("creates and persists a normalized portfolio", async () => {
    const repository = new InMemoryPortfolioRepository();
    const now = new Date("2026-07-24T12:00:00.000Z");
    const useCase = new CreatePortfolio(repository, () => now);

    const portfolio = await useCase.execute(command);

    expect(portfolio.name).toBe("Patrimoine principal");
    expect(portfolio.baseCurrency).toBe("EUR");
    expect(portfolio.createdAt).toEqual(now);
    expect(repository.all()).toEqual([portfolio]);
  });

  it("rejects duplicate names for the same user", async () => {
    const repository = new InMemoryPortfolioRepository();
    const useCase = new CreatePortfolio(repository);

    await useCase.execute(command);

    await expect(
      useCase.execute({ ...command, id: "22222222-2222-4222-8222-222222222222", name: "patrimoine principal" }),
    ).rejects.toBeInstanceOf(PortfolioAlreadyExistsError);
  });

  it("allows the same name for another user", async () => {
    const repository = new InMemoryPortfolioRepository();
    const useCase = new CreatePortfolio(repository);

    await useCase.execute(command);
    await useCase.execute({
      ...command,
      id: "33333333-3333-4333-8333-333333333333",
      userId: "user-2",
    });

    expect(repository.all()).toHaveLength(2);
  });

  it("rejects an empty name", async () => {
    const useCase = new CreatePortfolio(new InMemoryPortfolioRepository());

    await expect(useCase.execute({ ...command, name: "   " })).rejects.toThrow("Portfolio name is required.");
  });
});
