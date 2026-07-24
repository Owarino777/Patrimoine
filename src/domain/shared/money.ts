export type Currency = string & { readonly __brand: "Currency" };

export function currency(value: string): Currency {
  const normalized = value.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(normalized)) {
    throw new Error("Currency must use a three-letter ISO 4217 code.");
  }
  return normalized as Currency;
}

export class Money {
  private constructor(
    public readonly amountMinor: bigint,
    public readonly currency: Currency,
  ) {}

  static of(amountMinor: bigint, moneyCurrency: Currency): Money {
    return new Money(amountMinor, moneyCurrency);
  }

  static zero(moneyCurrency: Currency): Money {
    return new Money(0n, moneyCurrency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountMinor + other.amountMinor, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountMinor - other.amountMinor, this.currency);
  }

  isNegative(): boolean {
    return this.amountMinor < 0n;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error("Cannot calculate with different currencies.");
    }
  }
}
