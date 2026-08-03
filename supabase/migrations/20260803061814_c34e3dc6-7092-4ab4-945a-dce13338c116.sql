-- Remove overly permissive public INSERT policy on illustrations bucket.
-- Uploads are done exclusively by the generate-illustration edge function using
-- the service role, which bypasses RLS and therefore needs no policy.
DROP POLICY IF EXISTS "Service role can insert illustrations" ON storage.objects;

-- Remove broad SELECT policy that allowed clients to list every object in the
-- public illustrations bucket. Public objects remain readable via their public
-- URLs, which do not require a storage.objects SELECT policy.
DROP POLICY IF EXISTS "Public read access for illustrations" ON storage.objects;