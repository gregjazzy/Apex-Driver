create extension if not exists "uuid-ossp";

create table if not exists public.apexdriver_profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('coach', 'student')),
  full_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists apexdriver_profiles_role_idx on public.apexdriver_profiles(role);

create table if not exists public.apexdriver_tasks (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.apexdriver_profiles(id) on delete cascade not null,
  title text not null,
  status boolean default false not null,
  priority integer not null check (priority between 1 and 3),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists apexdriver_tasks_student_id_idx on public.apexdriver_tasks(student_id);
create index if not exists apexdriver_tasks_status_idx on public.apexdriver_tasks(status);

create table if not exists public.apexdriver_pomodoro_sessions (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.apexdriver_profiles(id) on delete cascade not null,
  duration integer not null,
  status text not null check (status in ('completed', 'abandoned')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists apexdriver_pomodoro_sessions_student_id_idx on public.apexdriver_pomodoro_sessions(student_id);
create index if not exists apexdriver_pomodoro_sessions_created_at_idx on public.apexdriver_pomodoro_sessions(created_at desc);

alter table public.apexdriver_profiles enable row level security;
alter table public.apexdriver_tasks enable row level security;
alter table public.apexdriver_pomodoro_sessions enable row level security;

drop policy if exists "ApexDriver: Users can view own profile" on public.apexdriver_profiles;
drop policy if exists "ApexDriver: Coaches can view all profiles" on public.apexdriver_profiles;
drop policy if exists "ApexDriver: Users can update own profile" on public.apexdriver_profiles;
drop policy if exists "ApexDriver: Coaches can insert profiles" on public.apexdriver_profiles;

create policy "ApexDriver: Users can view own profile"
  on public.apexdriver_profiles for select
  using (auth.uid() = id);

create policy "ApexDriver: Coaches can view all profiles"
  on public.apexdriver_profiles for select
  using (
    exists (
      select 1 from public.apexdriver_profiles
      where id = auth.uid() and role = 'coach'
    )
  );

create policy "ApexDriver: Users can update own profile"
  on public.apexdriver_profiles for update
  using (auth.uid() = id);

create policy "ApexDriver: Coaches can insert profiles"
  on public.apexdriver_profiles for insert
  with check (
    exists (
      select 1 from public.apexdriver_profiles
      where id = auth.uid() and role = 'coach'
    )
  );

drop policy if exists "ApexDriver: Students can view own tasks" on public.apexdriver_tasks;
drop policy if exists "ApexDriver: Coaches can insert tasks" on public.apexdriver_tasks;
drop policy if exists "ApexDriver: Students can update own tasks, coaches can update all" on public.apexdriver_tasks;
drop policy if exists "ApexDriver: Coaches can delete tasks" on public.apexdriver_tasks;

create policy "ApexDriver: Students can view own tasks"
  on public.apexdriver_tasks for select
  using (
    student_id = auth.uid() or
    exists (
      select 1 from public.apexdriver_profiles
      where id = auth.uid() and role = 'coach'
    )
  );

create policy "ApexDriver: Coaches can insert tasks"
  on public.apexdriver_tasks for insert
  with check (
    exists (
      select 1 from public.apexdriver_profiles
      where id = auth.uid() and role = 'coach'
    )
  );

create policy "ApexDriver: Students can update own tasks, coaches can update all"
  on public.apexdriver_tasks for update
  using (
    student_id = auth.uid() or
    exists (
      select 1 from public.apexdriver_profiles
      where id = auth.uid() and role = 'coach'
    )
  );

create policy "ApexDriver: Coaches can delete tasks"
  on public.apexdriver_tasks for delete
  using (
    exists (
      select 1 from public.apexdriver_profiles
      where id = auth.uid() and role = 'coach'
    )
  );

drop policy if exists "ApexDriver: Students can view own pomodoro sessions" on public.apexdriver_pomodoro_sessions;
drop policy if exists "ApexDriver: Students can insert own pomodoro sessions" on public.apexdriver_pomodoro_sessions;
drop policy if exists "ApexDriver: Students can update own pomodoro sessions" on public.apexdriver_pomodoro_sessions;

create policy "ApexDriver: Students can view own pomodoro sessions"
  on public.apexdriver_pomodoro_sessions for select
  using (
    student_id = auth.uid() or
    exists (
      select 1 from public.apexdriver_profiles
      where id = auth.uid() and role = 'coach'
    )
  );

create policy "ApexDriver: Students can insert own pomodoro sessions"
  on public.apexdriver_pomodoro_sessions for insert
  with check (student_id = auth.uid());

create policy "ApexDriver: Students can update own pomodoro sessions"
  on public.apexdriver_pomodoro_sessions for update
  using (student_id = auth.uid());

create or replace function public.apexdriver_handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists apexdriver_set_updated_at on public.apexdriver_profiles;
drop trigger if exists apexdriver_set_updated_at on public.apexdriver_tasks;

create trigger apexdriver_set_updated_at
  before update on public.apexdriver_profiles
  for each row
  execute function public.apexdriver_handle_updated_at();

create trigger apexdriver_set_updated_at
  before update on public.apexdriver_tasks
  for each row
  execute function public.apexdriver_handle_updated_at();

create or replace function public.apexdriver_handle_new_user()
returns trigger as $$
begin
  insert into public.apexdriver_profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'full_name', 'Nouvel utilisateur')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists apexdriver_on_auth_user_created on auth.users;

create trigger apexdriver_on_auth_user_created
  after insert on auth.users
  for each row execute function public.apexdriver_handle_new_user();

do $$
begin
  begin
    alter publication supabase_realtime add table public.apexdriver_tasks;
  exception when others then
    raise notice 'Table apexdriver_tasks déjà dans la publication Realtime';
  end;
  
  begin
    alter publication supabase_realtime add table public.apexdriver_pomodoro_sessions;
  exception when others then
    raise notice 'Table apexdriver_pomodoro_sessions déjà dans la publication Realtime';
  end;
end $$;

select 'Tables ApexDriver créées avec succès!' as status;
select table_name from information_schema.tables 
where table_schema = 'public' 
and table_name like 'apexdriver_%'
order by table_name;
