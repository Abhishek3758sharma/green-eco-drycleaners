-- Add booking_source to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_source TEXT DEFAULT 'website';
