import {useNavigation} from "@/contexts/navigation-context"
import {usePathname} from "next/navigation"

export default function MainContent({children}) {
    const { isNavigationMenuOpen } = useNavigation()
    const pathname = usePathname()

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 700

    return (
        <div
            style={{
                paddingTop: "0.25rem",
                paddingLeft: "0.25rem",
                marginLeft: pathname !== "/" && (isNavigationMenuOpen || isDesktop) ? '14rem' : '0',
            }}
        >
            {children}
        </div>
    )
}