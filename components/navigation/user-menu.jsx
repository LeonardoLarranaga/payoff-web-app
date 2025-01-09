'use client'

import {
    Avatar,
    AvatarIcon,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Link
} from "@nextui-org/react"
import {useAuth} from "@/contexts/auth-context"
import {emailIcon, lightIcon, logoutIcon, systemIcon} from "@/libraries/icons"

export default function UserMenu() {
    const { email, clearCredentials } = useAuth()

    return (
        <Dropdown backdrop="blur">
            <DropdownTrigger>
                <div className="flex flex-row items-center hover:cursor-pointer    ">
                    <Avatar
                        classNames={{
                            base: "bg-gradient-to-br from-[#3A8BFDFF] to-[#47B3FFFF]",
                            icon: "text-black/60",
                        }}
                        icon={<AvatarIcon />}
                        isBordered
                    />

                    <div className="ml-3 flex flex-col text-sm">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-bold">{email}</p>
                    </div>
                </div>
            </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownSection showDivider title="Theme">
                    <DropdownItem
                        startContent={systemIcon}
                    >
                        System
                    </DropdownItem>

                    <DropdownItem
                        startContent={lightIcon}
                    >
                        Light
                    </DropdownItem>

                    <DropdownItem>Dark</DropdownItem>
                </DropdownSection>

                <DropdownItem
                    startContent={emailIcon}
                    color="primary"
                >
                    <Link
                        isExternal
                        href="mailto:app.payoff@gmail.com?subject=Hello%20from%20Payoff!&body=Hello%2C%20Payoff%20Team!%0A%0A"
                    >
                        Get help via email
                    </Link>
                </DropdownItem>

                <DropdownItem
                    className="text-danger font-semibold"
                    color="danger"
                    startContent={logoutIcon}
                    onPress={clearCredentials}
                >
                    Logout
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}