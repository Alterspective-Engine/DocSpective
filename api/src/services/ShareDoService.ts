/**
 * ShareDo API Service
 * Handles authentication and API calls to ShareDo platform
 */

import { ParticipantType } from "../types/participantType";
import { PartyType } from "../types/partyType";

interface TokenCache {
  accessToken: string;
  expiresAt: number;
  expiresIn: number;
  tokenType: string;
}

export class ShareDoService {
  private tokenCache: TokenCache | null = null;
  private readonly hostname: string;
  private readonly domain: string;
  private readonly username: string;
  private readonly appName: string;
  private readonly appSecret: string;

  constructor() {
    this.hostname = process.env.SHAREDO_HOSTNAME || '';
    this.domain = process.env.SHAREDO_DOMAIN || '';
    this.username = process.env.SHAREDO_USERNAME || '';
    this.appName = process.env.SHAREDO_APPNAME || '';
    this.appSecret = process.env.SHAREDO_APPSECRET || '';

    if (!this.hostname || !this.domain || !this.username || !this.appName || !this.appSecret) {
      throw new Error('Missing required ShareDo environment variables');
    }
  }

  /**
   * Get access token with caching
   */
  async getAccessToken(): Promise<{ access_token: string; expires_in: number; token_type: string; cached: boolean; expires_at: number }> {
    // Check if we have a valid cached token (with 30-second buffer)
    if (this.tokenCache && Date.now() < (this.tokenCache.expiresAt - 30000)) {
      return {
        access_token: this.tokenCache.accessToken,
        expires_in: this.tokenCache.expiresIn,
        token_type: this.tokenCache.tokenType,
        cached: true,
        expires_at: this.tokenCache.expiresAt
      };
    }

    // Get new token
    const tokenUrl = `https://${this.hostname}-identity.${this.domain}/connect/token`;
    const apiKey = Buffer.from(`${this.appName}:${this.appSecret}`).toString('base64');
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${apiKey}`
      },
      body: new URLSearchParams({
        grant_type: 'Impersonate.Specified',
        scope: 'sharedo',
        impersonate_user: this.username,
        impersonate_provider: 'idsrv'
      }),
    });

    if (!response.ok) {
      throw new Error(`ShareDo authentication failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('No access token received from ShareDo');
    }

    const expiresAt = Date.now() + (data.expires_in * 1000);

