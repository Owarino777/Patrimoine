begin;

create extension if not exists pgcrypto;

create schema if not exists private;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_currency char(3) not null default 'EUR',
  timezone text not null default 'Europe/Paris',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_currency_format check (preferred_currency ~ '^[A-Z]{3}$'),
  constraint profiles_display_name_length check (display_name is null or char_length(display_name) between 1 and 100)
);

create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  name text not null,
  description text,
  base_currency char(3) not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolios_name_length check (char_length(name) between 1 and 120),
  constraint portfolios_description_length check (description is null or char_length(description) <= 1000),
  constraint portfolios_currency_format check (base_currency ~ '^[A-Z]{3}$'),
  constraint portfolios_user_name_unique unique (user_id, name)
);

create table public.financial_accounts (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  institution_name text not null,
  name text not null,
  account_type text not null,
  currency char(3) not null default 'EUR',
  cash_balance_minor bigint not null default 0,
  planned_monthly_contribution_minor bigint not null default 0,
  objective text,
  horizon_years smallint,
  opened_at date,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint financial_accounts_type check (account_type in ('LIVRET_A','LDDS','PEA','CTO','PER','CRYPTO_WALLET','CASH','OTHER')),
  constraint financial_accounts_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint financial_accounts_cash_nonnegative check (cash_balance_minor >= 0),
  constraint financial_accounts_contribution_nonnegative check (planned_monthly_contribution_minor >= 0),
  constraint financial_accounts_horizon check (horizon_years is null or horizon_years between 0 and 100),
  constraint financial_accounts_name_length check (char_length(name) between 1 and 120),
  constraint financial_accounts_institution_length check (char_length(institution_name) between 1 and 160),
  constraint financial_accounts_objective_length check (objective is null or char_length(objective) <= 1000),
  constraint financial_accounts_portfolio_name_unique unique (portfolio_id, name)
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.profiles(user_id) on delete cascade,
  identifier_type text not null,
  identifier text not null,
  name text not null,
  asset_class text not null,
  currency char(3) not null,
  country_code char(2),
  sector text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assets_identifier_type check (identifier_type in ('ISIN','TICKER','CRYPTO_SYMBOL','CUSTOM')),
  constraint assets_asset_class check (asset_class in ('CASH','EQUITY','ETF','BOND','FUND','CRYPTO','COMMODITY','REAL_ESTATE','OTHER')),
  constraint assets_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint assets_country_format check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  constraint assets_identifier_length check (char_length(identifier) between 1 and 64),
  constraint assets_name_length check (char_length(name) between 1 and 200),
  constraint assets_owner_identifier_unique unique nulls not distinct (owner_user_id, identifier_type, identifier)
);

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  financial_account_id uuid not null references public.financial_accounts(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete restrict,
  quantity numeric(38,18) not null,
  average_unit_cost_minor bigint,
  current_unit_price_minor bigint,
  price_currency char(3) not null,
  risk_level text,
  holding_objective text,
  valued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint positions_quantity_nonnegative check (quantity >= 0),
  constraint positions_average_cost_nonnegative check (average_unit_cost_minor is null or average_unit_cost_minor >= 0),
  constraint positions_current_price_nonnegative check (current_unit_price_minor is null or current_unit_price_minor >= 0),
  constraint positions_currency_format check (price_currency ~ '^[A-Z]{3}$'),
  constraint positions_risk_level check (risk_level is null or risk_level in ('LOW','MEDIUM','HIGH','SPECULATIVE')),
  constraint positions_objective_length check (holding_objective is null or char_length(holding_objective) <= 1000),
  constraint positions_account_asset_unique unique (financial_account_id, asset_id)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  financial_account_id uuid not null references public.financial_accounts(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete restrict,
  transaction_type text not null,
  quantity numeric(38,18),
  unit_price_minor bigint,
  gross_amount_minor bigint not null,
  fees_minor bigint not null default 0,
  currency char(3) not null,
  occurred_at timestamptz not null,
  note text,
  idempotency_key text,
  created_at timestamptz not null default now(),
  constraint transactions_type check (transaction_type in ('DEPOSIT','WITHDRAWAL','BUY','SELL','DIVIDEND','INTEREST','FEE','TRANSFER_IN','TRANSFER_OUT','ADJUSTMENT')),
  constraint transactions_quantity_nonnegative check (quantity is null or quantity >= 0),
  constraint transactions_unit_price_nonnegative check (unit_price_minor is null or unit_price_minor >= 0),
  constraint transactions_fees_nonnegative check (fees_minor >= 0),
  constraint transactions_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint transactions_note_length check (note is null or char_length(note) <= 2000),
  constraint transactions_trade_fields check (
    (transaction_type in ('BUY','SELL') and asset_id is not null and quantity is not null and unit_price_minor is not null)
    or transaction_type not in ('BUY','SELL')
  ),
  constraint transactions_idempotency_unique unique nulls not distinct (portfolio_id, idempotency_key)
);

create table public.allocation_targets (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  dimension text not null,
  target_key text not null,
  target_basis_points integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint allocation_targets_dimension check (dimension in ('ASSET_CLASS','ACCOUNT_TYPE','COUNTRY','SECTOR')),
  constraint allocation_targets_basis_points check (target_basis_points between 0 and 10000),
  constraint allocation_targets_key_length check (char_length(target_key) between 1 and 100),
  constraint allocation_targets_unique unique (portfolio_id, dimension, target_key)
);

create table public.projection_scenarios (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  name text not null,
  initial_capital_minor bigint not null,
  monthly_contribution_minor bigint not null,
  horizon_years smallint not null,
  annual_return_basis_points integer not null,
  annual_inflation_basis_points integer not null default 0,
  annual_fees_basis_points integer not null default 0,
  currency char(3) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projection_scenarios_name_length check (char_length(name) between 1 and 120),
  constraint projection_scenarios_initial_nonnegative check (initial_capital_minor >= 0),
  constraint projection_scenarios_contribution_nonnegative check (monthly_contribution_minor >= 0),
  constraint projection_scenarios_horizon check (horizon_years between 1 and 80),
  constraint projection_scenarios_return check (annual_return_basis_points between -10000 and 50000),
  constraint projection_scenarios_inflation check (annual_inflation_basis_points between -1000 and 10000),
  constraint projection_scenarios_fees check (annual_fees_basis_points between 0 and 10000),
  constraint projection_scenarios_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint projection_scenarios_unique unique (portfolio_id, name)
);

create table public.investment_decisions (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  title text not null,
  considered_action text not null,
  rationale text not null,
  final_decision text,
  status text not null default 'DRAFT',
  decided_at timestamptz,
  review_at date,
  observed_result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint investment_decisions_action check (considered_action in ('HOLD','BUY','SELL','REDUCE','INCREASE','REBALANCE','PAUSE_CONTRIBUTIONS','OTHER')),
  constraint investment_decisions_status check (status in ('DRAFT','DECIDED','REVIEWED','ARCHIVED')),
  constraint investment_decisions_title_length check (char_length(title) between 1 and 200),
  constraint investment_decisions_rationale_length check (char_length(rationale) between 1 and 10000),
  constraint investment_decisions_final_length check (final_decision is null or char_length(final_decision) <= 5000),
  constraint investment_decisions_result_length check (observed_result is null or char_length(observed_result) <= 5000)
);

create table public.decision_sources (
  id uuid primary key default gen_random_uuid(),
  investment_decision_id uuid not null references public.investment_decisions(id) on delete cascade,
  title text not null,
  source_url text not null,
  publisher text,
  published_at timestamptz,
  accessed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint decision_sources_title_length check (char_length(title) between 1 and 300),
  constraint decision_sources_url_length check (char_length(source_url) between 1 and 2048),
  constraint decision_sources_publisher_length check (publisher is null or char_length(publisher) <= 200),
  constraint decision_sources_unique unique (investment_decision_id, source_url)
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid,
  portfolio_id uuid,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  occurred_at timestamptz not null default now(),
  constraint audit_logs_action check (action in ('INSERT','UPDATE','DELETE')),
  constraint audit_logs_entity_type_length check (char_length(entity_type) between 1 and 100)
);

create index portfolios_user_id_idx on public.portfolios(user_id);
create index financial_accounts_portfolio_id_idx on public.financial_accounts(portfolio_id);
create index financial_accounts_type_idx on public.financial_accounts(account_type);
create index assets_owner_user_id_idx on public.assets(owner_user_id);
create index assets_identifier_idx on public.assets(identifier_type, identifier);
create index positions_portfolio_id_idx on public.positions(portfolio_id);
create index positions_account_id_idx on public.positions(financial_account_id);
create index positions_asset_id_idx on public.positions(asset_id);
create index transactions_portfolio_occurred_idx on public.transactions(portfolio_id, occurred_at desc);
create index transactions_account_occurred_idx on public.transactions(financial_account_id, occurred_at desc);
create index allocation_targets_portfolio_idx on public.allocation_targets(portfolio_id);
create index projection_scenarios_portfolio_idx on public.projection_scenarios(portfolio_id);
create index investment_decisions_portfolio_created_idx on public.investment_decisions(portfolio_id, created_at desc);
create index decision_sources_decision_idx on public.decision_sources(investment_decision_id);
create index audit_logs_portfolio_occurred_idx on public.audit_logs(portfolio_id, occurred_at desc);
create index audit_logs_user_occurred_idx on public.audit_logs(user_id, occurred_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger portfolios_set_updated_at before update on public.portfolios for each row execute function private.set_updated_at();
create trigger financial_accounts_set_updated_at before update on public.financial_accounts for each row execute function private.set_updated_at();
create trigger assets_set_updated_at before update on public.assets for each row execute function private.set_updated_at();
create trigger positions_set_updated_at before update on public.positions for each row execute function private.set_updated_at();
create trigger allocation_targets_set_updated_at before update on public.allocation_targets for each row execute function private.set_updated_at();
create trigger projection_scenarios_set_updated_at before update on public.projection_scenarios for each row execute function private.set_updated_at();
create trigger investment_decisions_set_updated_at before update on public.investment_decisions for each row execute function private.set_updated_at();

create or replace function private.validate_position_scope()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.financial_accounts a
    where a.id = new.financial_account_id and a.portfolio_id = new.portfolio_id
  ) then
    raise exception 'Position account must belong to the same portfolio';
  end if;
  return new;
end;
$$;

create trigger positions_validate_scope before insert or update on public.positions for each row execute function private.validate_position_scope();

create or replace function private.validate_transaction_scope()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.financial_accounts a
    where a.id = new.financial_account_id and a.portfolio_id = new.portfolio_id
  ) then
    raise exception 'Transaction account must belong to the same portfolio';
  end if;
  return new;
end;
$$;

create trigger transactions_validate_scope before insert or update on public.transactions for each row execute function private.validate_transaction_scope();

commit;
