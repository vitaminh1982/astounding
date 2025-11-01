/*
  # Integration System Schema

  ## Overview
  Creates a comprehensive schema for managing both MCP server connections and vendor API integrations.

  ## New Tables

  ### `integration_types`
  - `id` (uuid, primary key)
  - `name` (text) - Integration name
  - `slug` (text, unique) - URL-friendly identifier
  - `type` (text) - 'mcp' or 'vendor'
  - `category` (text) - messaging, calendar, crm, etc.
  - `description` (text)
  - `icon_type` (text)
  - `is_active` (boolean)
  - `config_schema` (jsonb) - Template configuration
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `user_integrations`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `integration_type_id` (uuid, foreign key to integration_types)
  - `name` (text) - User-defined name
  - `is_connected` (boolean)
  - `connection_config` (jsonb) - Encrypted configuration
  - `auth_method` (text) - api_key, oauth, certificate, ssh_key, jwt, basic
  - `status` (text) - connected, disconnected, error, testing
  - `last_tested_at` (timestamptz)
  - `last_error` (text)
  - `connected_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `integration_credentials`
  - `id` (uuid, primary key)
  - `user_integration_id` (uuid, foreign key to user_integrations)
  - `credential_type` (text)
  - `encrypted_value` (text) - Encrypted credentials
  - `expires_at` (timestamptz)
  - `last_rotated_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `integration_logs`
  - `id` (uuid, primary key)
  - `user_integration_id` (uuid, foreign key to user_integrations)
  - `event_type` (text) - connected, disconnected, tested, error, config_updated
  - `message` (text)
  - `metadata` (jsonb)
  - `created_at` (timestamptz)

  ### `integration_health_metrics`
  - `id` (uuid, primary key)
  - `user_integration_id` (uuid, foreign key to user_integrations)
  - `response_time_ms` (integer)
  - `success` (boolean)
  - `error_message` (text)
  - `checked_at` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own integrations
  - Credentials are stored encrypted

  ## Indexes
  - Add indexes for frequently queried columns
*/

-- Create integration_types table
CREATE TABLE IF NOT EXISTS integration_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('mcp', 'vendor', 'custom')),
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon_type text NOT NULL DEFAULT 'default',
  is_active boolean DEFAULT true,
  config_schema jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_integrations table
CREATE TABLE IF NOT EXISTS user_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type_id uuid NOT NULL REFERENCES integration_types(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_connected boolean DEFAULT false,
  connection_config jsonb DEFAULT '{}'::jsonb,
  auth_method text CHECK (auth_method IN ('api_key', 'oauth', 'certificate', 'ssh_key', 'jwt', 'basic', 'none')),
  status text DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'testing', 'configuring')),
  last_tested_at timestamptz,
  last_error text,
  connected_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create integration_credentials table
CREATE TABLE IF NOT EXISTS integration_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_integration_id uuid NOT NULL REFERENCES user_integrations(id) ON DELETE CASCADE,
  credential_type text NOT NULL,
  encrypted_value text NOT NULL,
  expires_at timestamptz,
  last_rotated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create integration_logs table
CREATE TABLE IF NOT EXISTS integration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_integration_id uuid NOT NULL REFERENCES user_integrations(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('connected', 'disconnected', 'tested', 'error', 'config_updated', 'credential_rotated')),
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create integration_health_metrics table
CREATE TABLE IF NOT EXISTS integration_health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_integration_id uuid NOT NULL REFERENCES user_integrations(id) ON DELETE CASCADE,
  response_time_ms integer,
  success boolean NOT NULL,
  error_message text,
  checked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_integration_types_type ON integration_types(type);
CREATE INDEX IF NOT EXISTS idx_integration_types_category ON integration_types(category);
CREATE INDEX IF NOT EXISTS idx_integration_types_slug ON integration_types(slug);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_status ON user_integrations(status);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type_id ON user_integrations(integration_type_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_user_integration_id ON integration_logs(user_integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_created_at ON integration_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_integration_health_metrics_user_integration_id ON integration_health_metrics(user_integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_health_metrics_checked_at ON integration_health_metrics(checked_at DESC);

-- Enable Row Level Security
ALTER TABLE integration_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_health_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integration_types (public read, admin write)
CREATE POLICY "Anyone can view integration types"
  ON integration_types
  FOR SELECT
  USING (true);

-- RLS Policies for user_integrations
CREATE POLICY "Users can view own integrations"
  ON user_integrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own integrations"
  ON user_integrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integrations"
  ON user_integrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own integrations"
  ON user_integrations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for integration_credentials
CREATE POLICY "Users can view own credentials"
  ON integration_credentials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own credentials"
  ON integration_credentials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own credentials"
  ON integration_credentials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own credentials"
  ON integration_credentials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_credentials.user_integration_id
      AND user_integrations.user_id = auth.uid()
    )
  );

-- RLS Policies for integration_logs
CREATE POLICY "Users can view own integration logs"
  ON integration_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_logs.user_integration_id
      AND user_integrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own integration logs"
  ON integration_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_logs.user_integration_id
      AND user_integrations.user_id = auth.uid()
    )
  );

-- RLS Policies for integration_health_metrics
CREATE POLICY "Users can view own health metrics"
  ON integration_health_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_health_metrics.user_integration_id
      AND user_integrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own health metrics"
  ON integration_health_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_integrations
      WHERE user_integrations.id = integration_health_metrics.user_integration_id
      AND user_integrations.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_integration_types_updated_at
  BEFORE UPDATE ON integration_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
