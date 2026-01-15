-- Seed Vendors if none exist (to prevent empty dropdowns/errors using real UUIDs)
-- This assumes public.vendors table exists (referenced in setup script)
-- Common columns: id, name/store_name, created_at

INSERT INTO public.vendors (id, store_name, created_at)
SELECT uuid_generate_v4(), 'Urban Thrift', now()
WHERE NOT EXISTS (SELECT 1 FROM public.vendors WHERE store_name = 'Urban Thrift');

INSERT INTO public.vendors (id, store_name, created_at)
SELECT uuid_generate_v4(), 'Retro Vibe', now()
WHERE NOT EXISTS (SELECT 1 FROM public.vendors WHERE store_name = 'Retro Vibe');

INSERT INTO public.vendors (id, store_name, created_at)
SELECT uuid_generate_v4(), 'Vintage Soul', now()
WHERE NOT EXISTS (SELECT 1 FROM public.vendors WHERE store_name = 'Vintage Soul');
