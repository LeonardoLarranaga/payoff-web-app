'use client'

import {createContext, useContext, useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import pocketbase from "@/libraries/pocketbase"
import {ClientResponseError} from "pocketbase"
import {useLocalStorage} from "@/libraries/use-local-storage"

const AuthContext = createContext(null)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
    const [otpResponse, setOtpResponse] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [email, setEmail] = useLocalStorage('email', null)
    const [token, setToken] = useLocalStorage('token', null)
    const [_, setIsNavigationMenuOpen] = useLocalStorage('isNavigationMenuOpen', true)

    const router = useRouter()

    useEffect(() => {
        try {
            if (pocketbase.authStore.token && pocketbase.authStore.isValid) {
                if (window.location.pathname === '/') router.push("home")
            } else clearCredentials()
        } catch (error) {
            console.log("Error loading auth store:", error)
            clearCredentials()
        }
    }, [router])

    function clearCredentials() {
        pocketbase.authStore.clear()
        setEmail(null)
        setToken(null)
        setOtpResponse(null)
        localStorage.removeItem('isNavigationMenuOpen')
        router.push('/')
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    const requestSignInWithOTP = async (email) => {
        if (!validateEmail(email)) {
            alert("Please enter a valid email address")
            return
        }

        let shouldSendOtp = false

        try {
            setIsLoading(true)
            const password = self.crypto.randomUUID()
            await pocketbase.collection("users").create({
                email: email,
                password: password,
                passwordConfirm: password,
                debtHistory: JSON.stringify([
                    {
                        id: 1,
                        color: "hsl(215, 70%, 50%)",
                        data: [
                            {
                                x: Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date()),
                                y: 0.0
                            }
                        ]
                    }
                ]),
            })
            shouldSendOtp = true
        } catch (error) {
            if (error instanceof ClientResponseError &&
                error.status === 400 &&
                error.response?.data?.email?.code === "validation_not_unique") {
                shouldSendOtp = true
            } else {
                alert("An error occurred while trying to sign in")
                console.error(error)
                setIsLoading(false)
            }
        }

        if (!shouldSendOtp) return

        const otpResponse = await pocketbase.collection("users").requestOTP(email)
        if (!otpResponse.otpId) {
            alert("An error occurred while trying to request the OTP")
            setIsLoading(false)
            return
        }

        setOtpResponse(otpResponse.otpId)
        setIsLoading(false)
    }

    const signInWithOTP = async (email, otp, setOtp, setIsInvalid) => {
        try {
            const auth = await pocketbase.collection("users").authWithOTP(otpResponse, otp)
            setOtp("")
            if (!auth.token) {
                alert("An error occurred while trying to sign in")
                setOtp("")
                setIsInvalid(true)
                return
            }
            setToken(auth.token)
            setEmail(email)
            pocketbase.authStore.save(auth.token, auth.record)
            setOtpResponse(null)
            router.push("home")
            setIsNavigationMenuOpen(true)
        } catch (error) {
            console.error(error)
            setIsInvalid(true)
            setOtp("")
        }
    }

    const value = {
        email,
        token,
        otpResponse,
        requestSignInWithOTP,
        signInWithOTP,
        clearCredentials,
        isLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}