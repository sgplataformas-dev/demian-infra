-- Perfil de ramificacao do motor de regras do programa de 28 dias (4 fases
-- de 7 dias: Selar, Desarmar, Limpar, Repovoar). As respostas aqui decidem
-- qual variacao de conteudo (ja aprovada pelo Demian) aparece pra cada
-- usuaria em cada dia — ver src/content/program-engine.ts e
-- src/content/program-days.ts.
create table if not exists public.demian_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  intestino text not null check (intestino in ('preso', 'solto')),
  turno text not null check (turno in ('dia', 'madrugada')),
  sono text not null check (sono in ('bom', 'ruim', 'acorda_de_madrugada')),
  lactose text not null check (lactose in ('tolera', 'intolerante')),
  remedios_afetam_sono boolean not null default false,
  has_bonus boolean not null default false,
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.demian_profiles enable row level security;

create policy "demian_profiles_select_own"
  on public.demian_profiles for select
  using (auth.uid() = user_id);

create policy "demian_profiles_insert_own"
  on public.demian_profiles for insert
  with check (auth.uid() = user_id);

create policy "demian_profiles_update_own"
  on public.demian_profiles for update
  using (auth.uid() = user_id);

create policy "demian_profiles_service_role"
  on public.demian_profiles for all
  using (auth.role() = 'service_role');
