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

export const metadata: Metadata = {
  title: "Vrental",
  description: "Turning Your House Into Rental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserContextProvider>
        <body className={roboto.className}>
          {children}
          <ToastContainer />
        </body>
      </UserContextProvider>
    </html>
  );
}
