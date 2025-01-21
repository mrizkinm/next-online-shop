import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const shop = await db.shop.findMany()

    return NextResponse.json(shop)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}