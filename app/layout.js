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
        <body className={`${figtree.className} antialiased`}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
