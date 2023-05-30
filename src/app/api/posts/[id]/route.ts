import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json({ ok: true });
}
