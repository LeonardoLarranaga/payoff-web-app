import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    ModalBody,
    ModalContent,
    useDisclosure
} from "@nextui-org/react"
import pocketbase from "@/libraries/pocketbase"
import AddTransaction from "@/components/debts/transactions/add-transaction"
import {useState} from "react"

export default function ActionsColumn({debt, transaction}) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [active, setActive] = useState(false)

    const onDelete = async () => {
        try {
            await pocketbase.collection("transactions").delete(transaction.id)
        } catch (error) {
           alert(`Error deleting transaction: ${error}`)
        }
    }

    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-gray-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 256 256"><path fill="currentColor" d="M112 60a16 16 0 1 1 16 16a16 16 0 0 1-16-16m16 52a16 16 0 1 0 16 16a16 16 0 0 0-16-16m0 68a16 16 0 1 0 16 16a16 16 0 0 0-16-16"></path></svg>
                    </Button>
                </DropdownTrigger>

                <DropdownMenu><>
                    {transaction.description.length > 50 && (
                        <DropdownItem>
                            <button onClick={onOpen}>View full description</button>
                        </DropdownItem>
                    )}

                    <DropdownItem onPress={() => setActive(!active)}>
                        Edit
                    </DropdownItem>

                    <DropdownItem color="danger" onPress={onDelete}>Delete</DropdownItem>
                </></DropdownMenu>
            </Dropdown>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                scrollBehavior="inside"
            >
                <ModalContent>
                    {() => (
                        <ModalBody>
                            <p>{transaction.description}</p>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>

            <AddTransaction debt={debt} transaction={transaction} activate={active} setActivate={setActive} />
        </>
    )
}