-- Simpler version - Insert vendors one by one
-- Run these in Supabase SQL Editor

-- Clear existing data (optional - only if you want to start fresh)
-- DELETE FROM reviews;
-- DELETE FROM vendor_transparency;
-- DELETE FROM red_flags;
-- DELETE FROM vendors;

-- Insert vendors
INSERT INTO vendors (business_name, instagram_handle, gstin, verification_status, drip_score, certification_expiry) VALUES
('Vintage Loft', 'vintageloft', '22AAAAA0000A1Z5', 'verified', 4.8, '2025-12-31');

INSERT INTO vendors (business_name, instagram_handle, gstin, verification_status, drip_score, certification_expiry) VALUES
('Patchwork Co.', 'patchworkco', NULL, 'verified', 4.6, '2025-11-30');

INSERT INTO vendors (business_name, instagram_handle, gstin, verification_status, drip_score, certification_expiry) VALUES
('Drift Studio', 'driftstudio', '27BBBBB1111B2Y6', 'verified', 4.9, '2025-10-15');

INSERT INTO vendors (business_name, instagram_handle, gstin, verification_status, drip_score, certification_expiry) VALUES
('Green Finds', 'greenfinds', NULL, 'pending', 4.2, NULL);

INSERT INTO vendors (business_name, instagram_handle, gstin, verification_status, drip_score, certification_expiry) VALUES
('Retro Realm', 'retrorealm', '29CCCCC2222C3X7', 'verified', 4.7, '2025-09-20');

INSERT INTO vendors (business_name, instagram_handle, gstin, verification_status, drip_score, certification_expiry) VALUES
('Urban Threads', 'urbanthreads', NULL, 'verified', 4.5, '2025-08-10');

-- After inserting vendors, you can manually add reviews using their IDs
-- Example (replace 'vendor-uuid-here' with actual vendor ID from the vendors table):
-- INSERT INTO reviews (vendor_id, full_name, role) VALUES
-- ('vendor-uuid-here', 'Sarah Johnson', 'buyer');
