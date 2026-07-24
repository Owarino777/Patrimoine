export type AccountName = string & { readonly __brand: "AccountName" };

export function accountName(value: string): AccountName {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length === 0) {
    throw new Error("Account name is required.");
  }
  if (normalized.length > 120) {
    throw new Error("Account name must not exceed 120 characters.");
  }
  return normalized as AccountName;
}

export type InstitutionName = string & { readonly __brand: "InstitutionName" };

export function institutionName(value: string): InstitutionName {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length === 0) {
    throw new Error("Institution name is required.");
  }
  if (normalized.length > 160) {
    throw new Error("Institution name must not exceed 160 characters.");
  }
  return normalized as InstitutionName;
}
