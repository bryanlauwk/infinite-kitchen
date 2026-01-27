-- Create storage bucket for illustrations
INSERT INTO storage.buckets (id, name, public)
VALUES ('illustrations', 'illustrations', true);

-- Allow public read access to illustrations bucket
CREATE POLICY "Public read access for illustrations"
ON storage.objects FOR SELECT
USING (bucket_id = 'illustrations');

-- Allow service role to insert illustrations
CREATE POLICY "Service role can insert illustrations"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'illustrations');

-- Create table for caching generated illustrations
CREATE TABLE public.generated_illustrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_key TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  dish_name TEXT,
  illustration_type TEXT CHECK (illustration_type IN ('dish', 'chef')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generated_illustrations ENABLE ROW LEVEL SECURITY;

-- Anyone can read illustrations (public cache)
CREATE POLICY "Public read access" 
ON public.generated_illustrations 
FOR SELECT USING (true);

-- Service role inserts via edge function (no user-facing insert policy needed)