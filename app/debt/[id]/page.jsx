'use client'

import {use, useEffect, useState} from "react"
import pocketbase from "@/libraries/pocketbase"
import {Icon} from "@iconify/react"
import AddDebt from "@/components/debts/add-debt/add-debt";

export default function GetDebt({params}) {

    const { id } = use(params)
    const [debt, setDebt] = useState({})

    const openDebtForm = () => {
        console.log("Open debt form")
    }

    useEffect(() => {
        const fetchDebt = async () => {
            try {
                const record = await pocketbase.collection("debts").getOne(id, {
                    expand: 'transactions'
                })
                setDebt(record)
            } catch (error) {
                console.log(error)
            }
        }

        fetchDebt().catch()
    }, [id])

    return (
        <div className="max-h-svh min-h-svh w-full overflow-y-auto">
            <div className="sm:pl-4 sm:pt-4">
                <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex">
                        <Icon
                            icon={debt.icon}
                            color={debt.color}
                            width={40}
                            height={40}
                        />

                        <h1 className="font-bold text-2xl ml-2">{debt.title}</h1>
                    </div>

                    <AddDebt debt={debt} setDebt={setDebt} />
                </div>

                <h1>{JSON.stringify(debt)}</h1>
            </div>
        </div>
    )
}