-- Corrected SQL for Supabase with UUID support
-- Run this in your Supabase SQL Editor

-- Insert vendors with UUID generation
INSERT INTO vendors (business_name, instagram_handle, gstin, verification_status, drip_score, certification_expiry) VALUES
('Vintage Loft', 'vintageloft', '22AAAAA0000A1Z5', 'verified', 5.0, '2025-12-31'),
('Green Finds', 'greenfinds', NULL, 'verified', 4.0, '2025-11-30'),
('Retro Reels', 'retroreels', '27BBBBB1111B2Y6', 'verified', 4.0, '2025-10-15'),
('Patchwork Co.', 'patchworkco', NULL, 'verified', 5.0, '2025-09-20'),
('Drift Studio', 'driftstudio', '29CCCCC2222C3X7', 'verified', 5.0, '2025-08-10')
RETURNING id, business_name, instagram_handle;

-- After running the above, note down the UUIDs
-- Then insert reviews using the actual UUIDs
-- Replace 'UUID-HERE' with the actual UUID from the vendors you just created

-- Example (you'll need to replace these UUIDs):
-- INSERT INTO reviews (vendor_id, full_name, role) VALUES
-- ('actual-uuid-for-vintageloft', 'Sarah Johnson', 'buyer'),
-- ('actual-uuid-for-vintageloft', 'Mike Chen', 'buyer'),
-- ('actual-uuid-for-greenfinds', 'Lisa Wang', 'buyer');
