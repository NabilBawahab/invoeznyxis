import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { image } from "@heroui/react";
import { icons } from "@dicebear/collection";
import { google } from "@/utils/arctic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "InvoEz - Free Online Invoice with AI Powered",
  description: "FREE ONLINE INVOICE WITH AI",
  verification: { google: "vxkT65BH8hivQjeN53_2PRWWeJuxdxs-3ECivuTNmpg" },
  icons: "/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased`}
      >
        <Providers>
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
