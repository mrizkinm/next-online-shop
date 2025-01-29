import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(request: Request) {
  const { customerId } = await request.json();

  if (!customerId) {
    return NextResponse.json({ errors: "Invalid input" }, { status: 400 });
  }

  try {
    await db.cart.deleteMany({
      where: {
        customerId: parseInt(customerId)
      }
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ errors: "Something went wrong" }, { status: 500 });
  }
}
