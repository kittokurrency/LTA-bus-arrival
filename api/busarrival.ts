/**
 * Serverless Connection for Singapore LTA DataMall v3 Bus Arrival API
 * Path: /api/busarrival
 *
 * Upstream LTA API:
 * GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode={BusStopCode}&ServiceNo={ServiceNo}
 * Header: AccountKey: <LTA_ACCOUNT_KEY>
 * Header: accept: application/json
 */

const LTA_BUS_ARRIVAL_V3_ENDPOINT = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';

interface QueryParams {
  busStopCode?: string;
  serviceNo?: string;
}

/**
 * Core business logic that interacts with LTA DataMall v3
 */
async function fetchLtaBusArrival(params: QueryParams, requestAccountKey?: string) {
  const accountKey =
    process.env.LTA_ACCOUNT_KEY ||
    process.env.ACCOUNT_KEY ||
    requestAccountKey;

  // Validate bus stop code
  const busStopCode = params.busStopCode || '83139'; // Default sample stop 83139 or caller specified

  if (!accountKey || accountKey.trim().length === 0) {
    return {
      status: 401,
      payload: {
        error: 'LTA_ACCOUNT_KEY_NOT_CONFIGURED',
        message: 'LTA DataMall AccountKey is not set. Please set the LTA_ACCOUNT_KEY environment variable in your serverless host.',
        endpoint: `${LTA_BUS_ARRIVAL_V3_ENDPOINT}?BusStopCode=${busStopCode}`,
        howToFix: 'Obtain a free key at https://datamall.lta.gov.sg and add LTA_ACCOUNT_KEY to your environment variables.',
        BusStopCode: busStopCode,
        Services: [],
      },
    };
  }

  // Construct target URL
  const targetUrl = new URL(LTA_BUS_ARRIVAL_V3_ENDPOINT);
  targetUrl.searchParams.set('BusStopCode', busStopCode);
  if (params.serviceNo) {
    targetUrl.searchParams.set('ServiceNo', params.serviceNo);
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'AccountKey': accountKey.trim(),
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        status: response.status,
        payload: {
          error: `LTA_UPSTREAM_ERROR_${response.status}`,
          message: `LTA DataMall responded with HTTP status ${response.status}: ${response.statusText}`,
          upstreamDetails: errorText,
          targetUrl: targetUrl.toString(),
        },
      };
    }

    const data = await response.json();
    return {
      status: 200,
      payload: data,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      status: 502,
      payload: {
        error: 'LTA_FETCH_FAILED',
        message: `Failed to connect to LTA DataMall: ${errorMsg}`,
        targetUrl: targetUrl.toString(),
      },
    };
  }
}

// 1. Node.js / Vercel Serverless Function Handler (req, res)
export default async function handler(req: any, res: any) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey, x-account-key');
      return res.status(204).end();
    }
  }

  const query = req.query || {};
  const busStopCode = (query.BusStopCode || query.busStopCode || '83139') as string;
  const serviceNo = (query.ServiceNo || query.serviceNo) as string | undefined;

  const headerKey =
    (req.headers?.accountkey as string) ||
    (req.headers?.['x-account-key'] as string);

  const result = await fetchLtaBusArrival({ busStopCode, serviceNo }, headerKey);

  if (res && typeof res.status === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
    return res.status(result.status).json(result.payload);
  }

  // Web Standard Response fallback
  return new Response(JSON.stringify(result.payload), {
    status: result.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=15, stale-while-revalidate=30',
    },
  });
}

// 2. Web Standard / Edge Runtime Handler (e.g. Next.js, Cloudflare, Fetch API)
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const busStopCode = url.searchParams.get('BusStopCode') || url.searchParams.get('busStopCode') || '83139';
  const serviceNo = url.searchParams.get('ServiceNo') || url.searchParams.get('serviceNo') || undefined;

  const headerKey =
    request.headers.get('AccountKey') ||
    request.headers.get('x-account-key') ||
    undefined;

  const result = await fetchLtaBusArrival({ busStopCode, serviceNo }, headerKey);

  return new Response(JSON.stringify(result.payload), {
    status: result.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=15, stale-while-revalidate=30',
    },
  });
}
