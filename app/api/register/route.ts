import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';
import bcrypt from "bcryptjs";

const formSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong"),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  password: z.string().min(6, "Password harus memiliki minimal 6 karakter"),
});

export async function POST(req: Request) {
  try {
    const { name, phone, email, address, password } = await req.json();

    const result = formSchema.safeParse({ name, phone, email, address, password });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.customer.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ errors: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await db.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error post data:', error);
    return NextResponse.json({ errors: 'Failed to register' }, { status: 500 });
  }
}