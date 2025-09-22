import type { Metadata } from "next";
import "./globals.css";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadate: Metadata = {
  title: "My BlogD",
  description: "Test with me@"
}

export const dynamic = 'force-dynamic'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <QueryClientProviderWrapper>
        {children}
        </QueryClientProviderWrapper>
        <Footer />
      </body>
    </html>
  )
}