import {Divider, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react"
import {Icon} from "@iconify/react"
import {useNavigation} from "@/contexts/navigation-context"
import NavigationMenuItem from "@/components/navigation/navigation-menu-item";
import UserMenu from "@/components/navigation/user-menu";

export default function NavigationModal() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { menuItems } = useNavigation()

    return (
        <header className="sm:hidden block sticky top-0 z-50 h-[4.5rem] backdrop-blur-2xl items-center w-full">
            <div className='flex items-center justify-between h-full px-4'>
                <h1 className="font-bold text-4xl">
                    Payoff
                </h1>

                <button
                    onClick={onOpen}
                    suppressContentEditableWarning
                    className="ml-auto"
                >
                    <Icon icon="ic:round-menu-open" width="40" height="40" />
                </button>
            </div>

            <Divider className="w-full"/>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="full"
                backdrop="blur"
                motionProps={{
                    variants: {
                        enter: {
                            y: 0,
                            opacity: 1,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut",
                            },
                        },
                        exit: {
                            y: -20,
                            opacity: 0,
                            transition: {
                                duration: 0.2,
                                ease: "easeIn",
                            },
                        },
                    },
                }}
                closeButton={ <Icon icon="line-md:close" width="60" height="60" color="primary" /> }
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>
                                <h1 className="font-bold text-4xl">
                                    Payoff
                                </h1>
                            </ModalHeader>

                            <ModalBody>
                                <div className="flex flex-col justify-between h-full">
                                    <div className="flex flex-col w-full justify-between space-y-6 pt-2 px-1 h-full">
                                        <div className="flex flex-col h-full">
                                            {menuItems.map((item, index) => {
                                                return <NavigationMenuItem key={index} item={item} isSidebar={true}/>
                                            })}
                                        </div>
                                    </div>

                                    <div className="pb-10">
                                        <UserMenu />
                                    </div>
                                </div>

                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </header>
    )
}