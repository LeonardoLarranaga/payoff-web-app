'use client'

import {createContext, useContext, useEffect} from "react"
import {useCookies} from "react-cookie"

const NavigationContext = createContext(null)

export const useNavigation = () => {
    return useContext(NavigationContext)
}

const defaultMenuItems = [
    {
        title: "Home",
        path: "/home",
        icon: "fluent:home-20-filled"
    }
]

export const NavigationProvider = ({children}) => {

    const [cookies, setCookie] = useCookies(['isNavigationMenuOpen', 'menuItems'])

    const toggleNavigationMenu = () => {
        setCookie('isNavigationMenuOpen', cookies.isNavigationMenuOpen !== true)
    }

    const setIsNavigationMenuOpen = (isOpen) => {
        setCookie('isNavigationMenuOpen', isOpen)
    }

    const isNavigationMenuOpen = cookies.isNavigationMenuOpen === true
    const menuItems = cookies.menuItems || defaultMenuItems

    useEffect(() => {
        if (!cookies.menuItems) {
            setCookie('menuItems', defaultMenuItems)
        }

        const handleResize = () => {
            if (window.innerWidth <= 700) {
                setCookie('isNavigationMenuOpen', false)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const value = {
        isNavigationMenuOpen,
        toggleNavigationMenu,
        setIsNavigationMenuOpen,
        menuItems
    }

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    )
}