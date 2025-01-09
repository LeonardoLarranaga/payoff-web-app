import {Input} from "@nextui-org/react"
import {magnifyingGlassIcon} from "@/libraries/icons"

export default function TransactionsTableSearchBar({setFilterValue}) {

    return (
        <div className="flex flex-row">
            <Input
                placeholder="Search transactions by title..."
                onValueChange={setFilterValue}
                startContent={magnifyingGlassIcon}
            />
        </div>
    )
}