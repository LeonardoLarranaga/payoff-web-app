'use client'

import {createContext, useContext, useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import pocketbase from "@/libraries/pocketbase";

const AuthContext = createContext(null)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
    const [authData, setAuthData] = useState(null)
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)

    const router = useRouter()

    useEffect(() => {
        try {
            if (pocketbase.authStore.token && pocketbase.authStore.isValid) {
                setAuthData(pocketbase.authStore.model)
                setName(localStorage.getItem('auth.name'))
                setEmail(localStorage.getItem('auth.email'))

                if (window.location.pathname === '/') router.push("home")
            } else clearCredentials()
        } catch (error) {
            console.log("Error loading auth store:", error)
            clearCredentials()
        }
    }, [router])

    function clearCredentials() {
        pocketbase.authStore.clear()
        localStorage.removeItem('auth.name')
        localStorage.removeItem('auth.email')
        setAuthData(null)
        setName(null)
        setEmail(null)
        router.push('/')
    }

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}