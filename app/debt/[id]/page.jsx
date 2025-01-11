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
import {moneySlahIcon} from "@/libraries/icons"

export default function GetDebt({params}) {

    const { id } = use(params)
    const [debt, setDebt] = useState({})
    const [error, setError] = useState("")
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
                {moneySlahIcon}
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