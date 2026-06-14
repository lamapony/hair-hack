import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { CLINIC_METADATA } from "@/lib/clinic-copy";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: CLINIC_METADATA.title,
  description: CLINIC_METADATA.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
