import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Personal Finance Dashboard",
  description: "My finance dashboard",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body
        className={`${inter.className}`}>
          {/* header*/}
          <Header />
        <main className="min-h-screen">{children}</main>
        {/* footer*/}
        <footer className="bg-blue-50">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p >© 2023 Personal Finance Dashboard</p> 
          </div>
          
        </footer>
      </body>
    </html>
    </ClerkProvider>
    
  );
}
