import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./management.css";
import "./mobile-v2.css";

export const metadata: Metadata = {
  title: "Patrimoine",
  description: "Assistant patrimonial long terme, sans exécution d’ordre financier.",
  applicationName: "Patrimoine",
  appleWebApp: {
    capable: true,
    title: "Patrimoine",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#10251e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#main-content">
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
