-- Drop the old check constraint
ALTER TABLE public.generated_illustrations DROP CONSTRAINT IF EXISTS generated_illustrations_illustration_type_check;

-- Add new constraint that includes all illustration types
ALTER TABLE public.generated_illustrations ADD CONSTRAINT generated_illustrations_illustration_type_check 
  CHECK (illustration_type IN ('dish', 'chef', 'ingredient', 'technique'));