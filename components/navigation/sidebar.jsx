'use client'

import {motion} from 'framer-motion'
import {useNavigation} from "@/contexts/navigation-context"
import {usePathname} from "next/navigation"
import {Divider, Link} from "@nextui-org/react"
import {Icon} from "@iconify/react"
import UserMenu from "@/components/navigation/user-menu"

export default function Sidebar() {
    const { menuItems, isNavigationMenuOpen } = useNavigation()
    const pathName = usePathname()

    const MenuItem = ({ item }) => (
        <Link
            href={item.path}
            className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${
                item.path === pathName ? 'bg-zinc-200' : ''
            }`}
        >
            <Icon icon={item.icon} width="24" height="24"/>
            <span className="font-semibold text-xl">{item.title}</span>
        </Link>
    )

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
                            return <MenuItem key={index} item={item}/>
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