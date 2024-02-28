import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CountryCode } from "@/data/board"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getCountryFlagEmoji = (countryCode: CountryCode) => {
    if (countryCode == "NN") return "🏳"
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }