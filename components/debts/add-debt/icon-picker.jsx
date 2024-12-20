import {Button, Input, Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react"
import {Icon} from "@iconify/react"
import {useEffect, useRef, useState} from "react"

export default function IconPicker({ icon, setIcon, color }) {

    const inputRef = useRef(null)
    const [icons, setIcons] = useState([])
    const [query, setQuery] = useState("")
    const [isOpened, setIsOpened] = useState(false)
    const [abortController, setAbortController] = useState(new AbortController())

    const fetchIcons = async () => {
        if (abortController) abortController.abort()
        const controller = new AbortController();
        setAbortController(controller);

        try {
            const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}`, {signal: controller.signal})
            if (!response.ok) return
            const data = await response.json()
            setIcons(data.icons ?? [])
        } catch (error) {
            console.log(error)
        }
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
                    endContent={<svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 10l4 4l4-4"></path></svg>}
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
                        startContent={<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"> <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path> <path fill="currentColor" d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"></path></g></svg>}
                    />

                    <div className="grid grid-cols-3 gap-4 place-items-center overflow-y-auto w-full">
                        {icons.map((icon, index) => (
                            <Button
                                key={index}
                                variant="bordered"
                                onPress={() => {setIcon(icon); setIsOpened(false)}}
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