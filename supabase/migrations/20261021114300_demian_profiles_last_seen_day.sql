-- Cenario "perdeu um dia, sem comecar do zero": o dia do programa ja e
-- calculado por calendario (diaGeralDesdeInicio), entao nunca reseta
-- sozinho -- falta so detectar quando a usuaria PULOU dias desde a ultima
-- vez que abriu o app, pra mostrar uma mensagem de acolhimento em vez de
-- silencio. `last_seen_dia_geral` guarda o ultimo dia que ela efetivamente
-- viu (atualizado a cada getProgramStatus), comparado com o dia atual.
alter table public.demian_profiles
  add column if not exists last_seen_dia_geral integer;
