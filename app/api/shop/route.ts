import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const shop = await db.shop.findUnique({
      where: {
        id: 1
      }
    })

    return NextResponse.json(shop)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}