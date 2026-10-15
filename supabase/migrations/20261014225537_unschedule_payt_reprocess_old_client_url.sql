-- A migration anterior (20260819175147) agendou um cron job que chama a URL de
-- preview da Lovable do cliente original (app-programa) a cada 5 minutos. Essa
-- URL nao faz sentido para este projeto (demian-infra) e nao deve ser recriada
-- aqui. Reagende com a URL de producao correta quando o endpoint de reprocess
-- do Payt (ou equivalente) estiver definido para este cliente.
select cron.unschedule('payt-reprocess-pending') where exists (
  select 1 from cron.job where jobname = 'payt-reprocess-pending'
);
