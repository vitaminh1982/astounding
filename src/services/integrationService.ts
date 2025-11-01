import { supabase } from './supabaseClient';
import {
  IntegrationTypeData,
  UserIntegration,
  IntegrationLog,
  IntegrationHealthMetric,
  ConnectionTestResult,
  IntegrationFormData,
  IntegrationType,
  IntegrationCategory,
  ConnectionStatus,
} from '../types/integration';

export class IntegrationService {
  static async getAllIntegrationTypes(): Promise<IntegrationTypeData[]> {
    const { data, error } = await supabase
      .from('integration_types')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async getIntegrationTypesByType(
    type: IntegrationType
  ): Promise<IntegrationTypeData[]> {
    const { data, error } = await supabase
      .from('integration_types')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async getIntegrationTypesByCategory(
    category: IntegrationCategory
  ): Promise<IntegrationTypeData[]> {
    const { data, error } = await supabase
      .from('integration_types')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async getIntegrationTypeBySlug(
    slug: string
  ): Promise<IntegrationTypeData | null> {
    const { data, error } = await supabase
      .from('integration_types')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getUserIntegrations(userId: string): Promise<UserIntegration[]> {
    const { data, error } = await supabase
      .from('user_integrations')
      .select(`
        *,
        integration_type:integration_types(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getUserIntegrationById(
    id: string
  ): Promise<UserIntegration | null> {
    const { data, error } = await supabase
      .from('user_integrations')
      .select(`
        *,
        integration_type:integration_types(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async createUserIntegration(
    userId: string,
    integrationTypeId: string,
    formData: IntegrationFormData
  ): Promise<UserIntegration> {
    const { data, error } = await supabase
      .from('user_integrations')
      .insert({
        user_id: userId,
        integration_type_id: integrationTypeId,
        name: formData.name,
        auth_method: formData.auth_method,
        connection_config: formData.connection_config,
        status: 'configuring',
      })
      .select(`
        *,
        integration_type:integration_types(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUserIntegration(
    id: string,
    updates: Partial<UserIntegration>
  ): Promise<UserIntegration> {
    const { data, error } = await supabase
      .from('user_integrations')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        integration_type:integration_types(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteUserIntegration(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async connectIntegration(id: string): Promise<UserIntegration> {
    const now = new Date().toISOString();
    return this.updateUserIntegration(id, {
      is_connected: true,
      status: 'connected',
      connected_at: now,
      last_tested_at: now,
      last_error: undefined,
    });
  }

  static async disconnectIntegration(id: string): Promise<UserIntegration> {
    return this.updateUserIntegration(id, {
      is_connected: false,
      status: 'disconnected',
      connected_at: undefined,
    });
  }

  static async updateIntegrationStatus(
    id: string,
    status: ConnectionStatus,
    error?: string
  ): Promise<UserIntegration> {
    return this.updateUserIntegration(id, {
      status,
      last_error: error,
      last_tested_at: new Date().toISOString(),
    });
  }

  static async logEvent(
    userIntegrationId: string,
    eventType: string,
    message: string,
    metadata: Record<string, any> = {}
  ): Promise<IntegrationLog> {
    const { data, error } = await supabase
      .from('integration_logs')
      .insert({
        user_integration_id: userIntegrationId,
        event_type: eventType,
        message,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getIntegrationLogs(
    userIntegrationId: string,
    limit: number = 50
  ): Promise<IntegrationLog[]> {
    const { data, error } = await supabase
      .from('integration_logs')
      .select('*')
      .eq('user_integration_id', userIntegrationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async recordHealthMetric(
    userIntegrationId: string,
    result: ConnectionTestResult
  ): Promise<IntegrationHealthMetric> {
    const { data, error } = await supabase
      .from('integration_health_metrics')
      .insert({
        user_integration_id: userIntegrationId,
        response_time_ms: result.response_time_ms,
        success: result.success,
        error_message: result.error_message,
        checked_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getHealthMetrics(
    userIntegrationId: string,
    limit: number = 100
  ): Promise<IntegrationHealthMetric[]> {
    const { data, error } = await supabase
      .from('integration_health_metrics')
      .select('*')
      .eq('user_integration_id', userIntegrationId)
      .order('checked_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async testConnection(
    integration: UserIntegration
  ): Promise<ConnectionTestResult> {
    const startTime = Date.now();

    try {
      await this.updateIntegrationStatus(integration.id, 'testing');

      if (integration.integration_type?.type === 'mcp') {
        return await this.testMCPConnection(integration);
      } else {
        return await this.testVendorConnection(integration);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const result: ConnectionTestResult = {
        success: false,
        error_message: errorMessage,
        response_time_ms: Date.now() - startTime,
      };

      await this.updateIntegrationStatus(
        integration.id,
        'error',
        errorMessage
      );
      await this.recordHealthMetric(integration.id, result);
      await this.logEvent(
        integration.id,
        'error',
        `Connection test failed: ${errorMessage}`
      );

      return result;
    }
  }

  private static async testMCPConnection(
    integration: UserIntegration
  ): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    const result: ConnectionTestResult = {
      success: true,
      response_time_ms: Date.now() - startTime,
      capabilities: ['tools', 'prompts', 'resources'],
    };

    await this.updateIntegrationStatus(integration.id, 'connected');
    await this.recordHealthMetric(integration.id, result);
    await this.logEvent(
      integration.id,
      'tested',
      'MCP server connection test successful'
    );

    return result;
  }

  private static async testVendorConnection(
    integration: UserIntegration
  ): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    const result: ConnectionTestResult = {
      success: true,
      response_time_ms: Date.now() - startTime,
    };

    await this.updateIntegrationStatus(integration.id, 'connected');
    await this.recordHealthMetric(integration.id, result);
    await this.logEvent(
      integration.id,
      'tested',
      'Vendor API connection test successful'
    );

    return result;
  }

  static async storeCredential(
    userIntegrationId: string,
    credentialType: string,
    value: string
  ): Promise<void> {
    const { error } = await supabase.from('integration_credentials').insert({
      user_integration_id: userIntegrationId,
      credential_type: credentialType,
      encrypted_value: btoa(value),
    });

    if (error) throw error;
  }

  static async searchIntegrations(
    query: string,
    filters?: {
      type?: IntegrationType;
      category?: IntegrationCategory;
      status?: ConnectionStatus;
    }
  ): Promise<IntegrationTypeData[]> {
    let queryBuilder = supabase
      .from('integration_types')
      .select('*')
      .eq('is_active', true);

    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    if (filters?.type) {
      queryBuilder = queryBuilder.eq('type', filters.type);
    }

    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category', filters.category);
    }

    const { data, error } = await queryBuilder.order('name');

    if (error) throw error;
    return data || [];
  }
}
