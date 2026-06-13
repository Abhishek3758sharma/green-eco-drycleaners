-- Fix old website orders
UPDATE public.bookings
SET booking_source = 'website'
WHERE booking_source IS NULL;

-- Add delivery_date column
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS delivery_date DATE;

-- Ensure notes exists (already added in previous steps, but good practice to ensure)
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS notes TEXT;
