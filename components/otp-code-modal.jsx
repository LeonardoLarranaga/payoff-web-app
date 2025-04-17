import {Button, InputOtp, Modal, ModalBody, ModalContent, ModalHeader, Spinner, useDisclosure} from "@heroui/react"
import {useAuth} from "@/contexts/auth-context"
import {useEffect, useState} from "react"

export default function OtpCodeModal({email}) {

    const { otpResponse, signInWithOTP, requestSignInWithOTP, isLoading } = useAuth()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [otp, setOtp] = useState("")
    const [isInvalid, setIsInvalid] = useState(false)
    const [timeLeft, setTimeLeft] = useState(30)

    useEffect(() => {
        if (otpResponse) onOpen()
    }, [otpResponse])

    useEffect(() => {
        if (isOpen) setTimeLeft(30)
    }, [isOpen])

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [timeLeft])

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            isDismissable={false}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="font-bold text-xl flex flex-col gap-1">
                            One-Time Password
                        </ModalHeader>

                        <ModalBody>
                            <div className="flex flex-col items-center gap-6">
                                <InputOtp
                                    length={6}
                                    onValueChange={setOtp}
                                    isInvalid={isInvalid}
                                    onComplete={() => signInWithOTP(email, otp, setOtp, setIsInvalid)}
                                    autoFocus
                                />

                                {isInvalid && <p className="text-red-500">Invalid OTP Code</p>}

                                {isLoading && <Spinner />}

                                <Button
                                    color="primary"
                                    isDisabled={timeLeft > 0}
                                    isLoading={isLoading}
                                    onPress={() => requestSignInWithOTP(email)}
                                    className="mb-6"
                                >
                                    Resend OTP Code ({timeLeft}s)
                                </Button>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}