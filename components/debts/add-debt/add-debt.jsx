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
} from "@heroui/react"
import {useEffect, useState} from "react"
import IconPicker from "@/components/debts/add-debt/icon-picker"
import {HexColorPicker} from "react-colorful"
import pocketbase from "@/libraries/pocketbase"
import {useRouter} from "next/navigation"
import {addIcon, debtEditIcon, trashIcon} from "@/libraries/icons"

export default function AddDebt({mobile, debt, setDebt}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const [title, setTitle] = useState("")
    const [icon, setIcon] = useState("")
    const [color, setColor] = useState("")
    const [error, setError] = useState(null)
    const [switchSelected, setSwitchSelected] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (isOpen && debt) {
            setIcon(debt.icon)
            setTitle(debt.title)
            if (debt.color != null && debt.color.trim()) {
                setSwitchSelected(true)
                setColor(debt.color)
            }
        }
    }, [isOpen, debt])

    const onColorSwitchChange = (isSelected) => {
        setColor(isSelected ? "#2671D9" : "")
        setSwitchSelected(isSelected)
    }

    const onDebt = (onClose) => {
        if (debt) {
            pocketbase.updateDebt(debt, setDebt, title, icon, color, setError, onClose).catch()
        } else {
            pocketbase.addDebt(title, icon, color, setError, onClose, router).catch()
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
                            <ModalHeader className="flex flex-col gap-1">
                                {debt ? "Edit Debt" : "New Debt"}
                            </ModalHeader>

                            <ModalBody>
                                <div className="w-full flex grid-cols-7 gap-4 items-center h-14">
                                    <IconPicker icon={icon} setIcon={setIcon} color={color}/>

                                    <Input
                                        label="Debt Title"
                                        value={title}
                                        onValueChange={setTitle}
                                        variant="bordered"
                                        className="grid-cols-6"
                                    />
                                </div>

                                <Switch
                                    className="font-bold my-3"
                                    onValueChange={onColorSwitchChange}
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
                                    onPress={() => onDebt(onClose)}
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
                                                onPress={() => pocketbase.deleteDebt(debt, setError, onClose, router)}
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