'use client'

import {useNavigation} from "@/contexts/navigation-context"
import {useEffect, useState} from "react"
import {Spacer} from "@nextui-org/react"
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
        <header className={`hidden md:block sticky top-0 z-40 h-12 backdrop-blur-2xl items-center w-full ${pathname === '/' ? 'opacity-0' : ''}`}>
            <div className='w-56 flex items-center justify-between h-full pl-4'>
                <h1 className="font-bold text-3xl">
                    Payoff
                </h1>

                <Spacer />

                <button
                    onClick={toggleNavigationMenu}
                    suppressContentEditableWarning
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                        <rect width="18" height="18" x="3" y="3" rx="2" fill="none" stroke="currentColor"
                              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                        <path d="M9 3v18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2"/>
                    </svg>

                </button>

                {/*<Divider orientation="vertical" className="-ml-8" />*/}
            </div>

            {/*<Divider className="w-full"/>*/}
        </header>
    )
}