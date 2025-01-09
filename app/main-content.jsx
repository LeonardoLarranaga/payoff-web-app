import {useNavigation} from "@/contexts/navigation-context"
import {usePathname} from "next/navigation"

export default function MainContent({children}) {
    const { isNavigationMenuOpen } = useNavigation()
    const pathname = usePathname()

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 700

    return (
        <div
            className={pathname !== "/" && isDesktop ? "pt-1 pl-1 ml-56" : ""}
            style={{
                marginLeft: pathname !== "/" && isNavigationMenuOpen && isDesktop ? '14rem' : '0',
            }}
        >
            {children}
        </div>
    )
}