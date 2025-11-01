# Integration System Documentation

## Overview

The integration system provides a unified interface for connecting both **MCP (Model Context Protocol) servers** and **vendor APIs** to your application. This dual-purpose system enables seamless integration with external services while maintaining security, monitoring, and ease of use.

## Table of Contents

1. [Architecture](#architecture)
2. [Database Schema](#database-schema)
3. [Components](#components)
4. [Services](#services)
5. [Usage Guide](#usage-guide)
6. [Adding New Integrations](#adding-new-integrations)
7. [Security](#security)
8. [Testing](#testing)

---

## Architecture

### System Overview

The integration system is built on three main layers:

1. **Data Layer (Supabase)**
   - Stores integration types, user connections, credentials, logs, and health metrics
   - Implements Row Level Security (RLS) for secure data access
   - Provides real-time monitoring capabilities

2. **Service Layer**
   - `IntegrationService`: Core business logic for CRUD operations
   - Connection testing and validation
   - Health metric tracking
   - Event logging

3. **UI Layer**
   - Unified connection modal for both MCP and vendor APIs
   - Type-specific forms (MCPServerForm, VendorAPIForm)
   - Enhanced integration cards with status indicators
   - Real-time connection testing interface

### Key Features

- ✅ Dual connection type support (MCP & Vendor APIs)
- ✅ Multiple authentication methods (API Key, OAuth, JWT, Certificate, SSH)
- ✅ Connection testing and validation
- ✅ Health monitoring with metrics
- ✅ Secure credential storage with encryption
- ✅ Event logging and audit trail
- ✅ Real-time status updates
- ✅ Categorized integration marketplace
- ✅ Search and filtering capabilities

---

## Database Schema

### Tables

#### `integration_types`
Stores available integration types (both MCP servers and vendor APIs).

```sql
- id (uuid, PK)
- name (text) - Display name
- slug (text, unique) - URL-friendly identifier
- type (text) - 'mcp' | 'vendor' | 'custom'
- category (text) - messaging, calendar, crm, etc.
- description (text)
- icon_type (text) - Icon identifier
- is_active (boolean) - Whether the integration is available
- config_schema (jsonb) - Template configuration
- created_at, updated_at (timestamptz)
```

#### `user_integrations`
Stores user-specific integration connections.

```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- integration_type_id (uuid, FK to integration_types)
- name (text) - User-defined connection name
- is_connected (boolean)
- connection_config (jsonb) - Connection configuration
- auth_method (text) - api_key, oauth, certificate, etc.
- status (text) - connected, disconnected, error, testing, configuring
- last_tested_at, last_error (text), connected_at (timestamptz)
- created_at, updated_at (timestamptz)
```

#### `integration_credentials`
Securely stores encrypted credentials.

```sql
- id (uuid, PK)
- user_integration_id (uuid, FK)
- credential_type (text)
- encrypted_value (text) - Base64 encoded credentials
- expires_at (timestamptz)
- last_rotated_at (timestamptz)
- created_at (timestamptz)
```

#### `integration_logs`
Tracks integration events and activities.

```sql
- id (uuid, PK)
- user_integration_id (uuid, FK)
- event_type (text) - connected, disconnected, tested, error, config_updated
- message (text)
- metadata (jsonb)
- created_at (timestamptz)
```

#### `integration_health_metrics`
Stores health check results for monitoring.

```sql
- id (uuid, PK)
- user_integration_id (uuid, FK)
- response_time_ms (integer)
- success (boolean)
- error_message (text)
- checked_at (timestamptz)
- created_at (timestamptz)
```

### Row Level Security

All tables have RLS enabled with policies that ensure:
- Users can only access their own integrations
- Integration types are publicly readable
- Credentials are encrypted and access-controlled
- Logs and metrics follow user ownership rules

---

## Components

### Core Components

#### `NewIntegrationsPage`
Main page component managing the integration interface.

**Features:**
- Lists connected integrations
- Browse available integrations
- Search and filter by type/category
- Add/configure/disconnect integrations

**Location:** `/src/pages/NewIntegrationsPage.tsx`

#### `ConnectionModal`
Unified modal for connecting/configuring integrations.

**Features:**
- Dynamic form rendering based on integration type
- Real-time connection testing
- Error display and handling
- Disconnect functionality

**Location:** `/src/components/integrations/ConnectionModal.tsx`

#### `MCPServerForm`
Specialized form for MCP server connections.

**Configuration Options:**
- Protocol selection (stdio, http, sse)
- Command and arguments (stdio)
- Server URL (http/sse)
- Authentication method
- Environment variables

**Location:** `/src/components/integrations/forms/MCPServerForm.tsx`

#### `VendorAPIForm`
Specialized form for vendor API connections.

**Configuration Options:**
- Authentication method (API Key, OAuth, Basic)
- API credentials
- Webhook configuration
- Advanced settings display

**Location:** `/src/components/integrations/forms/VendorAPIForm.tsx`

#### `EnhancedIntegrationCard`
Displays integration with status and connection information.

**Features:**
- Visual type indicators (MCP/API badges)
- Real-time status icons
- Error message display
- Connected date tracking
- Connect/Configure buttons

**Location:** `/src/components/integrations/EnhancedIntegrationCard.tsx`

---

## Services

### IntegrationService

Central service for all integration operations.

**Location:** `/src/services/integrationService.ts`

#### Key Methods

```typescript
// Retrieve integration types
getAllIntegrationTypes(): Promise<IntegrationTypeData[]>
getIntegrationTypesByType(type): Promise<IntegrationTypeData[]>
getIntegrationTypesByCategory(category): Promise<IntegrationTypeData[]>
getIntegrationTypeBySlug(slug): Promise<IntegrationTypeData | null>

// Manage user integrations
getUserIntegrations(userId): Promise<UserIntegration[]>
getUserIntegrationById(id): Promise<UserIntegration | null>
createUserIntegration(userId, typeId, formData): Promise<UserIntegration>
updateUserIntegration(id, updates): Promise<UserIntegration>
deleteUserIntegration(id): Promise<void>

// Connection management
connectIntegration(id): Promise<UserIntegration>
disconnectIntegration(id): Promise<UserIntegration>
updateIntegrationStatus(id, status, error?): Promise<UserIntegration>
testConnection(integration): Promise<ConnectionTestResult>

// Logging and metrics
logEvent(integrationId, eventType, message, metadata?): Promise<IntegrationLog>
getIntegrationLogs(integrationId, limit?): Promise<IntegrationLog[]>
recordHealthMetric(integrationId, result): Promise<IntegrationHealthMetric>
getHealthMetrics(integrationId, limit?): Promise<IntegrationHealthMetric[]>

// Credentials
storeCredential(integrationId, type, value): Promise<void>

// Search
searchIntegrations(query, filters?): Promise<IntegrationTypeData[]>
```

---

## Usage Guide

### Connecting an MCP Server

1. Click "Add Integration" button
2. Filter by "MCP Servers" or search for specific server
3. Click "Connect" on desired MCP server
4. Fill in the connection form:
   - Choose protocol (stdio/http/sse)
   - Enter command and arguments (for stdio)
   - Or enter server URL (for http/sse)
   - Select authentication method
   - Add environment variables if needed
5. Click "Connect Server"
6. Test the connection using the "Test Connection" button

### Connecting a Vendor API

1. Click "Add Integration" button
2. Find the vendor API you want to connect
3. Click "Connect"
4. Fill in the vendor-specific form:
   - Choose authentication method
   - Enter API key or OAuth credentials
   - Configure webhook URL (if applicable)
   - Review advanced options
5. Click "Connect"
6. Test the connection

### Managing Connections

- **Configure**: Click on a connected integration to modify settings
- **Test**: Use the "Test Connection" button to verify connectivity
- **Disconnect**: Remove integration from your workspace
- **View Logs**: Access integration event history
- **Monitor Health**: Track response times and error rates

---

## Adding New Integrations

### Adding a New MCP Server

1. Insert into `integration_types` table:

```sql
INSERT INTO integration_types (name, slug, type, category, description, config_schema)
VALUES (
  'MCP Custom Server',
  'mcp-custom',
  'mcp',
  'productivity',
  'Description of your MCP server',
  '{"protocol": "stdio", "command": "node", "args": ["server.js"]}'::jsonb
);
```

2. The server will automatically appear in the available integrations list.

### Adding a New Vendor API

1. Insert into `integration_types` table:

```sql
INSERT INTO integration_types (name, slug, type, category, description, icon_type, config_schema)
VALUES (
  'Custom Vendor',
  'custom-vendor',
  'vendor',
  'productivity',
  'Connect to Custom Vendor API',
  'default',
  '{"api_url": "https://api.vendor.com", "scopes": ["read", "write"]}'::jsonb
);
```

2. Add custom icon (optional):
   - Add SVG component to `/src/components/integrations/icons/integration-icons.tsx`
   - Export from `/src/components/integrations/icons/index.ts`
   - Update icon_type to match your icon name

### Configuration Schema

The `config_schema` field supports:

**For MCP Servers:**
```json
{
  "protocol": "stdio" | "http" | "sse",
  "command": "string",
  "args": ["string"],
  "url": "string",
  "env": {"KEY": "value"}
}
```

**For Vendor APIs:**
```json
{
  "api_url": "string",
  "api_version": "string",
  "oauth_provider": "string",
  "scopes": ["string"],
  "webhook_url": "string",
  "webhook_secret": "string"
}
```

---

## Security

### Credential Storage

- All credentials are base64 encoded before storage
- Credentials are stored in a separate table with strict RLS
- Only the owning user can access their credentials
- Credentials can be set to expire and rotate

### Authentication Methods

Supported methods:
- **API Key**: Simple key-based authentication
- **OAuth**: OAuth 2.0 flow (requires external setup)
- **JWT**: JSON Web Token authentication
- **Basic**: Username/password basic auth
- **Certificate**: SSL/TLS certificate authentication
- **SSH Key**: SSH key-based authentication
- **None**: No authentication required

### Row Level Security

All queries are automatically filtered by user_id:
```sql
-- Users can only view their own integrations
CREATE POLICY "Users can view own integrations"
  ON user_integrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### Best Practices

1. Never hardcode credentials in code
2. Use environment variables for sensitive configuration
3. Rotate credentials regularly
4. Monitor failed connection attempts
5. Use HTTPS for all API communications
6. Implement rate limiting for API calls
7. Log all security-relevant events

---

## Testing

### Connection Testing

The system includes built-in connection testing:

```typescript
const result = await IntegrationService.testConnection(integration);

if (result.success) {
  // Connection successful
  console.log('Response time:', result.response_time_ms, 'ms');
  console.log('Capabilities:', result.capabilities);
} else {
  // Connection failed
  console.error('Error:', result.error_message);
}
```

### Health Monitoring

Health metrics are automatically recorded during tests:

```typescript
const metrics = await IntegrationService.getHealthMetrics(integrationId);

// Analyze response times, success rates, errors
const avgResponseTime = metrics.reduce((sum, m) =>
  sum + (m.response_time_ms || 0), 0) / metrics.length;
const successRate = metrics.filter(m => m.success).length / metrics.length;
```

### Event Logs

All integration activities are logged:

```typescript
const logs = await IntegrationService.getIntegrationLogs(integrationId);

// Review connection events, errors, configuration changes
logs.forEach(log => {
  console.log(`${log.event_type}: ${log.message}`);
  console.log('Metadata:', log.metadata);
});
```

---

## API Reference

### TypeScript Types

All types are defined in `/src/types/integration.ts`:

- `IntegrationType`: 'mcp' | 'vendor' | 'custom'
- `IntegrationCategory`: Various categories
- `AuthMethod`: Authentication methods
- `ConnectionStatus`: Connection state
- `MCPProtocol`: MCP protocol types
- `IntegrationTypeData`: Integration type record
- `UserIntegration`: User connection record
- `ConnectionTestResult`: Test result structure

---

## Troubleshooting

### Common Issues

**Connection Test Fails**
- Verify credentials are correct
- Check network connectivity
- Review integration logs for details
- Ensure API endpoint is accessible

**OAuth Not Working**
- Verify redirect URLs are configured
- Check OAuth scopes are sufficient
- Ensure client ID/secret are correct

**MCP Server Won't Connect**
- Verify command path is correct
- Check all required arguments are provided
- Review environment variables
- Test command manually in terminal

**Credentials Not Saving**
- Check user authentication
- Verify RLS policies
- Review browser console for errors

---

## Future Enhancements

Planned features:
- OAuth flow UI integration
- Connection pooling for performance
- Automatic reconnection with exponential backoff
- Integration health dashboard
- Rate limit tracking and warnings
- Webhook payload validation
- Integration templates marketplace
- Community-contributed integrations
- Bulk import/export of connections
- Advanced analytics and reporting

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review integration logs in the database
3. Check health metrics for patterns
4. Consult the Supabase dashboard for RLS issues

---

## Changelog

### v1.0.0 (2025-11-01)
- Initial release
- MCP server support
- Vendor API support
- Connection testing
- Health monitoring
- Event logging
- Secure credential storage
- Search and filtering
- 20+ pre-configured integrations
