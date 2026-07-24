begin;

create or replace function private.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_data jsonb;
  target_portfolio_id uuid;
  target_entity_id uuid;
begin
  row_data := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  target_entity_id := nullif(row_data ->> 'id', '')::uuid;

  if row_data ? 'portfolio_id' then
    target_portfolio_id := nullif(row_data ->> 'portfolio_id', '')::uuid;
  elsif tg_table_name = 'portfolios' then
    target_portfolio_id := target_entity_id;
  else
    target_portfolio_id := null;
  end if;

  insert into public.audit_logs (
    user_id,
    portfolio_id,
    entity_type,
    entity_id,
    action,
    old_data,
    new_data
  ) values (
    auth.uid(),
    target_portfolio_id,
    tg_table_name,
    target_entity_id,
    tg_op,
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke all on function private.write_audit_log() from public;

create trigger financial_accounts_audit
  after insert or update or delete on public.financial_accounts
  for each row execute function private.write_audit_log();

create trigger positions_audit
  after insert or update or delete on public.positions
  for each row execute function private.write_audit_log();

create trigger transactions_audit
  after insert or update or delete on public.transactions
  for each row execute function private.write_audit_log();

create trigger allocation_targets_audit
  after insert or update or delete on public.allocation_targets
  for each row execute function private.write_audit_log();

create trigger projection_scenarios_audit
  after insert or update or delete on public.projection_scenarios
  for each row execute function private.write_audit_log();

create trigger investment_decisions_audit
  after insert or update or delete on public.investment_decisions
  for each row execute function private.write_audit_log();

commit;
