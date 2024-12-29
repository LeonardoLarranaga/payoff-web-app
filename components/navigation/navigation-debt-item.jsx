import {usePathname, useRouter} from "next/navigation"
import {Icon} from "@iconify/react"
import {useIsDarkMode} from "@/contexts/dark-contest"

export default function NavigationDebtItem({index, item}) {
    const pathname = usePathname()
    const router = useRouter()
    const isDarkMode= useIsDarkMode()

    const handleOnPress = () => {
        if (item.path === pathname) return
        router.push(item.path)
    }

    const backgroundColor = () => {
        if (item.path === pathname) {
            if (isDarkMode) return 'bg-zinc-200/20'
            return 'bg-zinc-300/70'
        } else {
            if (isDarkMode) return 'hover:bg-zinc-200/5'
            return 'hover:bg-zinc-300/50'
        }
    }

    return (
        <button
            key={index}
            className={`h-8 rounded-lg flex-shrink-0 ${backgroundColor()}`}
            onClick={handleOnPress}
        >
            <div className="h-full flex flex-row items-center justify-start gap-2">
                <Icon
                    icon={item.icon}
                    width="24"
                    height="24"
                    color={item.color}
                />
                {item.title}
            </div>
        </button>
    )
}