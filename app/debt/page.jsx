import {magnifyingGlassSidebarIcon, sidebarIcon} from "@/libraries/icons"

export default function DefaultNoDebt() {
    return (
        <div className="max-h-svh min-h-svh w-full flex items-center justify-center">
            <div className="flex flex-col items-center text-gray-500">
                {magnifyingGlassSidebarIcon}
                <div className="flex flex-row justify-center items-center">
                    <h1 className="font-bold text-2xl mr-4">Select a debt from the sidebar</h1>
                    {sidebarIcon}
                </div>

            </div>
        </div>
    )
}