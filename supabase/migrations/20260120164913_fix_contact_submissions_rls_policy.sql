/*
  # Fix Contact Submissions RLS Policy

  1. Changes
    - Drop the overly permissive RLS policy that allows unrestricted access
    - Create a new secure policy with proper validation constraints
  
  2. Security
    - Validates that required fields (name, email, message) are provided and not empty
    - Enforces reasonable length limits to prevent abuse
    - Validates email format at database level
    - Prevents null or excessively long inputs that could be used for attacks
  
  3. Validation Rules
    - Name: Required, 1-200 characters
    - Email: Required, valid format, 3-320 characters (RFC 5321 max)
    - Message: Required, 1-5000 characters
    - Company: Optional, max 200 characters
    - Budget: Optional, max 100 characters
*/

-- Drop the insecure policy
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create a secure policy with proper validation
CREATE POLICY "Validated contact form submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Name validation: required, not empty, reasonable length
    name IS NOT NULL 
    AND trim(name) != '' 
    AND length(name) >= 1 
    AND length(name) <= 200
    
    -- Email validation: required, not empty, valid format, reasonable length
    AND email IS NOT NULL 
    AND trim(email) != '' 
    AND length(email) >= 3 
    AND length(email) <= 320
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    
    -- Message validation: required, not empty, reasonable length
    AND message IS NOT NULL 
    AND trim(message) != '' 
    AND length(message) >= 1 
    AND length(message) <= 5000
    
    -- Optional fields validation: if provided, must have reasonable length
    AND (company IS NULL OR length(company) <= 200)
    AND (budget IS NULL OR length(budget) <= 100)
    
    -- System fields should not be set by users
    AND email_sent IS NULL OR email_sent = false
    AND email_sent_at IS NULL
  );