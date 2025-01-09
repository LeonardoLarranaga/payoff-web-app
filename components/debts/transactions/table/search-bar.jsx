import {Input} from "@nextui-org/react"

export default function TransactionsTableSearchBar({setFilterValue}) {

    return (
        <div className="flex flex-row">
            <Input
                placeholder="Search transactions by title..."
                onValueChange={setFilterValue}
                startContent={<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M10 6.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0m-.691 3.516a4.5 4.5 0 1 1 .707-.707l2.838 2.837a.5.5 0 0 1-.708.708z" clipRule="evenodd"></path></svg>}
            />
        </div>
    )
}