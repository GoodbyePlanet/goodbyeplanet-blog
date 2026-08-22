-- Backend for the floating post-like heart (layouts/partials/post-likes.html).
-- Paste this whole file into the Supabase SQL editor and run it. Safe to re-run.
--
-- The anon/publishable key shipped in config.yml can only read counts and call
-- increment_likes(); it has no direct write access to the table.

create table if not exists public.post_likes (
  slug  text primary key,
  likes integer not null default 0
);

alter table public.post_likes enable row level security;

drop policy if exists "public read" on public.post_likes;
create policy "public read"
  on public.post_likes
  for select
  to anon
  using (true);

create or replace function public.increment_likes(post_slug text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  insert into public.post_likes (slug, likes)
  values (post_slug, 1)
  on conflict (slug) do update set likes = post_likes.likes + 1
  returning likes into new_count;

  return new_count;
end;
$$;

-- PostgREST hides functions the caller cannot execute, so a missing grant looks
-- like a 404 on /rest/v1/rpc/increment_likes.
grant execute on function public.increment_likes(text) to anon;

-- Nudge PostgREST to pick the new function up immediately.
notify pgrst, 'reload schema';
