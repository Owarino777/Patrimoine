export type PortfolioName = string & { readonly __brand: "PortfolioName" };

export function portfolioName(value: string): PortfolioName {
  const normalized = value.trim().replace(/\s+/g, " ");

  if (normalized.length === 0) {
    throw new Error("Portfolio name is required.");
  }

  if (normalized.length > 120) {
    throw new Error("Portfolio name must contain at most 120 characters.");
  }

  return normalized as PortfolioName;
}
