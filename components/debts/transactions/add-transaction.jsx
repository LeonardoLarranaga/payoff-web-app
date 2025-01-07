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
import useRefs from "react-use-refs"
import {parseDate, today} from "@internationalized/date"
import pocketbase from "@/libraries/pocketbase"

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function AddTransaction({debt, transaction, activate, setActivate}) {

    const [icon, setIcon] = useState("prime:shop")
    const [titleRef] = useRefs()
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
        if (isOpen && transaction) {
            setIcon(transaction.icon)
            titleRef.current.value = transaction.title
            setTitleLength(transaction.title.length)
            setAmount(transaction.amount)
            setTransactionDate(parseDate(transaction.transactionDate.slice(0, 10)))
            setPaymentDate(parseDate(transaction.paymentDate.slice(0, 10)))
            setDescription(transaction.description)
        } else {
            if (setActivate) setActivate(false)
        }
    }, [isOpen])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const onSaveTransaction = async ({onClose}) => {
        try {
            setIsLoading(true)
            setError(null)
            const newTransaction = {
                user: pocketbase.authStore.model.id,
                debt: debt.id,
                title: titleRef.current?.value ?? "",
                amount: amount,
                transactionDate: transactionDate.toDate(currentTimeZone),
                paymentDate: paymentDate.toDate(currentTimeZone),
                icon: icon,
                description: description
            }

            let record;
            if (!transaction) record = await pocketbase.collection("transactions").create(newTransaction)
            else record = await pocketbase.collection("transactions").update(transaction.id, newTransaction)

            if (record.message) {
                setError(record.data.message)
                return
            }

            onClose()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

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
                                        ref={titleRef}
                                        onValueChange={(value) => setTitleLength(value.length)}
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
                                        onChange={setTransactionDate}
                                    />

                                    <DatePicker
                                        showMonthAndYearPickers
                                        label="Payment Date"
                                        labelPlacement="inside"
                                        value={paymentDate}
                                        onChange={setPaymentDate}
                                    />
                                </div>

                                <Textarea
                                    label="Description"
                                    value={description}
                                    onValueChange={setDescription}
                                />

                                <Button
                                    color="primary"
                                    onPress={() => onSaveTransaction({onClose})}
                                    isLoading={isLoading}
                                    isDisabled={isNaN(parseFloat(amount)) || !(titleRef.current?.value?.trim() ?? "")}
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