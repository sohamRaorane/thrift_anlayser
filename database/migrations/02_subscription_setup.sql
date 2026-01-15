-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. PLANS TABLE
create table if not exists public.plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price_monthly numeric not null, -- can be 0
  features jsonb not null default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. SELLER SUBSCRIPTIONS TABLE
create table if not exists public.seller_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.vendors(id) not null unique, -- ensuring one sub per seller
  plan_id uuid references public.plans(id) not null,
  
  -- Promotions / Features Toggles
  promo_active_campaign boolean default false,
  promo_visibility_boost boolean default false,
  promo_click_tracking boolean default false,
  
  -- Admin Metadata
  custom_note text,
  discount_code text,
  billing_reference text,
  
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. ROI REPORTS TABLE
create table if not exists public.seller_roi_reports (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.vendors(id) not null unique,
  
  views_count int default 0,
  leads_count int default 0,
  conversations_count int default 0,
  
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS POLICIES (Simple)
alter table public.plans enable row level security;
alter table public.seller_subscriptions enable row level security;
alter table public.seller_roi_reports enable row level security;

-- Allow public read access to plans (needed for pricing page etc)
create policy "Public plans access" on public.plans for select using (true);

-- Allow authenticated (admins/sellers) to read subscriptions
-- In a real app we'd restrict to own ID for sellers, but for this demo/admin tool:
create policy "Authenticated read subscriptions" on public.seller_subscriptions for select to authenticated using (true);
create policy "Authenticated insert/update subscriptions" on public.seller_subscriptions for all to authenticated using (true);

-- ROI policies
create policy "Authenticated read ROI" on public.seller_roi_reports for select to authenticated using (true);
create policy "Authenticated insert/update ROI" on public.seller_roi_reports for all to authenticated using (true);


-- 4. SEED DATA FOR PLANS
-- Clear existing plans if re-running (optional, or rely on IDs)
-- For safety we will insert only if not exist
insert into public.plans (name, price_monthly, features)
select 'Free', 0, '["Basic Verification Badge", "Standard Support", "Listed in Directory"]'::jsonb
where not exists (select 1 from public.plans where name = 'Free');

insert into public.plans (name, price_monthly, features)
select 'Pro Seller', 2499, '["Priority Verification", "Analytics Dashboard", "Top 100 Listing"]'::jsonb
where not exists (select 1 from public.plans where name = 'Pro Seller');

insert into public.plans (name, price_monthly, features)
select 'Featured Vendor', 7999, '["Homepage Feature", "Dedicated Account Manager", "Unlimited Promotions"]'::jsonb
where not exists (select 1 from public.plans where name = 'Featured Vendor');