    // Cache the token (expires_in is in seconds)
    this.tokenCache = {
      accessToken: data.access_token,
      expiresAt,
      expiresIn: data.expires_in,
      tokenType: data.token_type || 'Bearer'
    };

    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type || 'Bearer',
      cached: false,
      expires_at: expiresAt
    };
  }

  /**
   * Make authenticated API call to ShareDo
   */
  private async makeApiCall(endpoint: string): Promise<any> {
    const tokenResponse = await this.getAccessToken();
    const apiUrl = `https://${this.hostname}.${this.domain}${endpoint}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ShareDo API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Check authentication status
   */
  async getAuthStatus(): Promise<{ access_token: string; expires_in: number; token_type: string; cached: boolean; expires_at: number; authenticated: boolean }> {
    try {
      const tokenData = await this.getAccessToken();
      return {
        ...tokenData,
        authenticated: true
      };
    } catch (error) {
      throw error; // Let the caller handle the error
    }
  }

  /**
   * Get documents from ShareDo repository
   */
  async getDocuments(folder?: string): Promise<any> {
    var endpoint = '/api/repository/templates';
    if (folder) {
      endpoint += `/${encodeURIComponent(folder)}`;
    }
    const data = await this.makeApiCall(endpoint);

    // Return simplified response (only items and repositoryUrl)
    return {
      items: data.items || [],
      repositoryUrl: data.repositoryUrl || ''
    };
  }

  async getRepositories(): Promise<any> {
    var endpoint = '/api/repository';
    const data = await this.makeApiCall(endpoint);

    // Return simplified response (only items and repositoryUrl)
    return data;
  }

  /**
   * Get template types
   */
  async getTemplateTypes(): Promise<any> {
    const endpoint = '/api/sharedo/reporting/documentadmincharts/document-templates/types';
    return await this.makeApiCall(endpoint);
  }

  /**
   * Find template type system name by name
   */
  async getTemplateTypeSystemName(templateTypeName: string): Promise<string | null> {
    try {
      const templateTypes = await this.getTemplateTypes();
      
      // Find the template type that matches the name
      const matchedType = templateTypes.find((type: any) => 
        type.name === templateTypeName || 
        type.name?.toLowerCase() === templateTypeName.toLowerCase()
      );
      
      return matchedType ? matchedType.systemName : null;
    } catch (error) {
      console.error(`Failed to get template type system name for "${templateTypeName}":`, error);
      return null;
    }
  }

  /**
   * Find context type system name by work type name (including derived types)
   */
  async getContextTypeSystemName(workTypeName: string): Promise<string | null> {
    try {
      const workTypes = await this.getWorkTypes();
      
      // Find the work type that matches the name
      const matchedType = workTypes.find((type: any) => 
        type.name === workTypeName || 
        type.name?.toLowerCase() === workTypeName.toLowerCase()
      );
      
      if (matchedType) {
        return matchedType.systemName;
      }

      // If not found in main work types, check derived types
      for (const workType of workTypes) {
        if (workType.derivedTypes && Array.isArray(workType.derivedTypes)) {
          const derivedMatch = workType.derivedTypes.find((derivedType: any) =>
            derivedType.name === workTypeName ||
            derivedType.name?.toLowerCase() === workTypeName.toLowerCase()
          );
          if (derivedMatch) {
            return derivedMatch.systemName;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to get context type system name for "${workTypeName}":`, error);
      return null;
    }
  }

  /**
   * Get work types
   */
  async getWorkTypes(): Promise<any> {
    const endpoint = '/api/modeller/sharedoTypes';
    return await this.makeApiCall(endpoint);
  }

  /**
   * Get participant types
   */
  async getParticipantTypes(): Promise<any> {
    const endpoint = '/api/modeller/participantTypes';
    const data: { participantTypes: ParticipantType[], partyTypes: PartyType[] } = await this.makeApiCall(endpoint);
    // data.participantTypes.map(pt => {
    //   if (pt.isPerson) {
    //     pt.parties = data.partyTypes.filter(party => party.isPersonTag)
    //   } else if (pt.isOrganisation) {
    //     pt.parties = data.partyTypes.filter(party => party.isOrganisationTag)
    //   } else if (pt.isUser) {
    //     pt.parties = data.partyTypes.filter(party => party.isUserTag)
    //   } else if (pt.isTeam) {
    //     pt.parties = data.partyTypes.filter(party => party.isTeamTag)
    //   } else {
    //     pt.parties = [];
    //   }
    // });
    return data;
  }

  /**
   * Upload document to ShareDo repository
   */
  async uploadDocument(fileBuffer: Buffer, fileName: string, folder?: string): Promise<any> {
    const tokenResponse = await this.getAccessToken();
    
    // Build the API URL
    let apiUrl = `https://${this.hostname}.${this.domain}/api/repository/templates`;
    if (folder) {
      apiUrl += `/${encodeURIComponent(folder)}`;
    }

    // Create form data using the built-in FormData
    const formData = new FormData();
    // Convert Buffer to Uint8Array for FormData compatibility  
    const uint8Array = new Uint8Array(fileBuffer);
    const blob = new Blob([uint8Array]);
    formData.append('files', blob, fileName);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`ShareDo upload failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Create a document template in ShareDo
   */
  async createTemplate(templateSystemName: string, templateData: any): Promise<any> {
    const tokenResponse = await this.getAccessToken();
    const apiUrl = `https://${this.hostname}.${this.domain}/api/admin/docGen/templates/${encodeURIComponent(templateSystemName)}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(templateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ShareDo template creation failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Get template tags and process tags from ShareDo
   */
  async getTags(): Promise<{ tags: string[]; processTags: string[] }> {
    const tokenResponse = await this.getAccessToken();
    const apiUrl = `https://${this.hostname}.${this.domain}/api/admin/docGen/templates/_tags`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ShareDo tags API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Download document from ShareDo using downloadUrl
   */
  async downloadDocument(downloadUrl: string): Promise<Buffer> {
    const tokenResponse = await this.getAccessToken();
    
    // Build the full URL using baseUrl + downloadUrl
    const baseUrl = `https://${this.hostname}.${this.domain}`;
    const fullUrl = `${baseUrl}${downloadUrl}`;

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`,
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download document from ShareDo: ${response.status} ${response.statusText}`);
    }

    // Get the file as a Buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Delete a ShareDo template by system name
   */
  async deleteTemplate(systemName: string): Promise<{ itemDeleted: boolean }> {
    // Get access token
    const tokenResponse = await this.getAccessToken();

    // Build the ShareDo API URL
    const baseUrl = `https://${this.hostname}.${this.domain}`;
    const url = `${baseUrl}/api/checkanddelete/document-template`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemName: systemName
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete template from ShareDo: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result as { itemDeleted: boolean };
  }
}

// Export singleton instance
export const shareDoService = new ShareDoService();