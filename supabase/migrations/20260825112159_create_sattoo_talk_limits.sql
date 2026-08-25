-- Per-anonymous-user rate-limit counters for Sattoo's direct conversation room.
create table if not exists public.sattoo_talk_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  daily_started_at timestamptz not null default now(),
  daily_count integer not null default 0 check (daily_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.sattoo_talk_limits enable row level security;

-- Only the service-role client inside talk-to-sattoo may read or update limits.
revoke all on table public.sattoo_talk_limits from anon, authenticated;
