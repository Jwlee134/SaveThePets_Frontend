import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json([
    { id: "1", lat: 37.3595704, lng: 127.105399 },
    { id: "2", lat: 37.3495704, lng: 127.105399 },
    { id: "3", lat: 37.3395704, lng: 127.105399 },
    { id: "4", lat: 37.3295704, lng: 127.105399 },
    { id: "5", lat: 37.3195704, lng: 127.105399 },
    { id: "6", lat: 37.3095704, lng: 127.105399 },
    { id: "7", lat: 37.2995704, lng: 127.105399 },
    { id: "8", lat: 37.2895704, lng: 127.105399 },
    { id: "9", lat: 37.2795704, lng: 127.105399 },
    { id: "10", lat: 37.2695704, lng: 127.105399 },
  ]);
}
