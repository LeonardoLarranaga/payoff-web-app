import {Figtree} from "next/font/google"
import "./globals.css"
import {Providers} from "@/contexts/providers"

const figtree = Figtree({
    variable: "--font-figtree",
    subsets: ["latin"],
})

export const metadata = {
    title: "Payoff Web",
    description: "Manage your debts in one place.",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            {/*<script src="https://unpkg.com/react-scan/dist/auto.global.js" async/>*/}
            <meta name="apple-mobile-web-app-title" content="Payoff"/>
            <title>Payoff</title>
        </head>
        <body className={`${figtree.className} antialiased`}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
