import { describe, expect, it } from "vitest";
import { Money, currency } from "./money";

describe("Money", () => {
  it("adds amounts in the same currency", () => {
    const eur = currency("eur");
    expect(Money.of(1_000n, eur).add(Money.of(250n, eur)).amountMinor).toBe(1_250n);
  });

  it("rejects calculations across currencies", () => {
    expect(() => Money.of(100n, currency("EUR")).add(Money.of(100n, currency("USD")))).toThrow(
      "Cannot calculate with different currencies.",
    );
  });

  it("rejects malformed currency codes", () => {
    expect(() => currency("euro")).toThrow("Currency must use a three-letter ISO 4217 code.");
  });
});
