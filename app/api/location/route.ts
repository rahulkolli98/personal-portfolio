import { headers } from "next/headers";
import { NextResponse } from "next/server";

type LocationPayload = {
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  source: "ip" | "fallback";
};

const FALLBACK: LocationPayload = {
  city: "your city",
  country: "Earth",
  countryCode: "UN",
  latitude: 0,
  longitude: 0,
  source: "fallback",
};

function readClientIp(headerList: Headers): string {
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "";
  }

  return headerList.get("x-real-ip") || "";
}

function toNumber(value: string | null): number {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchFromIpWhoIs(ip: string): Promise<LocationPayload | null> {
  const endpoint = ip ? `https://ipwho.is/${ip}` : "https://ipwho.is/";
  const response = await fetch(endpoint, { next: { revalidate: 60 * 30 } });
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data?.success) {
    return null;
  }

  return {
    city: data?.city || "your city",
    country: data?.country || "Earth",
    countryCode: data?.country_code || "UN",
    latitude: Number(data?.latitude) || 0,
    longitude: Number(data?.longitude) || 0,
    source: "ip",
  };
}

async function fetchFromIpInfo(): Promise<LocationPayload | null> {
  const response = await fetch("https://ipinfo.io/json", {
    headers: {
      "User-Agent": "rahul-portfolio/1.0",
    },
    next: { revalidate: 60 * 30 },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const [latText, lngText] = (data?.loc || "0,0").split(",");

  return {
    city: data?.city || "your city",
    country: data?.country || "Earth",
    countryCode: data?.country || "UN",
    latitude: Number(latText) || 0,
    longitude: Number(lngText) || 0,
    source: "ip",
  };
}

export async function GET() {
  try {
    const headerList = await headers();
    const ip = readClientIp(headerList);

    const vercelCountry = headerList.get("x-vercel-ip-country");
    const vercelCity = headerList.get("x-vercel-ip-city");
    const vercelLat = toNumber(headerList.get("x-vercel-ip-latitude"));
    const vercelLng = toNumber(headerList.get("x-vercel-ip-longitude"));

    if (vercelCountry || vercelCity || (vercelLat !== 0 && vercelLng !== 0)) {
      return NextResponse.json({
        city: vercelCity || "your city",
        country: vercelCountry || "Earth",
        countryCode: vercelCountry || "UN",
        latitude: vercelLat,
        longitude: vercelLng,
        source: "ip" as const,
      });
    }

    const fromIpWhoIs = await fetchFromIpWhoIs(ip);
    if (fromIpWhoIs) {
      return NextResponse.json(fromIpWhoIs);
    }

    const fromIpInfo = await fetchFromIpInfo();
    if (fromIpInfo) {
      return NextResponse.json(fromIpInfo);
    }

    return NextResponse.json(FALLBACK);
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
