import {Button, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react"
import useRefs from "react-use-refs"
import {useState} from "react"
import IconPicker from "@/components/debts/add-debt/icon-picker"

export default function AddDebt() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const [titleRef] = useRefs()
    const [icon, setIcon] = useState("")

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
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">New Debt</ModalHeader>

                            <ModalBody>
                                <div className="w-full flex grid-cols-7 gap-4 items-center h-14">
                                    <IconPicker icon={icon} setIcon={setIcon}/>

                                    <Input
                                        label="Debt Title"
                                        ref={titleRef}
                                        variant="bordered"
                                        className="grid-cols-6"
                                    />
                                </div>



                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}