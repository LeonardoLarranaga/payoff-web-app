import {useNavigation} from "@/contexts/navigation-context"
import {usePathname} from "next/navigation"

export default function MainContent({children}) {
    const { isNavigationMenuOpen } = useNavigation()
    const pathname = usePathname()

    return (
        <div
            className={pathname !== "/" && window.innerWidth >= 700 ? "pt-1 pl-1 ml-56" : ""}
            style={{
                marginLeft: pathname !== "/" && isNavigationMenuOpen && window.innerWidth >= 700 ? '14rem' : '0',
            }}
        >
            {children}
        </div>
    )
}