import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COLON AI — Football Intelligence",
  description: "Analyse football, statistiques et gestion de bankroll avec COLON AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
