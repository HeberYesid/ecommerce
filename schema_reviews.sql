-- Create reviews table
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) not null,
  user_id uuid references auth.users(id) not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table reviews enable row level security;

-- Policies
create policy "Anyone can view reviews" on reviews for select using (true);
create policy "Authenticated users can create reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews" on reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews" on reviews for delete using (auth.uid() = user_id);
