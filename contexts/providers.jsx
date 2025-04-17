'use client'

import {AuthProvider} from "@/contexts/auth-context"
import {DarkProvider} from "@/contexts/dark-contest"
import {HeroUIProvider} from "@heroui/react"
import {ThemeProvider} from "next-themes"
import {NavigationProvider} from "@/contexts/navigation-context"
import Sidebar from "@/components/navigation/sidebar"
import MainContent from "@/app/main-content"
import NavigationModal from "@/components/navigation/navigation-modal"

export const Providers = ({children}) => {
    return (
        <HeroUIProvider>
            <AuthProvider>
                <DarkProvider>
                    <ThemeProvider>
                        <NavigationProvider>
                            <Sidebar/>
                            <NavigationModal />
                            <MainContent children={children}/>
                        </NavigationProvider>
                    </ThemeProvider>
                </DarkProvider>
            </AuthProvider>
        </HeroUIProvider>
    )
}