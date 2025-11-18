import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { DevBanner } from "@/components/dev-banner";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Frites & snacks belges B2B à La Réunion | BelFrit-Business",
  description: "Distribution belge premium pour professionnels : qualité, chaîne du froid, PLV & recettes. Ouvrez votre compte pro et accédez à la grille tarifaire.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased">
        <Header />
        <DevBanner />
        <div className="pt-52">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
