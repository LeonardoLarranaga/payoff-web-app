export default function DefaultNoDebt() {
    return (
        <div className="max-h-svh min-h-svh w-full flex items-center justify-center">
            <div className="flex flex-col items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 20 20">
                    <path fill="currentColor" d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-2.585a1.5 1.5 0 0 0-.354-.56l-2-2A4.5 4.5 0 0 0 3 8.758zm10 1v7a.5.5 0 0 0 1 0v-7a.5.5 0 0 0-1 0m-4 6c0 .786-.26 1.512-.697 2.096l2.55 2.55a.5.5 0 0 1-.707.707l-2.55-2.55A3.5 3.5 0 1 1 9 12.5m-1 0a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0 5 0"></path>
                </svg>
                <div className="flex flex-row justify-center items-center">
                    <h1 className="font-bold text-2xl mr-4">Select a debt from the sidebar</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 16 16">
                        <g fill="currentColor"><path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z"></path><path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"></path></g>
                    </svg>
                </div>

            </div>
        </div>
    )
}