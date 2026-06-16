-- Contador de uso de IA por usuario y día (control de costos / anti-abuso).
-- Solo la service role escribe; los usuarios no acceden directamente.
create table if not exists public.ai_usage (
  user_id uuid references auth.users(id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (user_id, day)
);

alter table public.ai_usage enable row level security;
-- Sin policies para usuarios: solo la service role (que saltea RLS) la usa.
