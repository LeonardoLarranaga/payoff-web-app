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

export default pocketbase