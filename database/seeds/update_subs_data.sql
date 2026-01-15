-- 1. Free Plan (Ensure it exists and is correct)
UPDATE public.plans 
SET price_monthly = 0, 
    features = '["Basic Verification Badge", "Standard Support", "Listed in Directory"]'::jsonb 
WHERE name = 'Free';

INSERT INTO public.plans (name, price_monthly, features)
SELECT 'Free', 0, '["Basic Verification Badge", "Standard Support", "Listed in Directory"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Free');

-- 2. Pro Seller Plan (Update to ₹2,499)
UPDATE public.plans 
SET price_monthly = 2499, 
    features = '["Priority Verification", "Analytics Dashboard", "Top 100 Listing"]'::jsonb 
WHERE name = 'Pro Seller';

INSERT INTO public.plans (name, price_monthly, features)
SELECT 'Pro Seller', 2499, '["Priority Verification", "Analytics Dashboard", "Top 100 Listing"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Pro Seller');

-- 3. Featured Vendor Plan (Update to ₹7,999)
UPDATE public.plans 
SET price_monthly = 7999, 
    features = '["Homepage Feature", "Dedicated Account Manager", "Unlimited Promotions"]'::jsonb 
WHERE name = 'Featured Vendor';

INSERT INTO public.plans (name, price_monthly, features)
SELECT 'Featured Vendor', 7999, '["Homepage Feature", "Dedicated Account Manager", "Unlimited Promotions"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Featured Vendor');
