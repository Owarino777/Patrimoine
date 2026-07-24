-- Development-only seed. Never run against production.

insert into public.assets (
  owner_user_id,
  identifier_type,
  identifier,
  name,
  asset_class,
  currency,
  country_code,
  sector
) values
  (null, 'ISIN', 'FR001400U5Q4', 'Amundi PEA Monde MSCI World UCITS ETF Acc', 'ETF', 'EUR', 'FR', 'Diversified'),
  (null, 'ISIN', 'FR0011550185', 'BNP Paribas Easy S&P 500 UCITS ETF', 'ETF', 'EUR', 'FR', 'Diversified'),
  (null, 'TICKER', 'AI.PA', 'Air Liquide', 'EQUITY', 'EUR', 'FR', 'Industrials'),
  (null, 'CRYPTO_SYMBOL', 'SOL', 'Solana', 'CRYPTO', 'EUR', null, 'Cryptoasset')
on conflict (owner_user_id, identifier_type, identifier) do nothing;
