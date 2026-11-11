CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  CONSTRAINT newsletter_subscribers_email_key UNIQUE (email)
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_newsletter_subscriber" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (
    email IS NOT NULL
    AND trim(email) != ''
    AND length(email) >= 3
    AND length(email) <= 320
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
