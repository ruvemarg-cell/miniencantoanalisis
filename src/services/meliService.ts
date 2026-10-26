/**
 * Mercado Libre Argentina (MLA) API Integration Service
 * Uses secure environment credentials from .env.local
 */

let cachedToken: {
  accessToken: string;
  expiresAt: number;
} | null = null;

export async function getMeliAccessToken(): Promise<string | null> {
  const clientId = process.env.MELI_APP_ID;
  const clientSecret = process.env.MELI_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  // Return cached token if still valid (with 5 minute safety buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 300_000) {
    return cachedToken.accessToken;
  }

  try {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    const res = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'MiniEncantoAnalisis/1.0 (Argentina)',
      },
      body: body.toString(),
    });

    if (!res.ok) {
      console.error('[MELI Service] Error obteniendo OAuth token:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    cachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 21600) * 1000,
    };

    return cachedToken.accessToken;
  } catch (err) {
    console.error('[MELI Service] Excepción en autenticación:', err);
    return null;
  }
}

export async function getMeliAccountInfo() {
  const token = await getMeliAccessToken();
  if (!token) return null;

  try {
    const res = await fetch('https://api.mercadolibre.com/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'MiniEncantoAnalisis/1.0 (Argentina)',
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getMeliCategories() {
  const token = await getMeliAccessToken();
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'MiniEncantoAnalisis/1.0 (Argentina)',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('https://api.mercadolibre.com/sites/MLA/categories', { headers });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
