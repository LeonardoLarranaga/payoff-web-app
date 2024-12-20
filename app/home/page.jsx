'use client'

import pocketbase from "@/libraries/pocketbase"
import {useEffect, useState} from "react"
import MyResponsiveLine from "@/components/MyResponsiveLine"
import {motion} from "framer-motion"

export default function Home() {
    const [totalDebt, setTotalDebt] = useState(null)
    const [failed, setFailed] = useState(false)
    const [debtHistory, setDebtHistory] = useState(null)
    const [hasFetch, setHasFetch] = useState(false)

    useEffect(() => {
        async function fetchTotalDebt() {
            if (hasFetch) return
            try {
                const user = await pocketbase.collection('users').getOne(pocketbase.authStore.record.id)
                setTotalDebt(user.totalDebt)
                setDebtHistory(user.debtHistory)
                setHasFetch(true)
            } catch (error) {
                console.error(error)
                setFailed(true)
            }
        }

        fetchTotalDebt().catch(console.error)
    }, [])

    return (
        <div className="max-h-svh min-h-svh w-full">
            <div
                className="flex flex-col gap-4 items-center justify-center sm:grid sm:grid-cols-7 sm:gap-2 w-full sm:w-auto">
                {totalDebt && (
                    <motion.div
                        className="relative w-full flex flex-row items-center sm:items-end justify-center sm:col-span-3"
                        initial={ {opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <MyResponsiveLine data={debtHistory}/>
                    </motion.div>
                )}
            </div>
        </div>
    )
}