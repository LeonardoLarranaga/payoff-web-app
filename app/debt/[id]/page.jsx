'use client'

import {use, useEffect, useState} from "react"
import pocketbase from "@/libraries/pocketbase"
import {Icon} from "@iconify/react"
import AddDebt from "@/components/debts/add-debt/add-debt"

export default function GetDebt({params}) {

    const { id } = use(params)
    const [debt, setDebt] = useState({})
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDebt = async () => {
            try {
                const record = await pocketbase.collection("debts").getOne(id, {
                    expand: 'transactions'
                })
                setDebt(record)
            } catch (error) {
                if (error.toString().includes("404")) {
                    setError("404")
                    return
                }
                console.log("Error fetching debt:", error)
            }
        }

        fetchDebt().catch()
    }, [id])

    const notFoundView = (
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

    if (error === "404") return notFoundView

    return (
        <div className="max-h-svh min-h-svh w-full overflow-y-auto">
            <div className="sm:pl-4 pt-4">

                {/*{error === "404" && notFoundView}*/}

                <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex">
                        <Icon
                            icon={debt.icon}
                            color={debt.color}
                            width={40}
                            height={40}
                            className="ml-4 sm:ml-0"
                        />

                        <h1 className="font-bold text-2xl ml-2">{debt.title}</h1>
                    </div>

                    <AddDebt debt={debt} setDebt={setDebt}/>
                </div>

                <h1>{JSON.stringify(debt)}</h1>
            </div>
        </div>
    )
}