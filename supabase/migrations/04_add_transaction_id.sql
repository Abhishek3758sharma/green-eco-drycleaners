-- Add transaction_id to bookings if not exists
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS transaction_id TEXT;
