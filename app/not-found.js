"use client"

import pocketbase from "@/libraries/pocketbase"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {(!pocketbase.authStore.isValid ?? true) && (
                <a href={'/home'}>
                    <img src="/images/icon.png" alt="App icon" className="w-14 h-14 mb-2"/>
                </a>
            )}
            <h1 className="text-3xl font-bold">404</h1>
            <p className="text-lg text-gray-600">Page not found</p>
        </div>
    )
}