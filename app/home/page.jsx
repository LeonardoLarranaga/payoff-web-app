import UserMenu from "@/components/user-menu";

export default function Home() {
    return (
        <div className="h-full w-full">
            <div className="flex flex-row justify-between items-center p-5">
                <h1 className="text-4xl sm:text-3xl font-bold">
                    Payoff
                </h1>
                <UserMenu />
            </div>

        </div>
    )
}