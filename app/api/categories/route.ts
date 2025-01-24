import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || undefined;

    const category = await db.category.findMany({
      take: limit ? Number(limit) : undefined,
      include: {
        products: true,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}