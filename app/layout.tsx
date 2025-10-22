import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { DeepIntelligenceProvider } from "./contexts/DeepIntelligenceContext";
import DeepIntelligenceButton from "./components/DeepIntelligenceButton";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kinetica Finance",
  description: "Business Intelligence Portal for Kinetica Finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        <DeepIntelligenceProvider>
          {children}
          <DeepIntelligenceButton />
        </DeepIntelligenceProvider>
      </body>
    </html>
  );
}
