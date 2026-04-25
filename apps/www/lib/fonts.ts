import { Geist, Geist_Mono } from "next/font/google"

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

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
)
