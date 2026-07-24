export type AccountId = string & { readonly __brand: "AccountId" };

export function accountId(value: string): AccountId {
  const normalized = value.trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized)) {
    throw new Error("Account id must be a valid UUID.");
  }
  return normalized as AccountId;
}
