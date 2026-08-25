-- Run this only after deploying generate-sattoo-status and setting its secrets.
-- Replace YOUR_LONG_RANDOM_CRON_SECRET with the same SATTOO_CRON_SECRET
-- stored in Edge Function Secrets. Do not use the AI API key here.

create extension if not exists pg_cron;
create extension if not exists pg_net;
create extension if not exists vault;

select vault.create_secret(
  'https://fpkzrifklnqwubtvctpz.supabase.co',
  'sattoo_project_url'
);

select vault.create_secret(
  'YOUR_LONG_RANDOM_CRON_SECRET',
  'sattoo_cron_secret'
);

select cron.schedule(
  'generate-sattoo-status-every-five-minutes',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'sattoo_project_url') || '/functions/v1/generate-sattoo-status',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'sattoo_cron_secret')
    ),
    body := jsonb_build_object('scheduled_at', now()),
    timeout_milliseconds := 60000
  ) as request_id;
  $$
);

