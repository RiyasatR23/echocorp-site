/*
# Create site_enquiries table

1. New Tables
- `site_enquiries`
  - `id` (uuid, primary key)
  - `created_at` (timestamptz, defaults to now)
  - `name` (text, required, 1-120 characters)
  - `business` (text, optional, up to 160 characters)
  - `need` (text, required, the option the visitor picked, up to 80 characters)
  - `budget` (text, required, the budget range the visitor picked, up to 80 characters)
  - `message` (text, optional, up to 1000 characters)
  - `emailed_at` (timestamptz, set once the notification email has been sent via Resend)

2. Security
- Enable RLS on `site_enquiries`. No policies are added, so the anon and authenticated roles cannot read or write rows directly.
- Grant SELECT, INSERT and UPDATE to `service_role` only. The `contact-request` edge function uses the service role to store enquiries and mark them as emailed.

3. Notes
- Visitors submit the contact form through the `contact-request` edge function, which validates input before inserting a row.
- This table is separate from `quote_requests`, which requires a WhatsApp number that this form does not collect.
*/

CREATE TABLE IF NOT EXISTS site_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 120),
  business text CHECK (business IS NULL OR char_length(business) <= 160),
  need text NOT NULL CHECK (char_length(need) <= 80),
  budget text NOT NULL CHECK (char_length(budget) <= 80),
  message text CHECK (message IS NULL OR char_length(message) <= 1000),
  emailed_at timestamptz
);

ALTER TABLE site_enquiries ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON site_enquiries TO service_role;
