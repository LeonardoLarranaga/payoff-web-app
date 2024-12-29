import {usePathname, useRouter} from "next/navigation"
import {Button} from "@nextui-org/react"
import {Icon} from "@iconify/react"

export default function NavigationDebtItem({index, item}) {
    const pathname = usePathname()
    const router = useRouter()

    const handleOnPress = () => {
        if (item.path === pathname) return
        router.push(item.path)
    }

    return (
        <Button
            variant="light"
            key={index}
            startContent={<Icon icon={item.icon} width="24" height="24"/>}
            className={`justify-start ${item.path === pathname ? 'bg-zinc-200/25' : ''}`}
            onPress={handleOnPress}
        >
            {item.title}
        </Button>
    )
}