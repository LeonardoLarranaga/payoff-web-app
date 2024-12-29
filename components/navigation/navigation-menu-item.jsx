import {Icon} from "@iconify/react"
import {Link} from "@nextui-org/react"
import {usePathname} from "next/navigation"

export default function NavigationMenuItem({item, isSidebar}) {

    const pathname = usePathname()

    const handleOnPress = (event) => {
        if (item.path === pathname) event.preventDefault()
        else console.log("Navigating to:", item.path)
    }

    return (
        <Link
            href={item.path}
            onClick={(event) => handleOnPress(event)}
            className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${
                item.path === pathname ? 'bg-zinc-200' : ''
            }`}
        >
            <Icon icon={item.icon} width="24" height="24"/>
            <span className="font-semibold text-xl">{item.title}</span>
        </Link>
    )
}

