-- Esquema de base de datos para mamen-mindfulness
-- Ejecuta este archivo en el SQL Editor de Supabase ANTES que el seed.

-- Necesitamos pgcrypto para gen_random_uuid()
create extension if not exists pgcrypto;

-- ──────────────────────────────────────────────────────────────
-- Tabla: categorias
-- ──────────────────────────────────────────────────────────────
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────
-- Tabla: meditaciones
-- ──────────────────────────────────────────────────────────────
create table if not exists public.meditaciones (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  categoria text not null default 'general',
  duracion_minutos int,
  url_audio text not null,
  activa boolean not null default true,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_meditaciones_activa on public.meditaciones (activa);
create index if not exists idx_meditaciones_categoria on public.meditaciones (categoria);
create index if not exists idx_meditaciones_orden on public.meditaciones (orden);

-- ──────────────────────────────────────────────────────────────
-- Tabla: cursos
-- ──────────────────────────────────────────────────────────────
create table if not exists public.cursos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  tipo text not null check (tipo in ('particular','empresa')),
  modalidad text not null default 'Online' check (modalidad in ('Presencial','Online','Ambas')),
  duracion text,
  imagen_url text,
  whatsapp_mensaje text,
  activo boolean not null default true,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_cursos_activo on public.cursos (activo);
create index if not exists idx_cursos_tipo on public.cursos (tipo);

-- ──────────────────────────────────────────────────────────────
-- Tabla: eventos
-- ──────────────────────────────────────────────────────────────
create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  fecha timestamptz not null,
  lugar text,
  imagen_url text,
  url_inscripcion text,
  tipo_inscripcion text check (tipo_inscripcion in ('whatsapp','email','url')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_eventos_activo on public.eventos (activo);
create index if not exists idx_eventos_fecha on public.eventos (fecha desc);

-- ──────────────────────────────────────────────────────────────
-- Tabla: newsletter
-- ──────────────────────────────────────────────────────────────
create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────────────────
alter table public.categorias enable row level security;
alter table public.meditaciones enable row level security;
alter table public.cursos enable row level security;
alter table public.eventos enable row level security;
alter table public.newsletter enable row level security;

-- Lectura pública (anon + authenticated) en todas las tablas excepto newsletter
drop policy if exists "categorias_read_public" on public.categorias;
create policy "categorias_read_public" on public.categorias
  for select using (true);

drop policy if exists "meditaciones_read_public" on public.meditaciones;
create policy "meditaciones_read_public" on public.meditaciones
  for select using (true);

drop policy if exists "cursos_read_public" on public.cursos;
create policy "cursos_read_public" on public.cursos
  for select using (true);

drop policy if exists "eventos_read_public" on public.eventos;
create policy "eventos_read_public" on public.eventos
  for select using (true);

-- Newsletter: cualquiera puede suscribirse (insert), nadie puede leer salvo admin
drop policy if exists "newsletter_insert_public" on public.newsletter;
create policy "newsletter_insert_public" on public.newsletter
  for insert with check (true);

drop policy if exists "newsletter_read_admin" on public.newsletter;
create policy "newsletter_read_admin" on public.newsletter
  for select using (auth.role() = 'authenticated');

-- Escritura (insert/update/delete) restringida a usuarios autenticados
drop policy if exists "categorias_write_admin" on public.categorias;
create policy "categorias_write_admin" on public.categorias
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "meditaciones_write_admin" on public.meditaciones;
create policy "meditaciones_write_admin" on public.meditaciones
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "cursos_write_admin" on public.cursos;
create policy "cursos_write_admin" on public.cursos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "eventos_write_admin" on public.eventos;
create policy "eventos_write_admin" on public.eventos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
