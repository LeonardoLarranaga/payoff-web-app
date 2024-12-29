import {usePathname, useRouter} from "next/navigation"
import {Icon} from "@iconify/react"
import {useIsDarkMode} from "@/contexts/dark-contest"

export default function NavigationDebtItem({index, item, onClose}) {
    const pathname = usePathname()
    const router = useRouter()
    const isDarkMode= useIsDarkMode()

    const handleOnPress = () => {
        if (item.path === pathname) return
        router.push(item.path)
        if (onClose) onClose()
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

    const iconSize = onClose ? 32 : 24
    const textSize = onClose ? 'text-xl' : ''
    const itemHeight = onClose ? 'h-10' : 'h-8'

    return (
        <button
            key={index}
            className={`${itemHeight} rounded-lg flex-shrink-0 ${backgroundColor()}`}
            onClick={handleOnPress}
        >
            <div className="h-full flex flex-row items-center justify-start gap-2">
                <Icon
                    icon={item.icon}
                    width={iconSize}
                    height={iconSize}
                    color={item.color}
                />
                <h1 className={textSize}>{item.title}</h1>

            </div>
        </button>
    )
}