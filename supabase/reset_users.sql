DELETE FROM public.apexdriver_profiles WHERE full_name IN ('Sacha', 'Admin Coach');

DELETE FROM auth.users WHERE email IN ('sacha@apexdriver.app', 'admin@apexdriver.app');

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@apexdriver.app',
  crypt('admin', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin Coach","role":"coach"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
), (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'sacha@apexdriver.app',
  crypt('Bertini', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Sacha","role":"student"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

SELECT id, email, raw_user_meta_data->>'full_name' as name, raw_user_meta_data->>'role' as role FROM auth.users WHERE email LIKE '%apexdriver.app';
