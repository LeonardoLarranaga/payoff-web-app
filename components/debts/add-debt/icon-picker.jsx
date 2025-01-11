import {Button, Input, Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react"
import {Icon} from "@iconify/react"
import {useEffect, useRef, useState} from "react"
import {iconPickerChevron, iconPickerIcon} from "@/libraries/icons"

export default function IconPicker({ icon, setIcon, color }) {

    const inputRef = useRef(null)
    const [icons, setIcons] = useState([])
    const [query, setQuery] = useState("")
    const [isOpened, setIsOpened] = useState(false)
    const [abortController, setAbortController] = useState(new AbortController())

    const fetchIcons = async () => {
        if (abortController) abortController.abort()
        const controller = new AbortController()
        setAbortController(controller)

        try {
            const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}`, {signal: controller.signal})
            if (!response.ok) return
            const data = await response.json()
            setIcons(data.icons ?? [])
        } catch (error) {
            console.log(error)
        }
    }

    const onSelectIcon = (icon) => {
        setIcon(icon)
        setIsOpened(false)
    }

    useEffect(() => {
        if (!query.trim()) return

        const timeout = setTimeout(() => {
            fetchIcons().catch(console.error)
        }, 1000)

        return () => clearTimeout(timeout)
    }, [query])

    useEffect(() => {
        if (isOpened) inputRef.current.focus()
    }, [isOpened])

    return (
        <Popover isOpen={isOpened} onOpenChange={setIsOpened}>
            <PopoverTrigger className="grid-cols-1 h-14">
                <Button
                    variant="bordered"
                    className="aspect-square"
                    endContent={iconPickerChevron}
                >
                    {icon.trim() !== '' ?
                        <Icon
                            icon={icon}
                            width={128}
                            height={128}
                            color={color}
                        />
                     :
                        <p>Icon</p>
                    }
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-64 h-72">
                <div className="flex flex-col w-full h-full align-top">
                    <Input
                        label="Search"
                        variant="underlined"
                        ref={inputRef}
                        onValueChange={setQuery}
                        className="mb-2"
                        startContent={iconPickerIcon}
                    />

                    <div className="grid grid-cols-3 gap-4 place-items-center overflow-y-auto w-full">
                        {icons.map((icon, index) => (
                            <Button
                                key={index}
                                variant="bordered"
                                onPress={() => onSelectIcon(icon)}
                                className="aspect-square"
                                isIconOnly
                            >
                                <Icon icon={icon} width={64} height={64}/>
                            </Button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}