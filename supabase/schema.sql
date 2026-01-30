-- ============================================
-- SCHEMA SUPABASE - APPLICATION COACHING
-- ============================================

-- Activation de l'extension UUID
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('coach', 'student')),
  full_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour optimiser les requêtes
create index profiles_role_idx on public.profiles(role);

-- ============================================
-- TABLE: tasks
-- ============================================
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  status boolean default false not null,
  priority integer not null check (priority between 1 and 3),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour optimiser les requêtes
create index tasks_student_id_idx on public.tasks(student_id);
create index tasks_status_idx on public.tasks(status);

-- ============================================
-- TABLE: pomodoro_sessions
-- ============================================
create table public.pomodoro_sessions (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  duration integer not null, -- en minutes
  status text not null check (status in ('completed', 'abandoned')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour optimiser les requêtes
create index pomodoro_sessions_student_id_idx on public.pomodoro_sessions(student_id);
create index pomodoro_sessions_created_at_idx on public.pomodoro_sessions(created_at desc);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activation du RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.pomodoro_sessions enable row level security;

-- ============================================
-- POLICIES: profiles
-- ============================================

-- Les utilisateurs peuvent voir leur propre profil
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Les coaches peuvent voir tous les profils
create policy "Coaches can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- Les utilisateurs peuvent mettre à jour leur propre profil
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Les coaches peuvent insérer des profils (pour créer des élèves)
create policy "Coaches can insert profiles"
  on public.profiles for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- ============================================
-- POLICIES: tasks
-- ============================================

-- Les élèves peuvent voir uniquement leurs tâches
create policy "Students can view own tasks"
  on public.tasks for select
  using (
    student_id = auth.uid() or
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- Les coaches peuvent créer des tâches pour n'importe quel élève
create policy "Coaches can insert tasks"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- Les élèves peuvent mettre à jour leurs propres tâches
-- Les coaches peuvent mettre à jour toutes les tâches
create policy "Students can update own tasks, coaches can update all"
  on public.tasks for update
  using (
    student_id = auth.uid() or
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- Les coaches peuvent supprimer des tâches
create policy "Coaches can delete tasks"
  on public.tasks for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- ============================================
-- POLICIES: pomodoro_sessions
-- ============================================

-- Les élèves peuvent voir uniquement leurs sessions
create policy "Students can view own pomodoro sessions"
  on public.pomodoro_sessions for select
  using (
    student_id = auth.uid() or
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- Les élèves peuvent créer leurs propres sessions
create policy "Students can insert own pomodoro sessions"
  on public.pomodoro_sessions for insert
  with check (student_id = auth.uid());

-- Les élèves peuvent mettre à jour leurs propres sessions
create policy "Students can update own pomodoro sessions"
  on public.pomodoro_sessions for update
  using (student_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Fonction pour mettre à jour le timestamp updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger pour profiles
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Trigger pour tasks
create trigger set_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();

-- ============================================
-- FONCTION: Créer un profil automatiquement après signup
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'full_name', 'Nouvel utilisateur')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger pour créer automatiquement un profil après signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- REALTIME: Activation des publications
-- ============================================

-- Activer realtime pour les tables nécessaires
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.pomodoro_sessions;

-- ============================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Insérer un coach de test (à adapter avec vos vrais IDs après signup)
-- insert into public.profiles (id, role, full_name)
-- values ('uuid-coach-ici', 'coach', 'Coach Principal');

-- Insérer un élève de test
-- insert into public.profiles (id, role, full_name)
-- values ('uuid-eleve-ici', 'student', 'Élève Test');

-- Insérer des tâches de test
-- insert into public.tasks (student_id, title, status, priority)
-- values 
--   ('uuid-eleve-ici', 'Finir les exercices de maths', false, 1),
--   ('uuid-eleve-ici', 'Réviser le chapitre d''histoire', false, 2),
--   ('uuid-eleve-ici', 'Préparer l''exposé de français', true, 1);
