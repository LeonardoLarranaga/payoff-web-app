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
import {deleteIcon, descriptionIcon, editIcon, paidIcon, threeDotsIcon, unpaidIcon} from "@/libraries/icons"

export default function ActionsColumn({debt, transaction}) {

    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    const [active, setActive] = useState(false)

    const onDelete = async () => {
        try {
            await pocketbase.collection("transactions").delete(transaction.id)
        } catch (error) {
            alert(`Error deleting transaction: ${error}`)
        }
    }

    const onPaid = async () => {
        const data = {
            amount: transaction.amount * -1
        }

        try {
            await pocketbase.collection("transactions").update(transaction.id, data)
        } catch (error) {
            alert(`Error marking transaction as paid: ${error}`)
        }
    }

    const isUnpaid = transaction.amount > 0

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
                        {threeDotsIcon}
                    </Button>
                </DropdownTrigger>

                <DropdownMenu><>
                    {transaction.description.length > 50 && (
                        <DropdownItem
                            onPress={onOpen}
                            endContent={descriptionIcon}
                        >
                            View full description
                        </DropdownItem>
                    )}

                    <DropdownItem
                        color={isUnpaid ? "success" : "warning"}
                        onPress={onPaid}
                        endContent={isUnpaid ? paidIcon : unpaidIcon}
                    >
                        {isUnpaid ? "Mark as paid" : "Mark as unpaid"}
                    </DropdownItem>

                    <DropdownItem
                        onPress={() => setActive(!active)}
                        endContent={editIcon}
                    >
                        Edit
                    </DropdownItem>

                    <DropdownItem
                        color="danger"
                        onPress={onDelete}
                        endContent={deleteIcon}
                    >
                        Delete
                    </DropdownItem>
                </>
                </DropdownMenu>
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

            <AddTransaction debt={debt} transaction={transaction} activate={active} setActivate={setActive}/>
        </>
    )
}