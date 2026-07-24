export type PortfolioId = string & { readonly __brand: "PortfolioId" };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function portfolioId(value: string): PortfolioId {
  const normalized = value.trim().toLowerCase();

  if (!UUID_PATTERN.test(normalized)) {
    throw new Error("Portfolio id must be a valid UUID.");
  }

  return normalized as PortfolioId;
}
