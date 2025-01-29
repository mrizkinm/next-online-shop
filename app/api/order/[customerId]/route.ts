import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(req: Request, {params} : {params: {customerId: string}}) {
  try {
    const param = await params;
    const customerId = parseInt(param.customerId);

    if (isNaN(customerId)) {
      return NextResponse.json({ 
        errors: "Invalid customer ID", 
        data: [], 
        total: 0 
      }, { status: 400 });
    }
    const orders = await db.order.findMany({
      where: { customerId },
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