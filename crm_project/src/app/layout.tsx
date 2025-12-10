import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/app/theme_provider";
import GlobalClickSpark from "@/components/GlobalClickSpark";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Simple CRM",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="de">
      <body>
      <ThemeProvider>
        <Navbar />
        <main style={{ padding: "20px" }}>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
