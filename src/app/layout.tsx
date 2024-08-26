import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

// export const metadata: Metadata = {
//   title: "Vrental",
//   description:
//     "Vrental makes turning your house into a rental property simple and profitable. Manage your property with ease, attract tenants, and maximize your rental income with our all-in-one platform.",
// };

export const metadata: Metadata = {
  title: "Vrental",
  description:
    "Vrental makes turning your house into a rental property simple and profitable. Manage your property with ease, attract tenants, and maximize your rental income with our all-in-one platform.",
  // Add more metadata for SEO
  keywords:
    "rental property, house rental, property management, Vrental, rental income, real estate,rental",
  authors: [{ name: "Vrental Team" }],
  openGraph: {
    title: "Vrental - Turn Your House Into a Rental Property",
    description:
      "Transform your home into a profitable rental property with Vrental. Simplify property management, attract tenants, and maximize your rental income.",
    url: "https://vrental.in",
    siteName: "Vrental",
    images: [
      {
        url: "https://vrental.in",
        width: 1200,
        height: 630,
        alt: "Vrental - Turning Your House Into Rental",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vrental - Turn Your House Into a Rental Property",
    description:
      "Discover how Vrental can help you transform your house into a rental property. Simplify management, attract tenants, and maximize your rental income.",
    images: ["https://vrental.in"],
    site: "@vrental",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/assets/Logo.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/assets/Logo.png"
          type="image/png"
          sizes="16x16"
        />
        <link rel="apple-touch-icon" href="/assets/Logo.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <title>Vrental</title>
        <meta
          name="description"
          content={metadata.description ?? "Default Description"}
        />
        {/* Add other SEO-related meta tags here */}
      </head>
      <UserContextProvider>
        <body className={roboto.className}>
          {children}
          <ToastContainer />
        </body>
      </UserContextProvider>
    </html>
  );
}
