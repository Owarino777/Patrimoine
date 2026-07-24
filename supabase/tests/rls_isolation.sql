begin;

-- Expected execution context: local Supabase database after migrations.
-- The script rolls back all fixtures.

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'alice@example.test', '', now(), now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'bob@example.test', '', now(), now(), now());

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);

insert into public.profiles (user_id, display_name)
values ('11111111-1111-1111-1111-111111111111', 'Alice');

insert into public.portfolios (id, user_id, name)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Alice portfolio');

insert into public.financial_accounts (
  id, portfolio_id, institution_name, name, account_type, currency
) values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Test Bank',
  'Alice PEA',
  'PEA',
  'EUR'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);

insert into public.profiles (user_id, display_name)
values ('22222222-2222-2222-2222-222222222222', 'Bob');

insert into public.portfolios (id, user_id, name)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Bob portfolio');

do $$
declare
  visible_count integer;
begin
  select count(*) into visible_count
  from public.portfolios
  where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  if visible_count <> 0 then
    raise exception 'RLS failure: Bob can read Alice portfolio';
  end if;
end;
$$;

do $$
begin
  begin
    insert into public.financial_accounts (
      portfolio_id, institution_name, name, account_type, currency
    ) values (
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'Attacker Bank',
      'Forbidden account',
      'CTO',
      'EUR'
    );
    raise exception 'RLS failure: Bob inserted into Alice portfolio';
  exception
    when insufficient_privilege then null;
    when check_violation then null;
  end;
end;
$$;

do $$
declare
  visible_count integer;
begin
  select count(*) into visible_count
  from public.financial_accounts
  where id = 'aaaaaaaa-0000-0000-0000-000000000001';

  if visible_count <> 0 then
    raise exception 'RLS failure: Bob can read Alice account';
  end if;
end;
$$;

rollback;
