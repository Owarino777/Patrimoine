begin;

revoke all on schema private from public;
grant usage on schema private to authenticated;

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

revoke all on public.profiles from authenticated;
revoke all on public.portfolios from authenticated;
revoke all on public.financial_accounts from authenticated;
revoke all on public.assets from authenticated;
revoke all on public.positions from authenticated;
revoke all on public.transactions from authenticated;
revoke all on public.allocation_targets from authenticated;
revoke all on public.projection_scenarios from authenticated;
revoke all on public.investment_decisions from authenticated;
revoke all on public.decision_sources from authenticated;
revoke all on public.audit_logs from authenticated;

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
grant usage, select on sequence public.audit_logs_id_seq to authenticated;

commit;
