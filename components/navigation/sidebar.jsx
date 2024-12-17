'use client'

import {motion} from 'framer-motion'
import {useNavigation} from "@/contexts/navigation-context"
import {usePathname} from "next/navigation"
import {Divider} from "@nextui-org/react"
import UserMenu from "@/components/navigation/user-menu"
import NavigationMenuItem from "@/components/navigation/navigation-menu-item"

export default function Sidebar() {
    const { menuItems, isNavigationMenuOpen } = useNavigation()
    const pathName = usePathname()

    return (
        <motion.div
            animate={{ left: !isNavigationMenuOpen ? '-100%' : '0' }}
            transition={{ type: 'spring', duration: 0.45 }}
            className="w-56 backdrop-blur-2xl h-full top-0 left-0 fixed z-50 mt-12 flex flex-col shadow-lg"
        >
            <div className="flex flex-row max-h-svh min-h-svh">
                <div className="flex flex-col w-full justify-between space-y-6 pt-2 px-1">
                    <div className="flex flex-col">
                        {menuItems.map((item, index) => {
                            return <NavigationMenuItem key={index} item={item} isSidebar={true}/>
                        })}
                    </div>

                    <div className="pb-20">
                        <UserMenu />
                    </div>
                </div>

                <Divider orientation="vertical" className="h-full"/>
            </div>

        </motion.div>
    )
}