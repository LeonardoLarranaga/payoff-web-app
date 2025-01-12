'use client'

import {createContext, useContext, useEffect} from "react"
import pocketbase from "@/libraries/pocketbase"
import {useLocalStorage} from "@/libraries/use-local-storage"

const NavigationContext = createContext(null)

export const useNavigation = () => {
    return useContext(NavigationContext)
}

export const NavigationProvider = ({children}) => {

    const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useLocalStorage('isNavigationMenuOpen', true)

    const toggleNavigationMenu = () => {
        setIsNavigationMenuOpen(!isNavigationMenuOpen)
    }

    const [debtItems, setDebtItems] = useLocalStorage('menuItems', [])

    useEffect(() => {
        const handleResize = () => {
            setIsNavigationMenuOpen(document.documentElement.clientWidth > 700)
        }

        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (pocketbase.authStore.isValid) {
            // Fetch debts for the first time
            const fetchDebts = async () => {
                try {
                    const records = await pocketbase.collection("debts").getFullList({
                        sort: "created"
                    })

                    setDebtItems([])
                    setDebtItems(records.map((record) => ({
                        id: record.id,
                        title: record.title,
                        icon: record.icon,
                        color: record.color,
                        path: `/debt/${record.id}`
                    })))
                } catch (error) {
                    console.log("Error fetching debts:", error)
                }
            }

            fetchDebts().catch()

            // Subscribe to debts collection
            pocketbase.collection("debts").subscribe("*", function (e) {
                switch (e.action) {
                    case "create":
                        setDebtItems((previous) => [...previous, {
                            id: e.record.id,
                            title: e.record.title,
                            icon: e.record.icon,
                            color: e.record.color,
                            path: `/debt/${e.record.id}`
                        }])
                        break

                    case "update":
                        setDebtItems((previous) => previous.map((item) => item.id === e.record.id ? {
                            id: e.record.id,
                            title: e.record.title,
                            icon: e.record.icon,
                            color: e.record.color,
                            path: `/debt/${e.record.id}`
                        } : item))
                        break

                    case "delete":
                        setDebtItems((previous) => previous.filter((item) => item.id !== e.record.id))
                        break
                }
            }).catch()

            return () => {
                pocketbase.collection("debts").unsubscribe().catch()
            }
        } else {
            setDebtItems([])
        }
    }, [pocketbase.authStore.token, pocketbase.authStore.isValid])

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