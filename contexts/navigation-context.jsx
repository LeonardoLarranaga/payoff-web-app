'use client'

import {createContext, useContext, useState} from "react"

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

    const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(
        () => JSON.parse(localStorage.getItem('isNavigationMenuOpen')) ?? false
    )
    const [menuItems, setMenuItems] = useState(defaultMenuItems)

    const toggleNavigationMenu = () => {
        setIsNavigationMenuOpen(!isNavigationMenuOpen)
        localStorage.setItem('isNavigationMenuOpen', JSON.stringify(!isNavigationMenuOpen))
    }

    const value = {
        isNavigationMenuOpen,
        toggleNavigationMenu,
        menuItems,
    }

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    )
}