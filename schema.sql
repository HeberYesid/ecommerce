-- Create uuid extension
create extension if not exists "uuid-ossp";

-- Create products table
create table products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  price numeric not null,
  description text,
  image_url text,
  seller_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table products enable row level security;

-- Policies
-- Anyone can read products
create policy "Anyone can view products" on products for select using (true);

-- Only authenticated users can insert products (Sellers)
create policy "Users can insert products" on products for insert with check (auth.uid() = seller_id);

-- Only owners can update/delete their products
create policy "Users can update own products" on products for update using (auth.uid() = seller_id);
create policy "Users can delete own products" on products for delete using (auth.uid() = seller_id);
