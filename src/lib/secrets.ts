import { BitwardenClient, LogLevel } from 'bitwarden-sdk';

/**
 * Retrieves a secret from Bitwarden Secrets Manager
 * @param secretId - The unique identifier of the secret to retrieve
 * @returns Promise that resolves to the secret value
 * @throws Error if secret retrieval fails or access token is missing
 */
export async function getSecret(secretId: string): Promise<string> {
  const accessToken = process.env.BWS_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('BWS_ACCESS_TOKEN environment variable is not set');
  }

  let client: BitwardenClient | null = null;

  try {
    client = new BitwardenClient({
      accessToken,
      logLevel: LogLevel.Info,
    });

    const secret = await client.secrets().get(secretId);
    
    if (!secret || !secret.value) {
      throw new Error(`Secret with ID ${secretId} not found or has no value`);
    }

    return secret.value;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve secret: ${error.message}`);
    }
    throw new Error('Failed to retrieve secret: Unknown error occurred');
  } finally {
    if (client) {
      await client.close();
    }
  }
}