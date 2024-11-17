-- Activation de l'extension uuid-ossp si pas déjà active
create extension if not exists "uuid-ossp";

-- Table des profils utilisateurs
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  phone_number text,
  company_name text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activation RLS
alter table public.profiles enable row level security;

-- Politique RLS pour les profils
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Trigger pour mettre à jour updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- Trigger pour créer automatiquement un profil lors de la création d'un utilisateur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();