-- COLON AI — première migration Supabase.
-- Exécuter dans un projet Supabase neuf après revue. Les données sportives
-- fournisseur sont écrites uniquement par le serveur/service role.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  currency text not null default 'XOF' check (currency = 'XOF'),
  timezone text not null default 'Africa/Lome',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bankrolls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Capital principal',
  currency text not null default 'XOF' check (currency = 'XOF'),
  opening_balance bigint not null default 0 check (opening_balance >= 0),
  created_at timestamptz not null default now()
);
create index if not exists bankrolls_user_idx on public.bankrolls(user_id);

create table if not exists public.bankroll_transactions (
  id uuid primary key default gen_random_uuid(),
  bankroll_id uuid not null references public.bankrolls(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('deposit','withdrawal','stake','return','adjustment')),
  amount bigint not null check (amount > 0),
  currency text not null default 'XOF' check (currency = 'XOF'),
  description text,
  match_label text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists bankroll_tx_user_date_idx on public.bankroll_transactions(user_id, occurred_at desc);
create index if not exists bankroll_tx_bankroll_idx on public.bankroll_transactions(bankroll_id);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'api-football',
  provider_match_id bigint not null,
  competition_name text not null,
  season integer,
  home_team text not null,
  away_team text not null,
  kickoff_at timestamptz,
  status text,
  stats jsonb not null default '{}',
  source_updated_at timestamptz,
  created_at timestamptz not null default now(),
  unique(provider, provider_match_id)
);
create index if not exists matches_kickoff_idx on public.matches(kickoff_at);

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  match_id uuid references public.matches(id) on delete set null,
  market text not null,
  selection text not null,
  probability numeric(6,5) check (probability >= 0 and probability <= 1),
  confidence text not null check (confidence in ('low','medium','high')),
  rationale text not null,
  method_version text not null,
  outcome text check (outcome in ('won','lost','void','pending')),
  evaluated_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists predictions_user_created_idx on public.predictions(user_id, created_at desc);
create index if not exists predictions_match_idx on public.predictions(match_id);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_odds numeric(10,3),
  actual_odds numeric(10,3),
  stake bigint check (stake is null or stake > 0),
  status text not null default 'draft' check (status in ('draft','pending','won','lost','void')),
  created_at timestamptz not null default now()
);
create index if not exists coupons_user_created_idx on public.coupons(user_id, created_at desc);

create table if not exists public.coupon_legs (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  match_id uuid references public.matches(id) on delete set null,
  competition_name text not null,
  selection text not null,
  odds numeric(10,3) check (odds is null or odds > 1),
  created_at timestamptz not null default now()
);
create index if not exists coupon_legs_coupon_idx on public.coupon_legs(coupon_id);

alter table public.profiles enable row level security;
alter table public.bankrolls enable row level security;
alter table public.bankroll_transactions enable row level security;
alter table public.matches enable row level security;
alter table public.predictions enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_legs enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "bankrolls_select_own" on public.bankrolls for select using (auth.uid() = user_id);
create policy "bankrolls_insert_own" on public.bankrolls for insert with check (auth.uid() = user_id);
create policy "bankrolls_update_own" on public.bankrolls for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bankrolls_delete_own" on public.bankrolls for delete using (auth.uid() = user_id);

create policy "bankroll_tx_select_own" on public.bankroll_transactions for select using (auth.uid() = user_id);
create policy "bankroll_tx_insert_own" on public.bankroll_transactions for insert with check (auth.uid() = user_id);
create policy "bankroll_tx_update_own" on public.bankroll_transactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bankroll_tx_delete_own" on public.bankroll_transactions for delete using (auth.uid() = user_id);

-- Les matchs sont lisibles par les utilisateurs connectés. Aucune écriture client.
create policy "matches_read_authenticated" on public.matches for select to authenticated using (true);

create policy "predictions_read_own_or_public" on public.predictions for select using (user_id is null or auth.uid() = user_id);
create policy "predictions_insert_own" on public.predictions for insert with check (auth.uid() = user_id);
create policy "predictions_update_own" on public.predictions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "coupons_select_own" on public.coupons for select using (auth.uid() = user_id);
create policy "coupons_insert_own" on public.coupons for insert with check (auth.uid() = user_id);
create policy "coupons_update_own" on public.coupons for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "coupons_delete_own" on public.coupons for delete using (auth.uid() = user_id);

create policy "coupon_legs_read_own" on public.coupon_legs for select using (
  exists (select 1 from public.coupons c where c.id = coupon_id and c.user_id = auth.uid())
);
create policy "coupon_legs_insert_own" on public.coupon_legs for insert with check (
  exists (select 1 from public.coupons c where c.id = coupon_id and c.user_id = auth.uid())
);
create policy "coupon_legs_update_own" on public.coupon_legs for update using (
  exists (select 1 from public.coupons c where c.id = coupon_id and c.user_id = auth.uid())
) with check (
  exists (select 1 from public.coupons c where c.id = coupon_id and c.user_id = auth.uid())
);
create policy "coupon_legs_delete_own" on public.coupon_legs for delete using (
  exists (select 1 from public.coupons c where c.id = coupon_id and c.user_id = auth.uid())
);

-- Création du profil à l'inscription.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
