import {
    Avatar,
    AvatarIcon,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Link,
    Modal,
    ModalContent,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react"
import {useAuth} from "@/contexts/auth-context"
import {emailIcon, logoutIcon, paintbrushIcon} from "@/libraries/icons"
import {HexColorPicker} from "react-colorful"
import {useEffect, useState} from "react"
import pocketbase from "@/libraries/pocketbase"

export default function UserMenu() {
    const { clearCredentials } = useAuth()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const [newColor, setNewColor] = useState("")
    const [color, setColor] = useState("")

    useEffect(() => {
        if (!pocketbase.authStore.record) return
        const color = pocketbase.authStore.record.debtHistory?.[0]?.color ?? "#2671D9"
        setColor(color)
        setNewColor(color)
    }, [pocketbase.authStore.record])

    return (<>
        <Dropdown backdrop="blur">
            <DropdownTrigger>
                <div className="flex flex-row items-center hover:cursor-pointer">
                    <Avatar
                        style={{
                            background: `linear-gradient(to bottom right, ${color}, ${color}B3)`,
                        }}
                        classNames={{
                            icon: "text-black/60",
                        }}
                        icon={<AvatarIcon />}
                        isBordered
                    />

                    <div className="ml-3 flex flex-col text-sm">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-bold">{pocketbase.authStore.record.email}</p>
                    </div>
                </div>
            </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownSection title="Profile Options" showDivider>
                    <DropdownItem
                        startContent={paintbrushIcon}
                        onPress={onOpen}
                    >
                        Change user color
                    </DropdownItem>
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

        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xs"
            // className="w-60 p-12"
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>New Color</ModalHeader>

                        <div className="flex flex-col items-center gap-2">
                            <HexColorPicker color={newColor} onChange={setNewColor} />

                            <Button
                                color="primary"
                                className="my-4"
                                onPress={() => pocketbase.changeUserColor(newColor, onClose)}
                            >
                                Save
                            </Button>
                        </div>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>)
}