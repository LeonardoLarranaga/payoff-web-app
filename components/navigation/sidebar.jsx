'use client'

import {motion} from 'framer-motion'
import {useNavigation} from "@/contexts/navigation-context"
import {usePathname} from "next/navigation"
import UserMenu from "@/components/navigation/user-menu"
import {useEffect, useState} from "react"
import {useAuth} from "@/contexts/auth-context"
import AddDebt from "@/components/debts/add-debt/add-debt"
import NavigationDebtItem from "@/components/navigation/navigation-debt-item"
import {sidebarChevronIcon} from "@/libraries/icons"

export default function Sidebar() {
    const { debtItems, isNavigationMenuOpen, setIsNavigationMenuOpen } = useNavigation()
    const { token } = useAuth()

    const [showSidebar, setShowSidebar] = useState(true)
    const pathname = usePathname()

    const [showDebts, setShowDebts] = useState(true)

    useEffect(() => {
        setShowSidebar(pathname !== '/')
        if (!token) setIsNavigationMenuOpen(pathname !== '/')
    }, [pathname])

    if (!showSidebar || pathname === '/') return null

    return (
        <motion.div
            animate={{ left: !isNavigationMenuOpen ? '-100%' : '0.5rem' }}
            transition={{ type: 'spring', duration: 0.45 }}
            className={`${showSidebar ? 'w-56' : 'w-0'} backdrop-blur-2xl rounded-lg border-2 border-[var(--sidebar-border)] bg-[var(--sidebar-background)] fixed z-30 flex flex-col overflow-y-scroll ${pathname === '/' ? 'opacity-0' : ''}`}
            style={{
                top: '0.5rem',
                left: '0.5rem',
                right: '0.5rem',
                bottom: '0.5rem'
            }}
        >
            <div className="flex flex-col w-full h-full justify-between space-y-6 pt-1 px-2 pb-2">
                <div>
                    <a href={'/home'}>
                        <img src="/images/icon.png" alt="App icon" className="w-10 h-10 mt-2 mb-2"/>
                    </a>

                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-xl">Debts</h1>

                        <div className="items-center space-x-2">
                            <button
                                onClick={() => setShowDebts(!showDebts)}
                                className={`transform transition-transform duration-300 ease-in-out ${
                                    showDebts ? 'rotate-180' : 'rotate-90'
                                } translate-y-1`}>
                                {sidebarChevronIcon}
                            </button>
                            <AddDebt/>
                        </div>
                    </div>

                    <motion.div
                        className="flex flex-col space-y-2 mt-2 max-h-[280px] overflow-y-scroll"
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: showDebts ? 1 : 0, height: showDebts ? "18rem" : 0}}
                        exit={{opacity: 0, height: 0}}
                        transition={{duration: 0.3, ease: "easeInOut"}}
                    >
                        {debtItems.map((item, index) => (
                            <NavigationDebtItem key={index} item={item}/>
                        ))}
                    </motion.div>
                </div>

                <UserMenu/>
            </div>
        </motion.div>
    )
}