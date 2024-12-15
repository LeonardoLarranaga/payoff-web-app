'use client'

import UserMenu from "@/components/user-menu"
import pocketbase from "@/libraries/pocketbase"
import {useEffect, useState} from "react"
import MyResponsiveLine from "@/components/MyResponsiveLine"
import {motion} from "framer-motion"
import {Divider} from "@nextui-org/react"

export default function Home() {
    const [totalDebt, setTotalDebt] = useState(null)
    const [failed, setFailed] = useState(false)
    const [debtHistory, setDebtHistory] = useState(null)

    useEffect(() => {
        const fetchTotalDebt = async () => {
            try {
                console.log(pocketbase.authStore.record)
                const user = await pocketbase.collection('users').getOne(pocketbase.authStore.record.id)
                setTotalDebt(user.totalDebt)
                setDebtHistory(user.debtHistory)
            } catch (error) {
                console.error(error)
                setFailed(true)
            }
        }

        fetchTotalDebt().catch(console.error)
    }, []);

    return (
        <div className="min-h-screen w-full">
            <div className="flex flex-row justify-between items-center p-5">
                <h1 className="text-4xl sm:text-3xl font-bold">
                    Payoff
                </h1>
                <UserMenu/>
            </div>

            <Divider className="mb-4"/>

            <div
                className="flex flex-col gap-4 items-center justify-center sm:grid sm:grid-cols-7 sm:gap-2 w-full sm:w-auto">
                {totalDebt && (
                    <motion.div
                        className="relative w-full flex flex-row items-center sm:items-end justify-center sm:col-span-3"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                    >
                        <div className="flex flex-col items-center sm:mr-8">
                            <h1 className="font-semibold text-gray-300 opacity-35 text-4xl">your balance</h1>
                            <h1 className="text-7xl font-extrabold text-center">${totalDebt}</h1>
                        </div>
                    </motion.div>
                )}

                {debtHistory && (
                    <motion.div
                        className="sm:col-span-4 w-full sm:-ml-6"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                    >
                        <MyResponsiveLine data={debtHistory}/>
                    </motion.div>
                )}
            </div>
        </div>
    )
}