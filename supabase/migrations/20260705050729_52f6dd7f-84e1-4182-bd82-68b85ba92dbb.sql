
DROP POLICY IF EXISTS "Anyone can view public analyses" ON public.saved_analyses;
DROP POLICY IF EXISTS "Users can view their own analyses" ON public.saved_analyses;

CREATE POLICY "Anon can view public analyses"
ON public.saved_analyses
FOR SELECT
TO anon
USING (is_public = true);

CREATE POLICY "Authenticated can view own or public analyses"
ON public.saved_analyses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_public = true);
