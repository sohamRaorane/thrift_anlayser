-- 1. UPDATE CHECK CONSTRAINT ON STATUS
-- We need to add 'Revoked' and 'Not Certified' to the allowed statuses if not present.
-- Postgres doesn't support altering CHECK constraint directly easily, so we drop and re-add.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'seller_certifications_status_check') THEN
    ALTER TABLE public.seller_certifications DROP CONSTRAINT seller_certifications_status_check;
  END IF;
  
  ALTER TABLE public.seller_certifications 
  ADD CONSTRAINT seller_certifications_status_check 
  CHECK (status IN ('Verified', 'Review Due', 'Expiring Soon', 'Expired', 'Revoked', 'Not Certified'));
END $$;

-- 2. SEED DATA (Ensure all vendors have at least a placeholder or logic handles it)
-- We don't need to insert for everyone, but let's make sure our key vendors have interesting statuses for the demo.

DO $$
DECLARE
  v_599 uuid;
  v_thriftogram uuid;
BEGIN
  -- Fetch IDs
  select id into v_599 from public.vendors where business_name ilike '%599store%' OR instagram_handle ilike '%599store%' limit 1;
  select id into v_thriftogram from public.vendors where business_name ilike '%THRIFTOGRAM%' OR instagram_handle ilike '%thriftogram%' limit 1;

  -- 1. 599store__: Expired
  IF v_599 IS NOT NULL THEN
     insert into public.seller_certifications (seller_id, certified_on, expires_on, status)
     values (v_599, '2022-01-01', '2023-01-01', 'Expired')
     on conflict (seller_id) do update set status = 'Expired', expires_on = '2023-01-01';
  END IF;

  -- 2. THRIFTOGRAM: Revoked (for demo)
  IF v_thriftogram IS NOT NULL THEN
     insert into public.seller_certifications (seller_id, certified_on, expires_on, status)
     values (v_thriftogram, '2023-05-01', '2024-05-01', 'Revoked')
     on conflict (seller_id) do update set status = 'Revoked';
  END IF;

END $$;
