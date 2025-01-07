export default function DescriptionColumn({cellValue}) {
    return (
        <span>
            {cellValue.length > 50 ? `${cellValue.slice(0, 50)}...` : cellValue}
        </span>
    )
}