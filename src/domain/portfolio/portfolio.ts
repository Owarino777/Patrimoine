import type { Currency } from "../shared/money";
import type { PortfolioId } from "./portfolio-id";
import type { PortfolioName } from "./portfolio-name";

export type UserId = string & { readonly __brand: "UserId" };

export type Portfolio = Readonly<{
  id: PortfolioId;
  userId: UserId;
  name: PortfolioName;
  description: string | null;
  baseCurrency: Currency;
  createdAt: Date;
  updatedAt: Date;
}>;

export type CreatePortfolioProps = Readonly<{
  id: PortfolioId;
  userId: UserId;
  name: PortfolioName;
  description?: string | null;
  baseCurrency: Currency;
  now: Date;
}>;

export function createPortfolioEntity(props: CreatePortfolioProps): Portfolio {
  const description = props.description?.trim() || null;

  if (description !== null && description.length > 1_000) {
    throw new Error("Portfolio description must contain at most 1000 characters.");
  }

  return Object.freeze({
    id: props.id,
    userId: props.userId,
    name: props.name,
    description,
    baseCurrency: props.baseCurrency,
    createdAt: new Date(props.now),
    updatedAt: new Date(props.now),
  });
}
