import {
    Button,
    DatePicker,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Textarea,
    useDisclosure
} from "@nextui-org/react"
import {Icon} from "@iconify/react"
import IconPicker from "@/components/debts/add-debt/icon-picker"
import {useEffect, useState} from "react"
import {parseDate, today} from "@internationalized/date"
import pocketbase from "@/libraries/pocketbase"

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function AddTransaction({debt, transaction, activate, setActivate}) {

    const [icon, setIcon] = useState("prime:shop")
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState("")
    const [transactionDate, setTransactionDate] = useState(today(currentTimeZone))
    const [paymentDate, setPaymentDate] = useState(today(currentTimeZone))
    const [description, setDescription] = useState("")

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const [titleLength, setTitleLength] = useState(0)

    useEffect(() => {
        if (activate) onOpen()
    }, [activate])

    useEffect(() => {
        setTitleLength(title.length)
    }, [title])

    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                setIcon(transaction.icon)
                setTitle(transaction.title)
                setTitleLength(transaction.title.length)
                setAmount(transaction.amount)
                setTransactionDate(parseDate(transaction.transactionDate.slice(0, 10)))
                setPaymentDate(parseDate(transaction.paymentDate.slice(0, 10)))
                setDescription(transaction.description)
            }
        } else {
            if (setActivate) setActivate(false)
            setDescription("")
            setAmount("")
            setIcon("prime:shop")
            setTitleLength(0)
            setTransactionDate(today(currentTimeZone))
            setPaymentDate(today(currentTimeZone))
        }
    }, [isOpen])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    return (
        <>
            {!transaction && (
                <button
                    className="flex items-center gap-2 text-gray-500"
                    onClick={onOpen}
                >
                    <Icon icon="akar-icons:plus" width={20} height={20}/>
                    <span>Add transaction</span>
                </button>
            )}

            <Modal
                isOpen={isOpen}
                onClose={onOpenChange}
                placement={'center'}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>New Transaction</ModalHeader>

                            <ModalBody>
                                <div className="w-full flex grid-cols-7 gap-4 items-center h-14">
                                    <IconPicker icon={icon} setIcon={setIcon} />

                                    <Input
                                        label="Debt Title"
                                        value={title}
                                        onValueChange={setTitle}
                                        variant="bordered"
                                        className="grid-cols-6"
                                        maxLength={50}
                                        isRequired
                                        endContent={<span className="text-gray-500 text-xs">{titleLength}/50</span>}
                                    />
                                </div>

                                <Input
                                    label="Cost"
                                    onValueChange={setAmount}
                                    value={amount}
                                    labelPlacement="outside"
                                    placeholder="0.00"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-xl">$</span>
                                        </div>
                                    }
                                    type="number"
                                    size="lg"
                                    isRequired
                                />

                                <div className="flex flex-row gap-3">
                                    <DatePicker
                                        showMonthAndYearPickers
                                        label="Transaction Date"
                                        labelPlacement="inside"
                                        value={transactionDate}
                                        onChange={(value) => {
                                            if (value) {
                                                setTransactionDate(parseDate(value.toString()))
                                            }
                                        }}
                                    />

                                    <DatePicker
                                        showMonthAndYearPickers
                                        label="Payment Date"
                                        labelPlacement="inside"
                                        value={paymentDate}
                                        onChange={(value) => {
                                            if (value) {
                                                setPaymentDate(parseDate(value.toString()))
                                                console.log(parseDate(value.toString()))
                                            }
                                        }}
                                    />
                                </div>

                                <Textarea
                                    label="Description"
                                    value={description}
                                    onValueChange={setDescription}
                                />

                                <Button
                                    color="primary"
                                    onPress={() => pocketbase.saveTransaction(debt, transaction, title, amount, transactionDate, paymentDate, icon, description, currentTimeZone, setIsLoading, setError, onClose)}
                                    isLoading={isLoading}
                                    isDisabled={isNaN(parseFloat(amount)) || !title.trim()}
                                >
                                    {transaction ? "Edit Transaction" : "Save Transaction"}
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