import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react"
import {useCallback} from "react"
import ActionsColumn from "@/components/debts/transactions/table/actions-column"
import DescriptionColumn from "@/components/debts/transactions/table/description-column"
import TitleColumn from "@/components/debts/transactions/title-column"
import EmptyTransactionsTableState from "@/components/debts/transactions/table/empty-state"

const columns = [
    {
        key: 'title',
        title: 'Title'
    },
    {
        key: 'amount',
        title: 'Amount'
    },
    {
        key: 'transactionDate',
        title: 'Transaction Date'
    },
    {
        key: 'paymentDate',
        title: 'Payment Date'
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

    const renderCell = useCallback((transaction, columnKey) => {
        const cellValue = transaction[columnKey]

        switch (columnKey) {
            case 'title':
                return <TitleColumn transaction={transaction} />

            case 'amount':
                return `$${cellValue}`

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
        <Table aria-label={`Transactions table of ${debt.title}`}>
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key} align={column.key === 'actions' ? 'center' : 'start'}>
                        {column.title}
                    </TableColumn>
                )}
            </TableHeader>

            <TableBody
                items={debt?.expand?.['transactions(debt)'] ?? []}
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