import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const res = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&output=json&orders=addr`,
    {
      // @ts-ignore
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NEXT_PUBLIC_MAP_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": process.env.MAP_CLIENT_SECRET,
      },
    }
  );
  const data = await res.json();
  const result =
    data?.results?.length > 0
      ? `${data.results[0].region.area1.name} ${data.results[0].region.area2.name} ${data.results[0].region.area3.name}`
      : "주소 정보 없음";

  return NextResponse.json({ result });
}
