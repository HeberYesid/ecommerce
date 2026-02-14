-- Add category column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS category text DEFAULT 'Other';

-- Add stock column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0;

-- Optional: Update existing records to have a default stock (e.g. 10) instead of 0
-- UPDATE products SET stock = 10 WHERE stock = 0;
