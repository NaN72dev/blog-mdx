import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

import SiteHeader from "@/components/nav/site-header";
import Footer from "@/components/nav/footer";

import {ThemeProvider} from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NaN",
  description: "NaN's website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className={`${inter.className} h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex flex-col items-center justify-between px-6 py-12   sm:px-10 sm:py-24 min-h-[calc(100vh-12rem)]">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
