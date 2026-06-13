-- Sync bookings table schema with application requirements
-- Add missing columns if they don't exist

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bookings' AND COLUMN_NAME = 'items') THEN
        ALTER TABLE public.bookings ADD COLUMN items JSONB DEFAULT '[]'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bookings' AND COLUMN_NAME = 'amount_min') THEN
        ALTER TABLE public.bookings ADD COLUMN amount_min NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bookings' AND COLUMN_NAME = 'amount_max') THEN
        ALTER TABLE public.bookings ADD COLUMN amount_max NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bookings' AND COLUMN_NAME = 'payment_screenshot_url') THEN
        ALTER TABLE public.bookings ADD COLUMN payment_screenshot_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bookings' AND COLUMN_NAME = 'order_id') THEN
        ALTER TABLE public.bookings ADD COLUMN order_id TEXT UNIQUE;
    END IF;
END $$;
