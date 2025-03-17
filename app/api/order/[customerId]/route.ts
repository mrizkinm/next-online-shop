import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(req: Request, { params } : { params: Promise<{customerId: string}> }) {
  try {
    const { customerId } = await params;
    const orders = await db.order.findMany({
      where: {
        id: parseInt(customerId)
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json({ 
      data: orders, 
      total: orders.length 
    });
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}