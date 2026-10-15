-- Tabela de compras usada pelo fluxo de acesso/login (email-only-login,
-- password-reset, create-access, check/grant-access, webhook da Payt). Ela
-- ja era referenciada em todo o codigo herdado do app-programa, mas nunca
-- existiu como migration rastreada neste repo — no banco de producao do
-- app-programa, provavelmente foi criada direto pelo SQL Editor em algum
-- momento e nunca exportada. Recriando aqui do zero, com o formato que o
-- codigo ja espera (colunas conferidas em cada arquivo que usa a tabela).
create table if not exists public.programa_active_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  payt_order_id text not null,
  product_name text,
  amount numeric,
  payment_status text not null,
  purchase_date timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (payt_order_id)
);

create index if not exists programa_active_purchases_email_idx
  on public.programa_active_purchases (email);

alter table public.programa_active_purchases enable row level security;

-- So acessada via supabaseAdmin (service_role) nos server functions e no
-- webhook — nenhuma leitura/escrita direta do cliente, entao so a policy de
-- service_role e necessaria (mesmo padrao de demian_profiles).
create policy "programa_active_purchases_service_role"
  on public.programa_active_purchases for all
  using (auth.role() = 'service_role');
