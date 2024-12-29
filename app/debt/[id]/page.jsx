'use client'

import {use, useEffect, useState} from "react"
import pocketbase from "@/libraries/pocketbase"

export default function GetDebt({params}) {

    const { id } = use(params)
    const [debt, setDebt] = useState({})

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
            <div className="sm:pl-4 sm:pt-2">
                <h1>Get Debt</h1>
                <h1>{id}</h1>
                <h1>{JSON.stringify(debt)}</h1>
            </div>
        </div>
    )
}