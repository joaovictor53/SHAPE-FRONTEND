import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams.toString();
  const targetUrl = `${API_URL}${path}${searchParams ? `?${searchParams}` : ""}`;

  const headers = new Headers(req.headers);
  headers.set("host", new URL(API_URL).host);
  headers.set("x-forwarded-host", req.nextUrl.host);
  headers.set("x-forwarded-proto", "https");

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      response.headers.getSetCookie().forEach((cookie) => {
        responseHeaders.append("set-cookie", cookie);
      });
    } else if (
      key.toLowerCase() !== "transfer-encoding" &&
      key.toLowerCase() !== "content-encoding" &&
      key.toLowerCase() !== "content-length"
    ) {
      responseHeaders.set(key, value);
    }
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (location) {
      responseHeaders.set("location", location);
    }
    return new NextResponse(null, {
      status: response.status,
      headers: responseHeaders,
    });
  }

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
