-- Chari-T demo seed (safe to re-run after deleting demo rows)
-- Usage: mysql -u root -p charit < scripts/demo-seed.sql
--
-- Creates a demo fundraiser + 3 campaigns for presentation when live data is empty.
-- Images use public slider assets so cards render without Cloudinary.

-- Optional schema upgrades (ignore errors if columns already exist)
-- ALTER TABLE centers ADD COLUMN total_donators INT DEFAULT 0;
-- ALTER TABLE centers ADD COLUMN total_campaigns INT DEFAULT 0;

INSERT INTO users (full_name, email, role, is_verified, image, method, donations, recieved)
SELECT 'Demo Organizer', 'demo@chari-t.local', 'donor', 1, '/slider1/hands.jpg', 'seed', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@chari-t.local');

SET @demo_user := (SELECT id FROM users WHERE email = 'demo@chari-t.local' LIMIT 1);

-- Soft bank payload so donate UI can open (replace subAccountCode with a real Paystack subaccount for live pay)
UPDATE users
SET bank_details = JSON_OBJECT(
  'accountName', 'Demo Organizer',
  'accountNumber', '0123456789',
  'bankName', 'Demo Bank',
  'bankCode', '000',
  'subAccountCode', 'ACCT_demo',
  'email', 'demo@chari-t.local'
),
is_verified = 1
WHERE id = @demo_user;

-- Remove previous seed campaigns only
DELETE FROM campaigns
WHERE user_id = @demo_user
  AND name IN (
    'School Meals for 200 Kids',
    'Community Health Outreach',
    'Youth Coding Bootcamp'
  );

INSERT INTO campaigns (
  name, details, story, main_img, imgs, donors, goal, raised, _type,
  user_id, date_to_completion, currency, category, donation_count, location,
  bank_details, safety_rating, reported, reports
) VALUES
(
  'School Meals for 200 Kids',
  'Help us provide daily meals for children in underserved schools this term.',
  'Many students walk long distances and learn on empty stomachs. Your gift funds local cooks and farm produce for two hundred kids for a full term.',
  JSON_OBJECT('url', '/slider1/close-up-smiley-kids-posing-together.jpg', 'publicId', 'demo-1'),
  JSON_ARRAY(),
  JSON_ARRAY(),
  500000,
  125000,
  'normal',
  @demo_user,
  CAST(UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 45 DAY)) * 1000 AS CHAR),
  'NG',
  'Education',
  12,
  'Lagos, Nigeria',
  (SELECT bank_details FROM users WHERE id = @demo_user),
  'likely_safe',
  0,
  0
),
(
  'Community Health Outreach',
  'Mobile clinic supplies and free screenings for families without easy hospital access.',
  'We partner with community nurses for weekend clinics — BP checks, maternal kits, and malaria tests.',
  JSON_OBJECT('url', '/slider1/hands.jpg', 'publicId', 'demo-2'),
  JSON_ARRAY(),
  JSON_ARRAY(),
  750000,
  210000,
  'normal',
  @demo_user,
  CAST(UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 60 DAY)) * 1000 AS CHAR),
  'NG',
  'Health',
  28,
  'Abuja, Nigeria',
  (SELECT bank_details FROM users WHERE id = @demo_user),
  'verified_safe',
  0,
  0
),
(
  'Youth Coding Bootcamp',
  'Laptops, mentors, and internet for a 6-week free coding program.',
  'Teens learn web basics and ship a portfolio project. Funds cover devices, data, and instructor stipends.',
  JSON_OBJECT('url', '/slider1/medium-shot-boys-hugging.jpg', 'publicId', 'demo-3'),
  JSON_ARRAY(),
  JSON_ARRAY(),
  1000000,
  400000,
  'normal',
  @demo_user,
  CAST(UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 30 DAY)) * 1000 AS CHAR),
  'NG',
  'Community',
  41,
  'Ibadan, Nigeria',
  (SELECT bank_details FROM users WHERE id = @demo_user),
  'likely_safe',
  0,
  0
);

-- Optional: promote yourself to admin after first Google sign-in
-- UPDATE users SET role = 'admin' WHERE email = 'you@example.com';

SELECT id, name, category, goal, raised, safety_rating
FROM campaigns
WHERE user_id = @demo_user;
