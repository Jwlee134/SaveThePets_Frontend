import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json([
    { id: "11", lat: 37.3695704, lng: 127.105399 },
    { id: "12", lat: 37.3695704, lng: 127.115399 },
    { id: "13", lat: 37.3595704, lng: 127.115399 },
  ]);
}
