import { BitwardenClient, ClientSettings, DeviceType, LogLevel } from '@bitwarden/sdk-wasm';

interface Env {
  BITWARDEN_ACCESS_TOKEN: string;
  BITWARDEN_ORGANIZATION_ID: string;
  BITWARDEN_SECRET_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    if (context.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const settings: ClientSettings = {
      apiUrl: 'https://api.bitwarden.com',
      identityUrl: 'https://identity.bitwarden.com',
      userAgent: 'Cloudflare-Pages-Function',
      deviceType: DeviceType.SDK,
    };

    const client = new BitwardenClient(settings, LogLevel.Info);
    
    await client.auth().loginAccessToken(context.env.BITWARDEN_ACCESS_TOKEN);

    const secret = await client.secrets().get(context.env.BITWARDEN_SECRET_ID);
    const apiKey = secret.value;

    const requestBody = await context.request.text();
    const requestHeaders = Object.fromEntries(context.request.headers.entries());

    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
        ...Object.fromEntries(
          Object.entries(requestHeaders).filter(([key]) => 
            !['host', 'cf-connecting-ip', 'cf-ray', 'x-forwarded-for'].includes(key.toLowerCase())
          )
        ),
      },
      body: requestBody,
    });

    const responseBody = await geminiResponse.text();
    const responseHeaders = Object.fromEntries(geminiResponse.headers.entries());

    return new Response(responseBody, {
      status: geminiResponse.status,
      headers: {
        ...corsHeaders,
        ...responseHeaders,
      },
    });

  } catch (error) {
    console.error('Gemini proxy error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
};