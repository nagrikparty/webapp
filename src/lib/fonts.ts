import { Inter_Tight, Mukta, Teko } from "next/font/google";

export const inter = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const mukta = Mukta({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  display: "swap",
  variable: "--font-mukta",
});

export const teko = Teko({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
  display: "swap",
  variable: "--font-teko",
});
