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
import {addIcon, debtEditIcon, trashIcon} from "@/libraries/icons"

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
                    startContent={mobile ? addIcon({width: 60, height: 60}) : null}
                    size={mobile ? "md" : "sm"}
                >
                    {mobile ? "Add Debt" : addIcon({width: 24, height: 24})}
                </Button>
            ) : (
                <Button
                    onPress={onOpen}
                    isIconOnly
                    variant="faded"
                    size="sm"
                >
                    {debtEditIcon}
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
                                                startContent={trashIcon}
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