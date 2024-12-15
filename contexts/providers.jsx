import {AuthProvider} from "@/contexts/auth-context"
import {DarkProvider} from "@/contexts/dark-contest"
import {NextUIProvider} from "@nextui-org/react"
import {ThemeProvider} from "next-themes"

export const Providers = ({children}) => {
    return (
        <NextUIProvider>
            <AuthProvider>
                <DarkProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </DarkProvider>
            </AuthProvider>
        </NextUIProvider>
    )
}