import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "UrbanStyle | T-Shirts & Jeans Premium Homme",
  description: "Découvrez notre collection de t-shirts et jeans pour homme. Qualité premium, livraison 24-48h, retours gratuits. Dès 24,99€.",
  keywords: "t-shirt homme, jean homme, vêtements homme, mode masculine, streetwear, urban style",
  openGraph: {
    title: "UrbanStyle | T-Shirts & Jeans Premium Homme",
    description: "Découvrez notre collection de t-shirts et jeans pour homme. Qualité premium, livraison 24-48h, retours gratuits.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${montserrat.variable} antialiased`}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
