import { Toaster } from "@/components/ui/sonner";
import QueryProviders from "@/providers/QueryProvider";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prangon Workspace",
  description: "A collaborative workspace and project management platform",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${fraunces.variable} ${ibmPlexSans.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProviders>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
