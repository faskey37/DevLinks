import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";
import { PageLoader } from "@/components/PageLoader";

export const metadata: Metadata = {
  title: "DevLinks — Your Developer Link Hub",
  description:
    "Create a beautiful, shareable page with all your developer links. GitHub, Portfolio, LinkedIn and more — in one place.",
  openGraph: {
    title: "DevLinks",
    description: "Your developer link hub",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <PageLoader />
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}