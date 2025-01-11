'use client'

import {use, useEffect, useState} from "react"
import pocketbase from "@/libraries/pocketbase"
import {Icon} from "@iconify/react"
import AddDebt from "@/components/debts/add-debt/add-debt"
import {motion} from "framer-motion"
import {Spinner} from "@nextui-org/react"
import AddTransaction from "@/components/debts/transactions/add-transaction"
import TransactionsTable from "@/components/debts/transactions/table/transactions-table"
import AnimatedNumber from "@/components/debts/animated-number"
import confetti from "canvas-confetti"

export default function GetDebt({params}) {

    const { id } = use(params)
    const [debt, setDebt] = useState({})
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        pocketbase.fetchDebt(id, setDebt, setError, setIsLoading).catch()
        if (debt) pocketbase.subscribeToTransactions(id, setDebt).catch()
        return () => pocketbase.unsubscribeFromTransactions().catch()
    }, [id])

    useEffect(() => {
        const transactions = debt?.expand?.['transactions(debt)']
        if (!transactions || transactions.length < 5) return

        const amount = transactions.reduce((acc, transaction) => acc + (transaction.amount  < 0 ? 0 : transaction.amount), 0)

        if (amount === 0) confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        })
    }, [debt.expand?.['transactions(debt)']])

    const loadingScreen = (
        <div className="max-h-svh min-h-svh w-full flex items-center justify-center">
            <Spinner color="primary" />
        </div>
    )

    const notFoundScreen = (
        <div className="max-h-svh min-h-svh w-full flex items-center justify-center">
            <div className="flex flex-col items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="M6 11a1 1 0 1 0 1 1a1 1 0 0 0-1-1m5.86-1.55L4.71 2.29a1 1 0 0 0-1.42 1.42L4.59 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14.59l2.7 2.71a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Zm-.74 2.09l1.34 1.34A1 1 0 0 1 12 13a1 1 0 0 1-1-1a1 1 0 0 1 .12-.46M4 17a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.59l3.1 3.1A3 3 0 0 0 9 12a3 3 0 0 0 3 3a3 3 0 0 0 1.9-.69L16.59 17ZM20 5h-7.34a1 1 0 0 0 0 2H20a1 1 0 0 1 1 1v7.34a1 1 0 1 0 2 0V8a3 3 0 0 0-3-3m-1 7a1 1 0 1 0-1 1a1 1 0 0 0 1-1"></path>
                </svg>
                <h1 className="font-bold text-2xl mt-4">Debt not found</h1>
            </div>
        </div>
    )

    if (isLoading) return loadingScreen
    if (error === "404") return notFoundScreen

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            transition={{duration: 0.6, ease: "easeOut"}}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            className="max-h-svh min-h-svh w-full overflow-y-auto"
        >
            <div className="px-4 sm:pt-1 pt-4">
                <div className="flex flex-col p-4 w-full bg-[var(--sidebar-background)] rounded-lg" style={{
                    background: isLoading
                        ? 'transparent'
                        : `linear-gradient(to bottom, var(--sidebar-background), ${debt.color}4D)`,
                }}>
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex">
                            <Icon
                                icon={debt.icon}
                                color={debt.color}
                                width={40}
                                height={40}
                            />

                            <h1 className="font-bold text-2xl ml-2">{debt.title}</h1>
                        </div>

                        <AddDebt debt={debt} setDebt={setDebt}/>
                    </div>

                    <AnimatedNumber className="text-6xl font-bold" value={debt?.expand?.['transactions(debt)']?.reduce((acc, transaction) => acc + ((transaction.amount ?? 0) < 0 ? 0 : transaction.amount), 0) ?? 0} />
                </div>

                <div className="flex flex-row items-center justify-between my-4">
                    <h1 className="text-xl">Transactions</h1>
                    <AddTransaction debt={debt} />
                </div>

                <TransactionsTable debt={debt} />
            </div>
        </motion.div>
    )
}