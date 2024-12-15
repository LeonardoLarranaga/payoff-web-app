'use client'

import {createContext, useContext, useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import pocketbase from "@/libraries/pocketbase";
import {ClientResponseError} from "pocketbase";

const AuthContext = createContext(null)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
    const [email, setEmail] = useState(null)
    const [token, setToken] = useState(null)
    const [otpResponse, setOtpResponse] = useState("")

    const router = useRouter()

    useEffect(() => {
        try {
            if (!token || !email)
            if (pocketbase.authStore.token && pocketbase.authStore.isValid) {
                setEmail(localStorage.getItem('auth.email'))
                setToken(localStorage.getItem('auth.token'))
                if (window.location.pathname === '/') router.push("home")
            } else clearCredentials()
        } catch (error) {
            console.log("Error loading auth store:", error)
            clearCredentials()
        }
    }, [router])

    function clearCredentials() {
        pocketbase.authStore.clear()
        localStorage.removeItem('auth.email')
        localStorage.removeItem('auth.token')
        setEmail(null)
        setToken(null)
        setOtpResponse(null)
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
            const password = self.crypto.randomUUID()
            await pocketbase.collection("users").create({
                email: email,
                password: password,
                passwordConfirm: password
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
            }
        }

        if (!shouldSendOtp) return

        const otpResponse = await pocketbase.collection("users").requestOTP(email)
        if (!otpResponse.otpId) {
            alert("An error occurred while trying to request the OTP")
            return
        }

        setOtpResponse(otpResponse.otpId)
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
            localStorage.setItem('auth.email', email)
            localStorage.setItem('auth.token', auth.token)
            pocketbase.authStore.save(auth.token, auth.record)
            setOtpResponse(null)
            router.push("home")
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
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}