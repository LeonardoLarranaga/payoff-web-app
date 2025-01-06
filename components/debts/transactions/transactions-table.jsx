import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react"
import {useCallback} from "react"
import {Icon} from "@iconify/react"

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

const titleColumn = ({transaction}) => (
    <div className="flex flex-row items-center justify-start">
        <Icon
            icon={transaction.icon}
            width="36"
            height="36"
            className="border rounded-lg p-1 min-w-[36px]"
        />
        <span className="ml-2">{transaction.title}</span>
    </div>
)

const descriptionColumn = ({cellValue}) => (
    <span>
        {cellValue.length > 50 ? `${cellValue.slice(0, 50)}...` : cellValue}
    </span>
)

const actionsColumn = ({transaction}) => (
    <Dropdown>
        <DropdownTrigger>
            <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-gray-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 256 256"><path fill="currentColor" d="M112 60a16 16 0 1 1 16 16a16 16 0 0 1-16-16m16 52a16 16 0 1 0 16 16a16 16 0 0 0-16-16m0 68a16 16 0 1 0 16 16a16 16 0 0 0-16-16"></path></svg>
            </Button>
        </DropdownTrigger>

        <DropdownMenu><>
            {transaction.description.length > 50 && (
                <DropdownItem>
                    View full description
                </DropdownItem>
            )}
            <DropdownItem>Edit</DropdownItem>
            <DropdownItem color="danger">Delete</DropdownItem>
        </></DropdownMenu>
    </Dropdown>
)

export default function TransactionsTable({debt}) {

    const renderCell = useCallback((transaction, columnKey) => {
        const cellValue = transaction[columnKey]

        switch (columnKey) {
            case 'title':
                return titleColumn({transaction})

            case 'amount':
                return `$${cellValue}`

            case 'transactionDate':
            case 'paymentDate':
                return new Date(cellValue).toLocaleDateString()

            case 'description':
                return descriptionColumn({cellValue})

            case 'actions':
                return actionsColumn({transaction})

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

            <TableBody items={debt?.expand?.['transactions(debt)'] ?? []}>
                {(transaction) => (
                    <TableRow key={transaction.id}>
                        {(columnKey) => <TableCell>{renderCell(transaction, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}