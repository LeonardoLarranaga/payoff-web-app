'use client'

import {Button, Image, Input} from "@nextui-org/react"
import {useState} from "react"
import {useAuth} from "@/contexts/auth-context"
import {motion} from "framer-motion"
import OtpCodeModal from "@/components/otp-code-modal"

const motionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
}

export default function Home() {

    const [email, setEmail] = useState("")
    const { requestSignInWithOTP, isLoading } = useAuth()

    return (
        <div className="flex flex-col justify-center items-center h-screen text-center w-full gradient-container">
            <div className="gradient-background h-screen"></div>

            <motion.div
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, ease: "easeOut" }}
                variants={motionVariants}
                className="flex flex-col items-center gap-6"
            >
                <Image
                    src="/images/AppIcon.jpg"
                    alt="Payoff app icon"
                    width={75}
                    className="rounded-lg shadow-2xl"
                />

                <h1 className="text-4xl text-center font-bold px-8 pt-4">
                    Payoff (but it's a web app)
                </h1>

                <div
                    className="flex flex-col gap-4 items-center justify-center pt-4 sm:grid sm:grid-cols-7 sm:gap-2 w-full sm:w-auto max-w-sm"
                >
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Sign in with your email"
                        variant="flat"
                        className="sm:col-span-4 md:w-full px-8 sm:px-0"
                        isInvalid={false}
                        isClearable
                        onValueChange={setEmail}
                        onKeyUp={(e) => e.key === "Enter" && requestSignInWithOTP(email)}
                    />

                    <Button
                        className="sm:col-span-3 hover:shadow-2xl sm:h-full px-4 sm:px-6"
                        color="primary"
                        onPress={() => requestSignInWithOTP(email)}
                        isLoading={isLoading}
                    >
                        Receive OTP Code
                    </Button>
                </div>
            </motion.div>

            <OtpCodeModal email={email}/>
        </div>
    )
}
