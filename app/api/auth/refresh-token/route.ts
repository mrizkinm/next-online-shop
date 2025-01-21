import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import db from "@/lib/db";
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const refreshTokenShop = cookieStore.get('refreshTokenShop')?.value;
  if (!refreshTokenShop) return NextResponse.json({ msg: 'Token tidak ditemukan' }, { status: 401 });
  
  try {
    // Verifikasi refresh token
    const { payload } = await jwtVerify(
      refreshTokenShop, 
      new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)
    );
    if (!payload) return NextResponse.json({ msg: 'Token tidak valid' }, { status: 401 });

    // Cocokkan token dengan token di database
    const user = await db.customer.findUnique({
      where: { id: payload.id as number },
    });

    if (!user || user.token !== refreshTokenShop) {
      return NextResponse.json({ msg: 'Token tidak cocok' }, { status: 401 });
    }

    // Buat access token baru
    const accessTokenShop = await new SignJWT({ id: user.id, name: user.name, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET));

    const response = NextResponse.json({ accessTokenShop });
    response.cookies.set('accessTokenShop', accessTokenShop, {
      httpOnly: false,  // Untuk keamanan, hanya bisa diakses oleh server
      secure: process.env.NODE_ENV === 'production',  // Set secure di production
      maxAge: 15 * 60, // Set waktu kadaluarsa 15 menit
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh Token error:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}