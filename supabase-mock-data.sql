-- Mock Data for Supabase using existing vendor assets
-- Run these SQL commands in your Supabase SQL Editor

-- Insert vendors using existing data
INSERT INTO vendors (id, business_name, instagram_handle, gstin, verification_status, drip_score, certification_expiry) VALUES
('vintageloft', 'Vintage Loft', 'vintageloft', '22AAAAA0000A1Z5', 'verified', 5.0, '2025-12-31'),
('greenfinds', 'Green Finds', 'greenfinds', NULL, 'verified', 4.0, '2025-11-30'),
('retroreels', 'Retro Reels', 'retroreels', '27BBBBB1111B2Y6', 'verified', 4.0, '2025-10-15'),
('patchworkco', 'Patchwork Co.', 'patchworkco', NULL, 'verified', 5.0, '2025-09-20'),
('driftstudio', 'Drift Studio', 'driftstudio', '29CCCCC2222C3X7', 'verified', 5.0, '2025-08-10');

-- Insert mock reviews for each vendor
INSERT INTO reviews (vendor_id, full_name, role) VALUES
-- Vintage Loft reviews
('vintageloft', 'Sarah Johnson', 'buyer'),
('vintageloft', 'Mike Chen', 'buyer'),
('vintageloft', 'Emma Davis', 'buyer'),
('vintageloft', 'Alex Kumar', 'buyer'),

-- Green Finds reviews
('greenfinds', 'Lisa Wang', 'buyer'),
('greenfinds', 'Tom Brown', 'buyer'),
('greenfinds', 'Nina Patel', 'buyer'),

-- Retro Reels reviews
('retroreels', 'Chris Lee', 'buyer'),
('retroreels', 'Maya Singh', 'buyer'),

-- Patchwork Co. reviews
('patchworkco', 'David Park', 'buyer'),
('patchworkco', 'Sophie Martin', 'buyer'),
('patchworkco', 'James Wilson', 'buyer'),

-- Drift Studio reviews
('driftstudio', 'Olivia Taylor', 'buyer'),
('driftstudio', 'Ryan Garcia', 'buyer'),
('driftstudio', 'Zoe Anderson', 'buyer');

-- Insert vendor transparency data
INSERT INTO vendor_transparency (vendor_id, avg_delivery_days, price_range, refund_policy, cancellation_policy, updated_at) VALUES
('vintageloft', 5, '₹800-₹4000', '7 days return policy', '24 hours before shipping', NOW()),
('greenfinds', 4, '₹500-₹3000', '14 days return policy', '48 hours before shipping', NOW()),
('retroreels', 6, '₹1000-₹8000', '3 days return policy', 'No cancellation', NOW()),
('patchworkco', 3, '₹1500-₹6000', '10 days return policy', '24 hours before shipping', NOW()),
('driftstudio', 4, '₹1200-₹5000', '7 days return policy', '48 hours before shipping', NOW());

-- Verify the data
SELECT 'Vendors Count:' as info, COUNT(*) as count FROM vendors
UNION ALL
SELECT 'Reviews Count:', COUNT(*) FROM reviews
UNION ALL
SELECT 'Transparency Records:', COUNT(*) FROM vendor_transparency;
