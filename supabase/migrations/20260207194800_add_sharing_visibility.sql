-- Add is_public column to resumes table
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add policy for public viewing
-- Note: This allows unauthenticated users to see resumes that are explicitly marked as public
CREATE POLICY "Public resumes are viewable by everyone"
  ON public.resumes FOR SELECT
  USING (is_public = true);
