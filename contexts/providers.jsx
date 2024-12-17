'use client'

import {AuthProvider} from "@/contexts/auth-context"
import {DarkProvider} from "@/contexts/dark-contest"
import {NextUIProvider} from "@nextui-org/react"
import {ThemeProvider} from "next-themes"
import {NavigationProvider} from "@/contexts/navigation-context"
import Sidebar from "@/components/navigation/sidebar"
import Header from "@/components/navigation/header"
import MainContent from "@/app/main-content";
import NavigationModal from "@/components/navigation/navigation-modal"

export const Providers = ({children}) => {
    return (
        <NextUIProvider>
            <AuthProvider>
                <DarkProvider>
                    <ThemeProvider>
                        <NavigationProvider>
                            <Sidebar/>
                            <Header/>
                            <NavigationModal />
                            <MainContent children={children}/>
                        </NavigationProvider>
                    </ThemeProvider>
                </DarkProvider>
            </AuthProvider>
        </NextUIProvider>
    )
}