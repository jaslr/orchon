-- Reset Jason's password to the correct hash
-- This fixes login issues with the ORCHON mobile app

UPDATE allowed_users
SET password_hash = '$2b$10$wC2LqGDgbLWNMBO.YCGno.4wLEuRlUDMWSomXh2MYUFjdRJINLdOK'
WHERE email = 'jasonleslieroberts@gmail.com';
