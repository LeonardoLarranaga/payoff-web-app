'use client'

import {createContext, useContext, useEffect, useState} from "react"
import {useTheme} from "next-themes"

const DarkContext = createContext(null)

export const useIsDarkMode = () => {
    return useContext(DarkContext)
}

export const DarkProvider = ({children}) => {
    const { theme } = useTheme()
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        if (theme === 'dark') {
            setIsDarkMode(true)
        } else if (theme === 'light') {
            setIsDarkMode(false)
        } else {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            setIsDarkMode(darkModeMediaQuery.matches)
            darkModeMediaQuery.addEventListener('change', (e) => {
                setIsDarkMode(e.matches)
            })
        }
    }, [theme])

    return (
        <DarkContext.Provider value={isDarkMode}>
            {children}
        </DarkContext.Provider>
    )
}