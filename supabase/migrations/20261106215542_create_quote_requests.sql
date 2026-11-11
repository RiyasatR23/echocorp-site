/*
# Create quote_requests table

1. New Tables
- `quote_requests`
  - `id` (uuid, primary key)
  - `created_at` (timestamptz, defaults to now)
  - `name` (text, required, 1-120 characters)
  - `business` (text, required, 1-160 characters)
  - `service` (text, required, the service the visitor picked)
  - `budget` (text, required, the budget range the visitor picked)
  - `whatsapp` (text, required, normalised phone number, 9-15 digits with optional leading +)
  - `emailed_at` (timestamptz, set once the notification email has been sent via Resend)

2. Security
- Enable RLS on `quote_requests`. No policies are added, so the anon and authenticated roles cannot read or write rows directly.
- Grant SELECT, INSERT and UPDATE to `service_role` only. The `request-quote` edge function uses the service role to store requests and mark them as emailed.

3. Notes
- Visitors submit quotes through the `request-quote` edge function, which validates input before inserting a row.
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 120),
  business text NOT NULL CHECK (char_length(trim(business)) BETWEEN 1 AND 160),
  service text NOT NULL CHECK (char_length(service) <= 80),
  budget text NOT NULL CHECK (char_length(budget) <= 80),
  whatsapp text NOT NULL CHECK (whatsapp ~ '^\+?[0-9]{9,15}$'),
  emailed_at timestamptz
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON quote_requests TO service_role;
