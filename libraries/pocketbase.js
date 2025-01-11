import PocketBase from 'pocketbase'

const pocketbase = new PocketBase("https://payoff.pockethost.io/")

pocketbase.fetchDebt = async (id, setDebt, setError, setIsLoading) => {
    try {
        const record = await pocketbase.collection("debts").getOne(id.toString(), {
            expand: 'transactions(debt)'
        })
        setDebt(record)
    } catch (error) {
        if (error.toString().includes("404")) {
            setError("404")
            return
        }
        console.log("Error fetching debt:", error)
    } finally {
        setIsLoading(false)
    }
}

pocketbase.subscribeToTransactions = async (debtId, setDebt) => {
    try {
        await pocketbase.collection("transactions").subscribe("*", (e) => {
            if (e.record.debt !== debtId.toString()) return

            switch (e.action) {
                case "create":
                    setDebt((previousDebt) => {
                        const updatedTransactions = [
                            ...(previousDebt.expand?.['transactions(debt)'] || []),
                            e.record
                        ]

                        return {
                            ...previousDebt,
                            expand: {
                                ...previousDebt.expand,
                                ['transactions(debt)']: updatedTransactions
                            }
                        }
                    })
                    break

                case "update":
                    setDebt((previousDebt) => {
                        const updatedTransactions = previousDebt.expand?.['transactions(debt)']?.map((transaction) => transaction.id === e.record.id ? e.record : transaction)

                        return {
                            ...previousDebt,
                            expand: {
                                ...previousDebt.expand,
                                ['transactions(debt)']: updatedTransactions
                            }
                        }
                    })
                    break

                case "delete":
                    setDebt((previousDebt) => {
                        const updatedTransactions = previousDebt.expand?.['transactions(debt)']?.filter((transaction) => transaction.id !== e.record.id)

                        return {
                            ...previousDebt,
                            expand: {
                                ...previousDebt.expand,
                                ['transactions(debt)']: updatedTransactions
                            }
                        }
                    })
                    break
            }
        })
    } catch (error) {
        console.error("Failed to subscribe to transactions:", error)
    }
}

pocketbase.unsubscribeFromTransactions = async () => {
    await pocketbase.collection("transactions").unsubscribe("*").catch((error) => {
        console.error("Failed to unsubscribe from transactions:", error)
    })
}

pocketbase.addDebt = async (titleRef, icon, color, setError, onClose, router) => {
    try {
        if (!titleRef.current?.value.trim()) {
            setError(new Error("Please enter a title for the debt"))
            return
        }

        const data = {
            user: pocketbase.authStore.model.id,
            transactions: [],
            title: titleRef.current?.value ?? "",
            icon: icon,
            totalAmount: 0.0,
            debtHistory: JSON.stringify([
                {
                    id: 1,
                    color: color,
                    data: [
                        {
                            x: Intl.DateTimeFormat('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            }).format(new Date()),
                            y: 0.0
                        }
                    ]
                }
            ]),
            color: color
        }

        const record = await pocketbase.collection("debts").create(data)
        if (record.message) {
            setError(record.message)
            return
        }
        if (!record.id) return
        onClose()
        router.push(`/debt/${record.id}`)
    } catch (error) {
        setError(error)
    }
}

pocketbase.deleteDebt = async (debt, setError, onClose, router) => {
    try {
        setError(null)
        await pocketbase.collection("debts").delete(debt.id)
        onClose()
        router.push("/home")
    } catch (error) {
        setError(error)
    }
}

pocketbase.updateDebt = async (debt, setDebt, titleRef, icon, color, onClose, setError) => {
    try {
        setError(null)
        if (!titleRef.current?.value.trim()) {
            setError(new Error("Please enter a title for the debt"))
            return
        }

        const data = {
            title: titleRef.current?.value ?? "",
            icon: icon,
            color: color
        }

        const record = await pocketbase.collection("debts").update(debt.id, data)
        if (record.message) {
            setError(record.message)
            return
        }

        if (!record.id) return
        setDebt((previous) => ({
            ...previous,
            title: record.title,
            icon: record.icon,
            color: record.color
        }))

        onClose()
    } catch (error) {
        setError(error)
    }
}


export default pocketbase