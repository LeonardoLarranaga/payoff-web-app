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

const paidIcon = <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">
    <path fill="currentColor" fillRule="evenodd"
          d="M7.245 2h9.51c1.159 0 1.738 0 2.206.163a3.05 3.05 0 0 1 1.881 1.936C21 4.581 21 5.177 21 6.37v14.004c0 .858-.985 1.314-1.608.744a.946.946 0 0 0-1.284 0l-.483.442a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0l-.483-.442a.946.946 0 0 0-1.284 0c-.623.57-1.608.114-1.608-.744V6.37c0-1.193 0-1.79.158-2.27c.3-.913.995-1.629 1.881-1.937C5.507 2 6.086 2 7.245 2m7.815 6.5a.75.75 0 0 0-1.12-1l-3.011 3.374l-.87-.974a.75.75 0 0 0-1.118 1l1.428 1.6a.75.75 0 0 0 1.119 0zM7.5 14.75a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5z"
          clipRule="evenodd"></path>
</svg>

const unpaidIcon = <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">
    <path fill="currentColor" fillRule="evenodd"
          d="M6.333 2h11.334c.31 0 .464 0 .595.012c1.45.133 2.6 1.34 2.727 2.861c.011.137.011.3.011.624V20.26c0 .872-1.059 1.243-1.558.544a.84.84 0 0 0-1.384 0l-.433.606a1.367 1.367 0 0 1-2.25 0a1.367 1.367 0 0 0-2.25 0a1.367 1.367 0 0 1-2.25 0a1.367 1.367 0 0 0-2.25 0a1.367 1.367 0 0 1-2.25 0l-.433-.605a.84.84 0 0 0-1.384 0c-.5.698-1.558.327-1.558-.545V5.497c0-.324 0-.487.011-.624c.127-1.521 1.277-2.728 2.728-2.861C5.869 2 6.024 2 6.333 2m4.197 5.47a.75.75 0 1 0-1.06 1.06L10.94 10l-1.47 1.47a.75.75 0 1 0 1.06 1.06L12 11.06l1.47 1.47a.75.75 0 1 0 1.06-1.06L13.06 10l1.47-1.47a.75.75 0 0 0-1.06-1.06L12 8.94zM7.5 14.75a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5z"
          clipRule="evenodd"></path>
</svg>

const editIcon = <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">
    <path fill="currentColor"
          d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-2.3 6.35c.22-.21.22-.56 0-.77L15.42 7.3a.53.53 0 0 0-.77 0l-1 1l2.05 2.05zM7 14.94V17h2.06l6.06-6.06l-2.06-2.06z"></path>
</svg>

const descriptionIcon = <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 48 48">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}>
        <path d="M24 9h18M24 19h18M6 29h36M6 39h36"></path>
        <path fill="currentColor" d="M6 9h10v10H6z"></path>
    </g>
</svg>

const deleteIcon = <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">
    <g fill="none" fillRule="evenodd">
        <path
            d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
        <path fill="currentColor"
              d="M8.108 3a3 3 0 0 0-2.544 1.41l-4.08 6.53a2 2 0 0 0 0 2.12l4.08 6.53A3 3 0 0 0 8.108 21H19a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm8.427 12.536a1 1 0 0 1-1.414 0L13 13.414l-2.121 2.122a1 1 0 1 1-1.415-1.415L11.586 12L9.464 9.879a1 1 0 0 1 1.415-1.415L13 10.586l2.121-2.122a1 1 0 1 1 1.414 1.415L14.415 12l2.12 2.121a1 1 0 0 1 0 1.415"></path>
    </g>
</svg>

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
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 256 256">
                            <path fill="currentColor"
                                  d="M112 60a16 16 0 1 1 16 16a16 16 0 0 1-16-16m16 52a16 16 0 1 0 16 16a16 16 0 0 0-16-16m0 68a16 16 0 1 0 16 16a16 16 0 0 0-16-16"></path>
                        </svg>
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