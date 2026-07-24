begin;

create or replace function private.owns_portfolio(target_portfolio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.portfolios p
    where p.id = target_portfolio_id
      and p.user_id = auth.uid()
  );
$$;

revoke all on function private.owns_portfolio(uuid) from public;
grant execute on function private.owns_portfolio(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.financial_accounts enable row level security;
alter table public.assets enable row level security;
alter table public.positions enable row level security;
alter table public.transactions enable row level security;
alter table public.allocation_targets enable row level security;
alter table public.projection_scenarios enable row level security;
alter table public.investment_decisions enable row level security;
alter table public.decision_sources enable row level security;
alter table public.audit_logs enable row level security;

alter table public.profiles force row level security;
alter table public.portfolios force row level security;
alter table public.financial_accounts force row level security;
alter table public.assets force row level security;
alter table public.positions force row level security;
alter table public.transactions force row level security;
alter table public.allocation_targets force row level security;
alter table public.projection_scenarios force row level security;
alter table public.investment_decisions force row level security;
alter table public.decision_sources force row level security;
alter table public.audit_logs force row level security;

create policy profiles_select_own on public.profiles for select to authenticated using (user_id = auth.uid());
create policy profiles_insert_own on public.profiles for insert to authenticated with check (user_id = auth.uid());
create policy profiles_update_own on public.profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy profiles_delete_own on public.profiles for delete to authenticated using (user_id = auth.uid());

create policy portfolios_select_own on public.portfolios for select to authenticated using (user_id = auth.uid());
create policy portfolios_insert_own on public.portfolios for insert to authenticated with check (user_id = auth.uid());
create policy portfolios_update_own on public.portfolios for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy portfolios_delete_own on public.portfolios for delete to authenticated using (user_id = auth.uid());

create policy accounts_select_own on public.financial_accounts for select to authenticated using (private.owns_portfolio(portfolio_id));
create policy accounts_insert_own on public.financial_accounts for insert to authenticated with check (private.owns_portfolio(portfolio_id));
create policy accounts_update_own on public.financial_accounts for update to authenticated using (private.owns_portfolio(portfolio_id)) with check (private.owns_portfolio(portfolio_id));
create policy accounts_delete_own on public.financial_accounts for delete to authenticated using (private.owns_portfolio(portfolio_id));

create policy assets_select_visible on public.assets for select to authenticated using (owner_user_id is null or owner_user_id = auth.uid());
create policy assets_insert_own on public.assets for insert to authenticated with check (owner_user_id = auth.uid());
create policy assets_update_own on public.assets for update to authenticated using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy assets_delete_own on public.assets for delete to authenticated using (owner_user_id = auth.uid());

create policy positions_select_own on public.positions for select to authenticated using (private.owns_portfolio(portfolio_id));
create policy positions_insert_own on public.positions for insert to authenticated with check (private.owns_portfolio(portfolio_id));
create policy positions_update_own on public.positions for update to authenticated using (private.owns_portfolio(portfolio_id)) with check (private.owns_portfolio(portfolio_id));
create policy positions_delete_own on public.positions for delete to authenticated using (private.owns_portfolio(portfolio_id));

create policy transactions_select_own on public.transactions for select to authenticated using (private.owns_portfolio(portfolio_id));
create policy transactions_insert_own on public.transactions for insert to authenticated with check (private.owns_portfolio(portfolio_id));
create policy transactions_update_own on public.transactions for update to authenticated using (private.owns_portfolio(portfolio_id)) with check (private.owns_portfolio(portfolio_id));
create policy transactions_delete_own on public.transactions for delete to authenticated using (private.owns_portfolio(portfolio_id));

create policy allocation_targets_select_own on public.allocation_targets for select to authenticated using (private.owns_portfolio(portfolio_id));
create policy allocation_targets_insert_own on public.allocation_targets for insert to authenticated with check (private.owns_portfolio(portfolio_id));
create policy allocation_targets_update_own on public.allocation_targets for update to authenticated using (private.owns_portfolio(portfolio_id)) with check (private.owns_portfolio(portfolio_id));
create policy allocation_targets_delete_own on public.allocation_targets for delete to authenticated using (private.owns_portfolio(portfolio_id));

create policy projections_select_own on public.projection_scenarios for select to authenticated using (private.owns_portfolio(portfolio_id));
create policy projections_insert_own on public.projection_scenarios for insert to authenticated with check (private.owns_portfolio(portfolio_id));
create policy projections_update_own on public.projection_scenarios for update to authenticated using (private.owns_portfolio(portfolio_id)) with check (private.owns_portfolio(portfolio_id));
create policy projections_delete_own on public.projection_scenarios for delete to authenticated using (private.owns_portfolio(portfolio_id));

create policy decisions_select_own on public.investment_decisions for select to authenticated using (private.owns_portfolio(portfolio_id));
create policy decisions_insert_own on public.investment_decisions for insert to authenticated with check (private.owns_portfolio(portfolio_id));
create policy decisions_update_own on public.investment_decisions for update to authenticated using (private.owns_portfolio(portfolio_id)) with check (private.owns_portfolio(portfolio_id));
create policy decisions_delete_own on public.investment_decisions for delete to authenticated using (private.owns_portfolio(portfolio_id));

create policy decision_sources_select_own on public.decision_sources
for select to authenticated
using (exists (
  select 1 from public.investment_decisions d
  where d.id = investment_decision_id and private.owns_portfolio(d.portfolio_id)
));

create policy decision_sources_insert_own on public.decision_sources
for insert to authenticated
with check (exists (
  select 1 from public.investment_decisions d
  where d.id = investment_decision_id and private.owns_portfolio(d.portfolio_id)
));

create policy decision_sources_update_own on public.decision_sources
for update to authenticated
using (exists (
  select 1 from public.investment_decisions d
  where d.id = investment_decision_id and private.owns_portfolio(d.portfolio_id)
))
with check (exists (
  select 1 from public.investment_decisions d
  where d.id = investment_decision_id and private.owns_portfolio(d.portfolio_id)
));

create policy decision_sources_delete_own on public.decision_sources
for delete to authenticated
using (exists (
  select 1 from public.investment_decisions d
  where d.id = investment_decision_id and private.owns_portfolio(d.portfolio_id)
));

create policy audit_logs_select_own on public.audit_logs
for select to authenticated
using (user_id = auth.uid() and (portfolio_id is null or private.owns_portfolio(portfolio_id)));

revoke insert, update, delete on public.audit_logs from authenticated;

commit;
