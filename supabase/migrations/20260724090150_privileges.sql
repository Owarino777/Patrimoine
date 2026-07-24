begin;

revoke all on schema private from public;
grant usage on schema private to authenticated;

revoke all on public.profiles from anon, authenticated;
revoke all on public.portfolios from anon, authenticated;
revoke all on public.financial_accounts from anon, authenticated;
revoke all on public.assets from anon, authenticated;
revoke all on public.positions from anon, authenticated;
revoke all on public.transactions from anon, authenticated;
revoke all on public.allocation_targets from anon, authenticated;
revoke all on public.projection_scenarios from anon, authenticated;
revoke all on public.investment_decisions from anon, authenticated;
revoke all on public.decision_sources from anon, authenticated;
revoke all on public.audit_logs from anon, authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.portfolios to authenticated;
grant select, insert, update, delete on public.financial_accounts to authenticated;
grant select, insert, update, delete on public.assets to authenticated;
grant select, insert, update, delete on public.positions to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
grant select, insert, update, delete on public.allocation_targets to authenticated;
grant select, insert, update, delete on public.projection_scenarios to authenticated;
grant select, insert, update, delete on public.investment_decisions to authenticated;
grant select, insert, update, delete on public.decision_sources to authenticated;
grant select on public.audit_logs to authenticated;

commit;
