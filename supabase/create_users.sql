-- ============================================
-- CRÉATION DES COMPTES UTILISATEURS - APEX DRIVER
-- ============================================
-- À exécuter dans Supabase SQL Editor après avoir créé les tables

-- Note: Supabase Auth utilise des EMAILS, pas des identifiants
-- Utilisez ces emails pour vous connecter :
-- - Coach: admin@apexdriver.com / admin
-- - Élève: sacha@apexdriver.com / Bertini

-- ============================================
-- 1. COMPTE COACH (VOUS)
-- ============================================
-- Email: admin@apexdriver.com
-- Mot de passe: admin

-- Insérer dans auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@apexdriver.com',
  crypt('admin', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin Coach","role":"coach"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- ============================================
-- 2. COMPTE ÉLÈVE (Sacha)
-- ============================================
-- Email: sacha@apexdriver.com
-- Mot de passe: Bertini

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'sacha@apexdriver.com',
  crypt('Bertini', gen_salt('bf')),
  now(),
  now(),
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

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Vérifier que les profils ont été créés automatiquement par le trigger
SELECT 
  id,
  role,
  full_name,
  created_at
FROM public.apexdriver_profiles
ORDER BY created_at DESC;

-- Vous devriez voir :
-- - Admin Coach (role: coach)
-- - Sacha (role: student)
