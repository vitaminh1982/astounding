# Integration System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ NewIntegrations  │  │  ConnectionModal │  │ Integration  │ │
│  │      Page        │  │                  │  │    Card      │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│            │                     │                    │          │
│            └─────────────────────┴────────────────────┘          │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Component Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  MCPServerForm   │              │  VendorAPIForm   │        │
│  │                  │              │                  │        │
│  │  • Protocol      │              │  • Auth Method   │        │
│  │  • Command       │              │  • API Key       │        │
│  │  • Args          │              │  • OAuth         │        │
│  │  • Env Vars      │              │  • Webhooks      │        │
│  └──────────────────┘              └──────────────────┘        │
│            │                                  │                  │
│            └──────────────────────────────────┘                  │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Service Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                   IntegrationService                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  • getAllIntegrationTypes()                               │  │
│  │  • getUserIntegrations()                                  │  │
│  │  • createUserIntegration()                                │  │
│  │  • connectIntegration()                                   │  │
│  │  • testConnection()                                       │  │
│  │  • recordHealthMetric()                                   │  │
│  │  • logEvent()                                             │  │
│  │  • storeCredential()                                      │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database Layer (Supabase)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ integration_     │  │ user_            │  │ integration_ │ │
│  │    types         │  │ integrations     │  │ credentials  │ │
│  │                  │  │                  │  │              │ │
│  │ • id             │  │ • id             │  │ • id         │ │
│  │ • name           │  │ • user_id        │  │ • user_int.. │ │
│  │ • type           │  │ • type_id        │  │ • encrypted  │ │
│  │ • category       │  │ • name           │  │ • expires_at │ │
│  │ • config_schema  │  │ • status         │  │              │ │
│  └──────────────────┘  │ • config         │  └──────────────┘ │
│                        └──────────────────┘                     │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────────────────────┐   │
│  │ integration_     │  │ integration_health_metrics       │   │
│  │    logs          │  │                                  │   │
│  │                  │  │ • id                             │   │
│  │ • id             │  │ • user_integration_id            │   │
│  │ • user_int_id    │  │ • response_time_ms               │   │
│  │ • event_type     │  │ • success                        │   │
│  │ • message        │  │ • error_message                  │   │
│  │ • metadata       │  │ • checked_at                     │   │
│  └──────────────────┘  └──────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Connection Creation Flow

```
User Action
    │
    ▼
┌─────────────────────┐
│  Click "Connect"    │
│  on Integration     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│  Open ConnectionModal       │
│  with Integration Type      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Render Type-Specific Form  │
│  (MCP or Vendor)            │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  User Fills Form            │
│  • Name                     │
│  • Auth Method              │
│  • Credentials              │
│  • Configuration            │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Submit Form                │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  IntegrationService.createUserIntegration()│
│  • Validates data                        │
│  • Creates record in user_integrations   │
│  • Returns new integration               │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  IntegrationService.storeCredential()   │
│  • Encodes credentials                  │
│  • Stores in integration_credentials    │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  IntegrationService.connectIntegration()│
│  • Updates status to "connected"        │
│  • Sets connected_at timestamp          │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  IntegrationService.logEvent()          │
│  • Creates log entry                    │
│  • Records "connected" event            │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  UI Updates                 │
│  • Closes modal             │
│  • Shows success toast      │
│  • Refreshes integration    │
│    list                     │
└─────────────────────────────┘
```

### Connection Testing Flow

```
User Action
    │
    ▼
┌─────────────────────────────┐
│  Click "Test Connection"    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  IntegrationService.testConnection()    │
│  • Updates status to "testing"          │
└──────────┬──────────────────────────────┘
           │
           ├─── MCP Server ───┐
           │                  │
           ▼                  ▼
┌──────────────────┐   ┌──────────────────┐
│ testMCPConnection│   │testVendorConnection│
│                  │   │                  │
│ • Validates      │   │ • Makes API call │
│   protocol       │   │ • Checks response│
│ • Tests command  │   │ • Verifies auth  │
│ • Checks env     │   │                  │
└──────────┬───────┘   └──────────┬───────┘
           │                      │
           └──────────┬───────────┘
                      │
                      ▼
┌─────────────────────────────────────────┐
│  Record Test Result                     │
│  • response_time_ms                     │
│  • success (boolean)                    │
│  • error_message (if failed)            │
└──────────┬──────────────────────────────┘
           │
           ├─ Success ─┐       ┌─ Failure ─┐
           │           │       │            │
           ▼           ▼       ▼            ▼
┌──────────────┐  ┌───────────────┐  ┌──────────────┐
│ Update status│  │recordHealthMetric│ │Update status │
│ "connected"  │  │ • Save metrics │  │ "error"      │
└──────────────┘  │ • Log success  │  │ • Save error │
                  └───────────────┘  └──────────────┘
           │                                 │
           └─────────────┬───────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────┐
│  UI Updates                             │
│  • Shows success/error message          │
│  • Updates status indicator             │
│  • Displays test results                │
└─────────────────────────────────────────┘
```

## Component Hierarchy

