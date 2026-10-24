-- Run this once in the Supabase dashboard: SQL Editor → New query → Run.

create table if not exists public.records (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  artist       text not null,
  title        text not null,
  year         int,
  -- [{ "name": "A", "tracks": [{ "title": "...", "duration": "3:45" }] }, ...]
  sides        jsonb not null default '[]'::jsonb,
  purchased_at text,
  notes        text,
  cover_url    text,
  cover_path   text,
  cover_color  text
);

-- Added later; safe to run again on an existing table.
alter table public.records add column if not exists genres text[] not null default '{}';

create index if not exists records_artist_idx on public.records (artist);

alter table public.records enable row level security;

-- Everyone may view the collection; only signed-in users may change it.
drop policy if exists "records are readable" on public.records;
create policy "records are readable" on public.records
  for select using (true);

drop policy if exists "signed-in users manage records" on public.records;
create policy "signed-in users manage records" on public.records
  for all to authenticated using (true) with check (true);

-- Public bucket for album covers.
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

drop policy if exists "signed-in users upload covers" on storage.objects;
create policy "signed-in users upload covers" on storage.objects
  for insert to authenticated with check (bucket_id = 'covers');

drop policy if exists "signed-in users update covers" on storage.objects;
create policy "signed-in users update covers" on storage.objects
  for update to authenticated using (bucket_id = 'covers');

drop policy if exists "signed-in users delete covers" on storage.objects;
create policy "signed-in users delete covers" on storage.objects
  for delete to authenticated using (bucket_id = 'covers');
