-- 1. ADMIN ACTIVITY LOG
-- Used for the "Recent Activity" feed on the Admin Dashboard
create table if not exists public.admin_activity_log (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references auth.users(id), -- Nullable if we want to store system actions or generic admin actions
  action_type text not null, -- 'VERIFY_VENDOR', 'APPROVE_LISTING', 'REMOVE_REVIEW', etc.
  details text, -- Human readable summary e.g. "Verified specific-vendor-name"
  target_id uuid, -- ID of the object being acted upon (vendor_id, listing_id, etc.)
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.admin_activity_log enable row level security;
create policy "Admins can view all logs" on public.admin_activity_log for select to authenticated using (true);
create policy "Admins can insert logs" on public.admin_activity_log for insert to authenticated with check (true);

-- 2. VENDOR VERIFICATION
-- Ensure vendors have verification fields
alter table public.vendors add column if not exists verification_status text default 'unverified'; -- 'unverified', 'pending', 'verified', 'rejected'
alter table public.vendors add column if not exists verification_docs jsonb default '[]'::jsonb; -- Array of {type, url, name}
alter table public.vendors add column if not exists verification_submitted_at timestamp with time zone;

-- 3. MARKETPLACE LISTINGS
-- Create listings table if it doesn't exist
create table if not exists public.listings (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()),
    title text not null,
    description text,
    price numeric,
    images text[], -- Array of image URLs
    category text,
    seller_id uuid references public.vendors(id) on delete cascade not null,
    
    -- Moderation fields
    moderation_status text default 'pending_review', -- 'pending_review', 'approved', 'rejected'
    admin_notes text
);

alter table public.listings enable row level security;
create policy "Public can view approved listings" on public.listings for select using (moderation_status = 'approved');
create policy "Admins can view all listings" on public.listings for select to authenticated using (true);

-- 4. REVIEWS MODERATION
-- Ensure reviews have moderation fields AND 'comment' column
-- The error "column comment does not exist" suggests it might be named something else (e.g. body, text) OR missing.
-- We will add it safely if missing.
alter table public.reviews add column if not exists comment text; 
alter table public.reviews add column if not exists moderation_status text default 'published'; -- 'published', 'flagged', 'removed', 'under_review'
alter table public.reviews add column if not exists is_flagged boolean default false;
alter table public.reviews add column if not exists flag_reason text;

-- 5. SEED DATA FOR ADMIN FEATURES
DO $$
DECLARE
  v_rnf uuid;
  v_drift uuid;
  v_t4c uuid;
BEGIN
  -- Fetch existing vendor IDs
  select id into v_rnf from public.vendors where business_name ilike '%RNF CLOTHING%' limit 1;
  select id into v_drift from public.vendors where business_name ilike '%Drift Studio%' limit 1;
  select id into v_t4c from public.vendors where business_name ilike '%T4C%' limit 1;

  -- A. Create a Pending Verification Request (Drift Studio)
  IF v_drift IS NOT NULL THEN
     update public.vendors 
     set verification_status = 'pending',
         verification_submitted_at = now(),
         verification_docs = '[{"type": "Business License", "url": "https://placehold.co/600x400?text=License+Doc", "name": "license.pdf"}, {"type": "ID Proof", "url": "https://placehold.co/600x400?text=ID+Proof", "name": "id_card.jpg"}]'::jsonb
     where id = v_drift;
  END IF;

  -- B. Create Pending Listings
  IF v_rnf IS NOT NULL THEN
     insert into public.listings (title, description, price, images, category, seller_id, moderation_status)
     values 
     ('Vintage Nike Windbreaker', '90s authentic windbreaker, great condition.', 45.00, ARRAY['https://placehold.co/300x300'], 'Jackets', v_rnf, 'pending_review'),
     ('Levis 501 Jeans', 'Classic fit, light wash.', 30.00, ARRAY['https://placehold.co/300x300'], 'Bottoms', v_rnf, 'approved');
  END IF;

  IF v_t4c IS NOT NULL THEN
     insert into public.listings (title, description, price, images, category, seller_id, moderation_status)
     values 
     ('Oversized Band Tee', 'Rare metallica t-shirt.', 25.00, ARRAY['https://placehold.co/300x300'], 'Tops', v_t4c, 'pending_review');
  END IF;

  -- C. Flag some Reviews
  -- Note: We now ensure 'comment' exists above, so this insert should work.
  IF v_rnf IS NOT NULL THEN
      insert into public.reviews (vendor_id, rating, comment, is_flagged, flag_reason, moderation_status)
      values 
      (v_rnf, 2, 'Fake product! Do not buy.', true, 'Suspected counterfeit', 'flagged');
  END IF;

  -- D. Add some initial activity logs
  insert into public.admin_activity_log (action_type, details) values
  ('SYSTEM_INIT', 'Admin tables initialized'),
  ('USER_LOGIN', 'Administrator logged in');

END $$;
