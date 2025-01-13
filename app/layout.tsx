import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { StoreProvider } from "../context/store-context";
import { StoreInfo } from "./types";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  // Ambil data store secara dinamis
  const storeInfo = await getStoreInfo();

  return {
    title: storeInfo.name,
    description: storeInfo.address,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeInfo: StoreInfo = await getStoreInfo();

  return (
    <StoreProvider storeInfo={storeInfo}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextTopLoader showSpinner={false} />
          <div className="min-h-screen bg-gray-50 pt-[50px] md:pt-[116px]">
            <Navbar />
            {children}
            <Footer />
          </div>
        </body>
      </html>
     </StoreProvider>
  );
}

async function getStoreInfo(): Promise<StoreInfo> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/data/shop`, { method: "GET" });
    if (!res.ok) {
      throw new Error('Failed to fetch store information');
    }
    const responseData = await res.json();
    return responseData[0];
  } catch (error) {
    console.error(error);
    return {
      name: 'Error',
      address: 'Error',
      phone: '/img/default.jpg',
      email: 'Error',
      description: '/img/default.jpg'
    };
  }
}
