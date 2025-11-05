/*
  # Fix Security and Performance Issues

  ## Changes Made

  1. **Add Missing Index**
     - Add index on `integration_credentials.user_integration_id` to optimize foreign key queries

  2. **Optimize RLS Policies**
     - Update all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
     - This prevents re-evaluation of auth function for each row, improving query performance at scale
     - Affected tables:
       - `user_integrations` (4 policies)
       - `integration_credentials` (4 policies)
       - `integration_logs` (2 policies)
       - `integration_health_metrics` (2 policies)

  3. **Fix Function Security**
     - Set immutable search_path for `update_updated_at_column` function

  4. **Remove Unused Indexes**
     - Drop indexes that are not being used by queries:
       - `idx_integration_types_type`
       - `idx_integration_types_category`
       - `idx_integration_types_slug`
       - `idx_user_integrations_user_id`
       - `idx_user_integrations_status`
       - `idx_user_integrations_type_id`
       - `idx_integration_logs_user_integration_id`
       - `idx_integration_logs_created_at`
       - `idx_integration_health_metrics_user_integration_id`
       - `idx_integration_health_metrics_checked_at`
*/

-- Add missing index for foreign key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'integration_credentials'
    AND indexname = 'idx_integration_credentials_user_integration_id'
  ) THEN
    CREATE INDEX idx_integration_credentials_user_integration_id
      ON integration_credentials(user_integration_id);
  END IF;
END $$;

-- Drop and recreate RLS policies for user_integrations with optimized auth function calls
DROP POLICY IF EXISTS "Users can view own integrations" ON user_integrations;
CREATE POLICY "Users can view own integrations"
  ON user_integrations
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own integrations" ON user_integrations;
CREATE POLICY "Users can insert own integrations"
  ON user_integrations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own integrations" ON user_integrations;
CREATE POLICY "Users can update own integrations"
  ON user_integrations
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own integrations" ON user_integrations;
CREATE POLICY "Users can delete own integrations"
  ON user_integrations
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate RLS policies for integration_credentials with optimized auth function calls
DROP POLICY IF EXISTS "Users can view own credentials" ON integration_credentials;
CREATE POLICY "Users can view own credentials"
  ON integration_credentials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own credentials" ON integration_credentials;
CREATE POLICY "Users can insert own credentials"
  ON integration_credentials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own credentials" ON integration_credentials;
CREATE POLICY "Users can update own credentials"
  ON integration_credentials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own credentials" ON integration_credentials;
CREATE POLICY "Users can delete own credentials"
  ON integration_credentials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = (select auth.uid())
    )
  );

-- Drop and recreate RLS policies for integration_logs with optimized auth function calls
DROP POLICY IF EXISTS "Users can view own integration logs" ON integration_logs;
CREATE POLICY "Users can view own integration logs"
  ON integration_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_logs.user_integration_id
      AND user_integrations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own integration logs" ON integration_logs;
CREATE POLICY "Users can insert own integration logs"
  ON integration_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_logs.user_integration_id
      AND user_integrations.user_id = (select auth.uid())
    )
  );

-- Drop and recreate RLS policies for integration_health_metrics with optimized auth function calls
DROP POLICY IF EXISTS "Users can view own health metrics" ON integration_health_metrics;
CREATE POLICY "Users can view own health metrics"
  ON integration_health_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_health_metrics.user_integration_id
      AND user_integrations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own health metrics" ON integration_health_metrics;
CREATE POLICY "Users can insert own health metrics"
  ON integration_health_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_health_metrics.user_integration_id
      AND user_integrations.user_id = (select auth.uid())
    )
  );

-- Fix function search path security issue
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers that used this function
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT DISTINCT trigger_schema, event_object_table
    FROM information_schema.triggers
    WHERE trigger_name LIKE '%update_updated_at%'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_updated_at ON %I.%I', r.trigger_schema, r.event_object_table);
    EXECUTE format('CREATE TRIGGER update_updated_at BEFORE UPDATE ON %I.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', r.trigger_schema, r.event_object_table);
  END LOOP;
END $$;

-- Drop unused indexes
DROP INDEX IF EXISTS idx_integration_types_type;
DROP INDEX IF EXISTS idx_integration_types_category;
DROP INDEX IF EXISTS idx_integration_types_slug;
DROP INDEX IF EXISTS idx_user_integrations_user_id;
DROP INDEX IF EXISTS idx_user_integrations_status;
DROP INDEX IF EXISTS idx_user_integrations_type_id;
DROP INDEX IF EXISTS idx_integration_logs_user_integration_id;
DROP INDEX IF EXISTS idx_integration_logs_created_at;
DROP INDEX IF EXISTS idx_integration_health_metrics_user_integration_id;
DROP INDEX IF EXISTS idx_integration_health_metrics_checked_at;