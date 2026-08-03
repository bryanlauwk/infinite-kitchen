-- Remove any pre-existing broad policies on the illustrations bucket
DROP POLICY IF EXISTS "Public read access for illustrations" ON storage.objects;
DROP POLICY IF EXISTS "Public insert for illustrations" ON storage.objects;
DROP POLICY IF EXISTS "Public update for illustrations" ON storage.objects;
DROP POLICY IF EXISTS "Public delete for illustrations" ON storage.objects;

-- Read-only public access; writes are only possible via the service role
-- (used by the generate-illustration edge function), which bypasses RLS.
CREATE POLICY "Illustrations are publicly readable"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'illustrations');
