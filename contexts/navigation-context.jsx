'use client'

import {createContext, useContext, useEffect} from "react"
import {useCookies} from "react-cookie"
import {useAuth} from "@/contexts/auth-context"
import pocketbase from "@/libraries/pocketbase"
import {useLocalStorage} from "@/libraries/use-local-storage"

const NavigationContext = createContext(null)

export const useNavigation = () => {
    return useContext(NavigationContext)
}

export const NavigationProvider = ({children}) => {

    const [cookies, setCookie] = useCookies(['isNavigationMenuOpen', 'menuItems'])

    const toggleNavigationMenu = () => {
        setCookie('isNavigationMenuOpen', cookies.isNavigationMenuOpen !== true)
    }

    const setIsNavigationMenuOpen = (isOpen) => {
        setCookie('isNavigationMenuOpen', isOpen)
    }

    const { token } = useAuth()

    const isNavigationMenuOpen = cookies.isNavigationMenuOpen === true
    // const menuItems = cookies.menuItems
    const [debtItems, setDebtItems] = useLocalStorage('menuItems', [])

    // useEffect(() => {
    //     if (cookies.menuItems) {
    //         console.log("Menu items loaded from cookies", cookies.menuItems)
    //     } else {
    //         console.log("Setting default menu items")
    //         setCookie('menuItems', JSON.stringify(defaultMenuItems))
    //     }
    // }, [cookies.menuItems])

    useEffect(() => {
        const handleResize = () => {
            setCookie('isNavigationMenuOpen', window.innerWidth > 700)
        }

        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (token) {
            pocketbase.collection("debts").subscribe("*", function (e) {
                console.log("Debts collection updated:", e)
                setCookie("menuItems", JSON.stringify([...cookies.menuItems, {
                    id: e.record.id,
                    title: e.record.title,
                    path: `/debt/${e.record.id}`,
                    icon: e.record.icon
                }]))
            }).catch()

            return () => {
                console.log("Unsubscribing from debts collection")
                pocketbase.collection("debts").unsubscribe().catch()
            }
        }
    }, [token])

    const value = {
        isNavigationMenuOpen,
        toggleNavigationMenu,
        setIsNavigationMenuOpen,
        debtItems
    }

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    )
}