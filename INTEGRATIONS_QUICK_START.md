# Integrations Quick Start Guide

## 🚀 Getting Started

This guide will help you quickly set up and use the new integration system for connecting MCP servers and vendor APIs.

## Prerequisites

✅ Supabase project configured
✅ Environment variables set (`.env` file)
✅ Application built and running

## 5-Minute Setup

### Step 1: Access the Integrations Page

1. Navigate to the **Integrations** page from the sidebar
2. You'll see a list of available integrations grouped by type

### Step 2: Connect Your First Integration

#### Option A: Connect a Vendor API (e.g., Slack)

1. Click **"Add Integration"** button
2. Search for "Slack" or filter by "Messaging" category
3. Click **"Connect"** on the Slack card
4. Fill in the connection form:
   ```
   Connection Name: My Slack Workspace
   Authentication: API Key
   API Key: xoxb-your-slack-token
   ```
5. Click **"Connect"**
6. Test the connection using **"Test Connection"** button
7. ✅ Done! Your Slack integration is now active

#### Option B: Connect an MCP Server

1. Click **"Add Integration"** button
2. Filter by "MCP Servers"
3. Select an MCP server (e.g., "MCP Memory Server")
4. Configure the server:
   ```
   Connection Name: My Memory Server
   Protocol: stdio
   Command: npx
   Arguments: -y @modelcontextprotocol/server-memory
   Authentication: None
   ```
5. Click **"Connect Server"**
6. Test the connection
7. ✅ Your MCP server is ready!

### Step 3: Verify the Connection

1. Your integration should now appear in "Connected Integrations"
2. Check the status indicator (green = connected, red = error)
3. Click **"Test Connection"** to verify it's working
4. View logs and health metrics in the configuration modal

---

## Common Use Cases

### Use Case 1: Connect Multiple Slack Workspaces

```
1. Add Slack integration (workspace 1)
2. Configure with first workspace's token
3. Add Slack integration again (workspace 2)
4. Configure with second workspace's token
5. Name them distinctly: "Slack - Team A", "Slack - Team B"
```

### Use Case 2: Set Up MCP File System Access

```
Connection Name: Local Files
Protocol: stdio
Command: npx
Arguments: -y @modelcontextprotocol/server-filesystem /path/to/folder
Environment Variables:
  HOME=/Users/yourname
  DEBUG=true
```

### Use Case 3: Connect to a REST API

```
Connection Name: Custom API
Protocol: http
Server URL: https://api.example.com
Authentication: API Key
API Key: your-api-key-here
```

---

## Integration Types Reference

### MCP Servers

Available MCP server integrations:

| Server | Purpose | Protocol | Command |
|--------|---------|----------|---------|
| File System | File access | stdio | `npx -y @modelcontextprotocol/server-filesystem` |
| Git | Git operations | stdio | `npx -y @modelcontextprotocol/server-git` |
| Memory | Knowledge graphs | stdio | `npx -y @modelcontextprotocol/server-memory` |
| Database | Database queries | stdio | Custom |
| HTTP | HTTP-based MCP | http | N/A (URL-based) |
| Brave Search | Web search | stdio | `npx -y @modelcontextprotocol/server-brave-search` |
| Puppeteer | Browser automation | stdio | `npx -y @modelcontextprotocol/server-puppeteer` |

### Vendor APIs

Pre-configured vendor integrations:

| Vendor | Category | Auth Type |
|--------|----------|-----------|
| Slack | Messaging | API Key / OAuth |
| Google Calendar | Calendar | OAuth |
| GitHub | Productivity | API Key / OAuth |
| Salesforce | CRM | OAuth |
| Stripe | Payment | API Key |
| Twilio | Messaging | API Key |
| SendGrid | Email | API Key |
| Zapier | Automation | API Key |
| Shopify | E-commerce | API Key |
| HubSpot | CRM | OAuth |
| Zendesk | CRM | API Key |
| Mailchimp | Email | API Key |
| Asana | Project | API Key |
| Jira | Project | API Key |
| Notion | Productivity | API Key |
| Airtable | Productivity | API Key |
| Discord | Messaging | API Key |

---

## Authentication Methods Guide

### API Key Authentication

Most straightforward method. Get your API key from the vendor's dashboard.

**Example (Stripe):**
```
1. Log in to Stripe Dashboard
2. Go to Developers > API Keys
3. Copy "Secret key"
4. Paste in API Key field
5. Click Connect
```

### OAuth Authentication

For services requiring OAuth (Google, Salesforce, etc.):

**Current Setup:**
1. Select OAuth as authentication method
2. Click "Connect with OAuth"
3. *Note: Full OAuth flow requires additional configuration*
4. For now, use API tokens if available

