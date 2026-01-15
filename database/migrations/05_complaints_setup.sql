-- Enable UUID if not already
create extension if not exists "uuid-ossp";

-- 1. COMPLAINT TICKETS TABLE
create table if not exists public.complaint_tickets (
  id uuid primary key default uuid_generate_v4(),
  ticket_code text unique not null, -- e.g. "T-9920"
  seller_id uuid references public.vendors(id), -- Nullable if vendor deleted, or enforce
  buyer_name text not null,
  issue_summary text not null, -- short description
  complaint_text text, -- full details
  status text check (status in ('Open', 'In Review', 'Resolved', 'Escalated')) default 'Open',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. COMPLAINT EVIDENCE TABLE
create table if not exists public.complaint_evidence (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references public.complaint_tickets(id) on delete cascade not null,
  file_name text not null,
  file_path text not null, -- Supabase Storage path (even if mock)
  file_type text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS
alter table public.complaint_tickets enable row level security;
alter table public.complaint_evidence enable row level security;

-- Admin policies (assuming authenticated admins)
create policy "Admins can do everything on tickets" on public.complaint_tickets for all to authenticated using (true);
create policy "Admins can do everything on evidence" on public.complaint_evidence for all to authenticated using (true);

-- 3. SEED DATA (Using REAL vendors from screenshot)
-- We will try to find them by 'business_name' OR 'instagram_handle'

DO $$
DECLARE
  v_rnf uuid;
  v_drift uuid;
  v_t4c uuid;
  t_id uuid;
BEGIN
  -- Get vendor IDs dynamically based on real names visible in the app
  -- 1. RNF CLOTHING (thrift.by.rnf)
  select id into v_rnf from public.vendors 
  where business_name ilike '%RNF CLOTHING%' OR instagram_handle ilike '%thrift.by.rnf%' limit 1;

  -- 2. Drift Studio (driftstudio)
  select id into v_drift from public.vendors 
  where business_name ilike '%Drift Studio%' OR instagram_handle ilike '%driftstudio%' limit 1;

  -- 3. T4C-THRIFT STORE (thrifts4culture)
  select id into v_t4c from public.vendors 
  where business_name ilike '%T4C%' OR instagram_handle ilike '%thrifts4culture%' limit 1;


  -- Create Ticket 1 (RNF CLOTHING)
  IF v_rnf IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.complaint_tickets WHERE ticket_code = 'T-9920') THEN
    insert into public.complaint_tickets (ticket_code, seller_id, buyer_name, issue_summary, complaint_text, status)
    values ('T-9920', v_rnf, 'Alice M.', 'Item not as described (faded color)', 'The hoodie I received has significant fading on the sleeves which was not mentioned in the description or shown in photos.', 'Open')
    returning id into t_id;
    
    -- Mock evidence
    insert into public.complaint_evidence (ticket_id, file_name, file_path)
    values (t_id, 'fading_proof.jpg', 'mock/fading_proof.jpg');
  END IF;

  -- Create Ticket 2 (Drift Studio)
  IF v_drift IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.complaint_tickets WHERE ticket_code = 'T-9921') THEN
     insert into public.complaint_tickets (ticket_code, seller_id, buyer_name, issue_summary, complaint_text, status, admin_notes)
    values ('T-9921', v_drift, 'Bob K.', 'Late delivery', 'Order #4451 is pending for 10 days without any tracking update. Seller is not replying to DMs.', 'In Review', 'Contacted vendor via WhatsApp, awaiting response.');
  END IF;

  -- Create Ticket 3 (T4C-THRIFT STORE)
  IF v_t4c IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.complaint_tickets WHERE ticket_code = 'T-9922') THEN
     insert into public.complaint_tickets (ticket_code, seller_id, buyer_name, issue_summary, complaint_text, status, admin_notes)
    values ('T-9922', v_t4c, 'Charlie D.', 'Wrong size received', 'Ordered a Size M vintage tee but received an XL. requesting exchange.', 'Resolved', 'Refund processed on Jan 14 as exchange was not possible.');
  END IF;

END $$;
