'use client'

import UserMenu from "@/components/user-menu"
import pocketbase from "@/libraries/pocketbase"
import {useEffect, useState} from "react"
import MyResponsiveLine from "@/components/MyResponsiveLine"

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
                console.log(user.debtHistory)
            } catch (error) {
                console.log(error)
                setFailed(true)
            }
        }

        fetchTotalDebt().catch(console.error)
    }, []);

    return (
        <div className="h-full w-full">
            <div className="flex flex-row justify-between items-center p-5">
                <h1 className="text-4xl sm:text-3xl font-bold">
                    Payoff
                </h1>
                <UserMenu />
            </div>

            {totalDebt && (
                <div className="relative w-full flex items-end justify-center">
                    {/* Debt Number */}
                    <div className="flex flex-col items-center">
                        <h1 className="font-semibold text-gray-300 opacity-35 text-4xl">your balance</h1>
                        <h1 className="text-7xl font-extrabold text-center">${totalDebt}</h1>
                    </div>
                </div>
            )}

            {debtHistory && (
                <MyResponsiveLine data={debtHistory} />
            )}
        </div>
    )
}