### Basic Authentication

Username/password based authentication.

**Example:**
```
Username/Client ID: your-username
Password/Client Secret: your-password
```

---

## Testing Connections

### Manual Testing

1. Go to connected integration
2. Click **"Configure"**
3. Click **"Test Connection"** button
4. Wait for result:
   - ✅ Green: Connection successful
   - ❌ Red: Connection failed (see error message)

### Automated Health Monitoring

The system automatically tracks:
- Response times
- Success/failure rates
- Error messages
- Last tested timestamp

View these metrics in the configuration modal.

---

## Troubleshooting

### "Connection Failed" Error

**Check:**
1. ✅ API key is correct and not expired
2. ✅ Network connection is active
3. ✅ API endpoint is accessible
4. ✅ No typos in configuration
5. ✅ Sufficient API permissions/scopes

**Solutions:**
- Copy credentials again from source
- Regenerate API key if expired
- Check firewall/proxy settings
- Review vendor's API status page

### "Authentication Error"

**For API Keys:**
- Verify the key hasn't expired
- Check if you're using test vs. live keys
- Ensure proper key format (with prefixes like `sk_`, `xoxb-`, etc.)

**For OAuth:**
- Verify redirect URLs are configured
- Check OAuth app is approved/published
- Ensure all required scopes are granted

### MCP Server Won't Start

**Common Issues:**
1. Command not found → Check `npx` is installed
2. Permission denied → Check file permissions
3. Module not found → Verify package name
4. Port in use → Change port in config

**Debug Steps:**
```bash
# Test command manually
npx -y @modelcontextprotocol/server-memory

# Check if npx is installed
npx --version

# Verify node is installed
node --version
```

---

## Best Practices

### 🔒 Security

- ✅ Never share API keys publicly
- ✅ Use environment variables for sensitive data
- ✅ Rotate credentials regularly
- ✅ Use read-only keys when possible
- ✅ Monitor for unusual activity

### 📊 Organization

- ✅ Use descriptive connection names
- ✅ Add notes in configuration
- ✅ Group similar integrations together
- ✅ Test connections regularly
- ✅ Document custom configurations

### ⚡ Performance

- ✅ Don't connect unnecessary integrations
- ✅ Monitor response times
- ✅ Set up rate limiting if needed
- ✅ Use webhooks for real-time updates
- ✅ Cache responses when appropriate

---

## Next Steps

### Explore Advanced Features

1. **View Integration Logs**
   - Access detailed event history
   - Debug connection issues
   - Track configuration changes

2. **Monitor Health Metrics**
   - Review response times
   - Analyze success rates
   - Identify performance issues

3. **Custom Integrations**
   - Add your own MCP servers
   - Configure custom vendor APIs
   - Create integration templates

4. **Webhooks Setup**
   - Configure webhook URLs
   - Handle real-time events
   - Process incoming data

### Learn More

- 📚 [Full Documentation](./INTEGRATIONS_DOCUMENTATION.md)
- 🗄️ [Database Schema](./INTEGRATIONS_DOCUMENTATION.md#database-schema)
- 🔧 [API Reference](./INTEGRATIONS_DOCUMENTATION.md#api-reference)
- 🛠️ [Troubleshooting Guide](./INTEGRATIONS_DOCUMENTATION.md#troubleshooting)

---

## Support & Feedback

Need help? Have suggestions?

1. Check the [troubleshooting section](#troubleshooting)
2. Review integration logs in the dashboard
3. Consult the full documentation
4. Check Supabase dashboard for database issues

---

## Quick Reference Card

### Essential Commands

```bash
# Build the project
npm run build

# Start development server
npm run dev

# Check integration logs (SQL)
SELECT * FROM integration_logs
WHERE user_integration_id = 'your-id'
ORDER BY created_at DESC;

# Check health metrics (SQL)
SELECT * FROM integration_health_metrics
WHERE user_integration_id = 'your-id'
ORDER BY checked_at DESC LIMIT 10;
```

### Useful SQL Queries

```sql
-- List all integration types
SELECT name, type, category FROM integration_types;

-- List user's integrations with status
SELECT name, status, connected_at
FROM user_integrations
WHERE user_id = auth.uid();

-- Recent errors
SELECT message, created_at
FROM integration_logs
WHERE event_type = 'error'
ORDER BY created_at DESC LIMIT 5;

-- Health summary
SELECT
  AVG(response_time_ms) as avg_response,
  COUNT(*) FILTER (WHERE success = true) as successes,
  COUNT(*) FILTER (WHERE success = false) as failures
FROM integration_health_metrics
WHERE user_integration_id = 'your-id';
```

---

Happy Integrating! 🎉
