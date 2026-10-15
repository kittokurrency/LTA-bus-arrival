/**
 * Serverless Health Check Endpoint
 * Path: /api/health
 */

export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  service: string;
  ltaKeyConfigured: boolean;
  targetLtaEndpoint: string;
  uptimeSeconds: number;
}

// Node.js / Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  const ltaKey = process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY;

  const data: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'LTA DataMall Bus Arrival Serverless Proxy',
    ltaKeyConfigured: Boolean(ltaKey && ltaKey.trim().length > 0),
    targetLtaEndpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
  };

  // Support Node/Express style res.status().json()
  if (res && typeof res.status === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);
  }

  // Web Standard Response fallback
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

// Web Fetch API / Edge Runtime Handler (e.g. Next.js, Cloudflare, Fetch API)
export async function GET(request?: Request): Promise<Response> {
  const ltaKey = process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY;

  const data: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'LTA DataMall Bus Arrival Serverless Proxy',
    ltaKeyConfigured: Boolean(ltaKey && ltaKey.trim().length > 0),
    targetLtaEndpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
