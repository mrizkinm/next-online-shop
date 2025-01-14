import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { StoreProvider } from "../context/store-context";
import { StoreInfo } from "./types";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getStoreInfo } from "@/lib/api";

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
  const store = await getStoreInfo();
  const storeInfo: StoreInfo = store[0];

  return {
    title: storeInfo.name,
    description: storeInfo.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await getStoreInfo();
  const storeInfo: StoreInfo = store[0];

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
