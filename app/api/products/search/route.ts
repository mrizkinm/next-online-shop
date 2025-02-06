import { NextResponse } from "next/server";
import db from "@/lib/db"; // Asumsi kamu sudah punya konfigurasi prisma di sini

export async function GET(request: Request) {
  // Ambil query parameter dari URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  // Cek jika query tidak ada atau kosong
  if (!query || query.trim() === "") {
    return NextResponse.json({ errors: "Query cannot be empty" }, { status: 400 });
  }

  try {
    // Cari produk berdasarkan nama atau deskripsi yang cocok
    const products = await db.product.findMany({
      where: {
        OR: [
          { name: { contains: query } }, // Pencarian pada nama produk
          { description: { contains: query } }, // Pencarian pada deskripsi produk
        ],
        isArchived: false, // Jangan tampilkan produk yang diarsipkan
      },
      select: {
        id: true,
        name: true,
        price: true,
        isFeatured: true,
        images: {
          select: { url: true }, // Ambil URL gambar jika tersedia
        },
        category: {
          select: { name: true }, // Nama kategori produk
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { errors: "An error occurred while fetching products", error },
      { status: 500 }
    );
  }
}