import type { Metadata } from "next";
import "./globals.css";
import { ItemCartProvider } from "@/context/ItemCartContext";
import { CandelaStoreProvider } from "@/context/CandelaStoreContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SITE_CONFIG } from "@/config/site";

// Resilient font variables with system font fallbacks in globals.css
const cormorant = { variable: "font-editorial" };
const inter = { variable: "font-body" };
const jetbrainsMono = { variable: "font-mono" };

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-candela-bg text-candela-text selection:bg-candela-accent/20 selection:text-candela-text">
        <ErrorBoundary>
          <CandelaStoreProvider>
            <ItemCartProvider>
              <WishlistProvider>
                <CompareProvider>{children}</CompareProvider>
              </WishlistProvider>
            </ItemCartProvider>
          </CandelaStoreProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
