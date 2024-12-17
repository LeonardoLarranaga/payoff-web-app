'use client'

import {Icon} from "@iconify/react"
import {useNavigation} from "@/contexts/navigation-context"
import {useEffect, useState} from "react"
import {Divider, Spacer} from "@nextui-org/react"
import {usePathname} from "next/navigation"

export default function Header() {

    const { toggleNavigationMenu } = useNavigation()
    const [showHeader, setShowHeader] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        setShowHeader(pathname !== '/')
    }, [pathname])

    if (!showHeader) return null

    return (
        <header className="hidden md:block sticky top-0 z-50 h-12 backdrop-blur-2xl items-center w-full">
            <div className='w-56 flex items-center justify-between h-full pl-4'>
                <h1 className="font-bold text-3xl">
                    Payoff
                </h1>

                <Spacer />

                <button
                    onClick={toggleNavigationMenu}
                    suppressContentEditableWarning
                >
                    <Icon icon="lucide:panel-left" width="26" height="26"/>
                </button>

                <Divider orientation="vertical" className="-ml-8" />
            </div>

            <Divider className="w-full"/>
        </header>
    )
}