'use client'

import {motion} from 'framer-motion'
import {useNavigation} from "@/contexts/navigation-context"
import {usePathname} from "next/navigation"
import UserMenu from "@/components/navigation/user-menu"
import {useEffect, useState} from "react"
import {useAuth} from "@/contexts/auth-context"
import AddDebt from "@/components/debts/add-debt/add-debt"

export default function Sidebar() {
    const { menuItems, isNavigationMenuOpen, setIsNavigationMenuOpen } = useNavigation()
    const { token } = useAuth()

    const [showSidebar, setShowSidebar] = useState(true)
    const pathname = usePathname()

    const [showDebts, setShowDebts] = useState(false)

    useEffect(() => {
        setShowSidebar(pathname !== '/')
        if (!token) setIsNavigationMenuOpen(pathname !== '/')
    }, [pathname])

    if (!showSidebar || pathname === '/') return null

    return (
        <motion.div
            animate={{ left: !isNavigationMenuOpen ? '-100%' : '0.5rem' }}
            transition={{ type: 'spring', duration: 0.45 }}
            className={`w-56 backdrop-blur-2xl rounded-lg border-2 border-[var(--sidebar-border)] bg-[var(--sidebar-background)] fixed z-30 flex flex-col ${pathname === '/' ? 'opacity-0' : ''}`}
            style={{
                top: '0.5rem',
                left: '0.5rem',
                right: '0.5rem',
                bottom: '0.5rem'
            }}
        >
            <div className="flex flex-col w-full h-full justify-between space-y-6 pt-1 px-2 pb-2">
                <div>
                    <img src="/images/icon.png" alt="App icon" className="w-10 h-10 mt-2 mb-4"/>

                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-xl">Debts</h1>

                        <div>
                            <AddDebt />
                        </div>
                    </div>
                </div>

                <UserMenu/>
            </div>
        </motion.div>
    )
}