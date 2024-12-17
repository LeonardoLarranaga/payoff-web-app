import {InputOtp, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react"
import {useAuth} from "@/contexts/auth-context"
import {useEffect, useState} from "react"

export default function OtpCodeModal(email) {
    const { otpResponse, signInWithOTP } = useAuth()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [otp, setOtp] = useState("")
    const [isInvalid, setIsInvalid] = useState(false)

    useEffect(() => {
        if (otpResponse) onOpen()
    }, [otpResponse])

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
                                />
                                {isInvalid && <p className="text-red-500">Invalid OTP Code</p>}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}