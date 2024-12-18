'use client'

import {motion} from 'framer-motion'
import {useNavigation} from "@/contexts/navigation-context"
import {usePathname} from "next/navigation"
import UserMenu from "@/components/navigation/user-menu"
import NavigationMenuItem from "@/components/navigation/navigation-menu-item"
import {useEffect, useState} from "react"

export default function Sidebar() {
    const { menuItems, isNavigationMenuOpen } = useNavigation()

    const [showSidebar, setShowSidebar] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        setShowSidebar(pathname !== '/')
    }, [pathname])

    if (!showSidebar) return null

    return (
        <motion.div
            animate={{ left: !isNavigationMenuOpen ? '-100%' : '0' }}
            transition={{ type: 'spring', duration: 0.45 }}
            className={`w-56 backdrop-blur-2xl h-full top-0 left-0 fixed z-30 flex flex-col ${pathname === '/' ? 'opacity-0' : ''}`}
        >
            <div className="flex flex-row max-h-svh min-h-svh">
                <div className="flex flex-col w-full justify-between space-y-6 pt-2 px-1 mt-12">
                    <div className="flex flex-col">
                        {menuItems.map((item, index) => {
                            return <NavigationMenuItem key={index} item={item} isSidebar={true}/>
                        })}
                    </div>

                    <div className="pb-10">
                        <UserMenu />
                    </div>
                </div>

                {/*<Divider orientation="vertical" className="h-full"/>*/}
            </div>

        </motion.div>
    )
}