import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : {params: {productId: string}}) {
  try {
    const param = await params;
    if (!param.productId) {
      return NextResponse.json({ errors: "Harus ada product id" }, {status: 400})
    }

    const product = await db.product.findUnique({
      where: {
        id: parseInt(param.productId)
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