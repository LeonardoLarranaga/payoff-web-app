import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import {NextUIProvider} from "@nextui-org/react"
import {AuthProvider} from "@/contexts/auth-context"

const geistSans = Geist({
    variable: "--font-geist-sans",
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
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextUIProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </NextUIProvider>
        </body>
        </html>
    )
}
