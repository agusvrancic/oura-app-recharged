import type { Metadata } from "next";
import { DM_Sans, Public_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: '--font-public-sans',
});

export const metadata: Metadata = {
  title: "Meridian",
  description: "Personal task management and productivity app",
  icons: {
    icon: '/app-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${publicSans.variable} font-sans`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
