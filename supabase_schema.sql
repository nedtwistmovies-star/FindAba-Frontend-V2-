-- FindAba OS V2 - MASTER DATABASE SYNC (AUDITED)
-- Run this in your Supabase SQL Editor.

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist in profiles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'profiles' AND column_name = 'verified') THEN
        ALTER TABLE profiles ADD COLUMN verified BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    address TEXT,
    image_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IDEMPOTENT COLUMN UPDATES (Fixes "Missing Column" errors)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'phone') THEN
        ALTER TABLE businesses ADD COLUMN phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'whatsapp') THEN
        ALTER TABLE businesses ADD COLUMN whatsapp TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'website') THEN
        ALTER TABLE businesses ADD COLUMN website TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'market_zone') THEN
        ALTER TABLE businesses ADD COLUMN market_zone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'price_range') THEN
        ALTER TABLE businesses ADD COLUMN price_range TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'sub_category') THEN
        ALTER TABLE businesses ADD COLUMN sub_category TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'amenities') THEN
        ALTER TABLE businesses ADD COLUMN amenities TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'policies') THEN
        ALTER TABLE businesses ADD COLUMN policies TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'gallery_urls') THEN
        ALTER TABLE businesses ADD COLUMN gallery_urls TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'owner_id') THEN
        ALTER TABLE businesses ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'opening_hours') THEN
        ALTER TABLE businesses ADD COLUMN opening_hours JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'cac_number') THEN
        ALTER TABLE businesses ADD COLUMN cac_number TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'tin') THEN
        ALTER TABLE businesses ADD COLUMN tin TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'national_id') THEN
        ALTER TABLE businesses ADD COLUMN national_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'owner_name') THEN
        ALTER TABLE businesses ADD COLUMN owner_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'owner_photo') THEN
        ALTER TABLE businesses ADD COLUMN owner_photo TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'businesses' AND column_name = 'featured') THEN
        ALTER TABLE businesses ADD COLUMN featured BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    image_url TEXT,
    category TEXT,
    stock_quantity INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES auth.users(id),
    buyer_name TEXT,
    seller_id UUID REFERENCES auth.users(id),
    seller_name TEXT,
    items JSONB,
    total DECIMAL(12,2),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'orders' AND column_name = 'escrow_status') THEN
        ALTER TABLE orders ADD COLUMN escrow_status TEXT DEFAULT 'held';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'orders' AND column_name = 'tracking') THEN
        ALTER TABLE orders ADD COLUMN tracking JSONB;
    END IF;
END $$;

-- 5. Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES auth.users(id),
    author_name TEXT,
    author_avatar TEXT,
    title TEXT,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    category TEXT DEFAULT 'general',
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    business_id UUID REFERENCES businesses(id),
    business_name TEXT,
    product_id UUID,
    product_name TEXT,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    guests INTEGER DEFAULT 1,
    total_price DECIMAL(12,2),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT,
    message TEXT,
    type TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Transport & Logistics
CREATE TABLE IF NOT EXISTS driver_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    name TEXT,
    photo_url TEXT,
    current_status TEXT DEFAULT 'offline',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    driver_id UUID REFERENCES driver_profiles(id),
    pickup_location JSONB,
    destination JSONB,
    fare DECIMAL(10,2),
    status TEXT DEFAULT 'searching',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id),
    tracking_number TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    amount DECIMAL(12,2),
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- 11. Security Policies (Using DO block to avoid syntax errors with IF NOT EXISTS)
DO $$ 
BEGIN
    -- Profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles viewable' AND tablename = 'profiles') THEN
        CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;

    -- Businesses
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Businesses viewable by all' AND tablename = 'businesses') THEN
        CREATE POLICY "Businesses viewable by all" ON businesses FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Owners can update business' AND tablename = 'businesses') THEN
        CREATE POLICY "Owners can update business" ON businesses FOR ALL USING (auth.uid() = owner_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can insert business' AND tablename = 'businesses') THEN
        CREATE POLICY "Authenticated can insert business" ON businesses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    -- Products
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Products viewable by all' AND tablename = 'products') THEN
        CREATE POLICY "Products viewable by all" ON products FOR SELECT USING (true);
    END IF;

    -- Community Posts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view posts' AND tablename = 'community_posts') THEN
        CREATE POLICY "Users can view posts" ON community_posts FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create posts' AND tablename = 'community_posts') THEN
        CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
    END IF;

    -- Orders
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own orders' AND tablename = 'orders') THEN
        CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
    END IF;
END $$;

-- 12. Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, name, email, phone, avatar_url, role)
    VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'), 
      new.email, 
      new.raw_user_meta_data->>'phone',
      new.raw_user_meta_data->>'avatar_url', 
      'citizen'
    );
  EXCEPTION WHEN OTHERS THEN
    -- Fallback to minimal insert if complex one fails
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'citizen')
    ON CONFLICT (id) DO NOTHING;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    END IF;
END $$;
