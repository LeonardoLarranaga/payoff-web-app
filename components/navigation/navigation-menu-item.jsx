import {Icon} from "@iconify/react"
import {Link} from "@nextui-org/react"
import {usePathname} from "next/navigation"

export default function NavigationMenuItem({item, isSidebar}) {

    const pathName = usePathname()

    return (
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
}