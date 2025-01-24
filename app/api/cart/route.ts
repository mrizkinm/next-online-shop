import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  const{ customerId, productId, quantity } = await req.json();

  if (!customerId || !productId) {
    return NextResponse.json({ errors: "Invalid input" }, { status: 400 });
  }

  try {
    const cartItem = await db.cart.upsert({
      where: { customerId_productId: { customerId, productId } },
      update: { quantity: { increment: quantity } },
      create: { customerId, productId, quantity },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ errors: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { customerId, productId } = await request.json();

  if (!customerId || !productId) {
    return NextResponse.json({ errors: "Invalid input" }, { status: 400 });
  }

  try {
    await db.cart.delete({
      where: { customerId_productId: { customerId, productId } },
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ errors: "Something went wrong" }, { status: 500 });
  }
}
