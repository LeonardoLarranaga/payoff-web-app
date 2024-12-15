'use client'

import {Button, Image, Input, InputOtp} from "@nextui-org/react"
import {useState} from "react"
import {useAuth} from "@/contexts/auth-context";

export default function Home() {

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [isInvalid, setIsInvalid] = useState(false)
    const {otpResponse, requestSignInWithOTP, signInWithOTP} = useAuth()

    return (
        <div className="flex flex-col justify-center items-center h-screen text-center w-full gradient-container">
            <div className="gradient-background h-screen"></div>

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
                className="flex flex-col gap-4 items-center justify-center pt-4 sm:grid sm:grid-cols-6 sm:gap-2 w-full sm:w-auto max-w-sm">
                <Input
                    label="Email"
                    type="email"
                    placeholder="Sign in with your email"
                    variant="flat"
                    className="sm:col-span-4 md:w-full px-8 sm:px-0"
                    isInvalid={false}
                    isClearable
                    onValueChange={setEmail}
                />

                <Button
                    className="sm:col-span-2 hover:shadow-2xl sm:h-full"
                    color="primary"
                    onPress={() => requestSignInWithOTP(email)}
                >
                    Receive OTP Code
                </Button>
            </div>

            {otpResponse && (
                <div>
                    <InputOtp
                        length={6}
                        onValueChange={setOtp}
                        className="pt-4"
                        isInvalid={isInvalid}
                        onComplete={() => signInWithOTP(email, otp, setOtp, setIsInvalid)}
                    />

                    {isInvalid && <p className="text-red-500">Invalid OTP Code</p>}
                </div>
            )}
        </div>
    )
}
