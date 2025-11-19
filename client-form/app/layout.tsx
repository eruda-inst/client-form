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
        <body className={`grid-cols-1 pt-20`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <div className="flex justify-center py-8"> 
              <Image
                src="/logo-newnet.png"
                width={350}
                height={150}
                alt="Logo Newnet"
              />
            </div>
            {children}
            <div className="flex justify-center py-8"> 
              <Image
                src="/logo-candol.png"
                width={200}
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