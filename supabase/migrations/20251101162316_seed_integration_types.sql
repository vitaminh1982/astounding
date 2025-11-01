/*
  # Seed Integration Types

  ## Overview
  Populates the integration_types table with popular MCP servers and vendor APIs.

  ## Integration Types Added
  - MCP Servers: File system, Git, Database, Memory, HTTP
  - Vendor APIs: Slack, Google Calendar, GitHub, Salesforce, Stripe, Twilio, SendGrid, etc.
*/

-- Insert MCP Server integration types
INSERT INTO integration_types (name, slug, type, category, description, icon_type, config_schema) VALUES
  ('MCP File System Server', 'mcp-filesystem', 'mcp', 'storage', 'Connect to file system resources through Model Context Protocol', 'default', '{"protocol": "stdio", "command": "", "args": []}'),
  ('MCP Git Server', 'mcp-git', 'mcp', 'productivity', 'Access Git repositories through Model Context Protocol', 'default', '{"protocol": "stdio", "command": "npx", "args": ["-y", "@modelcontextprotocol/server-git"]}'),
  ('MCP Database Server', 'mcp-database', 'mcp', 'storage', 'Query databases through Model Context Protocol', 'default', '{"protocol": "stdio", "command": "", "args": [], "connection_string": ""}'),
  ('MCP Memory Server', 'mcp-memory', 'mcp', 'storage', 'Persistent memory and knowledge graphs through MCP', 'default', '{"protocol": "stdio", "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"]}'),
  ('MCP HTTP Server', 'mcp-http', 'mcp', 'other', 'Connect to HTTP-based MCP servers', 'default', '{"protocol": "http", "url": "", "auth": {}}'),
  ('MCP Brave Search', 'mcp-brave-search', 'mcp', 'productivity', 'Web search capabilities through Brave Search MCP', 'default', '{"protocol": "stdio", "command": "npx", "args": ["-y", "@modelcontextprotocol/server-brave-search"], "env": {"BRAVE_API_KEY": ""}}'),
  ('MCP Puppeteer', 'mcp-puppeteer', 'mcp', 'automation', 'Browser automation through Puppeteer MCP', 'default', '{"protocol": "stdio", "command": "npx", "args": ["-y", "@modelcontextprotocol/server-puppeteer"]}')
ON CONFLICT (slug) DO NOTHING;

-- Insert Vendor API integration types
INSERT INTO integration_types (name, slug, type, category, description, icon_type, config_schema) VALUES
  ('Slack', 'slack', 'vendor', 'messaging', 'Connect your Slack workspace to send and receive messages directly from the platform.', 'slack', '{"api_url": "https://slack.com/api", "scopes": ["chat:write", "channels:read", "users:read"]}'),
  ('Google Calendar', 'google-calendar', 'vendor', 'calendar', 'Sync your Google Calendar to schedule meetings and track events automatically.', 'google-calendar', '{"oauth_provider": "google", "scopes": ["calendar.readonly", "calendar.events"]}'),
  ('GitHub', 'github', 'vendor', 'productivity', 'Integrate with GitHub repositories, issues, and pull requests.', 'default', '{"api_url": "https://api.github.com", "scopes": ["repo", "read:user"]}'),
  ('Salesforce', 'salesforce', 'vendor', 'crm', 'Connect to Salesforce CRM for managing contacts, leads, and opportunities.', 'default', '{"oauth_provider": "salesforce", "api_version": "v57.0"}'),
  ('Stripe', 'stripe', 'vendor', 'payment', 'Process payments and manage subscriptions with Stripe integration.', 'stripe', '{"api_url": "https://api.stripe.com/v1", "webhook_secret": ""}'),
  ('Twilio', 'twilio', 'vendor', 'messaging', 'Send SMS, make calls, and manage communications with Twilio.', 'default', '{"api_url": "https://api.twilio.com", "account_sid": ""}'),
  ('SendGrid', 'sendgrid', 'vendor', 'email', 'Send transactional and marketing emails through SendGrid.', 'default', '{"api_url": "https://api.sendgrid.com/v3"}'),
  ('Zapier', 'zapier', 'vendor', 'automation', 'Connect to thousands of apps through Zapier to automate your workflow.', 'zapier', '{"webhook_url": ""}'),
  ('Shopify', 'shopify', 'vendor', 'ecommerce', 'Sync your Shopify store products, orders and customers.', 'shopify', '{"shop_url": "", "api_version": "2024-01"}'),
  ('HubSpot', 'hubspot', 'vendor', 'crm', 'Sync contacts, companies and deals with your HubSpot CRM.', 'hubspot', '{"oauth_provider": "hubspot", "scopes": ["crm.objects.contacts.read", "crm.objects.companies.read"]}'),
  ('Zendesk', 'zendesk', 'vendor', 'crm', 'Manage customer support tickets directly from your dashboard.', 'zendesk', '{"subdomain": "", "api_url": "https://{subdomain}.zendesk.com/api/v2"}'),
  ('Outlook', 'outlook', 'vendor', 'email', 'Sync your emails, calendar and contacts with Outlook.', 'outlook', '{"oauth_provider": "microsoft", "scopes": ["Mail.Read", "Calendars.Read"]}'),
  ('Mailchimp', 'mailchimp', 'vendor', 'email', 'Sync your email subscribers and campaigns with Mailchimp.', 'mailchimp', '{"api_url": "https://{dc}.api.mailchimp.com/3.0", "datacenter": ""}'),
  ('Asana', 'asana', 'vendor', 'project', 'Track your project tasks and deadlines with Asana integration.', 'asana', '{"api_url": "https://app.asana.com/api/1.0"}'),
  ('Jira', 'jira', 'vendor', 'project', 'Manage issues and projects in Jira.', 'default', '{"site_url": "", "api_version": "3"}'),
  ('Trello', 'trello', 'vendor', 'project', 'Organize projects with Trello boards and cards.', 'default', '{"api_url": "https://api.trello.com/1"}'),
  ('Notion', 'notion', 'vendor', 'productivity', 'Access and manage Notion pages and databases.', 'default', '{"api_url": "https://api.notion.com/v1"}'),
  ('Airtable', 'airtable', 'vendor', 'productivity', 'Connect to Airtable bases and records.', 'default', '{"api_url": "https://api.airtable.com/v0"}'),
  ('Linear', 'linear', 'vendor', 'project', 'Manage issues and roadmaps with Linear.', 'default', '{"api_url": "https://api.linear.app/graphql"}'),
  ('Discord', 'discord', 'vendor', 'messaging', 'Integrate with Discord servers and channels.', 'default', '{"api_url": "https://discord.com/api/v10"}')
ON CONFLICT (slug) DO NOTHING;
