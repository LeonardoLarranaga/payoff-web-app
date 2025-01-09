"use client"

import {useAuth} from "@/contexts/auth-context"

export default function NotFound() {

    const { token } = useAuth()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {!token && (
                <a href={'/home'}>
                    <img src="/images/icon.png" alt="App icon" className="w-14 h-14 mb-2"/>
                </a>
            )}
            <h1 className="text-3xl font-bold">404</h1>
            <p className="text-lg text-gray-600">Page not found</p>
        </div>
    )
}