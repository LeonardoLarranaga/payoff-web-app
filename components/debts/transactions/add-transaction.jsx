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
import {useState} from "react"
import useRefs from "react-use-refs"
import {today} from "@internationalized/date"
import pocketbase from "@/libraries/pocketbase"

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function AddTransaction({debt}) {

    const [icon, setIcon] = useState("prime:shop")
    const [titleRef] = useRefs()
    const [amount, setAmount] = useState("")
    const [transactionDate, setTransactionDate] = useState(today(currentTimeZone))
    const [paymentDate, setPaymentDate] = useState(today(currentTimeZone))
    const [description, setDescription] = useState("")

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const onSaveTransaction = async ({onClose}) => {
        try {
            setIsLoading(true)
            setError(null)
            const transaction = {
                user: pocketbase.authStore.model.id,
                debt: debt.id,
                title: titleRef.current.value,
                amount: amount,
                transactionDate: transactionDate.toDate(currentTimeZone),
                paymentDate: paymentDate.toDate(currentTimeZone),
                icon: icon,
                description: description
            }

            const record = await pocketbase.collection("transactions").create(transaction)

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
            <button
                className="flex items-center gap-2 text-gray-500"
                onClick={onOpen}
            >
                <Icon icon="akar-icons:plus" width={20} height={20}/>
                <span>Add transaction</span>
            </button>

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
                                        variant="bordered"
                                        className="grid-cols-6"
                                        isRequired
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
                                    isDisabled={isNaN(parseFloat(amount)) || !titleRef.current.value.trim()}
                                >
                                    Save Transaction
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