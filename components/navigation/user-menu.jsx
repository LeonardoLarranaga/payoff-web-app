'use client'

import {Avatar, AvatarIcon, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link} from "@nextui-org/react"
import {useAuth} from "@/contexts/auth-context"

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
                <DropdownItem
                    startContent={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="#006FEE" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}> <rect width={18.5} height={15.5} x={2.75} y={4.25} rx={3}></rect> <path d="m2.75 8l8.415 3.866a2 2 0 0 0 1.67 0L21.25 8"></path></g></svg>}
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
                    startContent={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 3.25a.75.75 0 0 1 0 1.5a7.25 7.25 0 0 0 0 14.5a.75.75 0 0 1 0 1.5a8.75 8.75 0 1 1 0-17.5"></path><path fill="currentColor" d="M16.47 9.53a.75.75 0 0 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H10a.75.75 0 0 1 0-1.5h8.19z"></path></svg>}
                    onPress={clearCredentials}
                >
                    Logout
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}