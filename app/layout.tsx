import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";

import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { StoreProvider } from "@/context/store-context";
import { StoreInfo } from "./types";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getCategories, getStoreInfo } from "@/lib/api";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from 'react-hot-toast';
import MidtransScript from '@/components/midtrans-script';
import NextAuthProvider from "@/providers/next-auth-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"], // Bisa pilih lebih dari satu
  variable: "--font-poppins", // Variable CSS agar bisa digunakan di global CSS
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"], // Bold untuk heading
  variable: "--font-montserrat",
});

export async function generateMetadata(): Promise<Metadata> {
  // Ambil data store secara dinamis
  const store = await getStoreInfo();
  const storeInfo: StoreInfo = store;

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
  const storeInfo: StoreInfo = store;
  const categories = await getCategories({limit: 3});

  return (
    <NextAuthProvider>
      <StoreProvider storeInfo={storeInfo}>
        <CartProvider>
          <html lang="en">
            <body
              className={`${poppins.variable} ${montserrat.variable} antialiased`}
            >
              <NextTopLoader showSpinner={false} />
              <ThemeProvider attribute="class" defaultTheme="system">
                <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-[116px]">
                  <Navbar />
                  <Toaster />
                  <MidtransScript />
                  {children}
                  <Footer categories={categories} />
                </div>
              </ThemeProvider>
            </body>
          </html>
        </CartProvider>
      </StoreProvider>
    </NextAuthProvider>
  );
}
