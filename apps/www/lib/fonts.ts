import { Geist, Geist_Mono, Montserrat } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
})

const fontMontserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat"
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontMontserrat.variable,
)
