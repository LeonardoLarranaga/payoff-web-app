import { Geist, Geist_Mono } from "next/font/google"
import {Figtree} from "next/font/google"
import "./globals.css"
import {NextUIProvider} from "@nextui-org/react"
import {AuthProvider} from "@/contexts/auth-context"
import {ThemeProvider} from "next-themes"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const figtree = Figtree({
    variable: "--font-figtree",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata = {
    title: "Payoff Web",
    description: "Manage your debts in one place.",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${figtree.className} antialiased`}>
        <NextUIProvider>
            <AuthProvider>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </AuthProvider>
        </NextUIProvider>
        </body>
        </html>
    )
}
