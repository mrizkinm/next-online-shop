import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request, { params } : { params: Promise<{customerId: string}> }) {
  const { customerId } = await params;

  try {
    const cartItems = await db.cart.findMany({
      where: { customerId: parseInt(customerId) },
      include: {
        product: {
          include: {
            images: true, // Include images di dalam product
          },
        },
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ errors: "Something went wrong" }, { status: 500 });
  }
}