"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import Hero from "./components/Hero";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* <Hero /> */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}