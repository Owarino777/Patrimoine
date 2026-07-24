# Modèle de données conceptuel

## Tables MVP

- users
- portfolios
- financial_accounts
- assets
- positions
- transactions
- allocation_targets
- projection_scenarios
- investment_decisions
- decision_sources
- audit_logs

## Relations principales

```text
User 1---n Portfolio
Portfolio 1---n FinancialAccount
FinancialAccount 1---n Position
Asset 1---n Position
FinancialAccount 1---n Transaction
Portfolio 1---n AllocationTarget
Portfolio 1---n ProjectionScenario
Portfolio 1---n InvestmentDecision
InvestmentDecision 1---n DecisionSource
```

## Contraintes

- toutes les lignes métier appartiennent à un portefeuille ;
- toutes les positions appartiennent à un compte ;
- tout compte appartient à un portefeuille ;
- les montants ont une devise ;
- les quantités sont positives ou nulles selon le contexte ;
- les suppressions critiques sont auditées ;
- les identifiants techniques sont distincts des identifiants d’actifs.

## Types de compte

- LIVRET_A
- LDDS
- PEA
- CTO
- PER
- CRYPTO_WALLET
- CASH
- OTHER

## Classes d’actifs

- CASH
- EQUITY
- ETF
- BOND
- FUND
- CRYPTO
- COMMODITY
- REAL_ESTATE
- OTHER
