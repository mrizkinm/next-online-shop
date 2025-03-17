import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params } : { params: Promise<{productId: string}> }) {
  try {
    const { productId } = await params;
    if (!productId) {
      return NextResponse.json({ errors: "Harus ada product id" }, {status: 400})
    }

    const product = await db.product.findUnique({
      where: {
        id: parseInt(productId)
      },
      include: {
        category: true,
        images: true
      }
    })
    return NextResponse.json(product);
  } catch (error) {
    console.log('ERROR product GET', error);
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}