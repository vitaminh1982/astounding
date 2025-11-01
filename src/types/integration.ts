export type IntegrationType = 'mcp' | 'vendor' | 'custom';

export type IntegrationCategory =
  | 'messaging'
  | 'calendar'
  | 'email'
  | 'crm'
  | 'automation'
  | 'ecommerce'
  | 'payment'
  | 'project'
  | 'storage'
  | 'productivity'
  | 'analytics'
  | 'other';

export type AuthMethod =
  | 'api_key'
  | 'oauth'
  | 'certificate'
  | 'ssh_key'
  | 'jwt'
  | 'basic'
  | 'none';

export type ConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'testing'
  | 'configuring';

export type MCPProtocol = 'stdio' | 'http' | 'sse';

export type IntegrationEventType =
  | 'connected'
  | 'disconnected'
  | 'tested'
  | 'error'
  | 'config_updated'
  | 'credential_rotated';

export interface IntegrationTypeData {
  id: string;
  name: string;
  slug: string;
  type: IntegrationType;
  category: IntegrationCategory;
  description: string;
  icon_type: string;
  is_active: boolean;
  config_schema: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MCPServerConfig {
  protocol: MCPProtocol;
  command?: string;
  args?: string[];
  url?: string;
  env?: Record<string, string>;
  cwd?: string;
  auth?: {
    type: AuthMethod;
    credentials?: Record<string, any>;
  };
}

export interface VendorAPIConfig {
  api_url: string;
  api_version?: string;
  oauth_provider?: string;
  scopes?: string[];
  webhook_url?: string;
  webhook_secret?: string;
  rate_limit?: {
    requests_per_minute?: number;
    requests_per_hour?: number;
  };
  custom_headers?: Record<string, string>;
}

export type ConnectionConfig = MCPServerConfig | VendorAPIConfig;

export interface UserIntegration {
  id: string;
  user_id: string;
  integration_type_id: string;
  name: string;
  is_connected: boolean;
  connection_config: ConnectionConfig;
  auth_method: AuthMethod;
  status: ConnectionStatus;
  last_tested_at?: string;
  last_error?: string;
  connected_at?: string;
  created_at: string;
  updated_at: string;
  integration_type?: IntegrationTypeData;
}

export interface IntegrationCredential {
  id: string;
  user_integration_id: string;
  credential_type: string;
  encrypted_value: string;
  expires_at?: string;
  last_rotated_at?: string;
  created_at: string;
}

export interface IntegrationLog {
  id: string;
  user_integration_id: string;
  event_type: IntegrationEventType;
  message: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface IntegrationHealthMetric {
  id: string;
  user_integration_id: string;
  response_time_ms?: number;
  success: boolean;
  error_message?: string;
  checked_at: string;
  created_at: string;
}

export interface ConnectionTestResult {
  success: boolean;
  response_time_ms?: number;
  error_message?: string;
  capabilities?: string[];
  metadata?: Record<string, any>;
}

export interface IntegrationFormData {
  name: string;
  auth_method: AuthMethod;
  connection_config: Partial<ConnectionConfig>;
  credentials?: Record<string, string>;
}

export interface MCPServerFormData extends IntegrationFormData {
  protocol: MCPProtocol;
  command?: string;
  args?: string[];
  url?: string;
  env?: Record<string, string>;
}

export interface VendorAPIFormData extends IntegrationFormData {
  api_key?: string;
  oauth_token?: string;
  client_id?: string;
  client_secret?: string;
  access_token?: string;
  refresh_token?: string;
  webhook_url?: string;
  custom_fields?: Record<string, string>;
}

export interface IntegrationWithDetails extends UserIntegration {
  integration_type: IntegrationTypeData;
  recent_logs?: IntegrationLog[];
  health_metrics?: IntegrationHealthMetric[];
  credentials?: IntegrationCredential[];
}

export interface IntegrationStats {
  total: number;
  connected: number;
  disconnected: number;
  errors: number;
  by_type: Record<IntegrationType, number>;
  by_category: Record<IntegrationCategory, number>;
}
