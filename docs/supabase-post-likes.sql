-- Backend for the floating post-like heart (layouts/partials/post-likes.html).
-- Backend for the post-like heart (layouts/partials/post-likes.html) and the
-- read-only counts on the post list (layouts/_default/list.html).
-- Paste this whole file into the Supabase SQL editor and run it. Safe to re-run.
--
-- The anon/publishable key shipped in config.yml can only read counts and call
-- increment_likes(); it has no direct write access to the table.
-- The shape we want, and what enforces it:
--
--   read a count      SELECT on post_likes   -> allowed by the "public read" policy
--   like a post       increment_likes()      -> allowed, adds exactly 1
--   anything else     INSERT/UPDATE/DELETE   -> no grant and no policy, so denied
--
-- The publishable key in config.yml ships in every page of the site, so anyone
-- can send these requests. increment_likes() is the only write path it has.

create table if not exists public.post_likes (
                                                 slug  text primary key,
                                                 likes integer not null default 0
);

-- Without this, PostgREST honours the table grants directly and the anon key
-- can read, edit and delete every row. This is the fix for the Supabase
-- advisor's "rls_disabled_in_public" finding.
alter table public.post_likes enable row level security;

drop policy if exists "public read" on public.post_likes;
-- Deliberately NOT "force row level security": increment_likes() below is
-- security definer and runs as the table owner, which is exactly how it gets
-- to write rows that no policy allows. Forcing RLS would break that.

-- Table privileges are the first gate, the policies below are the second. Both
-- have to allow a statement, so revoking here means a stray permissive policy
-- can never hand out writes on its own.
revoke all on table public.post_likes from public, anon, authenticated;
grant select on table public.post_likes to anon, authenticated;

-- Start from a clean slate: a policy left over from an earlier setup (or one
-- added by hand in the dashboard) would still apply on top of what we create.
do $$
declare
pol record;
begin
for pol in
select policyname from pg_policies
where schemaname = 'public' and tablename = 'post_likes'
    loop
    execute format('drop policy %I on public.post_likes', pol.policyname);
end loop;
end;
$$;

-- The only policy on the table. No insert, update or delete policy exists, so
-- those commands match nothing and are refused for every non-owner role.
create policy "public read"
  on public.post_likes
  for select
                 to anon, authenticated
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
  if post_slug is null or length(trim(post_slug)) = 0 or length(post_slug) > 200 then
    raise exception 'invalid post_slug';
end if;

insert into public.post_likes (slug, likes)
values (post_slug, 1)
    on conflict (slug) do update set likes = post_likes.likes + 1
                              returning likes into new_count;

return new_count;
end;
$$;

revoke all on function public.increment_likes(text) from public;
grant execute on function public.increment_likes(text) to anon, authenticated;

notify pgrst, 'reload schema';


-- ---------------------------------------------------------------------------
-- Verification. Run these after the script and check the results by hand.
-- ---------------------------------------------------------------------------

-- 1. RLS is on. Expect rowsecurity = true.
select relname, relrowsecurity as rowsecurity
from pg_class
where oid = 'public.post_likes'::regclass;

-- 2. Exactly one policy, SELECT only. Expect a single row: "public read" / r.
select policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'post_likes';

-- 3. anon and authenticated hold SELECT and nothing else. Expect only SELECT.
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'post_likes'
  and grantee in ('anon', 'authenticated', 'public')
order by grantee, privilege_type;

-- 4. End-to-end, with the publishable key from config.yml. The first two must
--    succeed, the last three must come back as an RLS/permission error:
--
--    URL=https://vzudpehbcvvvtkaivndr.supabase.co
--    KEY=<supabaseAnonKey from config.yml>
--
--    curl -s "$URL/rest/v1/post_likes?select=slug,likes" \
--      -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
--
--    curl -s -X POST "$URL/rest/v1/rpc/increment_likes" \
--      -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
--      -H "Content-Type: application/json" -d '{"post_slug":"rls-smoke-test"}'
--
--    curl -s -X DELETE "$URL/rest/v1/post_likes?slug=eq.rls-smoke-test" \
--      -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
--
--    curl -s -X PATCH "$URL/rest/v1/post_likes?slug=eq.rls-smoke-test" \
--      -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
--      -H "Content-Type: application/json" -d '{"likes":9999}'
--
--    curl -s -X POST "$URL/rest/v1/post_likes" \
--      -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
--      -H "Content-Type: application/json" -d '{"slug":"injected","likes":1}'
--
--    Then clean the test row up from the SQL editor:
--    delete from public.post_likes where slug = 'rls-smoke-test';