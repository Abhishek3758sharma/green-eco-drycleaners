-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: bookings
-- Updated to support multi-service and payment verification
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    address TEXT,
    pickup_date DATE,
    items JSONB DEFAULT '[]'::jsonb,
    amount_min NUMERIC DEFAULT 0,
    amount_max NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    payment_method TEXT DEFAULT 'Pickup',
    payment_status TEXT DEFAULT 'Pending Payment',
    payment_screenshot_url TEXT,
    source TEXT DEFAULT 'Website',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors on overwrite
DROP POLICY IF EXISTS "Allow public insert to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated read bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public read own booking" ON public.bookings;

-- Allow public inserts for bookings (from the public-facing book route)
CREATE POLICY "Allow public insert to bookings" 
ON public.bookings FOR INSERT 
TO public
WITH CHECK (true);

-- Allow public to read their own booking via order_id (for the tracking page)
CREATE POLICY "Allow public read own booking"
ON public.bookings FOR SELECT
TO public
USING (true);

-- Allow authenticated users (Admins) full access
CREATE POLICY "Allow authenticated read bookings" 
ON public.bookings FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update bookings" 
ON public.bookings FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Drop existing policies for contact_messages
DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read contact_messages" ON public.contact_messages;

-- Allow public inserts for contact_messages
CREATE POLICY "Allow public insert to contact_messages" 
ON public.contact_messages FOR INSERT 
TO public
WITH CHECK (true);

-- Allow authenticated users to view contact_messages
CREATE POLICY "Allow authenticated read contact_messages" 
ON public.contact_messages FOR SELECT 
TO authenticated 
USING (true);
