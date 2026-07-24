export type DashboardAccount = Readonly<{
  id: string;
  name: string;
  type: string;
  institution: string;
  amount: number;
  monthlyContribution: number;
  status: "active" | "planned";
}>;

export const dashboardAccounts: readonly DashboardAccount[] = [
  {
    id: "livret-a",
    name: "Livret A",
    type: "Épargne de sécurité",
    institution: "À choisir",
    amount: 0,
    monthlyContribution: 50,
    status: "planned",
  },
  {
    id: "pea",
    name: "PEA",
    type: "Investissement long terme",
    institution: "À choisir",
    amount: 0,
    monthlyContribution: 50,
    status: "planned",
  },
  {
    id: "cto",
    name: "CTO",
    type: "Actifs non éligibles au PEA",
    institution: "Plus tard",
    amount: 0,
    monthlyContribution: 0,
    status: "planned",
  },
  {
    id: "per",
    name: "PER",
    type: "Retraite complémentaire",
    institution: "Plus tard",
    amount: 0,
    monthlyContribution: 0,
    status: "planned",
  },
  {
    id: "crypto",
    name: "Crypto",
    type: "Poche spéculative séparée",
    institution: "Portefeuille existant",
    amount: 0,
    monthlyContribution: 0,
    status: "active",
  },
];

export const monthlyPlan = [
  { label: "Vacances", amount: 100 },
  { label: "Livret A", amount: 50 },
  { label: "PEA", amount: 50 },
] as const;

export const nextActions = [
  "Choisir le courtier du PEA",
  "Ouvrir ou identifier le Livret A",
  "Renseigner la valeur actuelle des SOL",
  "Définir l’objectif d’épargne de sécurité",
] as const;
