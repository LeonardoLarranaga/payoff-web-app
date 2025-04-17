import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@heroui/react"
import {useCallback, useMemo, useState} from "react"
import ActionsColumn from "@/components/debts/transactions/table/actions-column"
import DescriptionColumn from "@/components/debts/transactions/table/description-column"
import TitleColumn from "@/components/debts/transactions/title-column"
import EmptyTransactionsTableState from "@/components/debts/transactions/table/empty-state"
import TransactionsTableSearchBar from "@/components/debts/transactions/table/search-bar"

const columns = [
    {
        key: 'title',
        title: 'Title',
        sortable: true
    },
    {
        key: 'amount',
        title: 'Amount',
        sortable: true
    },
    {
        key: 'transactionDate',
        title: 'Transaction Date',
        sortable: true
    },
    {
        key: 'paymentDate',
        title: 'Payment Date',
        sortable: true
    },
    {
        key: 'description',
        title: 'Description'
    },
    {
        key: 'actions',
        title: 'Actions'
    }
]

export default function TransactionsTable({debt}) {

    const [filterValue, setFilterValue] = useState("")
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'transactionDate',
        direction: 'descending'
    })

    const filteredTransactions = useMemo(() => {
        let transactions = [...(debt?.expand?.['transactions(debt)'] ?? [])]

        if (filterValue.trim()) {
            transactions = transactions.filter((transaction) =>
                transaction.title.toLowerCase().includes(filterValue.toLowerCase())
            )
        }

        return transactions
    }, [debt?.expand?.['transactions(debt)'] ?? [], filterValue])

    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0

            return sortDescriptor.direction === 'ascending' ? cmp : -cmp
        })
    }, [debt?.expand?.['transactions(debt)'] ?? [], filteredTransactions, sortDescriptor])

    const renderCell = useCallback((transaction, columnKey) => {
        const cellValue = transaction[columnKey]

        switch (columnKey) {
            case 'title':
                return <TitleColumn transaction={transaction} />

            case 'amount':
                return `$${Math.abs(cellValue)}`

            case 'transactionDate':
            case 'paymentDate':
                return new Date(cellValue).toLocaleDateString()

            case 'description':
                return <DescriptionColumn cellValue={cellValue} />

            case 'actions':
                return <ActionsColumn debt={debt} transaction={transaction} />

            default:
                return cellValue
        }
    }, [])

    return (
        <Table
            aria-label={`Transactions table of ${debt.title}`}
            topContent={<TransactionsTableSearchBar setFilterValue={setFilterValue} />}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.key}
                        align={column.key === 'actions' ? 'center' : 'start'}
                        allowsSorting={column.sortable}
                    >
                        {column.title}
                    </TableColumn>
                )}
            </TableHeader>

            <TableBody
                items={sortedTransactions}
                emptyContent={<EmptyTransactionsTableState />}
            >
                {(transaction) => (
                    <TableRow key={transaction.id}>
                        {(columnKey) => <TableCell>{renderCell(transaction, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}