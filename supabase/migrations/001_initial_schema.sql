-- Run this in the Supabase SQL editor: dashboard.supabase.com → SQL Editor

-- Products table
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  price       numeric(10,2) not null check (price >= 0),
  category    text not null,
  images      text[] not null default '{}',
  sizes       text[] not null default '{}',
  colors      text[] not null default '{}',
  stock       int not null default 0 check (stock >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Orders table
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  status            text not null default 'pending'
                    check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text,
  items             jsonb not null default '[]',
  subtotal          numeric(10,2) not null check (subtotal >= 0),
  total             numeric(10,2) not null check (total >= 0),
  mp_preference_id  text,
  mp_payment_id     text,
  mp_status         text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-update updated_at on orders
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Indexes
create index if not exists products_category_idx on products (category);
create index if not exists products_active_idx on products (active);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_mp_payment_id_idx on orders (mp_payment_id);

-- Row Level Security
alter table products enable row level security;
create policy "products_public_read" on products
  for select using (active = true);

alter table orders enable row level security;
-- No anon access to orders — server-side only via service role key

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'products');

create policy "product_images_admin_write" on storage.objects
  for insert with check (bucket_id = 'products');
