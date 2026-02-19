-- Create orders table
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  total_amount numeric not null,
  status text check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) default 'pending',
  shipping_address jsonb,
  created_at timestamp with time zone default now()
);

-- Create order_items table
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  title text not null, -- Store snapshot of title
  price_at_purchase numeric not null,
  quantity integer not null
);

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Policies for Orders
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);

-- Policies for Order Items
create policy "Users can view own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can insert own order items" on order_items for insert with check (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
