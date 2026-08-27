
import type { Metadata } from "next";
import {Inter, Poppins} from "next/font/google";
import "./globals.css";
import { JSX } from "react/jsx-runtime";

const bodyFont = Inter({
  subsets:['latin'],
  variable: '--font-body',
})

const displayFont = Poppins({
  subsets: ['latin'],
  weight: ['200','300','400','600','800'],
  variable: '--font-display',  
})

export const metadata: Metadata = {
  title: 'Smart Payroll',
  description:
  "Calculate gross pay, tax deductions, net pay, working hours, and monthly pay — one clear step at a time.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element{
  return(
    <html>
      <body className={`${bodyFont.variable} ${displayFont.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
