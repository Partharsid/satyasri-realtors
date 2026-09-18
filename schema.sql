-- Supabase Schema for Satyasri Realtors

-- 1. Create Listings Table
CREATE TABLE public.listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    summary TEXT,
    price TEXT,
    type TEXT, -- 'Apartment', 'Villa', 'Land', 'Commercial'
    transaction TEXT, -- 'Sale', 'Rent', 'Lease'
    "isFeatured" BOOLEAN DEFAULT false,
    thumbnail TEXT,
    images JSONB DEFAULT '[]'::jsonb,

    -- Location
    location_area TEXT,
    location_city TEXT,
    location_state TEXT,
    location_full_address TEXT,

    -- Specs
    specs_area TEXT,
    specs_bedrooms INTEGER,
    specs_bathrooms INTEGER,
    specs_facing TEXT,
    specs_floor TEXT,
    specs_furnishing TEXT,
    specs_parking TEXT,
    specs_availability TEXT,
    specs_tenant_restriction TEXT,

    -- Arrays
    features JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,

    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Leads Table
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    budget TEXT,
    location TEXT,
    requirement TEXT,
    source_page TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Public can read listings
CREATE POLICY "Public can view active listings"
    ON public.listings FOR SELECT
    USING (true);

-- Only authenticated admins can modify listings
CREATE POLICY "Admins can insert listings"
    ON public.listings FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update listings"
    ON public.listings FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete listings"
    ON public.listings FOR DELETE
    USING (auth.role() = 'authenticated');

-- Leads: public can insert (via API route with service key), admins can view/manage
CREATE POLICY "Admins can view leads"
    ON public.leads FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update leads"
    ON public.leads FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete leads"
    ON public.leads FOR DELETE
    USING (auth.role() = 'authenticated');

-- Note: The Next.js API route will use the Service Role key to insert leads,
-- bypassing RLS, so we don't need a public insert policy for leads.

-- 4. Create Storage Bucket for Property Images
INSERT INTO storage.buckets (id, name, public) VALUES ('properties', 'properties', true);

CREATE POLICY "Public can view property images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'properties');

CREATE POLICY "Admins can upload property images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'properties' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can update property images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'properties' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete property images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'properties' AND auth.role() = 'authenticated');

