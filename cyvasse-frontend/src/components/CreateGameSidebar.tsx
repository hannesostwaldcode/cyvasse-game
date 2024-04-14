import { ReactNode } from "react"

type CreateGameSidebarProps = {
    children: ReactNode
    title: string

}

export const CreateGameSidebar = ({children, title}: CreateGameSidebarProps) => {
    return (
        <div className="bg-slate-600 rounded-md overflow-hidden ml-10 w-[250px] md:w-[400px] h-auto">
            <div className="bg-slate-900 text-neutral-300 mx p-3 font-bold text-2xl text-center">
            {title}
            </div>
            <div className="h-full">
            {children}
            </div>
        </div>
    )
}