import {Icon} from "@iconify/react"

export default function TitleColumn({transaction}) {
    return (
        <div className="flex flex-row items-center justify-start">
            <Icon
                icon={transaction.icon}
                width="36"
                height="36"
                className={`border ${transaction.amount < 0 ? "border-green-400" : ""} rounded-lg p-1 min-w-[36px]`}
            />
            <span className="ml-2">{transaction.title}</span>
        </div>
    )
}