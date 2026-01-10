import { NextRequest } from "next/server";

export interface GeoData {
  country?: string;
  city?: string;
  region?: string;
  ip?: string;
}

/**
 * Extract geo information from request headers
 * Works with Vercel and Cloudflare headers
 */
export function getGeoData(request: NextRequest): GeoData {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
             request.headers.get("x-real-ip") || 
             "Unknown";
  
  // Vercel headers
  // https://vercel.com/docs/edge-network/headers#x-vercel-ip-country
  const country = request.headers.get("x-vercel-ip-country") || 
                  request.headers.get("cf-ipcountry") || 
                  undefined;

  const city = request.headers.get("x-vercel-ip-city") || undefined;
  const region = request.headers.get("x-vercel-ip-region") || undefined;

  return {
    country,
    city,
    region,
    ip,
  };
}

/**
 * Get full country name from ISO code if needed (optional helper)
 * This is a basic map, for full support use a library like 'country-list' 
 * or Intl.DisplayNames if the environment supports it.
 */
export function getCountryName(countryCode?: string, locale: string = 'en'): string | undefined {
  if (!countryCode) return undefined;
  
  try {
    const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
    return regionNames.of(countryCode);
  } catch (error) {
    return countryCode; // Fallback to code if Intl fails
  }
}
