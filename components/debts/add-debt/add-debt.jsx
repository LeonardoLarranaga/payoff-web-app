import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Switch,
    useDisclosure
} from "@nextui-org/react"
import useRefs from "react-use-refs"
import {useEffect, useState} from "react"
import IconPicker from "@/components/debts/add-debt/icon-picker"
import {HexColorPicker} from "react-colorful"
import pocketbase from "@/libraries/pocketbase"
import {useRouter} from "next/navigation"

export const AddIcon = ({width, height}) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path
                d="M3 10V8a2 2 0 0 1 2-2h2m-4 4c1.333 0 4-.8 4-4m-4 4v4m18-4V8a2 2 0 0 0-2-2h-2m4 4c-1.333 0-4-.8-4-4m4 4v2M7 6h10M3 14v2a2 2 0 0 0 2 2h2m-4-4c1.333 0 4 .8 4 4m0 0h4"/>
            <circle cx="12" cy="12" r="2"/>
            <path d="M18 15v3m0 3v-3m0 0h-3m3 0h3"/>
        </g>
    </svg>)
}

export default function AddDebt({mobile, debt, setDebt}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const [titleRef] = useRefs()

    const [icon, setIcon] = useState("")
    const [color, setColor] = useState("")
    const [error, setError] = useState(null)
    const [switchSelected, setSwitchSelected] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (isOpen && debt) {
            setIcon(debt.icon)
            titleRef.current.value = debt.title
            if (debt.color != null && debt.color.trim()) {
                setSwitchSelected(true)
                setColor(debt.color)
            }
        }
    }, [isOpen, debt])

    const onAddDebt = async (onClose) => {
        try {
            setError(null)
            if (!titleRef.current?.value.trim()) {
                setError(new Error("Please enter a title for the debt"))
                return
            }
            const data = {
                user: pocketbase.authStore.model.id,
                transactions: [],
                title: titleRef.current?.value ?? "",
                icon: icon,
                totalAmount: 0.0,
                debtHistory: JSON.stringify([
                    {
                        id: 1,
                        color: color,
                        data: [
                            {
                                x: Intl.DateTimeFormat('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }).format(new Date()),
                                y: 0.0
                            }
                        ]
                    }
                ]),
                color: color
            }

            const record = await pocketbase.collection("debts").create(data)
            if (record.message) {
                setError(record.message)
                return
            }
            if (!record.id) return
            onClose()
            router.push(`/debt/${record.id}`)
        } catch (error) {
            setError(error)
            console.log(error)
        }
    }

    const onDeleteDebt = async (onClose) => {
        try {
            setError(null)
            await pocketbase.collection("debts").delete(debt.id)
            onClose()
            router.push("/home")
        } catch (error) {
            console.log(error)
        }
    }

    const onUpdateDebt = async (onClose) => {
        try {
            setError(null)
            if (!titleRef.current?.value.trim()) {
                setError(new Error("Please enter a title for the debt"))
                return
            }
            const data = {
                title: titleRef.current?.value ?? "",
                icon: icon,
                color: color
            }

            const record = await pocketbase.collection("debts").update(debt.id, data)
            if (record.message) {
                setError(record.message)
                return
            }

            if (!record.id) return

            setDebt((previous) => ({
                ...previous,
                title: record.title,
                icon: record.icon,
                color: record.color
            }))
            onClose()
        } catch (error) {
            setError(error)
            console.log(error)
        }
    }

    return (
        <>
            {!debt ? (
                <Button
                    onPress={onOpen}
                    variant={mobile ? "bordered" : "faded"}
                    color={mobile ? "primary" : "default"}
                    isIconOnly={!mobile}
                    className={`${mobile ? "w-full h-12" : ''}`}
                    startContent={mobile ? <AddIcon width="60" height="60"/> : null}
                    size={mobile ? "md" : "sm"}
                >
                    {mobile ? "Add Debt" : <AddIcon width="20" height="20"/>}
                </Button>
            ) : (
                <Button
                    onPress={onOpen}
                    isIconOnly
                    variant="faded"
                    size="sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M20 7h-9m3 10H5"></path><circle cx={17} cy={17} r={3}></circle><circle cx={7} cy={7} r={3}></circle></g></svg>
                </Button>
            )}

            <Modal
                isOpen={isOpen}
                onOpenChange={(isOpen) => {
                    onOpenChange()
                    if (!isOpen) {
                        setError(null)
                        setIcon("")
                        setColor("")
                    }
                }}
                placement="center"
                className={`${mobile ? "mx-4" : ""}`}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{debt ? "Edit Debt" : "New Debt"}</ModalHeader>

                            <ModalBody>
                                <div className="w-full flex grid-cols-7 gap-4 items-center h-14">
                                    <IconPicker icon={icon} setIcon={setIcon} color={color}/>

                                    <Input
                                        label="Debt Title"
                                        ref={titleRef}
                                        variant="bordered"
                                        className="grid-cols-6"
                                    />
                                </div>

                                <Switch
                                    className="font-bold my-3"
                                    onValueChange={(isSelected) => {setColor(isSelected ? "#2671D9" : ""); setSwitchSelected(isSelected)}}
                                    isSelected={switchSelected}
                                >
                                    Custom Color
                                </Switch>

                                { color !== "" &&
                                    <HexColorPicker
                                        className="pb-3"
                                        color={color}
                                        onChange={setColor}
                                    />
                                }

                                <Button
                                    onPress={() => debt ? onUpdateDebt(onClose) : onAddDebt(onClose)}
                                    color="primary"
                                >
                                    {debt ? "Save" : "Add Debt"}
                                </Button>

                                { debt && (
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                color="danger"
                                                variant="bordered"
                                            >
                                                Delete Debt
                                            </Button>
                                        </DropdownTrigger>

                                        <DropdownMenu>
                                            <DropdownItem key="dont">Cancel</DropdownItem>
                                            <DropdownItem
                                                onPress={() => onDeleteDebt(onClose)}
                                                key="delete"
                                                color="danger"
                                                startContent={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M10.238 3.974L9.98 5.75h4.037l-.256-1.776c-.048-.167-.17-.224-.243-.224H10.48c-.073 0-.195.057-.243.224m5.296 1.776H19.5a.75.75 0 0 1 0 1.5h-.769l-.873 10.185c-.053.62-.096 1.13-.165 1.542c-.07.429-.177.813-.386 1.169a3.25 3.25 0 0 1-1.401 1.287c-.372.177-.764.25-1.198.284c-.417.033-.928.033-1.55.033h-2.316c-.623 0-1.133 0-1.55-.033c-.434-.034-.826-.107-1.198-.284a3.25 3.25 0 0 1-1.401-1.287c-.21-.356-.315-.74-.386-1.169c-.069-.413-.112-.922-.165-1.542L5.269 7.25H4.5a.75.75 0 0 1 0-1.5h3.966l.293-2.029l.011-.061c.182-.79.86-1.41 1.71-1.41h3.04c.85 0 1.528.62 1.71 1.41l.011.061z"></path></svg>}
                                            >
                                                Delete
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>

                                )}

                                {error != null && <p className="text-red-500">{error.message}</p>}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}