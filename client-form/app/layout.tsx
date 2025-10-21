import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pesquisa",
  description: "Um formulário dinâmico para coletar respostas de usuários.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <div className="flex justify-center py-8"> 
              <Image
                src="/logo-cdl.jpg"
                width={150}
                height={150}
                alt="Logo CDL"
              />
            </div>
            {children}
            <div className="flex justify-center py-8"> 
              <Image
                src="/Logo Candol.png"
                width={400}
                height={400}
                alt="Logo Candol"
              />
            </div>
            
            
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </>
  );
}