```
App
 └── NewIntegrationsPage
      ├── SearchBar
      ├── Filters
      │    ├── TypeFilter (MCP/Vendor/All)
      │    └── CategoryFilter
      │
      ├── Connected Integrations Section
      │    └── EnhancedIntegrationCard (multiple)
      │         ├── Icon
      │         ├── Type Badge (MCP/API)
      │         ├── Status Indicator
      │         ├── Connection Info
      │         └── Action Button
      │
      ├── Available Integrations Section
      │    └── EnhancedIntegrationCard (multiple)
      │
      └── ConnectionModal
           ├── Modal Header
           │    ├── Integration Icon
           │    ├── Integration Name
           │    └── Close Button
           │
           ├── Alert (Test Results)
           │
           ├── Form (Type-Specific)
           │    ├── MCPServerForm
           │    │    ├── Name Input
           │    │    ├── Protocol Selector
           │    │    ├── Command/URL Input
           │    │    ├── Arguments Input
           │    │    ├── Auth Method Selector
           │    │    └── Environment Variables
           │    │
           │    └── VendorAPIForm
           │         ├── Name Input
           │         ├── Auth Info Banner
           │         ├── Auth Method Selector
           │         ├── Credentials Input
           │         ├── Webhook Config
           │         └── Advanced Options
           │
           └── Modal Footer
                ├── Test Connection Button
                └── Disconnect Button
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
│  • User authentication via Supabase Auth                    │
│  • JWT tokens for API requests                             │
│  • No sensitive data stored in browser                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  API/Service Layer                           │
│  • All requests authenticated with JWT                      │
│  • Credentials encoded before storage                       │
│  • No plaintext credentials in logs                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database Layer (RLS)                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Row Level Security Policies                          │  │
│  │                                                        │  │
│  │  • users can only access own integrations            │  │
│  │  • credentials filtered by user_id                   │  │
│  │  • logs restricted to owned integrations             │  │
│  │  • health metrics filtered by ownership              │  │
│  │  • integration types publicly readable               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Data Encryption                                       │  │
│  │                                                        │  │
│  │  • Credentials base64 encoded                         │  │
│  │  • Sensitive config encrypted at rest                │  │
│  │  • TLS for all database connections                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Type System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Integration Types                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  IntegrationType                                            │
│  ├── 'mcp'                                                  │
│  ├── 'vendor'                                               │
│  └── 'custom'                                               │
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │   MCP Servers        │    │   Vendor APIs        │      │
│  ├──────────────────────┤    ├──────────────────────┤      │
│  │ • stdio Protocol     │    │ • REST APIs          │      │
│  │ • http Protocol      │    │ • GraphQL APIs       │      │
│  │ • sse Protocol       │    │ • OAuth Providers    │      │
│  │                      │    │ • Webhook Handlers   │      │
│  │ MCPServerConfig      │    │ VendorAPIConfig      │      │
│  │ ├── protocol         │    │ ├── api_url          │      │
│  │ ├── command          │    │ ├── api_version      │      │
│  │ ├── args             │    │ ├── oauth_provider   │      │
│  │ ├── url              │    │ ├── scopes           │      │
│  │ ├── env              │    │ ├── webhook_url      │      │
│  │ └── auth             │    │ └── rate_limit       │      │
│  └──────────────────────┘    └──────────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Authentication Methods                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AuthMethod                                                 │
│  ├── 'api_key'      → Simple key-based auth                │
│  ├── 'oauth'        → OAuth 2.0 flow                       │
│  ├── 'jwt'          → JSON Web Tokens                      │
│  ├── 'certificate'  → SSL/TLS certificates                 │
│  ├── 'ssh_key'      → SSH key authentication               │
│  ├── 'basic'        → Username/password                    │
│  └── 'none'         → No authentication                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 Connection Status                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ConnectionStatus                                           │
│  ├── 'connected'    → Active and working                   │
│  ├── 'disconnected' → Not connected                        │
│  ├── 'error'        → Connection failed                    │
│  ├── 'testing'      → Currently being tested               │
│  └── 'configuring'  → Being set up                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring & Logging Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Integration Event                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │               │
        ▼              ▼               ▼
┌─────────────┐  ┌──────────┐  ┌────────────┐
│   Success   │  │  Error   │  │   Config   │
│   Event     │  │  Event   │  │   Change   │
└──────┬──────┘  └────┬─────┘  └─────┬──────┘
       │              │               │
       └──────────────┼───────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│         IntegrationService.logEvent()                        │
│                                                              │
│  • Creates log entry                                        │
│  • Records event_type, message, metadata                   │
│  • Timestamps the event                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         Database: integration_logs                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ id | user_int_id | event_type | message | metadata │    │
│  ├────────────────────────────────────────────────────┤    │
│  │ Queryable, filterable, analyzable                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Health Monitoring                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌─────────────────┐          ┌─────────────────┐
│ Manual Test     │          │ Automatic Check │
│ (User Triggered)│          │ (Background)    │
└────────┬────────┘          └────────┬────────┘
         │                            │
         └────────────┬───────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│    IntegrationService.recordHealthMetric()                   │
│                                                              │
│  • Records response_time_ms                                 │
│  • Records success/failure                                  │
│  • Stores error_message if failed                          │
│  • Timestamps the check                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│      Database: integration_health_metrics                    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ id | user_int | response_ms | success | checked_at │    │
│  ├────────────────────────────────────────────────────┤    │
│  │ Aggregatable for trends and analytics              │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Implementation
- Direct database queries from service layer
- No caching layer
- Synchronous connection testing
- Single-user focused

### Future Enhancements
```
┌─────────────────────────────────────────────────────────────┐
│                 Enhanced Architecture                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Client Layer                                               │
│  └── React Query / SWR for caching                          │
│                                                              │
│  Service Layer                                              │
│  ├── Connection pool management                             │
│  ├── Rate limiting per integration                          │
│  ├── Queue for background testing                           │
│  └── Webhook processing service                             │
│                                                              │
│  Cache Layer (Optional)                                     │
│  ├── Redis for hot data                                     │
│  └── Integration status cache                               │
│                                                              │
│  Database Layer                                             │
│  ├── Read replicas for analytics                            │
│  ├── Partitioning for logs                                  │
│  └── Archival for old metrics                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

This architecture provides a solid foundation for a production-grade integration system that can scale with your needs while maintaining security and performance.
