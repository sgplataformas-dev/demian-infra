-- Amplia demian_profiles pra guardar a anamnese real aprovada pelo
-- Dr. Demian (Dr_Demian_respondido.pdf) — bem mais rica que o perfil de
-- ramificacao original (5 campos). Os valores validos de intestino/turno/sono
-- crescem, entao os CHECK constraints antigos saem; validacao passa a ser
-- so no zod de saveProgramProfile (mesmo padrao das colunas array novas, que
-- nunca tiveram CHECK).
alter table public.demian_profiles
  drop constraint if exists demian_profiles_intestino_check,
  drop constraint if exists demian_profiles_turno_check,
  drop constraint if exists demian_profiles_sono_check;

alter table public.demian_profiles
  add column if not exists idade integer,
  add column if not exists menopausa text,
  add column if not exists tempo_dor text,
  add column if not exists onde_doi text[] not null default '{}',
  add column if not exists dor_hoje integer,
  add column if not exists vezes_banheiro text,
  add column if not exists acorda_de_madrugada boolean not null default false,
  add column if not exists remedios text[] not null default '{}',
  add column if not exists remedios_outro text,
  add column if not exists condicoes text[] not null default '{}',
  add column if not exists hora_acorda text,
  add column if not exists hora_dorme text,
  add column if not exists nao_come text[] not null default '{}',
  add column if not exists mercado_disponivel text[] not null default '{}',
  add column if not exists evento_antes_dor text[] not null default '{}';

-- "Acorda de madrugada" sai do enum de sono e vira o booleano acima.
alter table public.demian_profiles
  drop column if exists remedios_afetam_sono;

notify pgrst, 'reload schema';
