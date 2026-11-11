/*
  # Fix Auth DB Connection Strategy

  1. Changes
    - Update auth configuration to use percentage-based connection allocation instead of fixed number
    - This allows the auth server to scale with database instance size automatically
  
  2. Security
    - Improves auth server performance and scalability
*/

-- Update auth configuration to use percentage-based pool size
-- This uses 10% of available connections instead of a fixed 10 connections
ALTER ROLE authenticator SET pgrst.db_pool_size = '0.1';