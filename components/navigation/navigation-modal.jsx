import {Divider, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react"
import {useNavigation} from "@/contexts/navigation-context"
import NavigationMenuItem from "@/components/navigation/navigation-menu-item"
import UserMenu from "@/components/navigation/user-menu"
import {useEffect, useState} from "react"
import {usePathname} from "next/navigation"
import AddDebt from "@/components/debts/add-debt/add-debt";

export default function NavigationModal() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { menuItems } = useNavigation()
    const [showHeader, setShowHeader] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        setShowHeader(pathname !== '/')
    }, [pathname])

    if (!showHeader || pathname === '/') return null

    return (
        <header className={`sm:hidden block sticky top-0 z-50 h-[4.5rem] backdrop-blur-2xl items-center w-full`}>
            <div className='flex items-center justify-between h-full px-4'>
                <h1 className="font-bold text-4xl">
                    Payoff
                </h1>

                <button
                    onClick={onOpen}
                    suppressContentEditableWarning
                    className="ml-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="M4 18h11c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h8c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h11c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1m17.3 7.88L17.42 12l2.88-2.88a.996.996 0 1 0-1.41-1.41L15.3 11.3a.996.996 0 0 0 0 1.41l3.59 3.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"/></svg>
                </button>
            </div>

            <Divider className="w-full"/>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="full"
                backdrop="blur"
                scrollBehavior="inside"
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
                closeButton={<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeDasharray="12" strokeDashoffset="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="12;0"/></path></svg>}
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
                                    <div className="flex flex-col w-full justify-between space-y-6 px-1 max-h-[80%]">
                                        <div className="flex flex-col h-full overflow-y-scroll">
                                            {menuItems.map((item, index) => {
                                                return <NavigationMenuItem key={index} item={item} isSidebar={true}/>
                                            })}
                                        </div>
                                    </div>

                                    <AddDebt mobile={true}/>

                                    <div className="pb-1">
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