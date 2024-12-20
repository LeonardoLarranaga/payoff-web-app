import {Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Switch, useDisclosure} from "@nextui-org/react"
import useRefs from "react-use-refs"
import {useState} from "react"
import IconPicker from "@/components/debts/add-debt/icon-picker"
import {HexColorPicker} from "react-colorful"
import pocketbase from "@/libraries/pocketbase"

export default function AddDebt() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const [titleRef] = useRefs()

    const [icon, setIcon] = useState("")
    const [color, setColor] = useState(null)
    const [error, setError] = useState(null)

    const onAddDebt = async (onClose) => {
        try {
            setError(null)
            if (!titleRef.current.value.trim()) {
                setError(new Error("Please enter a title for the debt"))
                return
            }
            const data = {
                user: pocketbase.authStore.model.id,
                transactions: [],
                title: titleRef.current.value,
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
            if (!record.ok) return
            onClose()
        } catch (error) {
            setError(error)
        }
    }

    return (
        <>
            <Button
                onPress={onOpen}
                variant="bordered"
                color="primary"
                className="h-10"
                startContent={<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"> <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"> <path d="M3 10V8a2 2 0 0 1 2-2h2m-4 4c1.333 0 4-.8 4-4m-4 4v4m18-4V8a2 2 0 0 0-2-2h-2m4 4c-1.333 0-4-.8-4-4m4 4v2M7 6h10M3 14v2a2 2 0 0 0 2 2h2m-4-4c1.333 0 4 .8 4 4m0 0h4"/> <circle cx="12" cy="12" r="2"/> <path d="M18 15v3m0 3v-3m0 0h-3m3 0h3"/> </g></svg>}
            >
                Add Debt
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">New Debt</ModalHeader>

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
                                    className="font-bold"
                                    onValueChange={(isSelected) => setColor(isSelected ? "#2671D9" : null)}
                                >
                                    Custom Color
                                </Switch>

                                { color != null && <HexColorPicker color={color} onChange={setColor} /> }

                                <Button
                                    onPress={() => onAddDebt(onClose)}
                                    color="primary"
                                >
                                    Add Debt
                                </Button>

                                {error != null && <p className="text-red-500">{error.message}</p>}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}