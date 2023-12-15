
import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel, Ysabeau_SC, Ysabeau } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "@/components/ui/toaster";


const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({subsets: ["latin"], variable: '--font-playfair', style: 'italic'})
const ysabeau = Ysabeau_SC({subsets: ["latin"], variable: '--font-ysabeau'})

export const metadata: Metadata = {
  title: "Spicify",
  description: "Your ultimate recipe companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={`${inter.className} ${playfair.variable} ${ysabeau.variable}` } >
          <ThemeProvider attribute="class">
            <main className="w-screen">
            {/* <Sidebar /> */}
            {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
