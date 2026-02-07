-- Create user_activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own activities"
    ON public.user_activities FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
    ON public.user_activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id_created_at ON public.user_activities(user_id, created_at DESC);
