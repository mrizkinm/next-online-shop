import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong"),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  id: z.number().int()
});

export async function PATCH(req: Request) {
  try {
    const { name, email, phone, address, id } = await req.json();

    const result = formSchema.safeParse({ name, email, phone, address, id });
     
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    // Cocokkan token dengan token di database
    const findUser = await db.customer.findUnique({
      where: { id: id },
    });

    if (!findUser) {
      return NextResponse.json({ errors: 'User not found' }, { status: 404 });
    }

    const user = await db.customer.update({
      where: {
        id: id
      },
      data: {
        name,
        email,
        phone,
        address
      }
    });

    return NextResponse.json(user)
  } catch (error) {
    console.log("ERROR user PATCH", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}