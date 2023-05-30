import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json([
    { id: "1", date: "2023-05-23T04:27:55.470Z" },
    { id: "2", date: "2023-04-23T04:27:55.470Z" },
    { id: "3", date: "2022-05-21T04:27:55.470Z" },
  ]);
}
