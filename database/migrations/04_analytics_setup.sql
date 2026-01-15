-- 1. SELLER CERTIFICATIONS (for Renewal Status)
create table if not exists public.seller_certifications (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.vendors(id) on delete cascade unique, -- One active cert per seller
  certified_on date not null,
  expires_on date not null,
  status text check (status in ('Verified', 'Review Due', 'Expiring Soon', 'Expired')) default 'Verified',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. SELLER DELIVERY METRICS (Weekly average delivery days)
create table if not exists public.seller_delivery_metrics (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.vendors(id) on delete cascade,
  week_label text not null, -- e.g. "Week 1", "Week 2" or specific date range
  avg_delivery_days numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. SELLER DRIPSCORE HISTORY (Line chart data)
create table if not exists public.seller_dripscore_history (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.vendors(id) on delete cascade,
  period_label text not null, -- e.g. "Jan", "Feb" or "Week 1"
  score numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS
alter table public.seller_certifications enable row level security;
alter table public.seller_delivery_metrics enable row level security;
alter table public.seller_dripscore_history enable row level security;

create policy "Admins can view certs" on public.seller_certifications for select to authenticated using (true);
create policy "Admins can view metrics" on public.seller_delivery_metrics for select to authenticated using (true);
create policy "Admins can view history" on public.seller_dripscore_history for select to authenticated using (true);

-- 4. SEED DATA (Linking to REAL vendors)

DO $$
DECLARE
  v_rnf uuid;
  v_drift uuid;
  v_t4c uuid;
  v_599 uuid;
  v_thriftogram uuid;
BEGIN
  -- Fetch IDs for real vendors
  select id into v_rnf from public.vendors where business_name ilike '%RNF CLOTHING%' OR instagram_handle ilike '%thrift.by.rnf%' limit 1;
  select id into v_drift from public.vendors where business_name ilike '%Drift Studio%' OR instagram_handle ilike '%driftstudio%' limit 1;
  select id into v_t4c from public.vendors where business_name ilike '%T4C%' OR instagram_handle ilike '%thrifts4culture%' limit 1;
  select id into v_599 from public.vendors where business_name ilike '%599store%' OR instagram_handle ilike '%599store%' limit 1;
  select id into v_thriftogram from public.vendors where business_name ilike '%THRIFTOGRAM%' OR instagram_handle ilike '%thriftogram%' limit 1;

  -- 1. RNF CLOTHING: Verified, Good Metrics
  IF v_rnf IS NOT NULL THEN
     -- Cert
     insert into public.seller_certifications (seller_id, certified_on, expires_on, status)
     values (v_rnf, '2023-01-15', '2024-01-15', 'Verified')
     on conflict (seller_id) do update set status = 'Verified';

     -- Delivery Trends (Last 4 weeks)
     delete from public.seller_delivery_metrics where seller_id = v_rnf;
     insert into public.seller_delivery_metrics (seller_id, week_label, avg_delivery_days) values
     (v_rnf, 'Week 1', 4.5), (v_rnf, 'Week 2', 3.8), (v_rnf, 'Week 3', 3.2), (v_rnf, 'Week 4', 2.9);

     -- DripScore History
     delete from public.seller_dripscore_history where seller_id = v_rnf;
     insert into public.seller_dripscore_history (seller_id, period_label, score) values
     (v_rnf, 'Month 1', 3.5), (v_rnf, 'Month 2', 3.8), (v_rnf, 'Month 3', 4.0), (v_rnf, 'Month 4', 4.5);
  END IF;

  -- 2. Drift Studio: Review Due, Slower Delivery
  IF v_drift IS NOT NULL THEN
     -- Cert
     insert into public.seller_certifications (seller_id, certified_on, expires_on, status)
     values (v_drift, '2023-02-10', '2023-12-10', 'Review Due')
     on conflict (seller_id) do update set status = 'Review Due';

     -- Delivery
     delete from public.seller_delivery_metrics where seller_id = v_drift;
     insert into public.seller_delivery_metrics (seller_id, week_label, avg_delivery_days) values
     (v_drift, 'Week 1', 5.5), (v_drift, 'Week 2', 6.0), (v_drift, 'Week 3', 5.8), (v_drift, 'Week 4', 6.2);

     -- DripScore
      delete from public.seller_dripscore_history where seller_id = v_drift;
     insert into public.seller_dripscore_history (seller_id, period_label, score) values
     (v_drift, 'Month 1', 4.2), (v_drift, 'Month 2', 4.0), (v_drift, 'Month 3', 3.8), (v_drift, 'Month 4', 3.5);
  END IF;

   -- 3. T4C-THRIFT STORE: Expiring Soon
  IF v_t4c IS NOT NULL THEN
     insert into public.seller_certifications (seller_id, certified_on, expires_on, status)
     values (v_t4c, '2023-06-20', '2024-06-20', 'Verified')
     on conflict (seller_id) do update set status = 'Verified';

     delete from public.seller_delivery_metrics where seller_id = v_t4c;
     insert into public.seller_delivery_metrics (seller_id, week_label, avg_delivery_days) values
     (v_t4c, 'Week 1', 3.0), (v_t4c, 'Week 2', 2.8), (v_t4c, 'Week 3', 2.5), (v_t4c, 'Week 4', 2.2);

      delete from public.seller_dripscore_history where seller_id = v_t4c;
     insert into public.seller_dripscore_history (seller_id, period_label, score) values
     (v_t4c, 'Month 1', 3.0), (v_t4c, 'Month 2', 3.5), (v_t4c, 'Month 3', 4.2), (v_t4c, 'Month 4', 4.8);
  END IF;

END $$;
