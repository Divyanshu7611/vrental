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
  title: "Vrental - Turn Your House Into a Rental Property",
  description:
    "Transform your home into a profitable rental property with Vrental. Simplify property management, attract tenants, and maximize your rental income.",
  keywords:
    "rental property, house rental, property management, Vrental, rental income, real estate, rental,Kota real estate,Kota property rental,Kota apartments,Kota student accommodation,Kota hostels,Kota room rentals,Kota PG accommodation,Kota flat rentals,Kota housing market",
  authors: [{ name: "Vrental Team" }],
  openGraph: {
    title: "Vrental - Turn Your House Into a Rental Property",
    description:
      "Transform your home into a profitable rental property with Vrental. Simplify property management, attract tenants, and maximize your rental income.",
    url: "https://vrental.in",
    siteName: "Vrental",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/1fbc7bfd-9778-49c2-8a2b-871aedd4038e.png?token=EAAc_2pd4fiKUy-S2S4qwo9TtD4Qi5ZSrcQciLSJp9U&height=500&width=500&expires=33260741968",
        width: 500,
        height: 500,
        alt: "Vrental - Turn Your House Into a Rental Property",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vrental - Turn Your House Into a Rental Property",
    description:
      "Transform your home into a profitable rental property with Vrental. Simplify property management, attract tenants, and maximize your rental income.",
    images: [
      "https://opengraph.b-cdn.net/production/images/1fbc7bfd-9778-49c2-8a2b-871aedd4038e.png?token=EAAc_2pd4fiKUy-S2S4qwo9TtD4Qi5ZSrcQciLSJp9U&height=500&width=500&expires=33260741968",
    ],
    site: "@vrental",
    creator: "@vrental",
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
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />

        <link rel="manifest" href="/site.webmanifest" />
        {/* <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" /> */}
        <title>Vrental</title>
        <meta
          name="description"
          content={metadata.description ?? "Default Description"}
        />
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
