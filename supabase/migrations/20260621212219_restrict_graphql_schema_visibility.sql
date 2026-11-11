-- Revoke SELECT from anon and authenticated on contact_submissions
-- These tables should not be discoverable via GraphQL
REVOKE SELECT ON public.contact_submissions FROM anon;
REVOKE SELECT ON public.contact_submissions FROM authenticated;

-- Revoke SELECT from anon and authenticated on newsletter_subscribers
REVOKE SELECT ON public.newsletter_subscribers FROM anon;
REVOKE SELECT ON public.newsletter_subscribers FROM authenticated;
