import { Geist_Mono as FontMono, Montserrat } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
)
