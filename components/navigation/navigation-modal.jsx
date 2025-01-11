import {Divider, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react"
import {useNavigation} from "@/contexts/navigation-context"
import UserMenu from "@/components/navigation/user-menu"
import {useEffect, useState} from "react"
import {usePathname, useRouter} from "next/navigation"
import AddDebt from "@/components/debts/add-debt/add-debt"
import NavigationDebtItem from "@/components/navigation/navigation-debt-item"
import {motion} from "framer-motion"
import {mobileCloseIcon, mobileHamburgerIcon, sidebarChevronIcon} from "@/libraries/icons"

export default function NavigationModal() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { debtItems } = useNavigation()
    const [showHeader, setShowHeader] = useState(true)
    const pathname = usePathname()
    const router = useRouter()

    const [showDebts, setShowDebts] = useState(true)

    useEffect(() => {
        setShowHeader(pathname !== '/')
    }, [pathname])

    useEffect(() => {
        const handleResize = () => {
            if (document.documentElement.clientWidth > 700) onClose()
        }

        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (!showHeader || pathname === '/') return <></>

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
                    {mobileHamburgerIcon}
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
                closeButton={mobileCloseIcon}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <button onClick={() => {
                                    router.push('/home')
                                    onClose()
                                }}>
                                    <img src="/images/icon.png" alt="App icon" className="w-10 h-10 mt-2 mb-2"/>
                                </button>

                            </ModalHeader>

                            <ModalBody>
                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-between items-center">
                                            <h1 className="text-xl">Debts</h1>

                                            <div className="items-center flex flex-row space-x-4">
                                                <button
                                                    onClick={() => setShowDebts(!showDebts)}
                                                    className={`transform transition-transform duration-300 ease-in-out ${
                                                        showDebts ? 'rotate-180' : 'rotate-90'
                                                    }`}>
                                                    {sidebarChevronIcon}
                                                </button>

                                                <AddDebt mobile={true}/>
                                            </div>
                                        </div>

                                        <motion.div
                                            className="flex flex-col justify-start space-y-2 mt-4 max-h-[80%] overflow-y-scroll"
                                            initial={{opacity: 0, height: 0}}
                                            animate={{opacity: showDebts ? 1 : 0, height: showDebts ? "18rem" : 0}}
                                            exit={{opacity: 0, height: 0}}
                                            transition={{duration: 0.3, ease: "easeInOut"}}
                                        >
                                            {debtItems.map((item, index) => (
                                                <NavigationDebtItem key={index} item={item} onClose={onClose} />
                                            ))}
                                        </motion.div>
                                    </div>

                                    <div className="pb-1">
                                        <UserMenu/>
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