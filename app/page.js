'use client'

import {Button, Image, Input, Tab, Tabs} from "@nextui-org/react"
import {useEffect, useState} from "react"
import pocketbase from "@/libraries/pocketbase"

export default function Home() {

    const [selectedTab, setSelectedTab] = useState("signin")

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [otp, setOtp] = useState("")

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    const handleSignIn = async () => {
        if (selectedTab === "signup" && !name.trim()) {
            alert("Please enter your name")
            return
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address")
            return
        }

        try {

        } catch (error) {

        }
    }

    const loginPortion = (
    <div className="flex flex-col gap-4 items-center justify-center pt-4 sm:grid sm:grid-cols-6 sm:gap-2 w-full sm:w-auto max-w-sm">
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
            onPress={handleSignIn}
        >
            Receive OTP Code
        </Button>
    </div>
    )

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

            <Tabs
                aria-label="Sign in or sign up"
                className="pt-4"
                onSelectionChange={setSelectedTab}
            >
                <Tab key="signin" title="Sign In" className="w-full">
                    {loginPortion}
                </Tab>
                <Tab key="signup" title="Sign Up" className="w-full">
                    <Input
                        label="Name"
                        type="name"
                        placeholder="What should we call you?"
                        variant="flat"
                        className="px-8 sm:px-0 pt-4 w-full"
                        isInvalid={false}
                        isClearable
                        onValueChange={setName}
                    />
                    {loginPortion}
                </Tab>
            </Tabs>
        </div>
    )
}
