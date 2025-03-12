import React from "react";
import "./globals.css";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-blue-600 text-white py-4 text-center text-xl font-semibold shadow-md">
          BPCL Payment Portal
        </header>

        {/* Body (Content Area) */}
        <main className="flex-1 bg-black text-white p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-3 text-sm">
          © {new Date().getFullYear()} BPCL | All Rights Reserved
        </footer>
      </body>
    </html>
  );
}
