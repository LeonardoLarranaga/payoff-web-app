import {moneySlahIcon} from "@/libraries/icons"

export default function EmptyTransactionsTableState() {
    return (
        <div className="flex flex-col items-center">
            {moneySlahIcon}
            <p className="text-xl font-bold text-gray-500">No transactions to display</p>
        </div>
    )
}